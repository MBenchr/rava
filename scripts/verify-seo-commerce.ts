import assert from "node:assert/strict";

import { GET as getMerchantFeed } from "../app/merchant-feed.xml/route";
import sitemap from "../app/sitemap";
import { buildProductMetadata } from "../lib/isandre/metadata";
import {
  buildHomeStructuredData,
  buildProductStructuredData,
} from "../lib/isandre/structured-data";
import {
  assertLiveCheckoutReleased,
  isBrandCleared,
  isCatalogReleased,
} from "../lib/isandre/release";
import { finishIds, productIds } from "../lib/isandre/catalog";

process.env.CATALOG_RELEASED = "false";

assert.equal(isBrandCleared(), false, "Brand clearance must default to false.");
assert.equal(isCatalogReleased(), false);
assert.deepEqual(sitemap(), [], "An unreleased catalogue must emit no sitemap.");

const home = buildHomeStructuredData("en");
assert.deepEqual(
  home.map((entry) => entry["@type"]),
  ["Organization", "WebSite", "CollectionPage", "ItemList"],
);

for (const productId of productIds) {
  const structured = buildProductStructuredData(productId, "en");
  const group = structured.find((entry) => entry["@type"] === "ProductGroup");
  assert.ok(group && "hasVariant" in group);
  const variants = group.hasVariant as Array<Record<string, unknown>>;
  assert.equal(variants.length, finishIds.length);
  assert.equal(
    variants.some((variant) => "offers" in variant),
    false,
    "Unreleased products must not expose Offer data.",
  );

  for (const finishId of finishIds) {
    const metadata = buildProductMetadata(productId, "en", finishId);
    assert.equal(
      metadata.alternates?.canonical,
      `/products/${productId}?finish=${finishId}`,
    );
    assert.equal(
      metadata.alternates?.languages?.["x-default"],
      `/products/${productId}?finish=${finishId}`,
    );
  }
}

const feedResponse = getMerchantFeed(
  new Request("https://isandre.com/merchant-feed.xml"),
);
assert.equal(feedResponse.status, 404);

process.env.STRIPE_SECRET_KEY = "sk_live_release_gate_fixture";
process.env.CATALOG_RELEASED = "true";
assert.equal(
  isCatalogReleased(),
  false,
  "An environment variable must not bypass the reviewed brand-clearance gate.",
);
assert.throws(
  () => assertLiveCheckoutReleased(["seuil-01"]),
  /unreleased products/,
);
process.env.STRIPE_SECRET_KEY = "sk_test_release_gate_fixture";
assert.doesNotThrow(() => assertLiveCheckoutReleased(["seuil-01"]));

console.log(
  "Verified release-gated offers/feed/checkout, home schema and canonical finish variants.",
);
