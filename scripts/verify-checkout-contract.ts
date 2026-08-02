import assert from "node:assert/strict";

import {
  checkoutIdempotencyKey,
  parseCheckoutPayload,
} from "../lib/checkout-contract";
import {
  buildCheckoutSessionParams,
  resolveCheckoutOrigin,
} from "../lib/checkout-session";
import { getFinishPriceCents } from "../lib/isandre/catalog";
import { getMarketAmountCentsFromEur } from "../lib/markets";

const checkoutAttemptId = "7f7309dd-a319-4702-8b18-7e372624180a";
const payload = parseCheckoutPayload({
  items: [
    {
      productId: "seuil-01",
      finishId: "sage",
      quantity: 2,
    },
  ],
  locale: "en",
  marketCode: "CH",
  checkoutAttemptId,
});

assert.throws(
  () =>
    parseCheckoutPayload({
      ...payload,
      amount: 1,
    }),
  /Unrecognized key/,
  "A browser-provided amount must be rejected, not silently trusted.",
);

assert.equal(
  checkoutIdempotencyKey(payload, "hosted"),
  `isandre-taqa-hosted-${checkoutAttemptId}`,
);

const localRequest = new Request("http://127.0.0.1:3012/api/checkout", {
  headers: {
    "x-forwarded-host": "127.0.0.1:3012",
    "x-forwarded-proto": "javascript",
  },
});
assert.equal(resolveCheckoutOrigin(localRequest), "http://127.0.0.1:3012");

const publicRequest = new Request("http://internal:10000/api/checkout", {
  headers: {
    "x-forwarded-host": "isandre.com",
    "x-forwarded-proto": "http",
  },
});
assert.equal(
  resolveCheckoutOrigin(publicRequest),
  "https://taqa.isandre.com",
);

const params = buildCheckoutSessionParams(localRequest, payload, "hosted");
const lineItem = params.line_items?.[0];
const canonicalEuroAmount = getFinishPriceCents("seuil-01", "sage");

assert.ok(canonicalEuroAmount, "The selected catalog variant must have a canonical price.");
assert.ok(lineItem && typeof lineItem !== "string");
assert.equal(lineItem.quantity, 2);
assert.equal(
  lineItem.price_data?.unit_amount,
  getMarketAmountCentsFromEur(canonicalEuroAmount, "CH", "price"),
  "Stripe price data must be derived from the server-side catalog.",
);
assert.equal(params.automatic_tax?.enabled, true);
assert.equal(params.metadata?.house, "isandre");
assert.equal(params.metadata?.universe, "taqa");
assert.equal(params.metadata?.order_kind, "catalog");
assert.equal(params.metadata?.checkout_attempt_id, checkoutAttemptId);
assert.match(
  String(params.metadata?.price_book_version ?? ""),
  /^taqa-price-book-/,
);
assert.deepEqual(params.shipping_address_collection?.allowed_countries, ["CH"]);
assert.match(params.success_url ?? "", /^http:\/\/127\.0\.0\.1:3012\/commander/);
assert.match(params.cancel_url ?? "", /^http:\/\/127\.0\.0\.1:3012\/commander/);

console.log("Verified canonical checkout pricing, strict input and safe return URLs.");
