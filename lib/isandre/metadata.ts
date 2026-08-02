import type { Metadata } from "next";

import { getContent } from "@/content";
import {
  brandIdentity,
  getFinishLabel,
  getFinishMedia,
  getLocalizedRoute,
  getProductById,
  getProductCopy,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";

function interpolate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

export function buildProductMetadata(
  productId: ProductId,
  locale: Locale,
  finishId?: FinishId,
): Metadata {
  const content = getContent(locale);
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const query = finishId ? `?finish=${finishId}` : "";
  const canonical = `${getLocalizedRoute(productId, locale)}${query}`;
  const englishRoute = `${getLocalizedRoute(productId, "en")}${query}`;
  const frenchRoute = `${getLocalizedRoute(productId, "fr")}${query}`;
  const baseTitle = interpolate(content.meta.productTitlePattern, {
    product: copy.name,
    descriptor: copy.descriptor,
  });
  const title = finishId
    ? `${copy.name} — ${getFinishLabel(finishId, locale)} | ${brandIdentity.name}`
    : baseTitle;
  const description = interpolate(content.meta.productDescriptionPattern, {
    product: copy.name,
    descriptor: copy.descriptor,
  });
  const socialMedia = finishId
    ? getFinishMedia(productId, finishId).hero
    : product.storefrontHero;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        "en-GB": englishRoute,
        "fr-FR": frenchRoute,
        "x-default": englishRoute,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: brandIdentity.name,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: [locale === "fr" ? "en_GB" : "fr_FR"],
      images: [
        {
          url: socialMedia.src,
          alt: socialMedia.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialMedia.src],
    },
  };
}
