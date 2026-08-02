import { getServerEnv } from "@/lib/server-env";
import { brandClearance } from "@/lib/isandre/brand";
import { getProductById, type ProductId } from "@/lib/isandre/catalog";
import { getProductMediaReleaseStatus } from "@/lib/isandre/media";

export function isBrandCleared() {
  return brandClearance.brandCleared;
}

export function isCatalogReleased() {
  return isBrandCleared() && getServerEnv("CATALOG_RELEASED") === "true";
}

export function isProductCommerceReleased(productId: ProductId) {
  const product = getProductById(productId);

  return (
    isCatalogReleased() &&
    product.legalStatus === "cleared" &&
    product.geometryStatus === "approved" &&
    getProductMediaReleaseStatus(productId) === "digital-approved"
  );
}

export function assertLiveCheckoutReleased(productIds: ProductId[]) {
  const stripeSecret = getServerEnv("STRIPE_SECRET_KEY") ?? "";
  const isLiveCredential = /^(?:sk|rk)_live_/.test(stripeSecret);

  if (!isLiveCredential) return;

  const blocked = [...new Set(productIds)].filter(
    (productId) => !isProductCommerceReleased(productId),
  );

  if (blocked.length) {
    throw new Error(
      `Live checkout is blocked for unreleased products: ${blocked.join(", ")}.`,
    );
  }
}
