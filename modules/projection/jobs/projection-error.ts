type ErrorRecord = Record<string, unknown>;

export type ProjectionFailureCategory =
  | "billing"
  | "authentication"
  | "configuration"
  | "invalid-image"
  | "quality"
  | "rate-limit"
  | "reference-asset"
  | "timeout"
  | "unknown";

export type ProjectionFailure = {
  category: ProjectionFailureCategory;
  code: string;
  publicMessage: string;
  status?: number;
  diagnostic: {
    name: string;
    sourceCode: string;
    safeMessage: string;
  };
};

const PUBLIC_MESSAGES: Record<ProjectionFailureCategory, string> = {
  billing:
    "The OpenAI projection credit limit has been reached. Update OpenAI billing, then try again.",
  authentication:
    "The projection service is not authenticated. Check the OpenAI API key configuration.",
  configuration:
    "The projection service is not configured yet. Add the required server configuration.",
  "invalid-image":
    "The image could not be prepared. Use a clear JPG, PNG or WebP photo and try again.",
  quality:
    "The result did not pass the geometry check. Adjust the placement and try again.",
  "rate-limit":
    "The projection service is temporarily busy. Wait a moment, then try again.",
  "reference-asset":
    "The approved product reference could not be loaded. The projection was not generated.",
  timeout:
    "The projection took too long. Try again with the same placement.",
  unknown: "The projection could not be prepared right now.",
};

function asRecord(value: unknown): ErrorRecord | undefined {
  return typeof value === "object" && value !== null ? (value as ErrorRecord) : undefined;
}

function firstString(values: unknown[]) {
  return values.find((value): value is string => typeof value === "string" && value.length > 0);
}

function firstNumber(values: unknown[]) {
  return values.find((value): value is number => typeof value === "number" && Number.isFinite(value));
}

function normalizeCode(value: string | undefined) {
  return (value ?? "PROJECTION_FAILED")
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 80);
}

function sanitizeMessage(value: string | undefined) {
  return (value ?? "No error message")
    .replace(/\bsk-[a-zA-Z0-9_-]+\b/g, "[redacted-api-key]")
    .replace(/\bBearer\s+[a-zA-Z0-9._-]+\b/gi, "Bearer [redacted]")
    .replace(/((?:[?&]|\b)(?:api_?key|token)=)[^&\s]+/gi, "$1[redacted]")
    .replace(/\s+/g, " ")
    .slice(0, 300);
}

function includesAny(value: string, patterns: string[]) {
  return patterns.some((pattern) => value.includes(pattern));
}

export function classifyProjectionError(error: unknown): ProjectionFailure {
  const direct = asRecord(error);
  const nested = asRecord(direct?.error);
  const cause = asRecord(direct?.cause);
  const code = normalizeCode(
    firstString([direct?.code, nested?.code, cause?.code, direct?.type, nested?.type]),
  );
  const status = firstNumber([direct?.status, nested?.status, cause?.status]);
  const name = normalizeCode(
    firstString([direct?.name, nested?.name, cause?.name]) ?? "UnknownError",
  );
  const message = firstString([
    direct?.message,
    nested?.message,
    cause?.message,
    error instanceof Error ? error.message : undefined,
  ]);
  const haystack = `${code} ${name} ${message ?? ""}`.toLowerCase();

  let category: ProjectionFailureCategory = "unknown";

  if (
    code === "PROJECTION_QUALITY_REJECTED" ||
    includesAny(haystack, ["projection_quality_rejected", "geometry check"])
  ) {
    category = "quality";
  } else if (
    includesAny(haystack, [
      "billing_hard_limit_reached",
      "insufficient_quota",
      "billing not active",
      "credit balance",
      "quota",
    ])
  ) {
    category = "billing";
  } else if (
    status === 401 ||
    includesAny(haystack, [
      "invalid_api_key",
      "authentication_error",
      "incorrect api key",
      "invalid authentication",
    ])
  ) {
    category = "authentication";
  } else if (
    includesAny(haystack, [
      "openai_api_key is not configured",
      "missing required server configuration",
    ])
  ) {
    category = "configuration";
  } else if (
    code === "ENOENT" ||
    includesAny(haystack, [
      "no such file or directory",
      "approved product reference could not be loaded",
    ])
  ) {
    category = "reference-asset";
  } else if (
    includesAny(haystack, [
      "invalid_image",
      "unsupported image",
      "unable to read the room image",
      "unable to normalize the room image",
      "input image",
    ])
  ) {
    category = "invalid-image";
  } else if (
    status === 429 ||
    includesAny(haystack, ["rate_limit", "rate limit", "too many requests"])
  ) {
    category = "rate-limit";
  } else if (
    status === 408 ||
    includesAny(haystack, ["etimedout", "timeout", "timed out", "apiconnectiontimeouterror"])
  ) {
    category = "timeout";
  }

  return {
    category,
    code: category === "unknown" ? code : `PROJECTION_${category.toUpperCase().replace("-", "_")}`,
    publicMessage: PUBLIC_MESSAGES[category],
    status,
    diagnostic: {
      name,
      sourceCode: code,
      safeMessage: sanitizeMessage(message),
    },
  };
}
