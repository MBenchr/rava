import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const sourcePlanPath = path.join(root, "docs", "media", "a7-media-source-plan.json");
const sourcePlan = JSON.parse(await readFile(sourcePlanPath, "utf8"));
const sourceRoot = path.join(root, sourcePlan.sourceRoot);
const outputRoot = path.join(root, sourcePlan.publicRoot);
const publicManifestPath = path.join(outputRoot, "manifest.json");
const auditManifestPath = path.join(root, "docs", "media", "a7-media-manifest.json");
const roles = Object.keys(sourcePlan.roles);
const desktopWidths = [480, 768, 1024, 1440];
const mobileWidths = [720, 960];
const background = { r: 243, g: 241, b: 235, alpha: 1 };
const digitalSourceType = sourcePlan.aiDisclosure;
const xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description
      rdf:about=""
      xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
      Iptc4xmpExt:DigitalSourceType="${digitalSourceType}" />
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function roleDirectory(role) {
  return role.toLowerCase();
}

async function encode(input, output, format, resize) {
  let pipeline = sharp(input).rotate();
  if (resize) pipeline = pipeline.resize(resize);
  pipeline = pipeline.withIccProfile("srgb").withXmp(xmp);

  if (format === "avif") {
    pipeline = pipeline.avif({ quality: 62, effort: 7 });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" });
  } else {
    pipeline = pipeline.webp({ quality: 86, effort: 6, smartSubsample: true });
  }

  await pipeline.toFile(output);
}

function sourceBitDepth(metadata) {
  return metadata.depth === "ushort" ? 16 : 8;
}

function altText(productId, role, finishId) {
  const product = sourcePlan.labels.products[productId];
  const finish = sourcePlan.labels.finishes[finishId];
  const roleLabel = sourcePlan.roles[role].label;

  return {
    en: `${product.en} in ${finish.en}. ${roleLabel}.`,
    fr: `${product.fr} en finition ${finish.fr}. ${roleLabel}.`,
  };
}

async function buildAsset(productId, role, finishId) {
  const sourcePath = path.join(sourceRoot, productId, roleDirectory(role), `${finishId}.png`);
  const sourceBuffer = await readFile(sourcePath);
  const sourceMetadata = await sharp(sourceBuffer).metadata();
  const mobileSourcePath = path.join(
    sourceRoot,
    productId,
    `${roleDirectory(role)}-mobile`,
    `${finishId}.png`,
  );
  let mobileSourceBuffer = sourceBuffer;
  let mobileSource = null;
  if (role === "D01") {
    try {
      mobileSourceBuffer = await readFile(mobileSourcePath);
      const mobileMetadata = await sharp(mobileSourceBuffer).metadata();
      mobileSource = {
        path: path.relative(root, mobileSourcePath),
        sha256: sha256(mobileSourceBuffer),
        width: mobileMetadata.width,
        height: mobileMetadata.height,
        format: mobileMetadata.format,
        colorSpace: mobileMetadata.space,
        bitDepth: sourceBitDepth(mobileMetadata),
        aiOrigin: true,
      };
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  const outputDirectory = path.join(outputRoot, productId, roleDirectory(role), finishId);
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all(
    desktopWidths.flatMap((width) =>
      ["webp", "avif", "jpeg"].map((format) =>
        encode(
          sourceBuffer,
          path.join(
            outputDirectory,
            `w-${width}.${format === "jpeg" ? "jpg" : format}`,
          ),
          format,
          { width, fit: "inside", withoutEnlargement: true },
        ),
      ),
    ),
  );

  await Promise.all(
    mobileWidths.flatMap((width) =>
      ["webp", "avif", "jpeg"].map((format) =>
        encode(
          mobileSourceBuffer,
          path.join(
            outputDirectory,
            `mobile-${width}.${format === "jpeg" ? "jpg" : format}`,
          ),
          format,
          {
            width,
            height: Math.round(width * 1.25),
            fit: "contain",
            background,
            withoutEnlargement: false,
          },
        ),
      ),
    ),
  );

  await Promise.all([
    encode(
      sourceBuffer,
      path.join(outputDirectory, "index.webp"),
      "webp",
      { width: 1586, fit: "inside", withoutEnlargement: true },
    ),
    encode(
      sourceBuffer,
      path.join(outputDirectory, "index.avif"),
      "avif",
      { width: 1586, fit: "inside", withoutEnlargement: true },
    ),
    encode(
      sourceBuffer,
      path.join(outputDirectory, "index.jpg"),
      "jpeg",
      { width: 1586, fit: "inside", withoutEnlargement: true },
    ),
    encode(
      sourceBuffer,
      path.join(outputDirectory, "thumb.webp"),
      "webp",
      {
        width: 360,
        height: 450,
        fit: "contain",
        background,
        withoutEnlargement: false,
      },
    ),
  ]);

  const outputFiles = [
    "index.webp",
    "index.avif",
    "index.jpg",
    "thumb.webp",
    ...desktopWidths.flatMap((width) => [
      `w-${width}.webp`,
      `w-${width}.avif`,
      `w-${width}.jpg`,
    ]),
    ...mobileWidths.flatMap((width) => [
      `mobile-${width}.webp`,
      `mobile-${width}.avif`,
      `mobile-${width}.jpg`,
    ]),
  ];
  const derivatives = [];

  for (const filename of outputFiles) {
    const absolutePath = path.join(outputDirectory, filename);
    const buffer = await readFile(absolutePath);
    const metadata = await sharp(buffer).metadata();
    derivatives.push({
      path: path.relative(root, absolutePath),
      sha256: sha256(buffer),
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      bytes: buffer.byteLength,
      aiDisclosureEmbedded: metadata.xmp?.includes(Buffer.from(digitalSourceType)) ?? false,
      colorSpace: metadata.space,
      bitDepth: sourceBitDepth(metadata),
      iccProfileEmbedded: Boolean(metadata.icc?.length),
    });
  }

  return {
    id: `${productId}-${role.toLowerCase()}-${finishId}`,
    productId,
    role,
    family: sourcePlan.roles[role].family,
    finishId,
    launchSelected: sourcePlan.roles[role].launchSelected !== false,
    releaseStatus: sourcePlan.products[productId].status,
    geometryStatus: sourcePlan.products[productId].geometryStatus,
    alt: altText(productId, role, finishId),
    rights: {
      ...sourcePlan.rightsPolicy,
      peopleRelease: "not-applicable",
      propertyRelease: sourcePlan.roles[role].allowScene
        ? "review-required"
        : "not-applicable",
      thirdPartyObjects: sourcePlan.roles[role].allowProps
        ? "review-required"
        : "not-applicable",
    },
    color: {
      profile: sourcePlan.colorPolicy.deliveryProfile,
      sourceBitDepth: sourceBitDepth(sourceMetadata),
      physicalMasterBitDepth: sourcePlan.colorPolicy.physicalMasterBitDepth,
      physicalMasterGate: sourcePlan.colorPolicy.physicalMasterGate,
    },
    source: {
      path: path.relative(root, sourcePath),
      sha256: sha256(sourceBuffer),
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      format: sourceMetadata.format,
      colorSpace: sourceMetadata.space,
      bitDepth: sourceBitDepth(sourceMetadata),
      aiOrigin: true,
    },
    mobileSource,
    derivatives,
  };
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const assets = [];
for (const [productId, product] of Object.entries(sourcePlan.products)) {
  for (const role of roles) {
    const roleDefinition = sourcePlan.roles[role];
    if (
      Array.isArray(roleDefinition.products) &&
      !roleDefinition.products.includes(productId)
    ) {
      continue;
    }
    const roleFinishes =
      roleDefinition.finishes === "all"
        ? product.finishes
        : roleDefinition.finishes;
    for (const finishId of roleFinishes) {
      assets.push(await buildAsset(productId, role, finishId));
    }
  }
}

const manifest = {
  schemaVersion: sourcePlan.schemaVersion,
  releaseVersion: sourcePlan.releaseVersion,
  brand: sourcePlan.brand,
  collection: sourcePlan.collection,
  generatedFrom: path.relative(root, sourcePlanPath),
  policies: sourcePlan.policies,
  assets,
};

const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
await writeFile(publicManifestPath, serialized);
await writeFile(auditManifestPath, serialized);

console.log(
  `Built ${assets.length} canonical masters and ${assets.reduce((total, asset) => total + asset.derivatives.length, 0)} derivatives.`,
);
