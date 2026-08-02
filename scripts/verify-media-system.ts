import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import {
  finishIds,
  productIds,
  type FinishId,
  type ProductId,
} from "../lib/isandre/catalog";

type Derivative = {
  path: string;
  sha256: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  aiDisclosureEmbedded: boolean;
  colorSpace: string;
  bitDepth: number;
  iccProfileEmbedded: boolean;
};

type ManifestAsset = {
  id: string;
  productId: ProductId;
  role:
    | "C01"
    | "C02"
    | "D01"
    | "D02"
    | "D03"
    | "D04"
    | "P01"
    | "P02"
    | "P03"
    | "P04";
  family: "commerce" | "desire" | "proof";
  finishId: FinishId;
  launchSelected: boolean;
  releaseStatus: "digital-approved" | "concept-blocked";
  geometryStatus: "approved" | "blocked";
  alt: {
    en: string;
    fr: string;
  };
  rights: {
    status: "pending-final-clearance";
    origin: "ai-assisted";
    rightsOwner: "pending";
    territories: "pending";
    channels: "pending";
    releaseGate: "H-010";
    peopleRelease: "not-applicable";
    propertyRelease: "review-required" | "not-applicable";
    thirdPartyObjects: "review-required" | "not-applicable";
  };
  color: {
    profile: "sRGB IEC61966-2.1";
    sourceBitDepth: number;
    physicalMasterBitDepth: 16;
    physicalMasterGate: "H-006/H-009/H-010";
  };
  source: {
    path: string;
    sha256: string;
    width: number;
    height: number;
    format: string;
    colorSpace: string;
    bitDepth: number;
    aiOrigin: boolean;
  };
  mobileSource: {
    path: string;
    sha256: string;
    width: number;
    height: number;
    format: string;
    colorSpace: string;
    bitDepth: number;
    aiOrigin: boolean;
  } | null;
  derivatives: Derivative[];
};

type MediaManifest = {
  schemaVersion: number;
  releaseVersion: string;
  assets: ManifestAsset[];
};

const root = process.cwd();
const auditManifestPath = path.join(root, "docs", "media", "a7-media-manifest.json");
const publicManifestPath = path.join(root, "public", "isandre", "media", "manifest.json");
const digitalSourceType =
  "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia";

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [auditRaw, publicRaw, catalogSource] = await Promise.all([
    readFile(auditManifestPath, "utf8"),
    readFile(publicManifestPath, "utf8"),
    readFile(path.join(root, "lib", "isandre", "catalog.ts"), "utf8"),
  ]);
  assert(auditRaw === publicRaw, "Audit and public media manifests diverge.");
  assert(!catalogSource.includes("/viaire/"), "The canonical catalog still references /viaire/.");

  const manifest = JSON.parse(auditRaw) as MediaManifest;
  assert(manifest.schemaVersion === 2, "Unexpected A7 media schema version.");
  assert(
    manifest.assets.length === 71,
    "A7 must register 71 canonical masters, including 12 acquisition-only D04 assets.",
  );

  for (const productId of productIds) {
    for (const finishId of finishIds) {
      const commerce = manifest.assets.find(
        (asset) =>
          asset.productId === productId &&
          asset.finishId === finishId &&
          asset.role === "C01",
      );
      const desire = manifest.assets.find(
        (asset) =>
          asset.productId === productId &&
          asset.finishId === finishId &&
          asset.role === "D01",
      );
      const threeQuarter = manifest.assets.find(
        (asset) =>
          asset.productId === productId &&
          asset.finishId === finishId &&
          asset.role === "C02",
      );
      assert(commerce, `Missing C01 for ${productId}/${finishId}.`);
      assert(threeQuarter, `Missing C02 for ${productId}/${finishId}.`);
      assert(desire, `Missing D01 for ${productId}/${finishId}.`);
      assert(
        commerce.source.sha256 !== desire.source.sha256,
        `Commerce and desire masters are duplicated for ${productId}/${finishId}.`,
      );
      if (productId !== "veille-03") {
        assert(
          desire.mobileSource,
          `Missing dedicated D01 mobile master for ${productId}/${finishId}.`,
        );
        assert(
          Math.abs(
            desire.mobileSource.width / desire.mobileSource.height - 0.8,
          ) <= 0.02,
          `Invalid mobile master ratio for ${productId}/${finishId}.`,
        );
      }
      const expectedStatus =
        productId === "veille-03" ? "concept-blocked" : "digital-approved";
      assert(
        commerce.releaseStatus === expectedStatus &&
          threeQuarter.releaseStatus === expectedStatus &&
          desire.releaseStatus === expectedStatus,
        `Invalid release status for ${productId}.`,
      );
    }

    for (const finishId of ["chalk", "butter"] satisfies FinishId[]) {
      const morning = manifest.assets.find(
        (asset) =>
          asset.productId === productId &&
          asset.finishId === finishId &&
          asset.role === "D02",
      );
      assert(morning, `Missing D02 morning scene for ${productId}/${finishId}.`);
      assert(
        morning.launchSelected === false,
        `${morning.id} must remain in the acquisition library, outside the launch PDP selection.`,
      );
    }

    for (const finishId of ["sage", "rose-clay"] satisfies FinishId[]) {
      const evening = manifest.assets.find(
        (asset) =>
          asset.productId === productId &&
          asset.finishId === finishId &&
          asset.role === "D03",
      );
      assert(evening, `Missing D03 evening scene for ${productId}/${finishId}.`);
      assert(
        evening.launchSelected === false,
        `${evening.id} must remain in the acquisition library, outside the launch PDP selection.`,
      );
    }

    for (const finishId of finishIds) {
      const functionalUse = manifest.assets.find(
        (asset) =>
          asset.productId === productId &&
          asset.finishId === finishId &&
          asset.role === "D04",
      );
      assert(
        functionalUse,
        `Missing D04 functional-use scene for ${productId}/${finishId}.`,
      );
      assert(
        functionalUse.launchSelected === true,
        `${functionalUse.id} must belong to the launch PDP selection.`,
      );
    }

    const depth = manifest.assets.find(
      (asset) =>
        asset.productId === productId &&
        asset.finishId === "chalk" &&
        asset.role === "P01",
    );
    assert(depth, `Missing P01 depth view for ${productId}.`);

    const rear = manifest.assets.find(
      (asset) =>
        asset.productId === productId &&
        asset.finishId === "chalk" &&
        asset.role === "P02",
    );
    if (productId === "veille-03") {
      assert(!rear, "VEILLE P02 must remain absent until H-005 is resolved.");
    } else {
      assert(rear, `Missing P02 rear view for ${productId}.`);
    }

    const dimensions = manifest.assets.find(
      (asset) =>
        asset.productId === productId &&
        asset.finishId === "chalk" &&
        asset.role === "P03",
    );
    assert(dimensions, `Missing P03 technical plate for ${productId}.`);

    const scale = manifest.assets.find(
      (asset) =>
        asset.productId === productId &&
        asset.finishId === "chalk" &&
        asset.role === "P04",
    );
    assert(scale, `Missing P04 scale view for ${productId}.`);
    if (productId === "veille-03") {
      assert(
        dimensions.releaseStatus === "concept-blocked" &&
          scale.releaseStatus === "concept-blocked",
        "VEILLE P03/P04 must remain concept-blocked until H-005 is resolved.",
      );
    }
  }

  const selectedCounts = Object.fromEntries(
    productIds.map((productId) => [
      productId,
      manifest.assets.filter(
        (asset) => asset.productId === productId && asset.launchSelected,
      ).length,
    ]),
  );
  assert(
    selectedCounts["seuil-01"] === 20 &&
      selectedCounts["portee-02"] === 20 &&
      selectedCounts["veille-03"] === 19,
    `Launch selection must remain 20/20/19, got ${JSON.stringify(selectedCounts)}.`,
  );

  const sourceChecksums = new Map<string, string>();
  for (const asset of manifest.assets) {
    assert(
      typeof asset.launchSelected === "boolean",
      `${asset.id} is missing launchSelected.`,
    );
    assert(asset.source.aiOrigin, `${asset.id} must declare its generative origin.`);
    assert(
      asset.alt.en.trim().length >= 20 && asset.alt.fr.trim().length >= 20,
      `${asset.id} must expose useful English and French alt text.`,
    );
    assert(
      asset.rights.status === "pending-final-clearance" &&
        asset.rights.origin === "ai-assisted" &&
        asset.rights.releaseGate === "H-010",
      `${asset.id} must expose the non-released rights contract.`,
    );
    assert(
      asset.color.profile === "sRGB IEC61966-2.1" &&
        asset.color.sourceBitDepth === 8 &&
        asset.color.physicalMasterBitDepth === 16 &&
        asset.color.physicalMasterGate === "H-006/H-009/H-010",
      `${asset.id} must distinguish the 8-bit digital source from the gated 16-bit physical master.`,
    );
    assert(
      !asset.source.path.match(/viaire|rava|mura/i),
      `${asset.id} uses a retired asset namespace.`,
    );
    const duplicatedSource = sourceChecksums.get(asset.source.sha256);
    assert(
      !duplicatedSource,
      `${asset.id} duplicates the canonical source used by ${duplicatedSource}.`,
    );
    sourceChecksums.set(asset.source.sha256, asset.id);
    assert(asset.derivatives.length === 22, `${asset.id} must have 22 derivatives.`);
    for (const width of [480, 768, 1024, 1440]) {
      assert(
        asset.derivatives.some((item) => item.path.endsWith(`/w-${width}.jpg`)),
        `${asset.id} is missing the ${width}px JPEG fallback.`,
      );
    }
    for (const width of [720, 960]) {
      assert(
        asset.derivatives.some((item) => item.path.endsWith(`/mobile-${width}.jpg`)),
        `${asset.id} is missing the mobile ${width}px JPEG fallback.`,
      );
    }

    const seenPaths = new Set<string>();
    for (const derivative of asset.derivatives) {
      assert(!seenPaths.has(derivative.path), `Duplicate derivative ${derivative.path}.`);
      seenPaths.add(derivative.path);
      const buffer = await readFile(path.join(root, derivative.path));
      const metadata = await sharp(buffer).metadata();
      assert(sha256(buffer) === derivative.sha256, `Checksum mismatch for ${derivative.path}.`);
      assert(
        metadata.width === derivative.width && metadata.height === derivative.height,
        `Dimension mismatch for ${derivative.path}.`,
      );
      assert(derivative.bytes <= 1_500_000, `${derivative.path} exceeds 1.5 MB.`);
      assert(
        metadata.xmp?.includes(Buffer.from(digitalSourceType)),
        `AI disclosure is missing from ${derivative.path}.`,
      );
      assert(
        derivative.colorSpace === "srgb" &&
          derivative.bitDepth === 8 &&
          derivative.iccProfileEmbedded &&
          Boolean(metadata.icc?.length),
        `The sRGB ICC delivery contract is missing from ${derivative.path}.`,
      );
    }
  }

  console.log(
    `Verified ${manifest.assets.length} media masters across ${productIds.length} products and ${finishIds.length} finishes.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
