"use client";

import {
  CheckoutElementsProvider,
  ExpressCheckoutElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";

import type { CartLine } from "@/components/cart-provider";
import type { MarketCode } from "@/lib/markets";
import type { Locale } from "@/lib/rava-content";

type ExpressCheckoutProps = {
  items: CartLine[];
  locale: Locale;
  marketCode: MarketCode;
};

type SessionData = {
  clientSecret: string;
  publishableKey: string;
  sessionId: string;
};

const klarnaFirstMarkets = new Set<MarketCode>(["AT", "DE", "DK", "FI", "NO", "SE"]);
const paypalFirstMarkets = new Set<MarketCode>(["BE", "CA", "DE", "ES", "FR", "GB", "IT", "LU", "NL", "PT", "US"]);

function paymentMethodOrder(marketCode: MarketCode) {
  if (klarnaFirstMarkets.has(marketCode)) {
    return ["klarna", "paypal", "apple_pay", "google_pay", "amazon_pay", "link"];
  }

  if (paypalFirstMarkets.has(marketCode)) {
    return ["paypal", "apple_pay", "google_pay", "klarna", "amazon_pay", "link"];
  }

  return ["apple_pay", "google_pay", "paypal", "klarna", "amazon_pay", "link"];
}

function ExpressButtons({
  locale,
  marketCode,
}: {
  locale: Locale;
  marketCode: MarketCode;
}) {
  const checkoutState = useCheckoutElements();
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  if (checkoutState.type === "error") {
    return null;
  }

  if (checkoutState.type !== "success") {
    return <div className="h-12 animate-pulse rounded-lg bg-secondary" aria-hidden="true" />;
  }

  return (
    <div className={ready ? "express-checkout express-checkout--ready" : "express-checkout"}>
      <ExpressCheckoutElement
        options={{
          buttonHeight: 48,
          buttonType: {
            applePay: "buy",
            googlePay: "buy",
            paypal: "buynow",
          },
          buttonTheme: undefined,
          layout: { maxColumns: 2, maxRows: 2, overflow: "auto" },
          paymentMethodOrder: paymentMethodOrder(marketCode),
          paymentMethods: {
            applePay: "auto",
            googlePay: "auto",
            paypal: "auto",
            klarna: "auto",
            amazonPay: "auto",
            link: "auto",
          },
        }}
        onReady={() => setReady(true)}
        onConfirm={async (event) => {
          setError(null);
          const result = await checkoutState.checkout.confirm({
            expressCheckoutConfirmEvent: event,
          });

          if (result.type === "error") {
            setError(
              result.error.message ??
                (locale === "fr" ? "Le paiement rapide a échoué." : "Express checkout failed."),
            );
          }
        }}
      />
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default function ExpressCheckout({
  items,
  locale,
  marketCode,
}: ExpressCheckoutProps) {
  const sessionKey = JSON.stringify({ items, locale, marketCode });

  return (
    <ExpressCheckoutSession
      key={sessionKey}
      items={items}
      locale={locale}
      marketCode={marketCode}
    />
  );
}

function ExpressCheckoutSession({
  items,
  locale,
  marketCode,
}: ExpressCheckoutProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [failed, setFailed] = useState(false);
  const sessionKey = useMemo(
    () => JSON.stringify({ items, locale, marketCode }),
    [items, locale, marketCode],
  );

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/checkout/express", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: sessionKey,
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = (await response.json()) as SessionData & { error?: string };

        if (!response.ok || !data.clientSecret || !data.publishableKey) {
          throw new Error(data.error ?? "Express checkout is unavailable.");
        }

        setSession(data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setFailed(true);
      });

    return () => controller.abort();
  }, [sessionKey]);

  const stripe = useMemo<Promise<Stripe | null> | null>(
    () => (session ? loadStripe(session.publishableKey) : null),
    [session],
  );

  if (failed) {
    return null;
  }

  if (!session || !stripe) {
    return <div className="h-12 animate-pulse rounded-lg bg-secondary" aria-hidden="true" />;
  }

  return (
    <CheckoutElementsProvider
      key={session.sessionId}
      stripe={stripe}
      options={{
        clientSecret: session.clientSecret,
        elementsOptions: {
          appearance: {
            theme: "stripe",
            variables: {
              borderRadius: "8px",
              colorPrimary: "#121311",
              fontFamily: "DM Sans, sans-serif",
            },
          },
        },
      }}
    >
      <ExpressButtons locale={locale} marketCode={marketCode} />
    </CheckoutElementsProvider>
  );
}
