import { getServerEnv } from "../lib/server-env";
import { getStripeClient } from "../lib/stripe";

async function configureStripeTax() {
  const required = {
    line1: "STRIPE_TAX_HEAD_OFFICE_LINE1",
    city: "STRIPE_TAX_HEAD_OFFICE_CITY",
    postalCode: "STRIPE_TAX_HEAD_OFFICE_POSTAL_CODE",
    country: "STRIPE_TAX_HEAD_OFFICE_COUNTRY",
  } as const;

  const missing = Object.values(required).filter((name) => !getServerEnv(name));

  if (missing.length > 0) {
    throw new Error(`Missing: ${missing.join(", ")}`);
  }

  const stripe = getStripeClient();
  const settings = await stripe.tax.settings.update({
    defaults: {
      tax_behavior: "inferred_by_currency",
      tax_code: getServerEnv("STRIPE_TAX_CODE_FURNITURE") ?? "txcd_99999999",
    },
    head_office: {
      address: {
        line1: getServerEnv(required.line1)!,
        line2: getServerEnv("STRIPE_TAX_HEAD_OFFICE_LINE2"),
        city: getServerEnv(required.city)!,
        postal_code: getServerEnv(required.postalCode)!,
        state: getServerEnv("STRIPE_TAX_HEAD_OFFICE_STATE"),
        country: getServerEnv(required.country)!.toUpperCase(),
      },
    },
  });

  console.log(
    `Stripe Tax configured in ${getServerEnv("STRIPE_SECRET_KEY")?.startsWith("sk_test_") ? "test" : "live"} mode. Status: ${settings.status}.`,
  );
}

configureStripeTax().catch((error) => {
  console.error(
    `Stripe Tax configuration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
  );
  process.exit(1);
});
