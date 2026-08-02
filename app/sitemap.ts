import type { MetadataRoute } from "next";
import {
  finishIds,
  getLocalizedRoute,
  productList,
} from "@/lib/isandre/catalog";
import {
  isCatalogReleased,
  isProductCommerceReleased,
} from "@/lib/isandre/release";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isCatalogReleased()) return [];

  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://isandre.com"
  ).replace(/\/$/, "");
  const now = new Date();
  const languageAlternates = (productId?: (typeof productList)[number]["id"], finishId?: string) => {
    const query = finishId ? `?finish=${finishId}` : "";
    const en = productId ? `${base}${getLocalizedRoute(productId, "en")}${query}` : base;
    const fr = productId ? `${base}${getLocalizedRoute(productId, "fr")}${query}` : `${base}/fr`;

    return { "en-GB": en, "fr-FR": fr, "x-default": en };
  };
  const releasedProducts = productList.filter((product) =>
    isProductCommerceReleased(product.id),
  );

  return [
    {
      url: base,
      lastModified: now,
      alternates: { languages: languageAlternates() },
    },
    {
      url: `${base}/fr`,
      lastModified: now,
      alternates: { languages: languageAlternates() },
    },
    {
      url: `${base}/making`,
      lastModified: now,
      alternates: {
        languages: {
          "en-GB": `${base}/making`,
          "fr-FR": `${base}/fr/fabrication`,
          "x-default": `${base}/making`,
        },
      },
    },
    {
      url: `${base}/fr/fabrication`,
      lastModified: now,
      alternates: {
        languages: {
          "en-GB": `${base}/making`,
          "fr-FR": `${base}/fr/fabrication`,
          "x-default": `${base}/making`,
        },
      },
    },
    ...releasedProducts.flatMap((product) =>
      (["en", "fr"] as const).flatMap((locale) => [
        {
          url: `${base}${getLocalizedRoute(product.id, locale)}`,
          lastModified: now,
          alternates: { languages: languageAlternates(product.id) },
        },
        ...finishIds.map((finishId) => ({
          url: `${base}${getLocalizedRoute(product.id, locale)}?finish=${finishId}`,
          lastModified: now,
          alternates: {
            languages: languageAlternates(product.id, finishId),
          },
        })),
      ]),
    ),
  ];
}
