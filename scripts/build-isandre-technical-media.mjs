import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const geometry = JSON.parse(
  await readFile(path.join(root, "lib", "isandre", "geometry.data.json"), "utf8"),
);
const canvas = { width: 2000, height: 2500 };
const paper = "#F3F1EB";
const ink = "#171815";
const muted = "#6B6D68";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function dimensionLayer(productId, dimensions) {
  const productName = {
    "seuil-01": "SEUIL 01",
    "portee-02": "PORTÉE 02",
    "veille-03": "VEILLE 03",
  }[productId];

  if (!dimensions) {
    return Buffer.from(`
      <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .ui { font-family: Arial, Helvetica, sans-serif; fill: ${ink}; }
          .muted { fill: ${muted}; }
        </style>
        <text class="ui" x="140" y="170" font-size="36" letter-spacing="8">${productName}</text>
        <text class="ui" x="140" y="2260" font-size="56">Dimensions under validation</text>
        <text class="ui muted" x="140" y="2330" font-size="30">No numerical claim is published before manufacturer approval.</text>
      </svg>
    `);
  }

  const widthLabel = `${dimensions.width} mm`;
  const heightLabel = `${dimensions.height} mm`;
  const depthLabel = `${dimensions.depth} mm`;
  return Buffer.from(`
    <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="${ink}" />
        </marker>
      </defs>
      <style>
        .ui { font-family: Arial, Helvetica, sans-serif; fill: ${ink}; }
        .muted { fill: ${muted}; }
        .rule { stroke: ${ink}; stroke-width: 3; marker-start: url(#arrow); marker-end: url(#arrow); }
        .guide { stroke: ${ink}; stroke-width: 2; opacity: .35; }
      </style>
      <text class="ui" x="140" y="170" font-size="36" letter-spacing="8">${productName}</text>
      <line class="guide" x1="330" y1="2070" x2="330" y2="2180" />
      <line class="guide" x1="1670" y1="2070" x2="1670" y2="2180" />
      <line class="rule" x1="350" y1="2140" x2="1650" y2="2140" />
      <text class="ui" x="1000" y="2115" text-anchor="middle" font-size="42">${widthLabel}</text>
      <line class="guide" x1="250" y1="400" x2="360" y2="400" />
      <line class="guide" x1="250" y1="2020" x2="360" y2="2020" />
      <line class="rule" x1="290" y1="420" x2="290" y2="2000" />
      <text class="ui" x="240" y="1210" text-anchor="middle" font-size="42" transform="rotate(-90 240 1210)">${heightLabel}</text>
      <rect x="1330" y="2260" width="520" height="110" rx="55" fill="${ink}" />
      <text x="1590" y="2330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="${paper}">Depth ${depthLabel}</text>
      <text class="ui muted" x="140" y="2330" font-size="30">Canonical geometry · ${escapeXml(geometry.kits[productId].version)}</text>
    </svg>
  `);
}

async function build(productId) {
  const outputDirectory = path.join(
    root,
    "media",
    "a7-sources",
    productId,
    "p03",
  );
  await mkdir(outputDirectory, { recursive: true });

  const sourcePath = path.join(
    root,
    "media",
    "a7-sources",
    productId,
    "c01",
    "chalk.png",
  );
  const product = await sharp(sourcePath)
    .resize({
      width: 1320,
      height: 1660,
      fit: "contain",
      background: paper,
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: canvas.width,
      height: canvas.height,
      channels: 4,
      background: paper,
    },
  })
    .composite([
      { input: product, left: 340, top: 330 },
      {
        input: dimensionLayer(productId, geometry.kits[productId].dimensionsMm),
        left: 0,
        top: 0,
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDirectory, "chalk.png"));
}

for (const productId of Object.keys(geometry.kits)) {
  await build(productId);
}

console.log("Built three deterministic P03 technical masters.");
