import assert from "node:assert/strict";

import { getApprovedProductReferenceKit } from "@/modules/projection/core/reference-kits";
import {
  createProductGeometry,
  readGeometryDimensionsMm,
} from "@/modules/projection/renderer/product-mesh";

async function main() {
  const vertical = getApprovedProductReferenceKit("elan-o1");
  const horizontal = getApprovedProductReferenceKit("portee-o2");

  for (const productId of ["elan-o1", "portee-o2"] as const) {
    const kit = getApprovedProductReferenceKit(productId);
    const geometry = createProductGeometry(kit);
    const dimensions = readGeometryDimensionsMm(geometry);

    for (const dimension of ["width", "height", "depth"] as const) {
      assert.ok(
        Math.abs(dimensions[dimension] - kit.dimensionsMm[dimension]) <= 1,
        `${productId} ${dimension} exceeds the ±1 mm tolerance`,
      );
    }

    assert.equal(kit.openings.length, 8, `${productId} must keep its eight openings`);
    assert.equal(kit.wallThicknessMm, 80, `${productId} must keep the 80 mm family density`);
    geometry.dispose();
  }

  assert.equal(
    horizontal.wallThicknessMm,
    vertical.wallThicknessMm,
    "PORTÉE must use the same junction density as SEUIL",
  );
  assert.equal(horizontal.dimensionsMm.width, vertical.dimensionsMm.height);
  assert.equal(horizontal.dimensionsMm.height, vertical.dimensionsMm.width);
  assert.equal(horizontal.dimensionsMm.depth, vertical.dimensionsMm.depth);

  console.log("Projection geometry verification passed");
}

void main();
