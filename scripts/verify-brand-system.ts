import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import {
  brandAssets,
  entailleGeometry,
  originPlateSpec,
} from "@/lib/isandre/brand";

type Manifest = {
  schemaVersion: number;
  brand: string;
  collection: string;
  entaille: {
    viewBox: string;
    ratio: string;
    notch: { width: number; height: number; centerY: number };
  };
  originPlate: {
    widthMm: number;
    heightMm: number;
    cornerRadiusMm: number;
    status: string;
  };
  files: Array<{ path: string; sha256: string }>;
};

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const root = process.cwd();
  const brandRoot = path.join(root, "brand");
  const manifest = JSON.parse(
    await readFile(path.join(brandRoot, "brand-assets.manifest.json"), "utf8"),
  ) as Manifest;

  invariant(manifest.schemaVersion === 1, "Unexpected brand manifest schema.");
  invariant(manifest.brand === "ISANDRE", "Brand manifest must target ISANDRE.");
  invariant(manifest.collection === "ṬĀQA", "Brand manifest must target ṬĀQA.");
  invariant(manifest.entaille.ratio === "1:1.55", "L'ENTAILLE ratio drifted.");
  invariant(
    manifest.entaille.notch.width === entailleGeometry.notchSize &&
      manifest.entaille.notch.height === entailleGeometry.notchSize &&
      manifest.entaille.notch.centerY === entailleGeometry.notchCenterY,
    "L'ENTAILLE notch geometry drifted.",
  );
  invariant(
    manifest.originPlate.widthMm === originPlateSpec.widthMm &&
      manifest.originPlate.heightMm === originPlateSpec.heightMm &&
      manifest.originPlate.cornerRadiusMm === originPlateSpec.cornerRadiusMm,
    "Origin plate dimensions drifted.",
  );
  invariant(
    manifest.originPlate.status === "prototype-required",
    "Origin plate cannot be production-approved before physical gates.",
  );

  for (const file of manifest.files) {
    const content = await readFile(path.join(brandRoot, file.path));
    const checksum = createHash("sha256").update(content).digest("hex");
    invariant(checksum === file.sha256, `Checksum mismatch for ${file.path}.`);

    if (file.path.startsWith("masters/")) {
      const publicContent = await readFile(
        path.join(root, "public", "brand", path.basename(file.path)),
      );
      invariant(
        publicContent.equals(content),
        `Public brand copy drifted from master: ${file.path}.`,
      );
    } else {
      const publicContent = await readFile(
        path.join(root, "public", "brand", file.path),
      );
      invariant(
        publicContent.equals(content),
        `Public brand copy drifted from master: ${file.path}.`,
      );
    }
  }

  const appIcon = await readFile(path.join(root, "app", "icon.svg"));
  const faviconMaster = await readFile(
    path.join(brandRoot, "masters", "isandre-favicon.svg"),
  );
  invariant(appIcon.equals(faviconMaster), "App favicon drifted from the master.");

  invariant(
    brandAssets.wordmark.ink === "/brand/isandre-wordmark-positive.svg",
    "Runtime wordmark path is not canonical.",
  );

  const canonicalGuidePath = path.join(
    brandRoot,
    "guidelines",
    "isandre-brand-guidelines-a4-1.pdf",
  );
  const workingGuidePath = path.join(
    root,
    "output",
    "pdf",
    "isandre-brand-guidelines-a4-1.pdf",
  );
  const [canonicalGuide, workingGuide, guideStats] = await Promise.all([
    readFile(canonicalGuidePath),
    readFile(workingGuidePath),
    stat(canonicalGuidePath),
  ]);
  invariant(guideStats.size > 100_000, "The A4 identity guide is incomplete.");
  invariant(
    canonicalGuide.equals(workingGuide),
    "The versioned A4 guide drifted from the rendered working copy.",
  );

  console.log(
    `Brand system verified: ${manifest.files.length} assets, exact Entaille geometry, prototype plate dimensions and versioned A4 guide.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
