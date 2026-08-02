import assert from "node:assert/strict";
import test from "node:test";

import {
  checkoutIdempotencyKey,
  parseCheckoutPayload,
} from "@/lib/checkout-contract";
import { normalizeDatabaseConnectionString } from "@/lib/database";
import {
  finishIds,
  getFinishPriceCents,
  getProductById,
  productIds,
} from "@/lib/isandre/catalog";
import {
  buildTaqaCheckoutMetadata,
  isTaqaCheckoutMetadata,
} from "@/lib/isandre/commerce";
import {
  canDispatchAnalytics,
  createMeasurementConsent,
  measurementRelease,
  parseMeasurementConsent,
} from "@/lib/measurement-consent";
import {
  getMarketAmountCentsFromEur,
  getMarketShippingCents,
  marketCodes,
  markets,
} from "@/lib/markets";
import {
  hashPassportActivationSecret,
  passportActivationSchema,
  verifyPassportActivationSecret,
} from "@/lib/passport-owner";
import {
  createPassportSerial,
  parsePassportSerial,
} from "@/lib/passports";
import { serviceRequestInputSchema } from "@/lib/service-requests/schema";

test("catalog exposes exactly three pieces and four finishes", () => {
  assert.deepEqual(productIds, ["seuil-01", "portee-02", "veille-03"]);
  assert.deepEqual(finishIds, ["chalk", "butter", "sage", "rose-clay"]);
});

test("canonical prices cannot drift between products", () => {
  assert.deepEqual(
    finishIds.map((finish) => getFinishPriceCents("seuil-01", finish)),
    [300_000, 320_000, 330_000, 350_000],
  );
  assert.deepEqual(
    finishIds.map((finish) => getFinishPriceCents("portee-02", finish)),
    [300_000, 320_000, 330_000, 350_000],
  );
  assert.deepEqual(
    finishIds.map((finish) => getFinishPriceCents("veille-03", finish)),
    [75_000, 80_000, 85_000, 90_000],
  );
});

test("approved geometries keep their metric proportions", () => {
  assert.deepEqual(getProductById("seuil-01").sizeCm, {
    width: 102,
    height: 184,
    depth: 42,
  });
  assert.deepEqual(getProductById("portee-02").sizeCm, {
    width: 184,
    height: 102,
    depth: 42,
  });
  assert.equal(getProductById("veille-03").geometryStatus, "design-frozen");
  assert.deepEqual(getProductById("veille-03").sizeCm, {
    width: 38.3,
    height: 62,
    depth: 42,
  });
});

test("all 30 markets keep shipping inside the approved EUR band", () => {
  assert.equal(marketCodes.length, 30);

  for (const marketCode of marketCodes) {
    assert.ok(markets[marketCode].shippingEurCents >= 6_000);
    assert.ok(markets[marketCode].shippingEurCents <= 9_000);
    assert.ok(getMarketShippingCents(marketCode) > 0);
  }
});

test("Swiss catalog anchor remains the approved round CHF amount", () => {
  assert.equal(getMarketAmountCentsFromEur(300_000, "CH"), 300_000);
});

test("checkout rejects browser-provided price fields", () => {
  assert.throws(() =>
    parseCheckoutPayload({
      items: [
        {
          productId: "seuil-01",
          finishId: "chalk",
          quantity: 1,
          unitAmount: 1,
        },
      ],
      locale: "en",
      marketCode: "GB",
    }),
  );
});

test("checkout idempotency is stable and mode-scoped", () => {
  const checkoutAttemptId = "7baef7d2-fb64-4436-b70a-0d03ad220b21";
  const payload = parseCheckoutPayload({
    items: [{ productId: "seuil-01", finishId: "chalk", quantity: 1 }],
    locale: "en",
    marketCode: "GB",
    checkoutAttemptId,
  });

  assert.equal(
    checkoutIdempotencyKey(payload, "hosted"),
    `isandre-taqa-hosted-${checkoutAttemptId}`,
  );
  assert.equal(
    checkoutIdempotencyKey(payload, "express"),
    `isandre-taqa-express-${checkoutAttemptId}`,
  );
});

test("Stripe events are accepted only for the canonical TAQA universe", () => {
  const metadata = buildTaqaCheckoutMetadata({
    checkoutAttemptId: "cfb873bc-8a9e-4b65-973e-c41ba143eb84",
    marketCode: "FR",
    locale: "fr",
  });

  assert.equal(isTaqaCheckoutMetadata(metadata), true);
  assert.equal(
    isTaqaCheckoutMetadata({ house: "isandre", universe: "eclipse" }),
    false,
  );
  assert.equal(isTaqaCheckoutMetadata({ universe: "taqa" }), false);
});

test("Supabase session-pooler URLs retain encrypted libpq semantics", () => {
  const normalized = normalizeDatabaseConnectionString(
    "postgres://runtime:secret@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require",
  );

  assert.match(normalized, /sslmode=require/u);
  assert.match(normalized, /uselibpqcompat=true/u);
  assert.equal(
    normalizeDatabaseConnectionString(
      "postgres://runtime:secret@database.example.com:5432/postgres?sslmode=require",
    ),
    "postgres://runtime:secret@database.example.com:5432/postgres?sslmode=require",
  );
});

test("service requests require privacy acceptance and canonical product pairing", () => {
  const base = {
    clientRequestId: "727c370e-1ed4-401c-98ca-7315337eddb3",
    kind: "project",
    source: "contact",
    locale: "en",
    name: "Ada Client",
    email: "ada@example.com",
    message: "Please confirm delivery planning for this interior.",
    marketingConsent: false,
    website: "",
  };

  assert.equal(
    serviceRequestInputSchema.safeParse({
      ...base,
      privacyAccepted: false,
    }).success,
    false,
  );
  assert.equal(
    serviceRequestInputSchema.safeParse({
      ...base,
      privacyAccepted: true,
      finishId: "sage",
    }).success,
    false,
  );
  assert.equal(
    serviceRequestInputSchema.safeParse({
      ...base,
      privacyAccepted: true,
      productId: "seuil-01",
      finishId: "sage",
    }).success,
    true,
  );
});

test("passport serial detects tampering", () => {
  const serial = createPassportSerial("seuil-01", 2026, 42);
  assert.equal(parsePassportSerial(serial)?.sequence, 42);
  assert.equal(parsePassportSerial(`${serial.slice(0, -1)}Z`), null);
});

test("passport activation secrets use a server pepper and constant comparison", () => {
  const pepper = "p".repeat(32);
  const hash = hashPassportActivationSecret("activation-secret-with-entropy", pepper);
  assert.equal(
    verifyPassportActivationSecret(
      "activation-secret-with-entropy",
      hash,
      pepper,
    ),
    true,
  );
  assert.equal(
    verifyPassportActivationSecret("different-activation-secret", hash, pepper),
    false,
  );
  assert.equal(
    passportActivationSchema.safeParse({
      serial: createPassportSerial("portee-02", 2026, 7),
      activationSecret: "activation-secret-with-entropy",
      orderReference: "ORDER-2026-0007",
      identitySubject: "identity-subject-0007",
      proofAccepted: true,
    }).success,
    true,
  );
});

test("analytics remains impossible before CMP and destination release", () => {
  const consent = createMeasurementConsent(true);
  assert.deepEqual(parseMeasurementConsent(JSON.stringify(consent)), consent);
  assert.equal(measurementRelease.cmpValidated, false);
  assert.equal(canDispatchAnalytics(consent), false);
});
