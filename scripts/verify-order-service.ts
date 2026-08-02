import assert from "node:assert/strict";

import type Stripe from "stripe";

import {
  createMemoryOrderRepository,
} from "../lib/orders/repository";
import {
  orderFromStripeSession,
  processPaidCheckoutEvent,
} from "../lib/orders/service";

const session = {
  id: "cs_test_isandre_order_0001",
  payment_status: "paid",
  payment_intent: "pi_test_0001",
  currency: "chf",
  amount_subtotal: 330_000,
  amount_total: 336_500,
  total_details: {
    amount_discount: 0,
    amount_shipping: 6_500,
    amount_tax: 0,
  },
  metadata: {
    house: "isandre",
    universe: "taqa",
    order_kind: "catalog",
    catalog_version: "isandre-taqa-2026.08.02.1",
    source_version: "isandre-commerce-metadata-v1",
    checkout_attempt_id: "7baef7d2-fb64-4436-b70a-0d03ad220b21",
    locale: "fr",
    market_code: "CH",
    price_book_version: "taqa-price-book-2026.08.02.1",
  },
  customer_details: {
    address: {
      city: "Genève",
      country: "CH",
      line1: "1 rue Exemple",
      line2: null,
      postal_code: "1200",
      state: null,
    },
    email: "client@example.com",
    name: "Client Exemple",
    phone: "+41000000000",
    tax_exempt: "none",
    tax_ids: [],
  },
  line_items: {
    data: [
      {
        id: "li_0001",
        amount_discount: 0,
        amount_subtotal: 330_000,
        amount_tax: 0,
        amount_total: 330_000,
        currency: "chf",
        description: "SEUIL 01 — Open Tall Cabinet",
        object: "item",
        quantity: 1,
        price: {
          id: "price_inline_0001",
          active: true,
          billing_scheme: "per_unit",
          created: 0,
          currency: "chf",
          custom_unit_amount: null,
          livemode: false,
          lookup_key: null,
          metadata: {},
          nickname: null,
          object: "price",
          product: {
            id: "prod_0001",
            object: "product",
            active: true,
            attributes: [],
            created: 0,
            default_price: null,
            description: null,
            features: [],
            images: [],
            livemode: false,
            marketing_features: [],
            metadata: {
              product_id: "seuil-01",
              finish_id: "sage",
            },
            name: "SEUIL 01",
            package_dimensions: null,
            shippable: true,
            statement_descriptor: null,
            tax_code: null,
            type: "good",
            unit_label: null,
            updated: 0,
            url: null,
          },
          recurring: null,
          tax_behavior: "exclusive",
          tiers_mode: null,
          transform_quantity: null,
          type: "one_time",
          unit_amount: 330_000,
          unit_amount_decimal: "330000",
        },
      },
    ],
    has_more: false,
    object: "list",
    url: "/v1/checkout/sessions/cs_test_isandre_order_0001/line_items",
  },
} as unknown as Stripe.Checkout.Session;

async function main() {
  const initial = orderFromStripeSession(session);
  assert.equal(initial.marketCode, "CH");
  assert.equal(initial.locale, "fr");
  assert.equal(initial.currency, "CHF");
  assert.equal(initial.shippingCents, 6_500);
  assert.equal(initial.lines[0]?.productId, "seuil-01");
  assert.equal(initial.lines[0]?.finishId, "sage");

  const repository = createMemoryOrderRepository();
  let notificationCalls = 0;
  const sendNotifications = async () => {
    notificationCalls += 1;
    return [{ status: "sent" as const }, { status: "sent" as const }];
  };

  const first = await processPaidCheckoutEvent(
    "evt_isandre_0001",
    "checkout.session.completed",
    session,
    { repository, sendNotifications },
  );
  const duplicate = await processPaidCheckoutEvent(
    "evt_isandre_0001",
    "checkout.session.completed",
    session,
    { repository, sendNotifications },
  );
  const stored = await repository.getOrderByStripeSession(session.id);

  assert.equal(first.status, "processed");
  assert.equal(duplicate.status, "already_completed");
  assert.equal(notificationCalls, 1, "A duplicate Stripe event must not resend email.");
  assert.equal(stored?.notificationStatus, "sent");
  assert.equal(stored?.reference, session.id.slice(-12).toUpperCase());

  console.log("Verified durable order projection and duplicate webhook protection.");
}

void main();
