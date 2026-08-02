import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { preproductionMediaList } from "../lib/isandre/preproduction-media";

const expectedAssetIds = ["W01", "W02", "W03", "W04", "W05", "W06", "W07"];

type Manifest = {
  schemaVersion: number;
  status: string;
  proofPolicy: string;
  digitalSourceType: string;
  assets: Array<{
    id: string;
    status: string;
    source: {
      path: string;
      sha256: string;
      width: number;
      height: number;
      aiOrigin: boolean;
    };
    derivatives: Record<
      string,
      { sha256: string; bytes: number; width: number; height: number }
    >;
  }>;
};

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function main() {
  const root = process.cwd();
  const auditPath = path.join(
    root,
    "docs",
    "media",
    "preproduction-media-manifest.json",
  );
  const publicPath = path.join(
    root,
    "public",
    "isandre",
    "preproduction",
    "manifest.json",
  );
  const [auditRaw, publicRaw] = await Promise.all([
    readFile(auditPath, "utf8"),
    readFile(publicPath, "utf8"),
  ]);
  invariant(auditRaw === publicRaw, "Public and audit manifests diverge.");

  const manifest = JSON.parse(auditRaw) as Manifest;
  invariant(manifest.schemaVersion === 1, "Unexpected manifest schema.");
  invariant(
    manifest.status === "preproduction-visualisation",
    "Pre-production media cannot be promoted to real evidence.",
  );
  invariant(
    /not evidence/iu.test(manifest.proofPolicy),
    "The proof limitation is missing.",
  );
  invariant(
    manifest.assets.length === expectedAssetIds.length,
    `Exactly ${expectedAssetIds.length} assets are required.`,
  );
  invariant(
    expectedAssetIds.every(
      (id, index) => manifest.assets[index]?.id === id,
    ),
    "The pre-production asset inventory or order drifted.",
  );
  invariant(
    preproductionMediaList.length === manifest.assets.length,
    "Runtime registry and manifest diverge.",
  );

  for (const asset of manifest.assets) {
    invariant(asset.status === "approved-visualisation", `${asset.id} is not approved.`);
    invariant(asset.source.aiOrigin, `${asset.id} must disclose its AI origin.`);
    const source = await readFile(path.join(root, asset.source.path));
    invariant(sha256(source) === asset.source.sha256, `${asset.id} source drifted.`);

    for (const [filename, expected] of Object.entries(asset.derivatives)) {
      const slug = preproductionMediaList.find((item) => item.id === asset.id)
        ?.media.en.src.split("/").at(-2);
      invariant(slug, `Missing runtime slug for ${asset.id}.`);
      const output = await readFile(
        path.join(root, "public", "isandre", "preproduction", slug, filename),
      );
      const metadata = await sharp(output).metadata();
      invariant(sha256(output) === expected.sha256, `${asset.id}/${filename} drifted.`);
      invariant(output.byteLength === expected.bytes, `${asset.id}/${filename} size drifted.`);
      invariant(
        metadata.width === expected.width && metadata.height === expected.height,
        `${asset.id}/${filename} dimensions drifted.`,
      );
    }
  }

  console.log(
    `Verified ${expectedAssetIds.length} disclosed pre-production visualisations; none is registered as real industrial evidence.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
