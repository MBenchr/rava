"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import ExpressCheckout from "@/components/express-checkout";
import MarketSelector from "@/components/market-selector";
import { useMarket } from "@/components/market-provider";
import ProductIdentityPicker from "@/components/product-identity-picker";
import QuantityStepper from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
  getAvailableFinishes,
  getLocalizedRoute,
  getProductById,
  getProductCopy,
  getSiteCopy,
  normalizeFinishForProduct,
  type Locale,
} from "@/lib/rava-content";

export default function CartDrawer({ locale }: { locale: Locale }) {
  const { clearCart, closeCart, isCartOpen, items, removeItem, replaceItem, setCartOpen, setQuantity, subtotalCents, totalItems } = useCart();
  const { market, marketCode } = useMarket();
  const siteCopy = getSiteCopy(locale);
  const [state, setState] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const marketSubtotalCents = getMarketAmountCentsFromEur(subtotalCents, marketCode, "price");
  const shippingCents = getMarketShippingCents(marketCode);

  async function checkout() {
    setState({ loading: true, error: null });
    try {
      trackCommerceEvent("begin_checkout", { currency: market.currency, value: marketSubtotalCents / 100, items: items.map((item) => ({ item_id: item.productId, item_variant: item.finishId, quantity: item.quantity })) });
      await openStripeCheckout({ locale, marketCode, items });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : "Checkout is unavailable." });
    }
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full max-w-[520px] gap-0 border-l border-border bg-card p-0">
        <SheetHeader className="border-b border-border px-5 py-6 sm:px-7">
          <p className="eyebrow">{locale === "fr" ? "Votre sélection" : "Your selection"}</p>
          <SheetTitle className="display-title text-5xl">{locale === "fr" ? "Le panier" : "The bag"}</SheetTitle>
          <SheetDescription>{totalItems ? (locale === "fr" ? `${totalItems} pièce${totalItems > 1 ? "s" : ""}, fabriquée${totalItems > 1 ? "s" : ""} pour vous.` : `${totalItems} piece${totalItems > 1 ? "s" : ""}, made for you.`) : (locale === "fr" ? "Votre sélection apparaîtra ici." : "Your selection will appear here.")}</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-6 px-7">
            <p className="display-title max-w-sm text-5xl">{locale === "fr" ? "Une pièce pour laisser vivre la vôtre." : "A piece that lets your room live."}</p>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">{locale === "fr" ? "Choisissez une forme, trouvez sa finition, puis commandez directement." : "Choose a form, find its finish, then order directly."}</p>
            <Button onClick={closeCart}>{locale === "fr" ? "Voir la collection" : "View the collection"}</Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <div className="grid gap-5">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  const copy = getProductCopy(item.productId, locale);
                  const image = getFinishMedia(item.productId, item.finishId).packshot;
                  const linePrice = getMarketAmountCentsFromEur(
                    (getFinishPriceCents(item.productId, item.finishId) ?? 0) * item.quantity,
                    marketCode,
                    "price",
                  );
                  return (
                    <article key={`${item.productId}:${item.finishId}`} className="cart-line">
                      <div className="image-stage cart-line__hero"><Image src={image.src} alt={image.alt} fill sizes="160px" className="object-contain" /></div>
                      <div className="grid content-start gap-3">
                        <div><p className="text-sm font-medium">{copy.name}</p><p className="mt-1 text-xs text-muted-foreground">{getFinishLabel(item.finishId, locale)}</p></div>
                        <p className="text-sm font-medium">{formatMarketAmount(linePrice, marketCode, locale)}</p>
                        <div className="flex items-center justify-between gap-3"><QuantityStepper value={item.quantity} onChange={(quantity) => setQuantity(item.productId, item.finishId, quantity)} locale={locale} /><button className="text-xs text-muted-foreground underline underline-offset-4" onClick={() => removeItem(item.productId, item.finishId)}>{locale === "fr" ? "Retirer" : "Remove"}</button></div>
                        <Link href={`${getLocalizedRoute(product.id, locale)}?finish=${item.finishId}`} className="text-xs text-muted-foreground underline underline-offset-4" onClick={closeCart}>{locale === "fr" ? "Modifier" : "Edit"}</Link>
                      </div>
                      <details className="cart-line__details">
                        <summary>
                          {locale === "fr" ? "Modifier la pièce ou la finition" : "Change piece or finish"}
                        </summary>
                        <div className="cart-line__editor">
                          <p className="cart-line__label">{locale === "fr" ? "Changer de pièce" : "Change piece"}</p>
                          <ProductIdentityPicker
                            compact
                            productId={item.productId}
                            finishId={item.finishId}
                            locale={locale}
                            onChange={(nextProductId) =>
                              replaceItem(
                                item.productId,
                                item.finishId,
                                nextProductId,
                                normalizeFinishForProduct(nextProductId, item.finishId),
                              )
                            }
                          />
                          <p className="cart-line__label">{locale === "fr" ? "Finition" : "Finish"}</p>
                          <div className="cart-line__finishes">
                            {getAvailableFinishes(item.productId).map((finish) => (
                              <button
                                key={finish.id}
                                type="button"
                                aria-label={finish.labels[locale]}
                                aria-pressed={finish.id === item.finishId}
                                onClick={() =>
                                  replaceItem(
                                    item.productId,
                                    item.finishId,
                                    item.productId,
                                    finish.id,
                                  )
                                }
                              >
                                <span style={{ backgroundColor: finish.hex }} />
                                {finish.labels[locale]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </details>
                    </article>
                  );
                })}
              </div>
            </div>

            <SheetFooter className="cart-drawer__footer border-t border-border p-5 sm:p-7">
              <MarketSelector locale={locale} />
              <dl className="cart-drawer__summary"><div className="buy-row"><dt>{locale === "fr" ? "Sous-total" : "Subtotal"}</dt><dd>{formatMarketAmount(marketSubtotalCents, marketCode, locale)}</dd></div><div className="buy-row cart-drawer__production"><dt>{locale === "fr" ? "Fabrication" : "Production"}</dt><dd>{siteCopy.fabricationDelay}</dd></div><div className="buy-row"><dt>{locale === "fr" ? "Livraison" : "Delivery"}</dt><dd>{formatMarketAmount(shippingCents, marketCode, locale)}</dd></div></dl>
              <div className="cart-drawer__trust grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2 bg-secondary p-3 text-xs leading-5 text-muted-foreground"><PackageCheck className="mt-0.5 size-4 shrink-0 text-foreground" />{locale === "fr" ? "Suivi du studio jusqu’à l’arrivée." : "Studio follow-up through arrival."}</div>
                <div className="flex items-start gap-2 bg-secondary p-3 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-foreground" />{locale === "fr" ? "Paiement sécurisé par Stripe." : "Secure payment by Stripe."}</div>
              </div>
              <ExpressCheckout items={items} locale={locale} marketCode={marketCode} />
              <div className="checkout-divider"><span>{locale === "fr" ? "ou" : "or"}</span></div>
              {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
              <Button size="lg" className="justify-between" onClick={checkout} disabled={state.loading}><span>{state.loading ? (locale === "fr" ? "Ouverture du paiement…" : "Opening checkout…") : (locale === "fr" ? "Continuer avec Stripe" : "Continue with Stripe")}</span><span>{formatMarketAmount(marketSubtotalCents, marketCode, locale)}</span></Button>
              <p className="cart-drawer__payment-note text-center text-xs leading-5 text-muted-foreground">{locale === "fr" ? "Les moyens de paiement disponibles sont affichés par Stripe selon votre pays et votre éligibilité." : "Stripe shows the payment methods available for your country and eligibility."}</p>
              <button type="button" className="text-xs text-muted-foreground underline underline-offset-4" onClick={() => { clearCart(); setState({ loading: false, error: null }); }}>{locale === "fr" ? "Vider le panier" : "Clear bag"}</button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
