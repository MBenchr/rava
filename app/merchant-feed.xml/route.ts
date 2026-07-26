import {
  brandIdentity,
  finishIds,
  getFinishLabel,
  getFinishPriceCents,
  getLocalizedRoute,
  getProductCopy,
  productList,
} from "@/lib/rava-content";

function xml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function GET(request: Request) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin).replace(/\/$/, "");
  const items = productList.flatMap((product) => {
    const copy = getProductCopy(product.id, "en");

    return finishIds.map((finishId) => {
      const finish = product.finishes[finishId];
      const amount = getFinishPriceCents(product.id, finishId);
      const link = `${origin}${getLocalizedRoute(product.id, "en")}?finish=${finishId}`;
      const imageLink = `${origin}${finish.packshot.src}`;
      const additionalImages = [
        finish.hero.src,
        finish.secondaryScene?.src,
        product.openBack.src,
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
  <g:color>${xml(getFinishLabel(finishId, "en"))}</g:color>
  <g:identifier_exists>no</g:identifier_exists>
</item>`;
    });
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>${xml(`${brandIdentity.name} — ${brandIdentity.collectionLabels.en}`)}</title>
<link>${xml(origin)}</link>
<description>Sculptural open furniture designed in France and made to order.</description>
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
