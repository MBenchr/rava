import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

type PilotManifest = {
  version: string;
  policy: {
    publicIntegrationAllowed: boolean;
    fullSceneReconstructionRequired: boolean;
    visible3dCollageAllowed: boolean;
  };
  pilots: Array<{
    productId: "seuil-01" | "portee-02" | "veille-03";
    geometryStatus: "approved" | "blocked";
    expectedOpeningCount: number;
    camera: {
      focalLengthEquivalentMm: number;
      heightCm: number;
      orientation: "landscape" | "portrait";
    };
    directions: string[];
    selected: string;
    releaseStatus: "digitally-approved-pilot" | "concept-blocked";
  }>;
};

async function main() {
  const root = process.cwd();
  const manifestPath = path.join(root, "docs/media/a6-pilot-manifest.json");
  const manifest = JSON.parse(
    await readFile(manifestPath, "utf8"),
  ) as PilotManifest;

  const errors: string[] = [];
  const checksums = new Map<string, string>();

  if (manifest.pilots.length !== 3) {
    errors.push(`Expected 3 pilots, found ${manifest.pilots.length}.`);
  }

  if (
    manifest.policy.publicIntegrationAllowed ||
    !manifest.policy.fullSceneReconstructionRequired ||
    manifest.policy.visible3dCollageAllowed
  ) {
    errors.push("Pilot media policy does not enforce the A6 visual contract.");
  }

  for (const pilot of manifest.pilots) {
    if (pilot.directions.length !== 3) {
      errors.push(`${pilot.productId}: expected exactly 3 directions.`);
    }

    if (
      pilot.camera.focalLengthEquivalentMm < 35 ||
      pilot.camera.focalLengthEquivalentMm > 50
    ) {
      errors.push(`${pilot.productId}: focal length is outside 35–50 mm.`);
    }

    if (pilot.camera.heightCm < 125 || pilot.camera.heightCm > 145) {
      errors.push(`${pilot.productId}: camera height is outside 125–145 cm.`);
    }

    if (pilot.productId === "veille-03") {
      if (
        pilot.geometryStatus !== "blocked" ||
        pilot.releaseStatus !== "concept-blocked" ||
        pilot.expectedOpeningCount !== 2
      ) {
        errors.push("veille-03 must remain a blocked two-opening concept.");
      }
    } else if (
      pilot.geometryStatus !== "approved" ||
      pilot.releaseStatus !== "digitally-approved-pilot" ||
      pilot.expectedOpeningCount !== 8
    ) {
      errors.push(`${pilot.productId}: approved geometry contract is incomplete.`);
    }

    for (const relativePath of [...pilot.directions, pilot.selected]) {
      if (relativePath.startsWith("public/") || relativePath.includes("/public/")) {
        errors.push(`${pilot.productId}: pilot asset must not be under public/.`);
        continue;
      }

      const absolutePath = path.join(root, relativePath);
      const buffer = await readFile(absolutePath);
      const metadata = await sharp(buffer).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      const actualOrientation = width >= height ? "landscape" : "portrait";

      if (actualOrientation !== pilot.camera.orientation) {
        errors.push(
          `${pilot.productId}: ${relativePath} is ${actualOrientation}, expected ${pilot.camera.orientation}.`,
        );
      }

      if (Math.min(width, height) < 900) {
        errors.push(`${pilot.productId}: ${relativePath} is below pilot resolution.`);
      }

      const checksum = createHash("sha256").update(buffer).digest("hex");
      const existing = checksums.get(checksum);
      const selectedCopy = relativePath === pilot.selected;
      if (existing && !selectedCopy) {
        errors.push(`${pilot.productId}: duplicate directions ${existing} and ${relativePath}.`);
      }
      checksums.set(checksum, relativePath);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.map((error) => `- ${error}`).join("\n"));
  }

  console.log(
    `A6 visual pilots verified: ${manifest.pilots.length} products, ` +
      `${manifest.pilots.length * 3} directions, version ${manifest.version}.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
