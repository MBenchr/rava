import assert from "node:assert/strict";

import {
  OpenAIStructuredOutputError,
  parseStructuredJsonResponse,
  requestStructuredJson,
} from "@/lib/openai-structured-output";

async function main() {
  const parsed = parseStructuredJsonResponse<{ score: number }>(
    {
      status: "completed",
      output_text: '{"score":0.95}',
    },
    "Test evaluation",
  );
  assert.deepEqual(parsed, { score: 0.95 });

  const incompleteBudgets: number[] = [];
  const recoveredFromIncomplete = await requestStructuredJson<{ score: number }>({
    label: "Incomplete evaluation",
    initialMaxOutputTokens: 900,
    retryMaxOutputTokens: 3600,
    create: async (maxOutputTokens) => {
      incompleteBudgets.push(maxOutputTokens);
      return maxOutputTokens === 900
        ? {
            status: "incomplete",
            incomplete_details: { reason: "max_output_tokens" },
            output_text: '{"score":',
          }
        : {
            status: "completed",
            output_text: '{"score":0.92}',
          };
    },
  });
  assert.deepEqual(incompleteBudgets, [900, 3600]);
  assert.deepEqual(recoveredFromIncomplete, { score: 0.92 });

  let malformedAttempts = 0;
  const recoveredFromMalformedJson = await requestStructuredJson<{ passed: boolean }>({
    label: "Malformed evaluation",
    initialMaxOutputTokens: 900,
    retryMaxOutputTokens: 3600,
    create: async () => {
      malformedAttempts += 1;
      return {
        status: "completed",
        output_text: malformedAttempts === 1 ? '{"passed":' : '{"passed":true}',
      };
    },
  });
  assert.equal(malformedAttempts, 2);
  assert.deepEqual(recoveredFromMalformedJson, { passed: true });

  let refusalAttempts = 0;
  await assert.rejects(
    requestStructuredJson({
      label: "Refused evaluation",
      initialMaxOutputTokens: 900,
      retryMaxOutputTokens: 3600,
      create: async () => {
        refusalAttempts += 1;
        return {
          status: "completed",
          output_text: "",
          output: [
            {
              type: "message",
              content: [{ type: "refusal", refusal: "Unable to inspect." }],
            },
          ],
        };
      },
    }),
    (error: unknown) =>
      error instanceof OpenAIStructuredOutputError &&
      error.code === "OPENAI_STRUCTURED_OUTPUT_REFUSAL" &&
      !error.retryable,
  );
  assert.equal(refusalAttempts, 1);

  console.log("OpenAI structured output recovery verified: 4 cases.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
