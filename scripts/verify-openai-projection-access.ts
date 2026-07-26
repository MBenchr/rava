import OpenAI from "openai";

import { getServerEnv } from "@/lib/server-env";
import { classifyProjectionError } from "@/modules/projection/jobs/projection-error";

async function main() {
  const apiKey = getServerEnv("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const imageModel = getServerEnv("OPENAI_IMAGE_MODEL") ?? "gpt-image-2";
  const client = new OpenAI({ apiKey });

  await client.models.retrieve(imageModel);

  console.log(`OpenAI projection access verified: ${imageModel}.`);
}

main().catch((error) => {
  const failure = classifyProjectionError(error);
  console.error(
    `OpenAI projection access failed: ${failure.category} (${failure.diagnostic.sourceCode}).`,
  );
  process.exitCode = 1;
});
