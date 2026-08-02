import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { commerceEventNames } from "@/lib/commerce-events";
import {
  canDispatchAnalytics,
  canDispatchMarketing,
  createMeasurementConsent,
  measurementRelease,
  parseMeasurementConsent,
} from "@/lib/measurement-consent";

const requiredEvents = [
  "hero_view",
  "view_item_list",
  "view_item",
  "select_item",
  "select_finish",
  "gallery_image_view",
  "zoom_open",
  "dimensions_open",
  "technical_sheet_download",
  "view_cart",
  "add_to_cart",
  "begin_checkout",
  "purchase",
  "projection_open",
  "projection_upload",
  "projection_placement",
  "projection_completed",
  "projection_failed",
  "projection_download",
  "projection_share",
  "add_to_cart_from_projection",
  "project_request",
  "trade_request",
  "press_request",
] as const;

async function main() {
  const root = process.cwd();
  const sources = await Promise.all(
    [
      "components/storefront-experience.tsx",
      "components/product-page.tsx",
      "components/cart-drawer.tsx",
      "components/cart-page.tsx",
      "components/projection-studio.tsx",
      "components/service-request-form.tsx",
      "components/technical-sheet-provider.tsx",
    ].map((file) => readFile(path.join(root, file), "utf8")),
  );
  const source = sources.join("\n");

  for (const event of requiredEvents) {
    assert.ok(
      commerceEventNames.includes(event),
      `Missing event from canonical registry: ${event}`,
    );
  }

  for (const event of [
    "hero_view",
    "view_item_list",
    "view_item",
    "select_finish",
    "gallery_image_view",
    "zoom_open",
    "dimensions_open",
    "technical_sheet_download",
    "view_cart",
    "add_to_cart",
    "begin_checkout",
    "purchase",
    "projection_open",
    "projection_completed",
    "project_request",
  ] as const) {
    assert.match(source, new RegExp(`["'\`]${event}["'\`]`));
  }

  const consent = createMeasurementConsent(true, true);
  assert.deepEqual(parseMeasurementConsent(JSON.stringify(consent)), consent);
  assert.equal(parseMeasurementConsent("{}"), null);
  assert.equal(measurementRelease.cmpValidated, false);
  assert.equal(measurementRelease.analyticsDestinationsEnabled, false);
  assert.equal(measurementRelease.marketingDestinationsEnabled, false);
  assert.equal(canDispatchAnalytics(consent), false);
  assert.equal(canDispatchMarketing(consent), false);

  for (const file of [
    "docs/operations/measurement-and-consent.md",
    "docs/operations/a15-measurement-dashboard.md",
    "docs/operations/a15-experiment-agenda.md",
  ]) {
    const contents = await readFile(path.join(root, file), "utf8");
    assert.ok(contents.length > 500, `${file} is not substantive.`);
  }

  console.log(
    `Verified ${requiredEvents.length} measurement events, strict consent defaults, disabled third-party gates and A15 operating specs.`,
  );
}

void main();
