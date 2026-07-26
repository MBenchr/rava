import Stripe from "stripe";

import {
  brandIdentity,
  getFinishLabel,
  getFinishPriceCents,
  getProductById,
  getProductCopy,
  type CheckoutPayload,
} from "@/lib/rava-content";
import {
  formatMarketAmount,
  getMarket,
  getMarketAmountCentsFromEur,
  getMarketShippingCents,
} from "@/lib/markets";
import { getServerEnv } from "@/lib/server-env";

type CheckoutUiMode = "hosted" | "elements";

function originFor(request: Request) {
  return (getServerEnv("NEXT_PUBLIC_SITE_URL") ?? new URL(request.url).origin).replace(/\/$/, "");
}

function deliveryEstimate(marketCode: CheckoutPayload["marketCode"]) {
  const region = getMarket(marketCode).region;

  if (region === "france") return { minimum: 2, maximum: 5 };
  if (region === "near-eu") return { minimum: 3, maximum: 7 };
  if (region === "europe") return { minimum: 5, maximum: 10 };

  return { minimum: 8, maximum: 18 };
}

export function buildCheckoutSessionParams(
  request: Request,
  payload: CheckoutPayload,
  uiMode: CheckoutUiMode,
): Stripe.Checkout.SessionCreateParams {
  const market = getMarket(payload.marketCode);
  const origin = originFor(request);
  const paymentMethodConfiguration = getServerEnv("STRIPE_PAYMENT_METHOD_CONFIGURATION_ID");
  const shippingAmount = getMarketShippingCents(payload.marketCode);
  const delivery = deliveryEstimate(payload.marketCode);
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = payload.items.map((item) => {
    const product = getProductById(item.productId);
    const copy = getProductCopy(item.productId, payload.locale);
    const canonicalEuroAmount = getFinishPriceCents(item.productId, item.finishId);

    if (!canonicalEuroAmount) {
      throw new Error(`No canonical price for ${product.code}.`);
    }

    const localAmount = getMarketAmountCentsFromEur(
      canonicalEuroAmount,
      payload.marketCode,
      "price",
    );

    return {
      quantity: item.quantity,
      price_data: {
        currency: market.currency.toLowerCase(),
        unit_amount: localAmount,
        tax_behavior: market.taxBehavior,
        product_data: {
          name: `${copy.name} — ${copy.descriptor}`,
          description: `${getFinishLabel(item.finishId, payload.locale)} · ${copy.shortStatement}`,
          images: [`${origin}${product.finishes[item.finishId].packshot.src}`],
          tax_code: getServerEnv("STRIPE_TAX_CODE_FURNITURE") ?? "txcd_99999999",
          metadata: {
            productId: item.productId,
            finishId: item.finishId,
            canonicalEuroUnitAmount: String(canonicalEuroAmount),
            localCatalogUnitAmount: String(localAmount),
            catalogPricingPolicy: "fixed-market-anchor-v1",
            marketCode: payload.marketCode,
          },
        },
      },
    };
  });

  const common: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: lineItems,
    locale: market.stripeLocale,
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: [payload.marketCode] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name:
            payload.locale === "fr"
              ? `Livraison depuis la France · ${formatMarketAmount(shippingAmount, payload.marketCode, payload.locale)}`
              : `Delivery from France · ${formatMarketAmount(shippingAmount, payload.marketCode, payload.locale)}`,
          fixed_amount: {
            amount: shippingAmount,
            currency: market.currency.toLowerCase(),
          },
          tax_behavior: market.taxBehavior,
          delivery_estimate: {
            minimum: { unit: "business_day", value: delivery.minimum },
            maximum: { unit: "business_day", value: delivery.maximum },
          },
          metadata: {
            marketCode: payload.marketCode,
            canonicalShippingEurCents: String(market.shippingEurCents),
          },
        },
      },
    ],
    customer_creation: "always",
    customer_email: payload.email,
    phone_number_collection: { enabled: true },
    tax_id_collection: { enabled: true },
    allow_promotion_codes: false,
    metadata: {
      brand: brandIdentity.name,
      orderKind: "catalog",
      locale: payload.locale,
      marketCode: payload.marketCode,
      catalogVersion: "viaire-international-v3",
      catalogPricingPolicy: "fixed-market-anchor-v1",
      taxEngine: "stripe-tax",
    },
    ...(paymentMethodConfiguration
      ? { payment_method_configuration: paymentMethodConfiguration }
      : {}),
  };

  if (uiMode === "elements") {
    return {
      ...common,
      ui_mode: "elements",
      return_url: `${origin}/commander?checkout=return&locale=${payload.locale}&market=${payload.marketCode}&session_id={CHECKOUT_SESSION_ID}`,
    };
  }

  return {
    ...common,
    ui_mode: "hosted_page",
    success_url: `${origin}/commander?checkout=success&locale=${payload.locale}&market=${payload.marketCode}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/commander?checkout=cancelled&locale=${payload.locale}&market=${payload.marketCode}`,
    submit_type: "pay",
    custom_text: {
      shipping_address: {
        message:
          payload.locale === "fr"
            ? "La fabrication sur commande (20 jours ouvrés) précède le délai de transport affiché."
            : "Made-to-order production (20 working days) precedes the displayed transit time.",
      },
    },
  };
}
