import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  parseVeilleGeometrySubmission,
  requireApprovedVeilleGeometry,
} from "@/lib/isandre/geometry-import";

const template = JSON.parse(
  readFileSync(
    "docs/execution/geometry-import/veille-03-input.template.json",
    "utf8",
  ),
);

assert.equal(
  parseVeilleGeometrySubmission(template).status,
  "pending-manufacturer-approval",
);
assert.throws(
  () => requireApprovedVeilleGeometry(template),
  /VEILLE_GEOMETRY_NOT_APPROVED/,
);

const approvedFixture = {
  ...template,
  status: "approved-manufacturer-drawing",
  supplier: "Fixture manufacturer",
  drawingReference: "FIXTURE-NOT-FOR-PRODUCTION",
  dimensionsMm: { width: 520, height: 720, depth: 420 },
  outerRadiusMm: 52,
  wallThicknessMm: 80,
  plinth: { heightMm: 60, recessMm: 20 },
  openings: [
    {
      id: "upper",
      kind: "arch",
      x: 80,
      y: 80,
      width: 360,
      height: 320,
      radius: 120,
      shoulderY: 180,
    },
    {
      id: "lower",
      kind: "rounded-rect",
      x: 80,
      y: 480,
      width: 360,
      height: 160,
      radius: 52,
    },
  ],
  approval: {
    approvedBy: "Test fixture",
    approvedAt: "2026-07-29T12:00:00+02:00",
    drawingSha256: "a".repeat(64),
  },
};

const approved = requireApprovedVeilleGeometry(approvedFixture);
assert.equal(approved.openings.length, 2);
assert.equal(approved.dimensionsMm.depth, 420);

assert.throws(() =>
  requireApprovedVeilleGeometry({
    ...approvedFixture,
    openings: [
      approvedFixture.openings[0],
      { ...approvedFixture.openings[1], x: 400 },
    ],
  }),
);

console.log(
  "Verified VEILLE import gate: pending template rejected and approved drawings constrained.",
);
