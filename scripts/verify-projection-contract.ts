import assert from "node:assert/strict";

import {
  buildProjectionPrompt,
  chooseApiCanvas,
  fitPlacementBoxToProductAspect,
  PROJECTION_PROMPT_VERSION,
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

const prompt = buildProjectionPrompt({
  productId: "seuil-01",
  finishId: "chalk",
  placementMode: "against-wall",
  placementBox: fitted,
  message: "Keep the chair in the foreground.",
});

assert.equal(PROJECTION_PROMPT_VERSION, "single-reference-room-edit-v2");
assert.match(prompt, /IMAGE 2 is the only authorised reference/);
assert.match(prompt, /102 cm wide × 184 cm high × 42 cm deep/);
assert.match(prompt, /Do not add, remove, merge or reshape an opening/);
assert.match(prompt, /not a collage or 3D overlay/);
assert.match(prompt, /Keep the chair in the foreground/);

console.log(
  `Projection contract verified: ${imageCases.length} image formats, deterministic placement and one official reference.`,
);
