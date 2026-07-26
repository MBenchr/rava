import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const sourceRoot = path.join(root, "assets", "viaire-visuals-source", "final");
const outputRoot = path.join(root, "public", "viaire");

const products = {
  "elan-o1": "seuil",
  "portee-o2": "portee",
  "veille-o4": "veille",
};

const finishes = ["chalk", "butter", "sage", "plaster-rose"];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

async function writeResponsiveScene(input, outputStem) {
  await mkdir(path.dirname(outputStem), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 91, effort: 6, smartSubsample: true })
    .toFile(`${outputStem}.webp`);

  await sharp(input)
    .rotate()
    .resize({ width: 960, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 87, effort: 6, smartSubsample: true })
    .toFile(`${outputStem}-mobile.webp`);
}

async function writeMaterialDetail(input, outputStem) {
  await mkdir(path.dirname(outputStem), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "cover", position: "attention" })
    .webp({ quality: 91, effort: 6, smartSubsample: true })
    .toFile(`${outputStem}.webp`);

  await sharp(input)
    .rotate()
    .resize({ width: 720, height: 720, fit: "cover", position: "attention" })
    .webp({ quality: 87, effort: 6, smartSubsample: true })
    .toFile(`${outputStem}-mobile.webp`);
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const [productId, publicName] of Object.entries(products)) {
  for (const finishId of finishes) {
    const source = path.join(sourceRoot, productId, `${finishId}.png`);
    await writeResponsiveScene(
      source,
      path.join(
        outputRoot,
        productId,
        "scenes",
        `viaire-${publicName}-${finishId}-lifestyle`,
      ),
    );
    await writeMaterialDetail(
      source,
      path.join(
        outputRoot,
        productId,
        "details",
        `viaire-${publicName}-${finishId}-material-detail`,
      ),
    );
  }
}

const outputFiles = await walk(outputRoot);
await writeFile(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(
    {
      version: "2026.07.25-3",
      brand: "VIAIRE",
      sourcePolicy:
        "Every published storefront image derives from a complete coherent photograph generated with the approved V2040 identity as reference. No product layer is pasted onto a room plate.",
      materialPolicy:
        "Fine hand-applied mineral plaster, silky matte 5-8 GU, with subtle tonal and trowel variation visible only in grazing light.",
      geometryPolicy:
        "SEUIL is 1020 x 1840 x 420 mm. PORTEE is 1840 x 1020 x 420 mm with 80 mm junctions. VEILLE preserves the approved V2040 visual identity pending manufacturer dimensions.",
      assets: outputFiles
        .filter((file) => file.endsWith(".webp"))
        .map((file) => path.relative(root, file)),
    },
    null,
    2,
  )}\n`,
);

console.log(`Prepared ${outputFiles.length} photographic VIAIRE storefront assets.`);
