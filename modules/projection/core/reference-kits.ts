import referenceKitData from "@/modules/projection/core/reference-kits.data.json";

import type { ProductId } from "@/lib/rava-content";

export type ProductDimensionsMm = {
  width: number;
  height: number;
  depth: number;
};

export type ProductOpening = {
  id: string;
  kind: "rounded-rect" | "arch";
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  shoulderY?: number;
};

export type ApprovedProductReferenceKit = {
  id: ProductId;
  version: string;
  status: "approved";
  dimensionsMm: ProductDimensionsMm;
  outerRadiusMm: number;
  wallThicknessMm: number;
  plinth: { heightMm: number; recessMm: number };
  openings: ProductOpening[];
  maskPath: string;
  sourceReference: string;
  assets: {
    manifest: string;
    frontOrthographic: string;
    frontRight30: string;
    rearLeft30: string;
    identityBoard: string;
    glb: string;
    usdz: string;
  };
};

export type BlockedProductReferenceKit = {
  id: ProductId;
  version: "unvalidated";
  status: "blocked";
  blockedReason: string;
  dimensionsMm: null;
  outerRadiusMm: null;
  wallThicknessMm: null;
  plinth: null;
  openings: [];
  maskPath: string;
  sourceReference: string;
};

export type ProductReferenceKit =
  | ApprovedProductReferenceKit
  | BlockedProductReferenceKit;

type RawKit = (typeof referenceKitData.kits)[keyof typeof referenceKitData.kits];

function kitAssets(id: ProductId, version: string): ApprovedProductReferenceKit["assets"] {
  const base = `/projection-kits/${id}/${version}`;

  return {
    manifest: `${base}/manifest.json`,
    frontOrthographic: `${base}/front-orthographic.png`,
    frontRight30: `${base}/front-right-30.png`,
    rearLeft30: `${base}/rear-left-30.png`,
    identityBoard: `${base}/identity-board.png`,
    glb: `${base}/product.glb`,
    usdz: `${base}/product.usdz`,
  };
}

function normalizeKit(raw: RawKit): ProductReferenceKit {
  if (raw.status === "blocked") {
    return raw as BlockedProductReferenceKit;
  }

  const kit = raw as Omit<ApprovedProductReferenceKit, "assets">;
  return { ...kit, assets: kitAssets(kit.id, kit.version) };
}

export const productReferenceKits = Object.fromEntries(
  Object.entries(referenceKitData.kits).map(([id, kit]) => [id, normalizeKit(kit)]),
) as Record<ProductId, ProductReferenceKit>;

export function getProductReferenceKit(productId: ProductId) {
  return productReferenceKits[productId];
}

export function getApprovedProductReferenceKit(productId: ProductId) {
  const kit = getProductReferenceKit(productId);

  if (kit.status !== "approved") {
    throw new Error(`PROJECTION_PRODUCT_UNVALIDATED:${productId}`);
  }

  return kit;
}

export function isProjectionProductReady(productId: ProductId) {
  return getProductReferenceKit(productId).status === "approved";
}
