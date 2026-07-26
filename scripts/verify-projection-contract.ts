import assert from "node:assert/strict";

import { chooseApiCanvas } from "@/lib/openai-projection";
import { evaluateProjectionQuality } from "@/modules/projection/quality/quality-gate";

const imageCases = [
  { width: 1600, height: 900 },
  { width: 1200, height: 1600 },
  { width: 1600, height: 1600 },
  { width: 2400, height: 800 },
  { width: 800, height: 2400 },
];

for (const source of imageCases) {
  const canvas = chooseApiCanvas(source);
  assert.equal(canvas.width % 16, 0, "canvas width must use the 16 px image grid");
  assert.equal(canvas.height % 16, 0, "canvas height must use the 16 px image grid");
  assert.ok(Math.max(canvas.width, canvas.height) <= 1536, "canvas edge exceeds local budget");
  assert.ok(canvas.width * canvas.height >= 655_360, "canvas is below gpt-image-2 minimum");
  assert.ok(
    Math.max(canvas.width / canvas.height, canvas.height / canvas.width) <= 3,
    "canvas ratio exceeds 3:1",
  );
}

const requestedBox = { x: 0.3, y: 0.18, width: 0.24, height: 0.48 };
const accepted = evaluateProjectionQuality({
  requestedBox,
  renderedBox: { ...requestedBox },
  geometryLocked: true,
  geometrySimilarity: 0.95,
  placementConfidence: 0.93,
  realismScore: 0.9,
  roomPreservationScore: 0.96,
  outsideIntegrationChangeRatio: 0.002,
});
assert.equal(accepted.passed, true, accepted.reasons.join(", "));

const distorted = evaluateProjectionQuality({
  requestedBox,
  renderedBox: { ...requestedBox, width: requestedBox.width * 1.12 },
  geometryLocked: true,
  geometrySimilarity: 0.95,
  placementConfidence: 0.93,
  realismScore: 0.9,
  roomPreservationScore: 0.96,
  outsideIntegrationChangeRatio: 0.002,
});
assert.equal(distorted.passed, false);
assert.ok(distorted.reasons.includes("product_aspect_ratio_delta_over_4_percent"));

console.log(`Projection contract verified: ${imageCases.length} image formats and strict geometry.`);
