import geometryData from "@/lib/isandre/geometry.data.json";

import type { ProductId } from "@/lib/isandre/catalog";

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

export type ProductReferenceAssets = {
  manifest: string;
  frontOrthographic: string;
  frontRight30: string;
  rearLeft30: string;
  identityBoard: string;
  glb: string;
  usdz: string;
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
  assets: ProductReferenceAssets;
};

export type DesignFrozenProductReferenceKit = Omit<
  ApprovedProductReferenceKit,
  "status"
> & {
  status: "design-frozen";
  validationNote: string;
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
  | DesignFrozenProductReferenceKit
  | BlockedProductReferenceKit;

type RawKit = (typeof geometryData.kits)[keyof typeof geometryData.kits];

function kitAssets(id: ProductId, version: string): ProductReferenceAssets {
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
    return raw as unknown as BlockedProductReferenceKit;
  }

  if (raw.status === "design-frozen") {
    const kit = raw as unknown as Omit<
      DesignFrozenProductReferenceKit,
      "assets"
    >;
    return { ...kit, assets: kitAssets(kit.id, kit.version) };
  }

  const kit = raw as unknown as Omit<ApprovedProductReferenceKit, "assets">;
  return { ...kit, assets: kitAssets(kit.id, kit.version) };
}

export const geometrySchemaVersion = geometryData.schemaVersion;

export const productReferenceKits = Object.fromEntries(
  Object.entries(geometryData.kits).map(([id, kit]) => [id, normalizeKit(kit)]),
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
