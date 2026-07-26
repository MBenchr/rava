"use client";

import Link from "next/link";
import { ArrowUpRight, Eye, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import QuantityStepper from "@/components/quantity-stepper";
import MarketSelector from "@/components/market-selector";
import { useMarket } from "@/components/market-provider";
import { Button } from "@/components/ui/button";
import { openStripeCheckout } from "@/lib/checkout-client";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  formatMarketAmount,
  formatMarketPriceFromEur,
  getMarketAmountCentsFromEur,
  getMarketShippingCents,
} from "@/lib/markets";
import {
  brandIdentity,
  getAvailableFinishes,
  getFinishLabel,
  getFinishPriceCents,
  getLocalizedRoute,
  getProductById,
  getProductCopy,
  getSiteCopy,
  normalizeFinishForProduct,
  productList,
  siteMeta,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/rava-content";
import { isProjectionProductReady } from "@/modules/projection/core/reference-kits";

type BuyPanelProps = {
  locale: Locale;
  productId: ProductId;
  finishId: FinishId;
  quantity: number;
  onFinishChange: (finishId: FinishId) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onProjectionOpen: () => void;
  onProductChange?: (productId: ProductId) => void;
  cartMessage?: string | null;
  showProductLink?: boolean;
  showProductSwitch?: boolean;
};

export default function BuyPanel({
  locale,
  productId,
  finishId,
  quantity,
  onFinishChange,
  onQuantityChange,
  onAddToCart,
  onProjectionOpen,
  onProductChange,
  cartMessage,
  showProductLink = false,
  showProductSwitch = false,
}: BuyPanelProps) {
  const product = getProductById(productId);
  const { market, marketCode } = useMarket();
  const copy = getProductCopy(productId, locale);
  const siteCopy = getSiteCopy(locale);
  const activeFinishId = normalizeFinishForProduct(productId, finishId);
  const projectionReady = isProjectionProductReady(productId);
  const [buyState, setBuyState] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });
  const actionsRef = useRef<HTMLDivElement>(null);
  const [showMobileBuyBar, setShowMobileBuyBar] = useState(true);
  const canonicalPriceCents = getFinishPriceCents(productId, activeFinishId) ?? 0;
  const marketPriceCents = getMarketAmountCentsFromEur(
    canonicalPriceCents,
    marketCode,
    "price",
  );
  const formattedPrice = formatMarketPriceFromEur(
    canonicalPriceCents,
    marketCode,
    locale,
  );
  const formattedShipping = formatMarketAmount(
    getMarketShippingCents(marketCode),
    marketCode,
    locale,
  );

  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileBuyBar(!entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(actions);
    return () => observer.disconnect();
  }, []);

  async function buyNow() {
    setBuyState({ loading: true, error: null });
    try {
      trackCommerceEvent("begin_checkout", {
        currency: market.currency,
        value: (marketPriceCents * quantity) / 100,
        items: [{ item_id: productId, item_variant: activeFinishId, quantity }],
      });
      await openStripeCheckout({
        locale,
        marketCode,
        items: [{ productId, finishId: activeFinishId, quantity }],
      });
    } catch (error) {
      setBuyState({
        loading: false,
        error: error instanceof Error ? error.message : "Checkout is unavailable.",
      });
    }
  }

  return (
    <aside className="purchase-panel">
      {showProductSwitch && onProductChange ? (
        <div
          className="purchase-panel__products"
          aria-label={locale === "fr" ? "Choisir une pièce" : "Choose a piece"}
        >
          {productList.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === productId}
              onClick={() => onProductChange(item.id)}
            >
              <span>0{index + 1}</span>
              {getProductCopy(item.id, locale).name}
            </button>
          ))}
        </div>
      ) : (
        <p className="eyebrow">{brandIdentity.collectionLabels[locale]}</p>
      )}

      <div className="purchase-panel__heading">
        <div>
          <h2 className="display-title">{copy.name}</h2>
          <p>{copy.descriptor}</p>
        </div>
        <p className="purchase-panel__price">{formattedPrice}</p>
      </div>
      <p className="purchase-panel__statement">{copy.statement}</p>

      <MarketSelector locale={locale} />

      <div className="purchase-panel__finish">
        <div>
          <p>{locale === "fr" ? "Finition" : "Finish"}</p>
          <span>{getFinishLabel(activeFinishId, locale)}</span>
        </div>
        <div className="finish-choices">
          {getAvailableFinishes(productId).map((finish) => (
            <button
              key={finish.id}
              type="button"
              aria-label={`${finish.labels[locale]} — ${formatMarketPriceFromEur(
                getFinishPriceCents(productId, finish.id) ?? 0,
                marketCode,
                locale,
              )}`}
              aria-pressed={finish.id === activeFinishId}
              onClick={() => onFinishChange(finish.id)}
            >
              <span style={{ backgroundColor: finish.hex }} />
              <small>{finish.labels[locale]}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="purchase-panel__quantity">
        <div>
          <p>{locale === "fr" ? "Quantité" : "Quantity"}</p>
          <span>{locale === "fr" ? "Fabriqué pour vous" : "Made for you"}</span>
        </div>
        <QuantityStepper value={quantity} onChange={onQuantityChange} locale={locale} />
      </div>

      <div ref={actionsRef} className="purchase-panel__actions">
        <Button size="lg" onClick={buyNow} disabled={buyState.loading}>
          {buyState.loading
            ? locale === "fr"
              ? "Ouverture…"
              : "Opening…"
            : locale === "fr"
              ? "Acheter maintenant"
              : "Buy now"}
          {!buyState.loading ? <ArrowUpRight className="size-4" /> : null}
        </Button>
        <Button size="lg" variant="outline" onClick={onAddToCart}>
          {locale === "fr" ? "Ajouter au panier" : "Add to bag"}
        </Button>
      </div>

      <button
        type="button"
        className="room-preview-link"
        disabled={!projectionReady}
        onClick={onProjectionOpen}
      >
        <Eye className="size-4" />
        {projectionReady
          ? locale === "fr"
            ? "Voir cette finition dans votre pièce"
            : "View this finish in your room"
          : locale === "fr"
            ? "Projection bientôt disponible"
            : "Room view coming soon"}
      </button>

      {buyState.error ? <p className="text-sm text-destructive">{buyState.error}</p> : null}
      {cartMessage ? <p className="text-sm text-muted-foreground">{cartMessage}</p> : null}

      <div className="purchase-panel__assurance">
        <ShieldCheck className="size-4" />
        <p>
          {locale === "fr"
            ? `Livraison ${formattedShipping}. Taxes calculées par Stripe avant paiement.`
            : `${formattedShipping} delivery. Taxes calculated by Stripe before payment.`}
        </p>
      </div>

      <div className="purchase-panel__details">
        <details>
          <summary>{locale === "fr" ? "Dimensions et matière" : "Dimensions and material"}</summary>
          <p>
            {product.dimensionsLabel ?? (locale === "fr" ? "Voir la fiche technique." : "See technical sheet.")}
            {" · "}
            {locale === "fr" ? "Surface minérale mate, structure traversante." : "Matte mineral surface, open-backed structure."}
          </p>
        </details>
        <details>
          <summary>{locale === "fr" ? "Fabrication et livraison" : "Production and delivery"}</summary>
          <p>{siteCopy.fabricationDelay}. {siteCopy.deliveryLine}</p>
        </details>
      </div>

      <div className="purchase-panel__links">
        {showProductLink ? (
          <Link href={`${getLocalizedRoute(productId, locale)}?finish=${activeFinishId}`}>
            {locale === "fr" ? "Voir tous les détails" : "View all details"}
          </Link>
        ) : null}
        <Link href={locale === "fr" ? "/fr/fiche-technique" : "/technical-sheet"}>
          {locale === "fr" ? "Fiche technique" : "Technical sheet"}
        </Link>
        <a href={`mailto:${siteMeta.leadEmail}`}>
          {locale === "fr" ? "Parler au studio" : "Speak to the studio"}
        </a>
      </div>

      <div
        className={`mobile-buy-bar${showMobileBuyBar ? " mobile-buy-bar--visible" : ""}`}
        aria-hidden={!showMobileBuyBar}
      >
        <div>
          <p>{copy.name} · {getFinishLabel(activeFinishId, locale)}</p>
          <strong>{formattedPrice}</strong>
        </div>
        <Button onClick={buyNow} disabled={buyState.loading}>
          {locale === "fr" ? "Acheter" : "Buy now"}
        </Button>
      </div>
    </aside>
  );
}
