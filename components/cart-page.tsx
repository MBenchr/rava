"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart-provider";
import ExpressCheckout from "@/components/express-checkout";
import MarketSelector from "@/components/market-selector";
import { useMarket } from "@/components/market-provider";
import QuantityStepper from "@/components/quantity-stepper";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import skipStyles from "@/components/skip-link.module.css";
import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import { openStripeCheckout } from "@/lib/checkout-client";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  formatMarketAmount,
  getMarketAmountCentsFromEur,
  getMarketShippingCents,
} from "@/lib/markets";
import {
  getFinishLabel,
  getFinishMedia,
  getFinishPriceCents,
  getHomeRoute,
  getLocalizedRoute,
  getProductCopy,
  getSiteCopy,
  type Locale,
} from "@/lib/isandre/catalog";

type CartPageProps = {
  locale: Locale;
  checkoutStatus?: "success" | "cancelled" | null;
  paymentVerified?: boolean;
  checkoutSessionId?: string | null;
  paidAmountCents?: number | null;
  paidCurrency?: string | null;
  customerEmail?: string | null;
  orderReference?: string | null;
  orderedItems?: Array<{ name: string; quantity: number }>;
};

export default function CartPage({
  locale,
  checkoutStatus = null,
  paymentVerified = false,
  checkoutSessionId = null,
  paidAmountCents = null,
  paidCurrency = null,
  customerEmail = null,
  orderReference = null,
  orderedItems = [],
}: CartPageProps) {
  const content = getContent(locale);
  const { clearCart, items, removeItem, setQuantity, subtotalCents, totalItems } = useCart();
  const { market, marketCode } = useMarket();
  const siteCopy = getSiteCopy(locale);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const handledPurchaseRef = useRef(false);
  const marketSubtotalCents = getMarketAmountCentsFromEur(subtotalCents, marketCode, "price");

  useEffect(() => {
    if (handledPurchaseRef.current || checkoutStatus !== "success" || !paymentVerified || !checkoutSessionId) return;
    handledPurchaseRef.current = true;

    const eventKey = `isandre-purchase:${checkoutSessionId}`;
    if (!window.sessionStorage.getItem(eventKey)) {
      trackCommerceEvent("purchase", { transaction_id: checkoutSessionId, currency: paidCurrency ?? market.currency, value: (paidAmountCents ?? marketSubtotalCents) / 100, items: items.map((item) => ({ item_id: item.productId, item_variant: item.finishId, quantity: item.quantity })) });
      window.sessionStorage.setItem(eventKey, "1");
    }
    clearCart();
  }, [checkoutSessionId, checkoutStatus, clearCart, items, market.currency, marketSubtotalCents, paidAmountCents, paidCurrency, paymentVerified]);

  async function checkout() {
    setState({ loading: true, error: null });
    try {
      trackCommerceEvent("begin_checkout", { currency: market.currency, value: marketSubtotalCents / 100, items: items.map((item) => ({ item_id: item.productId, item_variant: item.finishId, quantity: item.quantity })) });
      await openStripeCheckout({ locale, marketCode, items });
    } catch (error) { setState({ loading: false, error: error instanceof Error ? error.message : content.errors.checkout }); }
  }

  return (
    <>
      <a className={skipStyles.skipLink} href="#main-content">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content" tabIndex={-1}>
      <section className="page-shell section-space min-h-[70svh]">
        {checkoutStatus === "success" && paymentVerified ? (
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="eyebrow">{content.commerce.checkoutSuccess}</p>
              <h1 className="display-title mt-4 text-6xl">{content.emails.orderConfirmedHeading}</h1>
              <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{content.emails.orderConfirmedBody}</p>
            </div>
            <div className="surface mt-10 p-6 sm:p-8">
              <dl>
                <div className="buy-row">
                  <dt>{content.common.summary}</dt>
                  <dd>{orderReference ?? "—"}</dd>
                </div>
                <div className="buy-row">
                  <dt>{content.commerce.subtotal}</dt>
                  <dd>
                    {paidAmountCents && paidCurrency
                      ? new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
                          style: "currency",
                          currency: paidCurrency,
                        }).format(paidAmountCents / 100)
                      : "—"}
                  </dd>
                </div>
                {customerEmail ? (
                  <div className="buy-row">
                    <dt>{locale === "fr" ? "Suivi envoyé à" : "Updates sent to"}</dt>
                    <dd>{customerEmail}</dd>
                  </div>
                ) : null}
              </dl>
              {orderedItems.length ? (
                <div className="mt-6 border-t border-border pt-5">
                  {orderedItems.map((item) => (
                    <p key={`${item.name}-${item.quantity}`} className="flex justify-between gap-5 py-2 text-sm">
                      <span>{item.name}</span>
                      <span>× {item.quantity}</span>
                    </p>
                  ))}
                </div>
              ) : null}
              <ol className="mt-6 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-3">
                <li>1. {content.service.technicalTitle}</li>
                <li>2. {content.commerce.productionEstimate}</li>
                <li>3. {content.service.deliveryTitle}</li>
              </ol>
            </div>
            <div className="mt-8 text-center">
              <Link href={getHomeRoute(locale)} className="inline-flex h-12 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">
                {content.common.viewCollection}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div><p className="eyebrow">{content.navigation.bag}</p><h1 className="display-title mt-4 text-6xl">{checkoutStatus === "cancelled" ? content.commerce.checkoutCancelled : content.common.selection}</h1>
              <div className="mt-10 grid gap-5">{items.length === 0 ? <p className="text-muted-foreground">{content.commerce.bagEmptyBody}</p> : items.map((item) => { const copy = getProductCopy(item.productId, locale); const image = getFinishMedia(item.productId, item.finishId).packshot; const total = getMarketAmountCentsFromEur((getFinishPriceCents(item.productId, item.finishId) ?? 0) * item.quantity, marketCode, "price"); return <article key={`${item.productId}:${item.finishId}`} className="grid grid-cols-[120px_1fr] gap-5 border-t border-border pt-5"><div className="image-stage aspect-[4/5]"><Image src={image.thumbnailSrc} alt={image.alt} fill sizes="120px" unoptimized className="object-contain p-2" /></div><div className="flex flex-col justify-between gap-4"><div><p className="font-medium">{copy.name}</p><p className="text-sm text-muted-foreground">{getFinishLabel(item.finishId, locale)}</p></div><p className="font-medium">{formatMarketAmount(total, marketCode, locale)}</p><div className="flex items-center gap-4"><QuantityStepper value={item.quantity} onChange={(value) => setQuantity(item.productId, item.finishId, value)} locale={locale} /><button className="text-xs underline" onClick={() => removeItem(item.productId, item.finishId)}>{content.commerce.remove}</button><Link href={`${getLocalizedRoute(item.productId, locale)}?finish=${item.finishId}`} className="text-xs underline">{content.common.edit}</Link></div></div></article>; })}</div>
            </div>
            <aside className="surface h-fit p-6 lg:sticky lg:top-24"><p className="eyebrow">{content.common.summary}</p><div className="mt-5"><MarketSelector locale={locale} /></div><dl className="mt-5"><div className="buy-row"><dt>{content.common.items}</dt><dd>{totalItems}</dd></div><div className="buy-row"><dt>{content.commerce.subtotal}</dt><dd>{formatMarketAmount(marketSubtotalCents, marketCode, locale)}</dd></div><div className="buy-row"><dt>{content.common.delivery}</dt><dd>{formatMarketAmount(getMarketShippingCents(marketCode), marketCode, locale)}</dd></div><div className="buy-row"><dt>{content.common.leadTime}</dt><dd>{siteCopy.fabricationDelay}</dd></div></dl>{items.length ? <div className="mt-5"><ExpressCheckout items={items} locale={locale} marketCode={marketCode} /></div> : null}{state.error ? <p className="mt-4 text-sm text-destructive">{state.error}</p> : null}<Button className="mt-3 w-full" size="lg" disabled={!items.length || state.loading} onClick={checkout}>{state.loading ? content.common.opening : content.commerce.checkout}</Button></aside>
          </div>
        )}
      </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
