import OpenAI from "openai";

import { getServerEnv } from "@/lib/server-env";
import { classifyProjectionError } from "@/modules/projection/jobs/projection-error";

async function main() {
  const apiKey = getServerEnv("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const imageModel = getServerEnv("OPENAI_IMAGE_MODEL") ?? "gpt-image-2";
  const visionModel =
    getServerEnv("OPENAI_VISION_MODEL") ??
    getServerEnv("OPENAI_CHAT_MODEL") ??
    "gpt-5-mini";
  const client = new OpenAI({ apiKey });

  await client.models.retrieve(imageModel);
  await client.models.retrieve(visionModel);
  await client.responses.create({
    model: visionModel,
    input: "Reply with READY only.",
    max_output_tokens: 32,
  });

  console.log(`OpenAI projection access verified: ${imageModel} + ${visionModel}.`);
}

main().catch((error) => {
  const failure = classifyProjectionError(error);
  console.error(
    `OpenAI projection access failed: ${failure.category} (${failure.diagnostic.sourceCode}).`,
  );
  process.exitCode = 1;
});
