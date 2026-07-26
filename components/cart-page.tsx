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
import { Button } from "@/components/ui/button";
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
} from "@/lib/rava-content";

type CartPageProps = {
  locale: Locale;
  checkoutStatus?: "success" | "cancelled" | null;
  paymentVerified?: boolean;
  checkoutSessionId?: string | null;
  paidAmountCents?: number | null;
  paidCurrency?: string | null;
};

export default function CartPage({
  locale,
  checkoutStatus = null,
  paymentVerified = false,
  checkoutSessionId = null,
  paidAmountCents = null,
  paidCurrency = null,
}: CartPageProps) {
  const { clearCart, items, removeItem, setQuantity, subtotalCents, totalItems } = useCart();
  const { market, marketCode } = useMarket();
  const siteCopy = getSiteCopy(locale);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const handledPurchaseRef = useRef(false);
  const marketSubtotalCents = getMarketAmountCentsFromEur(subtotalCents, marketCode, "price");

  useEffect(() => {
    if (handledPurchaseRef.current || checkoutStatus !== "success" || !paymentVerified || !checkoutSessionId) return;
    handledPurchaseRef.current = true;

    const eventKey = `traversee-purchase:${checkoutSessionId}`;
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
    } catch (error) { setState({ loading: false, error: error instanceof Error ? error.message : "Checkout is unavailable." }); }
  }

  return (
    <main>
      <SiteHeader locale={locale} />
      <section className="page-shell section-space min-h-[70svh]">
        {checkoutStatus === "success" && paymentVerified ? (
          <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">{locale === "fr" ? "Paiement confirmé" : "Payment confirmed"}</p><h1 className="display-title mt-4 text-6xl">{locale === "fr" ? "Merci pour votre commande." : "Thank you for your order."}</h1><p className="mt-6 text-muted-foreground">{locale === "fr" ? "Une confirmation vous sera envoyée par email." : "A confirmation will be sent by email."}</p><Link href={getHomeRoute(locale)} className="mt-8 inline-flex h-12 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">{locale === "fr" ? "Retour à la collection" : "Back to the collection"}</Link></div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div><p className="eyebrow">{locale === "fr" ? "Panier" : "Bag"}</p><h1 className="display-title mt-4 text-6xl">{checkoutStatus === "cancelled" ? (locale === "fr" ? "Votre panier vous attend." : "Your bag is still here.") : (locale === "fr" ? "Votre sélection." : "Your selection.")}</h1>
              <div className="mt-10 grid gap-5">{items.length === 0 ? <p className="text-muted-foreground">{locale === "fr" ? "Votre panier est vide." : "Your bag is empty."}</p> : items.map((item) => { const copy = getProductCopy(item.productId, locale); const image = getFinishMedia(item.productId, item.finishId).packshot; const total = getMarketAmountCentsFromEur((getFinishPriceCents(item.productId, item.finishId) ?? 0) * item.quantity, marketCode, "price"); return <article key={`${item.productId}:${item.finishId}`} className="grid grid-cols-[120px_1fr] gap-5 border-t border-border pt-5"><div className="image-stage aspect-[4/5]"><Image src={image.src} alt={image.alt} fill sizes="120px" className="object-contain p-2" /></div><div className="flex flex-col justify-between gap-4"><div><p className="font-medium">{copy.name}</p><p className="text-sm text-muted-foreground">{getFinishLabel(item.finishId, locale)}</p></div><p className="font-medium">{formatMarketAmount(total, marketCode, locale)}</p><div className="flex items-center gap-4"><QuantityStepper value={item.quantity} onChange={(value) => setQuantity(item.productId, item.finishId, value)} locale={locale} /><button className="text-xs underline" onClick={() => removeItem(item.productId, item.finishId)}>{locale === "fr" ? "Retirer" : "Remove"}</button><Link href={`${getLocalizedRoute(item.productId, locale)}?finish=${item.finishId}`} className="text-xs underline">{locale === "fr" ? "Modifier" : "Edit"}</Link></div></div></article>; })}</div>
            </div>
            <aside className="surface h-fit p-6 lg:sticky lg:top-24"><p className="eyebrow">{locale === "fr" ? "Résumé" : "Summary"}</p><div className="mt-5"><MarketSelector locale={locale} /></div><dl className="mt-5"><div className="buy-row"><dt>{locale === "fr" ? "Pièces" : "Items"}</dt><dd>{totalItems}</dd></div><div className="buy-row"><dt>{locale === "fr" ? "Sous-total" : "Subtotal"}</dt><dd>{formatMarketAmount(marketSubtotalCents, marketCode, locale)}</dd></div><div className="buy-row"><dt>{locale === "fr" ? "Livraison" : "Delivery"}</dt><dd>{formatMarketAmount(getMarketShippingCents(marketCode), marketCode, locale)}</dd></div><div className="buy-row"><dt>{locale === "fr" ? "Délai" : "Lead time"}</dt><dd>{siteCopy.fabricationDelay}</dd></div></dl>{items.length ? <div className="mt-5"><ExpressCheckout items={items} locale={locale} marketCode={marketCode} /></div> : null}{state.error ? <p className="mt-4 text-sm text-destructive">{state.error}</p> : null}<Button className="mt-3 w-full" size="lg" disabled={!items.length || state.loading} onClick={checkout}>{state.loading ? (locale === "fr" ? "Ouverture…" : "Opening…") : (locale === "fr" ? "Continuer avec Stripe" : "Continue with Stripe")}</Button></aside>
          </div>
        )}
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
