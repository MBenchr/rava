import assert from "node:assert/strict";

import {
  createPassportSerial,
  parsePassportSerial,
} from "../lib/passports";
import {
  buildPassportOwnerExport,
  hashPassportActivationSecret,
  isPassportOwnerServiceEnabled,
  passportActivationSchema,
  passportRecoverySchema,
  passportTransferSchema,
  verifyPassportActivationSecret,
} from "../lib/passport-owner";
import { readFileSync } from "node:fs";

for (const productId of ["seuil-01", "portee-02", "veille-03"] as const) {
  const serial = createPassportSerial(productId, 2027, 1);
  const parsed = parsePassportSerial(serial);

  assert.ok(parsed);
  assert.equal(parsed.productId, productId);
  assert.equal(parsed.year, 2027);
  assert.equal(parsed.sequence, 1);

  const invalidChecksum = `${serial.slice(0, -1)}${serial.endsWith("Z") ? "Y" : "Z"}`;
  assert.equal(parsePassportSerial(invalidChecksum), null);
}

assert.throws(() => createPassportSerial("seuil-01", 2025, 1));
assert.throws(() => createPassportSerial("seuil-01", 2027, 0));
assert.equal(parsePassportSerial("TAQA-S01-2027-000001-A<script>"), null);

const serial = createPassportSerial("seuil-01", 2027, 42);
const secret = "A-valid-one-time-activation-secret";
const pepper = "a-server-only-pepper-with-at-least-thirty-two-characters";
const hash = hashPassportActivationSecret(secret, pepper);
assert.equal(hash.length, 64);
assert(verifyPassportActivationSecret(secret, hash, pepper));
assert(!verifyPassportActivationSecret(`${secret}-wrong`, hash, pepper));
assert.throws(() => hashPassportActivationSecret(secret, "short"));

assert.equal(
  passportActivationSchema.parse({
    serial,
    activationSecret: secret,
    orderReference: "ORDER-2027-000042",
    identitySubject: "auth0|owner-example",
    proofAccepted: true,
  }).serial,
  serial,
);
assert.equal(
  passportTransferSchema.parse({
    serial,
    fromIdentitySubject: "auth0|owner-example",
    toEmail: "next-owner@example.com",
    transferPolicyAccepted: true,
  }).serial,
  serial,
);
assert.equal(
  passportRecoverySchema.parse({
    serial,
    email: "owner@example.com",
    orderReference: "ORDER-2027-000042",
    evidenceNote:
      "The original order email and delivery address can be supplied securely.",
  }).serial,
  serial,
);
assert.equal(isPassportOwnerServiceEnabled(), false);

const ownerExport = buildPassportOwnerExport({
  generatedAt: "2027-01-15T10:00:00.000Z",
  passport: {
    serial,
    productId: "seuil-01",
    finishId: "chalk",
    status: "active",
    manufacturedAt: "2027-01-02",
    activatedAt: "2027-01-15T09:00:00.000Z",
    materialBatch: "BATCH-01",
    edition: "First edition",
    repairs: [],
  },
  ownership: {
    activatedAt: "2027-01-15T09:00:00.000Z",
    currentOwnerSince: "2027-01-15T09:00:00.000Z",
  },
  transfers: [],
  events: [
    {
      action: "activated",
      createdAt: "2027-01-15T09:00:00.000Z",
    },
  ],
});
const serializedExport = JSON.stringify(ownerExport);
assert(!serializedExport.includes("activation_secret"));
assert(!serializedExport.includes("internal_notes"));

const ownerMigration = readFileSync(
  "supabase/migrations/202607290004_isandre_passport_owner_contract.sql",
  "utf8",
);
assert(ownerMigration.includes("enable row level security"));
assert(ownerMigration.includes("isandre_passport_owner_events"));
assert(!ownerMigration.match(/create policy/i));

console.log(
  "Verified passport serials, owner activation/transfer/recovery contracts, gated release and safe export.",
);
