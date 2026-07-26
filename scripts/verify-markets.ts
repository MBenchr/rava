import assert from "node:assert/strict";

import {
  getMarketAmountCentsFromEur,
  getMarketShippingCents,
  marketCodes,
  markets,
} from "../lib/markets";

assert.equal(marketCodes.length, 30, "Exactly 30 launch markets must be configured.");
assert.equal(new Set(marketCodes).size, 30, "Market codes must be unique.");

for (const code of marketCodes) {
  const market = markets[code];
  const shipping = getMarketShippingCents(code);
  const samplePrice = getMarketAmountCentsFromEur(300_000, code);

  assert.ok(
    market.shippingEurCents >= 6_000 && market.shippingEurCents <= 9_000,
    `${code}: canonical shipping must stay between EUR 60 and EUR 90.`,
  );
  assert.equal(
    shipping % (market.shippingRoundMajor * 100),
    0,
    `${code}: localized shipping must follow its rounding step.`,
  );
  assert.equal(
    samplePrice % (market.priceRoundMajor * 100),
    0,
    `${code}: localized catalog prices must follow their rounding step.`,
  );
  assert.equal(
    samplePrice,
    market.catalogAnchorMajor * 100,
    `${code}: EUR 3,000 must map to the fixed commercial catalog anchor.`,
  );
  assert.ok(market.labels.en && market.labels.fr, `${code}: both storefront labels are required.`);
}

assert.equal(getMarketAmountCentsFromEur(300_000, "CH"), 300_000);
assert.equal(getMarketAmountCentsFromEur(320_000, "CH"), 320_000);
assert.equal(getMarketAmountCentsFromEur(330_000, "CH"), 330_000);
assert.equal(getMarketAmountCentsFromEur(350_000, "CH"), 350_000);

console.log(`Verified ${marketCodes.length} markets, localized prices and shipping tiers.`);
