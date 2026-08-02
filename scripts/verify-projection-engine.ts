import assert from "node:assert/strict";

import { productIds, products } from "@/lib/isandre/catalog";
import {
  geometrySchemaVersion,
  getApprovedProductReferenceKit,
  getProductReferenceKit,
} from "@/lib/isandre/geometry";

async function main() {
  assert.equal(geometrySchemaVersion, 3, "The canonical geometry schema must be v3");
  assert.deepEqual(
    productIds,
    ["seuil-01", "portee-02", "veille-03"],
    "The catalogue must expose only the canonical product identities",
  );

  const vertical = getApprovedProductReferenceKit("seuil-01");
  const horizontal = getApprovedProductReferenceKit("portee-02");

  for (const productId of ["seuil-01", "portee-02"] as const) {
    const kit = getApprovedProductReferenceKit(productId);
    const product = products[productId];
    assert.equal(product.geometryStatus, kit.status);
    assert.ok(product.sizeCm, `${productId} must publish its validated dimensions`);
    assert.deepEqual(product.sizeCm, {
      width: kit.dimensionsMm.width / 10,
      height: kit.dimensionsMm.height / 10,
      depth: kit.dimensionsMm.depth / 10,
    });
    assert.ok(
      Math.abs(product.projectionAspectRatio - kit.dimensionsMm.width / kit.dimensionsMm.height) <
        0.000_001,
      `${productId} catalogue ratio must come from canonical geometry`,
    );

    assert.equal(kit.openings.length, 8, `${productId} must keep its eight openings`);
    assert.equal(
      new Set(kit.openings.map(({ id }) => id)).size,
      kit.openings.length,
      `${productId} opening identifiers must be unique`,
    );
    assert.equal(kit.wallThicknessMm, 80, `${productId} must keep the 80 mm family density`);
    for (const opening of kit.openings) {
      assert.ok(opening.x >= kit.wallThicknessMm, `${productId}:${opening.id} starts outside the frame`);
      assert.ok(opening.y >= kit.wallThicknessMm, `${productId}:${opening.id} starts outside the frame`);
      assert.ok(
        opening.x + opening.width <= kit.dimensionsMm.width - kit.wallThicknessMm,
        `${productId}:${opening.id} exceeds the right frame`,
      );
      assert.ok(
        opening.y + opening.height <= kit.dimensionsMm.height - kit.plinth.heightMm,
        `${productId}:${opening.id} crosses the canonical plinth`,
      );
    }
  }

  assert.equal(
    horizontal.wallThicknessMm,
    vertical.wallThicknessMm,
    "PORTÉE must use the same junction density as SEUIL",
  );
  assert.equal(horizontal.dimensionsMm.width, vertical.dimensionsMm.height);
  assert.equal(horizontal.dimensionsMm.height, vertical.dimensionsMm.width);
  assert.equal(horizontal.dimensionsMm.depth, vertical.dimensionsMm.depth);

  const bedside = getProductReferenceKit("veille-03");
  assert.equal(bedside.status, "design-frozen");
  assert.equal(products["veille-03"].geometryStatus, "design-frozen");
  assert.deepEqual(bedside.dimensionsMm, {
    width: 383,
    height: 620,
    depth: 420,
  });
  assert.equal(bedside.openings.length, 2);
  assert.ok(
    Math.abs(bedside.dimensionsMm.width / bedside.dimensionsMm.height - 1 / ((1 + Math.sqrt(5)) / 2)) < 0.001,
    "VEILLE must preserve the golden-ratio frontal proportion",
  );
  assert.throws(
    () => getApprovedProductReferenceKit("veille-03"),
    /PROJECTION_PRODUCT_UNVALIDATED:veille-03/,
  );

  console.log("Canonical ISANDRE geometry verification passed");
}

void main();
