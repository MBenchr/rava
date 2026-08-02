import {
  brandIdentity,
  finishes,
  getFinishLabel,
  getFinishPriceCents,
  getLocalizedRoute,
  getProductById,
  getProductCopy,
  getSiteCopy,
  productList,
  siteMeta,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";
import { isProductCommerceReleased } from "@/lib/isandre/release";
import { isandreCommerceContract } from "@/lib/isandre/commerce";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? isandreCommerceContract.canonicalOrigin
).replace(/\/$/, "");

function absoluteUrl(pathname: string) {
  return pathname.startsWith("http") ? pathname : `${siteUrl}${pathname}`;
}

function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": isandreCommerceContract.houseOrganizationId,
    name: brandIdentity.name,
    url: isandreCommerceContract.houseOrigin,
    email: siteMeta.leadEmail,
    description: brandIdentity.signatures.en,
  };
}

export function buildHomeStructuredData(locale: Locale = "en") {
  const copy = getSiteCopy(locale);
  const homePath = locale === "fr" ? "/fr" : "/";
  const itemListId = `${siteUrl}${homePath}#first-edition`;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": itemListId,
    name: brandIdentity.collectionLabels[locale],
    numberOfItems: productList.length,
    itemListElement: productList.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(getLocalizedRoute(product.id, locale)),
      name: getProductCopy(product.id, locale).name,
      image: absoluteUrl(product.cardImage.src),
    })),
  };

  return [
    buildOrganization(),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: `${brandIdentity.name} — ${brandIdentity.collection}`,
      inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
      publisher: { "@id": isandreCommerceContract.houseOrganizationId },
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteUrl}${homePath}#collection`,
      url: absoluteUrl(homePath),
      name: copy.title,
      description: copy.description,
      inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
      mainEntity: { "@id": itemListId },
    },
    itemList,
  ];
}

export function buildProductStructuredData(
  productId: ProductId,
  locale: Locale = "en",
) {
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const route = getLocalizedRoute(productId, locale);
  const variants = finishes.map((finish) =>
    buildVariant(productId, finish.id, locale),
  );

  return [
    buildOrganization(),
    {
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      "@id": `${siteUrl}${route}#group`,
      productGroupID: product.code.replace(/\s+/g, "-"),
      name: `${copy.name} — ${copy.descriptor}`,
      brand: { "@type": "Brand", name: brandIdentity.name },
      description: `${copy.statement} ${copy.story}`,
      url: absoluteUrl(route),
      category: copy.descriptor,
      image: [absoluteUrl(product.hero.src), absoluteUrl(product.cardImage.src)],
      variesBy: ["https://schema.org/color"],
      hasVariant: variants,
    },
  ];
}

function buildVariant(
  productId: ProductId,
  finishId: FinishId,
  locale: Locale,
) {
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const finish = product.finishes[finishId];
  const price = getFinishPriceCents(productId, finishId);
  const route = `${getLocalizedRoute(productId, locale)}?finish=${finishId}`;
  const released =
    isProductCommerceReleased(productId) && finish.available && price !== null;

  return {
    "@type": "Product",
    "@id": `${siteUrl}${route}`,
    sku: `${productId}-${finishId}`.toUpperCase(),
    name: `${copy.name} — ${getFinishLabel(finishId, locale)}`,
    color: getFinishLabel(finishId, locale),
    image: [absoluteUrl(finish.packshot.src)],
    description: copy.shortStatement,
    url: absoluteUrl(route),
    size: product.dimensionsLabel,
    ...(released
      ? {
          offers: {
            "@type": "Offer",
            price: (price / 100).toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(route),
            seller: { "@id": isandreCommerceContract.houseOrganizationId },
            itemCondition: "https://schema.org/NewCondition",
          },
        }
      : {}),
  };
}
