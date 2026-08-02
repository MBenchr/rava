import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { finishIds, productIds } from "@/lib/isandre/catalog";
import { productReferenceKits } from "@/lib/isandre/geometry";
import {
  industrialFinishSpecs,
  materialPlatform,
  packagingTargets,
  productIndustrialSpecs,
  validationProgramme,
} from "@/lib/isandre/industrial";

const root = process.cwd();
const requiredDocuments = [
  "docs/industrial/README.md",
  "docs/industrial/rfq-manufacturer.md",
  "docs/industrial/material-test-protocol.md",
  "docs/industrial/supplier-scorecard.md",
  "docs/industrial/golden-sample-checklist.md",
  "docs/industrial/unit-qc-template.md",
  "docs/industrial/non-conformity-report-template.md",
  "docs/industrial/packaging-specification.md",
  "docs/industrial/cost-margin-model.md",
  "docs/industrial/isandre-industrial-cost-model.xlsx",
  "docs/industrial/tools/build-industrial-cost-model.mjs",
];
const forbiddenLegacyTerms =
  /\b(?:RAVA|MURA|VIAIRE|FORME OUVERTE|S[ÉE]RIE O|TRAVERS[ÉE]E)\b/i;

function checksum(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

assert.deepEqual(Object.keys(industrialFinishSpecs).sort(), [...finishIds].sort());
assert.deepEqual(Object.keys(productIndustrialSpecs).sort(), [...productIds].sort());

assert.equal(materialPlatform.primary, "rotomoulded-lldpe");
assert.equal(materialPlatform.fallback, "gfrp-mineral-finish");
assert.equal(materialPlatform.architecture.nominalSkinMm, 7);
assert.deepEqual(materialPlatform.surface.gloss60Gu, {
  min: 8,
  max: 15,
  unit: "GU",
  status: "prototype-required",
});
assert.deepEqual(materialPlatform.surface.opticalReliefUm, {
  min: 30,
  max: 50,
  unit: "µm",
  status: "prototype-required",
});

const approvedDimensions = {
  "seuil-01": { width: 1020, height: 1840, depth: 420 },
  "portee-02": { width: 1840, height: 1020, depth: 420 },
} as const;

for (const [productId, dimensions] of Object.entries(approvedDimensions)) {
  const kit = productReferenceKits[productId as keyof typeof approvedDimensions];
  const industrial = productIndustrialSpecs[productId as keyof typeof approvedDimensions];

  assert.equal(kit.status, "approved");
  if (kit.status !== "approved") continue;

  assert.deepEqual(kit.dimensionsMm, dimensions);
  assert.equal(kit.wallThicknessMm, materialPlatform.architecture.visualSectionMm);
  assert.ok(kit.openings.length > 0);
  assert.equal(industrial.manufacturingRoute, "rotomoulded-lldpe");
  assert.equal(industrial.nominalSkinMm, 7);
}

assert.equal(productReferenceKits["veille-03"].status, "design-frozen");
assert.equal(productIndustrialSpecs["veille-03"].status, "blocked");
assert.equal(productIndustrialSpecs["veille-03"].manufacturingRoute, "unvalidated");
assert.match(
  productIndustrialSpecs["veille-03"].blockingReason ?? "",
  /dimensions|geometry/i,
);

assert.deepEqual(packagingTargets.packedVolumeM3, {
  min: 1,
  max: 1.2,
  unit: "m³",
});
assert.ok(validationProgramme.couponFamilies.length >= 6);
assert.ok(validationProgramme.hardGates.length >= 6);

for (const relativePath of requiredDocuments) {
  const absolutePath = join(root, relativePath);
  assert.ok(existsSync(absolutePath), `Missing industrial artifact: ${relativePath}`);
  assert.ok(statSync(absolutePath).size > 100, `Industrial artifact is empty: ${relativePath}`);
}

const canonicalWorkbook = join(
  root,
  "docs/industrial/isandre-industrial-cost-model.xlsx",
);
assert.ok(statSync(canonicalWorkbook).size > 10_000, "Industrial workbook is incomplete");

const outputWorkbook = join(
  root,
  "outputs/019f427a-684e-7a63-acd9-658dde7e6acf/isandre-industrial-cost-model.xlsx",
);
if (existsSync(outputWorkbook)) {
  assert.equal(
    checksum(outputWorkbook),
    checksum(canonicalWorkbook),
    "Working and canonical industrial workbooks diverge",
  );
}

for (const relativePath of requiredDocuments.filter((path) => path.endsWith(".md"))) {
  const content = readFileSync(join(root, relativePath), "utf8");
  assert.doesNotMatch(content, forbiddenLegacyTerms, `Legacy naming in ${relativePath}`);
}

console.log(
  `Industrial system verified: ${productIds.length} products, ${finishIds.length} finishes, ${requiredDocuments.length} artifacts.`,
);
