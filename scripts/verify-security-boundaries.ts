import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function filesUnder(directory: string): Promise<string[]> {
  const full = path.join(root, directory);
  const entries = await readdir(full);
  const files: string[] = [];

  for (const entry of entries) {
    const relative = path.join(directory, entry);
    const details = await stat(path.join(root, relative));

    if (details.isDirectory()) {
      files.push(...(await filesUnder(relative)));
    } else {
      files.push(relative);
    }
  }

  return files;
}

async function source(file: string) {
  return readFile(path.join(root, file), "utf8");
}

async function main() {
  const clientFiles = [
    ...(await filesUnder("components")),
    ...(await filesUnder("app")),
  ].filter((file) => /\.(?:ts|tsx)$/.test(file));
  const forbiddenClientTokens = [
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
  ];

  for (const file of clientFiles) {
    const contents = await source(file);
    if (!contents.includes('"use client"')) continue;

    for (const token of forbiddenClientTokens) {
      assert.doesNotMatch(contents, new RegExp(token), `${token} leaked into ${file}`);
    }
    assert.doesNotMatch(contents, /@\/lib\/server-env/);
    assert.doesNotMatch(contents, /from ["']stripe["']/);
    assert.doesNotMatch(contents, /from ["']openai["']/);
    assert.doesNotMatch(contents, /from ["']resend["']/);
  }

  const checkoutRoute = await source("app/api/checkout/route.ts");
  const checkoutContract = await source("lib/checkout-contract.ts");
  const checkoutSession = await source("lib/checkout-session.ts");
  assert.match(checkoutRoute, /parseCheckoutPayload/);
  assert.match(checkoutRoute, /buildCheckoutSessionParams/);
  assert.match(checkoutContract, /\.strict\(\)/);
  assert.match(checkoutSession, /getFinishPriceCents/);
  assert.match(checkoutSession, /canonicalEuroAmount/);
  assert.doesNotMatch(checkoutSession, /payload\.(?:price|amount|unitAmount)/);

  const webhook = await source("app/api/stripe/webhook/route.ts");
  assert.match(webhook, /stripe-signature/);
  assert.match(webhook, /constructEvent/);
  assert.match(webhook, /processPaidCheckoutEvent/);

  const projectionParser = await source(
    "modules/projection/jobs/parse-projection-form.ts",
  );
  assert.match(projectionParser, /PROJECTION_UPLOAD_LIMIT_BYTES/);
  assert.match(projectionParser, /PROJECTION_UPLOAD_TYPES/);
  assert.match(projectionParser, /hasSupportedImageSignature/);
  assert.match(projectionParser, /isProjectionProductReady/);

  const serviceRoute = await source("app/api/service-requests/route.ts");
  const serviceSchema = await source("lib/service-requests/schema.ts");
  assert.match(serviceRoute, /application\/json/);
  assert.match(serviceRoute, /createServiceRequest/);
  assert.match(serviceSchema, /privacyAccepted: z\.literal\(true\)/);
  assert.match(serviceSchema, /website: z\.string\(\)\.max\(0\)/);

  const apiFiles = (await filesUnder("app/api")).filter((file) =>
    /route\.ts$/.test(file),
  );
  assert.equal(
    apiFiles.some((file) => file.includes("api/estimate/")),
    false,
    "Legacy estimate route must not coexist with canonical service requests.",
  );

  const release = await source("lib/isandre/release.ts");
  const brand = await source("lib/isandre/brand.ts");
  const consent = await source("lib/measurement-consent.ts");
  assert.match(release, /assertLiveCheckoutReleased/);
  assert.match(brand, /brandCleared: false/);
  assert.match(consent, /cmpValidated: false/);
  assert.match(consent, /analyticsDestinationsEnabled: false/);
  assert.match(consent, /marketingDestinationsEnabled: false/);

  console.log(
    `Verified ${clientFiles.length} client boundaries, canonical checkout pricing, signed webhooks, guarded uploads, strict service requests and closed release gates.`,
  );
}

void main();

