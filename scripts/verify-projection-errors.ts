import assert from "node:assert/strict";

import { classifyProjectionError } from "@/modules/projection/jobs/projection-error";

const cases = [
  {
    error: { error: { code: "billing_hard_limit_reached", message: "Limit reached" }, status: 429 },
    category: "billing",
  },
  {
    error: { status: 401, error: { code: "invalid_api_key", message: "Incorrect API key" } },
    category: "authentication",
  },
  {
    error: Object.assign(new Error("ENOENT: no such file or directory"), { code: "ENOENT" }),
    category: "reference-asset",
  },
  {
    error: new Error("OPENAI_API_KEY is not configured."),
    category: "configuration",
  },
  {
    error: { status: 429, code: "rate_limit_exceeded", message: "Too many requests" },
    category: "rate-limit",
  },
  {
    error: Object.assign(new Error("Rejected"), { code: "PROJECTION_QUALITY_REJECTED" }),
    category: "quality",
  },
] as const;

for (const testCase of cases) {
  assert.equal(classifyProjectionError(testCase.error).category, testCase.category);
}

const redacted = classifyProjectionError(
  new Error("Bearer sk-secret-value api_key=private-value"),
).diagnostic.safeMessage;
assert.equal(redacted.includes("sk-secret-value"), false);
assert.equal(redacted.includes("private-value"), false);

console.log(`Projection error classifier verified: ${cases.length} cases.`);
