import assert from "node:assert/strict";

import {
  chooseApiCanvas,
  fitPlacementBoxToProductAspect,
} from "@/lib/openai-projection";

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
  assert.ok(Math.max(canvas.width, canvas.height) <= 1280, "canvas edge exceeds local budget");
  assert.ok(canvas.width * canvas.height >= 655_360, "canvas is below gpt-image-2 minimum");
  assert.ok(
    Math.max(canvas.width / canvas.height, canvas.height / canvas.width) <= 3,
    "canvas ratio exceeds 3:1",
  );
}

const requestedBox = { x: 0.3, y: 0.18, width: 0.24, height: 0.48 };
const source = { width: 1200, height: 1600 };
const productAspect = 102 / 184;
const fitted = fitPlacementBoxToProductAspect(requestedBox, productAspect, source);
const requestedFloorAnchor = {
  x: requestedBox.x + requestedBox.width / 2,
  y: requestedBox.y + requestedBox.height,
};
const fittedFloorAnchor = {
  x: fitted.x + fitted.width / 2,
  y: fitted.y + fitted.height,
};
const fittedPixelAspect = (fitted.width * source.width) / (fitted.height * source.height);

assert.ok(Math.abs(fittedFloorAnchor.x - requestedFloorAnchor.x) < 0.0001);
assert.ok(Math.abs(fittedFloorAnchor.y - requestedFloorAnchor.y) < 0.0001);
assert.ok(Math.abs(fittedPixelAspect - productAspect) < 0.0001);

console.log(
  `Projection contract verified: ${imageCases.length} image formats and deterministic placement.`,
);
