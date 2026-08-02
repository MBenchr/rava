import assert from "node:assert/strict";
import test from "node:test";

import { canonicalOriginForLegacyHost } from "@/lib/isandre/legacy-origin";

test("the legacy furniture host resolves to the canonical TAQA origin", () => {
  assert.equal(
    canonicalOriginForLegacyHost("rava.mohyi.com"),
    "https://taqa.isandre.com",
  );
  assert.equal(
    canonicalOriginForLegacyHost("rava.mohyi.com:443"),
    "https://taqa.isandre.com",
  );
  assert.equal(
    canonicalOriginForLegacyHost("rava.mohyi.com, render.internal"),
    "https://taqa.isandre.com",
  );
});

test("canonical and unregistered hosts are never redirected", () => {
  assert.equal(canonicalOriginForLegacyHost("taqa.isandre.com"), null);
  assert.equal(canonicalOriginForLegacyHost("attacker.example"), null);
  assert.equal(canonicalOriginForLegacyHost(null), null);
});
