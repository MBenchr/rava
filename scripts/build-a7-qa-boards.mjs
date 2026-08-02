import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const manifestPath = path.join(root, "docs", "media", "a7-media-manifest.json");
const outputRoot = path.join(root, "docs", "media", "qa");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const cardWidth = 420;
const cardHeight = 560;
const imageWidth = 372;
const imageHeight = 452;
const gap = 24;
const columns = 4;
const background = { r: 243, g: 241, b: 235, alpha: 1 };

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function labelSvg(asset) {
  const status =
    asset.releaseStatus === "digital-approved" ? "DIGITAL APPROVED" : "CONCEPT BLOCKED";
  const statusColor =
    asset.releaseStatus === "digital-approved" ? "#2E5B48" : "#9B4F42";

  return Buffer.from(`
    <svg width="${cardWidth}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${cardWidth}" height="${cardHeight}" rx="16" fill="#FCFBF7"/>
      <rect x="24" y="500" width="6" height="6" rx="3" fill="${statusColor}"/>
      <text x="42" y="508" fill="#121311" font-family="Arial, sans-serif" font-size="16" font-weight="700">
        ${escapeXml(asset.productId.toUpperCase())} · ${escapeXml(asset.finishId.toUpperCase())}
      </text>
      <text x="24" y="536" fill="${statusColor}" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.2">
        ${status}
      </text>
    </svg>
  `);
}

async function buildCard(asset) {
  const sourcePath = path.join(root, asset.source.path);
  const image = await sharp(sourcePath)
    .rotate()
    .resize({
      width: imageWidth,
      height: imageHeight,
      fit: "contain",
      background,
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  return sharp(labelSvg(asset))
    .composite([{ input: image, left: 24, top: 24 }])
    .png()
    .toBuffer();
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const role of [...new Set(manifest.assets.map((asset) => asset.role))]) {
  const assets = manifest.assets.filter((asset) => asset.role === role);
  const rows = Math.ceil(assets.length / columns);
  const width = columns * cardWidth + (columns + 1) * gap;
  const height = rows * cardHeight + (rows + 1) * gap + 96;
  const title = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#E9E6DE"/>
      <text x="${gap}" y="54" fill="#121311" font-family="Arial, sans-serif" font-size="30" font-weight="700">
        ISANDRE / ṬĀQA — A7 ${escapeXml(role)}
      </text>
      <text x="${gap}" y="78" fill="#696B66" font-family="Arial, sans-serif" font-size="14">
        ${assets.length} canonical masters · ${escapeXml(manifest.releaseVersion)}
      </text>
    </svg>
  `);
  const cards = await Promise.all(assets.map(buildCard));
  const composites = cards.map((input, index) => ({
    input,
    left: gap + (index % columns) * (cardWidth + gap),
    top: 96 + gap + Math.floor(index / columns) * (cardHeight + gap),
  }));

  await sharp(title)
    .composite(composites)
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(outputRoot, `a7-${role.toLowerCase()}-board.webp`));
}

console.log(`Built ${new Set(manifest.assets.map((asset) => asset.role)).size} A7 QA boards.`);
