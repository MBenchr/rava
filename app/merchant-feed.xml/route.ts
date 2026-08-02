import {
  brandIdentity,
  finishIds,
  getFinishLabel,
  getFinishPriceCents,
  getLocalizedRoute,
  getProductCopy,
  productList,
} from "@/lib/isandre/catalog";
import { isProductCommerceReleased } from "@/lib/isandre/release";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET(request: Request) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin).replace(/\/$/, "");
  const releasedProducts = productList.filter((product) =>
    isProductCommerceReleased(product.id),
  );

  if (releasedProducts.length === 0) {
    return new Response("Catalog feed is not released.", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const items = releasedProducts.flatMap((product) => {
    const copy = getProductCopy(product.id, "en");

    return finishIds.flatMap((finishId) => {
      const finish = product.finishes[finishId];
      const amount = getFinishPriceCents(product.id, finishId);
      if (!finish.available || amount === null) return [];

      const link = `${origin}${getLocalizedRoute(product.id, "en")}?finish=${finishId}`;
      const imageLink = `${origin}${finish.packshot.src}`;
      const additionalImages = [
        finish.hero.src,
        finish.secondaryScene?.src,
        product.openBackProof?.src,
        product.depthProof.src,
      ]
        .filter((value): value is string => Boolean(value))
        .map((value) => `  <g:additional_image_link>${xml(`${origin}${value}`)}</g:additional_image_link>`)
        .join("\n");

      return `<item>
  <g:id>${xml(`${product.id}-${finishId}`)}</g:id>
  <g:item_group_id>${xml(product.id)}</g:item_group_id>
  <title>${xml(`${copy.name} — ${getFinishLabel(finishId, "en")}`)}</title>
  <description>${xml(`${copy.descriptor}. ${copy.statement}`)}</description>
  <link>${xml(link)}</link>
  <g:image_link>${xml(imageLink)}</g:image_link>
${additionalImages}
  <g:availability>${finish.available ? "in_stock" : "out_of_stock"}</g:availability>
  <g:price>${amount ? `${(amount / 100).toFixed(2)} EUR` : "0.00 EUR"}</g:price>
  <g:condition>new</g:condition>
  <g:brand>${xml(brandIdentity.name)}</g:brand>
  <g:mpn>${xml(`${product.id}-${finishId}`.toUpperCase())}</g:mpn>
  <g:color>${xml(getFinishLabel(finishId, "en"))}</g:color>
  <g:product_type>Furniture &gt; Open storage furniture</g:product_type>
</item>`;
    });
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>${xml(`${brandIdentity.name} — ${brandIdentity.collectionLabels.en}`)}</title>
<link>${xml(origin)}</link>
<description>Sculptural open furniture designed in France and made to order in Italy.</description>
${items.join("\n")}
</channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
