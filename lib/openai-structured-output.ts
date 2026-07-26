type StructuredResponseLike = {
  status?: string | null;
  output_text?: string | null;
  incomplete_details?: {
    reason?: string | null;
  } | null;
  error?: {
    code?: string | null;
    message?: string | null;
  } | null;
  output?: unknown;
};

type StructuredOutputErrorCode =
  | "OPENAI_STRUCTURED_OUTPUT_EMPTY"
  | "OPENAI_STRUCTURED_OUTPUT_FAILED"
  | "OPENAI_STRUCTURED_OUTPUT_INCOMPLETE"
  | "OPENAI_STRUCTURED_OUTPUT_INVALID_JSON"
  | "OPENAI_STRUCTURED_OUTPUT_REFUSAL";

export class OpenAIStructuredOutputError extends Error {
  readonly code: StructuredOutputErrorCode;
  readonly retryable: boolean;

  constructor(
    code: StructuredOutputErrorCode,
    message: string,
    retryable: boolean,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "OpenAIStructuredOutputError";
    this.code = code;
    this.retryable = retryable;
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined;
}

function findRefusal(output: unknown) {
  if (!Array.isArray(output)) return undefined;

  for (const outputItem of output) {
    const content = asRecord(outputItem)?.content;
    if (!Array.isArray(content)) continue;

    for (const contentItem of content) {
      const item = asRecord(contentItem);
      if (item?.type === "refusal" && typeof item.refusal === "string") {
        return item.refusal;
      }
    }
  }

  return undefined;
}

export function parseStructuredJsonResponse<T>(
  response: StructuredResponseLike,
  label: string,
): T {
  const refusal = findRefusal(response.output);
  if (refusal) {
    throw new OpenAIStructuredOutputError(
      "OPENAI_STRUCTURED_OUTPUT_REFUSAL",
      `${label} was refused by the model.`,
      false,
    );
  }

  if (response.status === "incomplete") {
    const reason = response.incomplete_details?.reason ?? "unknown reason";
    throw new OpenAIStructuredOutputError(
      "OPENAI_STRUCTURED_OUTPUT_INCOMPLETE",
      `${label} was incomplete (${reason}).`,
      true,
    );
  }

  if (response.status && response.status !== "completed") {
    const reason = response.error?.message ?? response.error?.code ?? response.status;
    throw new OpenAIStructuredOutputError(
      "OPENAI_STRUCTURED_OUTPUT_FAILED",
      `${label} failed (${reason}).`,
      false,
    );
  }

  const outputText = response.output_text?.trim();
  if (!outputText) {
    throw new OpenAIStructuredOutputError(
      "OPENAI_STRUCTURED_OUTPUT_EMPTY",
      `${label} returned no structured output.`,
      true,
    );
  }

  try {
    return JSON.parse(outputText) as T;
  } catch (error) {
    throw new OpenAIStructuredOutputError(
      "OPENAI_STRUCTURED_OUTPUT_INVALID_JSON",
      `${label} returned incomplete or invalid JSON.`,
      true,
      { cause: error },
    );
  }
}

type RequestStructuredJsonInput = {
  label: string;
  initialMaxOutputTokens: number;
  retryMaxOutputTokens: number;
  create: (maxOutputTokens: number) => Promise<StructuredResponseLike>;
};

export async function requestStructuredJson<T>({
  label,
  initialMaxOutputTokens,
  retryMaxOutputTokens,
  create,
}: RequestStructuredJsonInput): Promise<T> {
  const budgets = [initialMaxOutputTokens, retryMaxOutputTokens];
  let lastError: unknown;

  for (const [attemptIndex, maxOutputTokens] of budgets.entries()) {
    try {
      const response = await create(maxOutputTokens);
      return parseStructuredJsonResponse<T>(response, label);
    } catch (error) {
      lastError = error;
      const canRetry =
        attemptIndex === 0 &&
        error instanceof OpenAIStructuredOutputError &&
        error.retryable;

      if (!canRetry) throw error;
    }
  }

  throw lastError;
}
