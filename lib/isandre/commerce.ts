import type { Locale } from "@/lib/isandre/catalog";
import type { MarketCode } from "@/lib/markets";

export const isandreCommerceContract = {
  house: "isandre",
  universe: "taqa",
  orderKind: "catalog",
  catalogVersion: "isandre-taqa-2026.08.02.1",
  sourceVersion: "isandre-commerce-metadata-v1",
  priceBookVersion: "taqa-price-book-2026.08.02.1",
  houseOrigin: "https://isandre.com",
  houseOrganizationId: "https://isandre.com/#organization",
  canonicalOrigin: "https://taqa.isandre.com",
} as const;

export function buildTaqaCheckoutMetadata(input: {
  checkoutAttemptId: string;
  marketCode: MarketCode;
  locale: Locale;
}) {
  return {
    house: isandreCommerceContract.house,
    universe: isandreCommerceContract.universe,
    order_kind: isandreCommerceContract.orderKind,
    catalog_version: isandreCommerceContract.catalogVersion,
    source_version: isandreCommerceContract.sourceVersion,
    checkout_attempt_id: input.checkoutAttemptId,
    market_code: input.marketCode,
    locale: input.locale,
    price_book_version: isandreCommerceContract.priceBookVersion,
  };
}

export function isTaqaCheckoutMetadata(
  metadata: Record<string, string> | null | undefined,
) {
  if (!metadata) return false;

  if (
    metadata.house === isandreCommerceContract.house &&
    metadata.universe === isandreCommerceContract.universe
  ) {
    return true;
  }

  return (
    metadata.brand === "ISANDRE" &&
    metadata.catalogVersion === "isandre-taqa-v1"
  );
}
