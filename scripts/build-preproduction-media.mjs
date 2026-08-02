import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const planPath = path.join(
  root,
  "docs",
  "media",
  "preproduction-visualization-plan.json",
);
const plan = JSON.parse(await readFile(planPath, "utf8"));
const publicRoot = path.join(root, "public", "isandre", "preproduction");
const auditManifestPath = path.join(
  root,
  "docs",
  "media",
  "preproduction-media-manifest.json",
);
const publicManifestPath = path.join(publicRoot, "manifest.json");
const digitalSourceType =
  "http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia";
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

async function encode(input, output, format, resize) {
  let pipeline = sharp(input).rotate().resize(resize).withIccProfile("srgb").withXmp(xmp);

  if (format === "avif") {
    pipeline = pipeline.avif({ quality: 62, effort: 7 });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({
      quality: 88,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    });
  } else {
    pipeline = pipeline.webp({ quality: 86, effort: 6, smartSubsample: true });
  }

  await pipeline.toFile(output);
}

async function buildAsset(asset) {
  const sourcePath = path.join(root, asset.output);
  const sourceBuffer = await readFile(sourcePath);
  const sourceMetadata = await sharp(sourceBuffer).metadata();
  const outputDirectory = path.join(publicRoot, asset.slug);
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all([
    encode(sourceBuffer, path.join(outputDirectory, "index.webp"), "webp", {
      width: 1536,
      fit: "inside",
      withoutEnlargement: true,
    }),
    encode(sourceBuffer, path.join(outputDirectory, "index.avif"), "avif", {
      width: 1536,
      fit: "inside",
      withoutEnlargement: true,
    }),
    encode(sourceBuffer, path.join(outputDirectory, "index.jpg"), "jpeg", {
      width: 1536,
      fit: "inside",
      withoutEnlargement: true,
    }),
    encode(sourceBuffer, path.join(outputDirectory, "mobile.webp"), "webp", {
      width: 960,
      fit: "inside",
      withoutEnlargement: true,
    }),
    encode(sourceBuffer, path.join(outputDirectory, "mobile.avif"), "avif", {
      width: 960,
      fit: "inside",
      withoutEnlargement: true,
    }),
    encode(sourceBuffer, path.join(outputDirectory, "thumb.webp"), "webp", {
      width: 360,
      height: 360,
      fit: "cover",
      position: "attention",
    }),
  ]);

  const derivatives = {};
  for (const filename of [
    "index.webp",
    "index.avif",
    "index.jpg",
    "mobile.webp",
    "mobile.avif",
    "thumb.webp",
  ]) {
    const outputBuffer = await readFile(path.join(outputDirectory, filename));
    const metadata = await sharp(outputBuffer).metadata();
    derivatives[filename] = {
      sha256: sha256(outputBuffer),
      bytes: outputBuffer.byteLength,
      width: metadata.width,
      height: metadata.height,
    };
  }

  return {
    id: asset.id,
    slug: asset.slug,
    productId: asset.productId,
    title: asset.title,
    ratio: asset.ratio,
    status: asset.status,
    disclosure: plan.disclosure,
    alt: asset.alt,
    caption: asset.caption,
    source: {
      path: asset.output,
      sha256: sha256(sourceBuffer),
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      aiOrigin: true,
    },
    derivatives,
  };
}

await rm(publicRoot, { recursive: true, force: true });
await mkdir(publicRoot, { recursive: true });
const assets = [];
for (const asset of plan.assets) {
  assets.push(await buildAsset(asset));
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  status: plan.status,
  proofPolicy: plan.proofPolicy,
  originDirection: plan.originDirection,
  digitalSourceType,
  assets,
};
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
await Promise.all([
  writeFile(publicManifestPath, serialized, "utf8"),
  writeFile(auditManifestPath, serialized, "utf8"),
]);

console.log(`Built ${assets.length} disclosed pre-production media assets.`);
