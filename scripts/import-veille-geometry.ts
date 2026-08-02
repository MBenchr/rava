import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { requireApprovedVeilleGeometry } from "@/lib/isandre/geometry-import";

const inputPath = process.argv[2];

if (!inputPath) {
  throw new Error(
    "Usage: npm run geometry:import -- path/to/approved-veille-geometry.json",
  );
}

const raw = await readFile(path.resolve(inputPath), "utf8");
const submission = requireApprovedVeilleGeometry(JSON.parse(raw));
const digest = createHash("sha256").update(raw).digest("hex");
const outputDirectory = path.resolve("output/geometry");
const outputPath = path.join(
  outputDirectory,
  `veille-03-import-review-${digest.slice(0, 12)}.json`,
);

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      reviewStatus: "ready-for-human-review",
      importDigest: digest,
      canonicalMutationPerformed: false,
      submission,
    },
    null,
    2,
  )}\n`,
);

console.log(`Validated VEILLE geometry submission. Review: ${outputPath}`);
