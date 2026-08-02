"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronUp, Eye, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ExpressCheckout from "@/components/express-checkout";
import ProductIdentityPicker from "@/components/product-identity-picker";
import QuantityStepper from "@/components/quantity-stepper";
import MarketSelector from "@/components/market-selector";
import { useMarket } from "@/components/market-provider";
import { Button } from "@/components/ui/button";
import { useTechnicalSheet } from "@/components/technical-sheet-provider";
import { getContent } from "@/content";
import { openStripeCheckout } from "@/lib/checkout-client";
import { trackCommerceEvent } from "@/lib/commerce-events";
import { preloadProductMedia } from "@/lib/image-preload";
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
  siteMeta,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";

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
  headingLevel?: 1 | 2;
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
  headingLevel = 2,
  showProductLink = false,
  showProductSwitch = false,
}: BuyPanelProps) {
  const product = getProductById(productId);
  const { market, marketCode } = useMarket();
  const { openTechnicalSheet } = useTechnicalSheet();
  const content = getContent(locale);
  const copy = getProductCopy(productId, locale);
  const siteCopy = getSiteCopy(locale);
  const activeFinishId = normalizeFinishForProduct(productId, finishId);
  const [buyState, setBuyState] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });
  const actionsRef = useRef<HTMLDivElement>(null);
  const [showMobileBuyBar, setShowMobileBuyBar] = useState(true);
  const [mobileConfiguratorOpen, setMobileConfiguratorOpen] = useState(false);
  const [showInlineExpressCheckout, setShowInlineExpressCheckout] = useState(false);
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
  const ProductHeading = headingLevel === 1 ? "h1" : "h2";

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

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const syncExpressCheckout = () =>
      setShowInlineExpressCheckout(desktopQuery.matches);

    syncExpressCheckout();
    desktopQuery.addEventListener("change", syncExpressCheckout);
    return () =>
      desktopQuery.removeEventListener("change", syncExpressCheckout);
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
        error: error instanceof Error ? error.message : content.errors.checkout,
      });
    }
  }

  return (
    <aside className="purchase-panel">
      {showProductSwitch && onProductChange ? (
        <ProductIdentityPicker
          productId={productId}
          finishId={activeFinishId}
          locale={locale}
          onChange={onProductChange}
        />
      ) : (
        <p className="eyebrow">{brandIdentity.collectionLabels[locale]}</p>
      )}

      <div className="purchase-panel__heading">
        <div>
          <ProductHeading className="display-title">{copy.name}</ProductHeading>
          <p>{copy.descriptor}</p>
        </div>
        <p className="purchase-panel__price">{formattedPrice}</p>
      </div>
      <p className="purchase-panel__statement">{copy.statement}</p>

      <MarketSelector locale={locale} />

      <div className="purchase-panel__finish">
        <div>
          <p>{content.commerce.finish}</p>
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
              onFocus={() => void preloadProductMedia(productId, finish.id)}
              onPointerEnter={() => void preloadProductMedia(productId, finish.id)}
              onPointerDown={() => void preloadProductMedia(productId, finish.id)}
            >
              <span style={{ backgroundColor: finish.hex }} />
              <small>{finish.labels[locale]}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="purchase-panel__quantity">
        <div>
          <p>{content.commerce.quantity}</p>
          <span>{content.service.productionTitle}</span>
        </div>
        <QuantityStepper value={quantity} onChange={onQuantityChange} locale={locale} />
      </div>

      <div ref={actionsRef} className="purchase-panel__actions">
        <Button size="lg" onClick={buyNow} disabled={buyState.loading}>
          {buyState.loading
            ? content.common.opening
            : content.commerce.buyNow}
          {!buyState.loading ? <ArrowUpRight className="size-4" /> : null}
        </Button>
        <Button size="lg" variant="outline" onClick={onAddToCart}>
          {content.commerce.addToBag}
        </Button>
      </div>

      {showInlineExpressCheckout ? (
        <div className="purchase-panel__express">
          <p>{content.common.expressCheckout}</p>
          <ExpressCheckout
            items={[{ productId, finishId: activeFinishId, quantity }]}
            locale={locale}
            marketCode={marketCode}
          />
          <small>{content.common.expressCheckoutNote}</small>
        </div>
      ) : null}

      <button
        type="button"
        className="room-preview-link"
        onClick={onProjectionOpen}
      >
        <Eye className="size-4" />
        {content.home.viewAtHome}
      </button>

      {buyState.error ? <p className="text-sm text-destructive">{buyState.error}</p> : null}
      {cartMessage ? <p className="text-sm text-muted-foreground">{cartMessage}</p> : null}

      <div className="purchase-panel__assurance">
        <ShieldCheck className="size-4" />
        <p>
          {formattedShipping} · {content.commerce.taxNote}
        </p>
      </div>

      <div className="purchase-panel__details">
        <details>
          <summary>{content.common.dimensionsAndMaterial}</summary>
          <p>
            {product.dimensionsLabel ?? content.common.technicalSheet}
            {" · "}
            {content.common.materialSummary}
          </p>
        </details>
        <details>
          <summary>{content.common.productionAndDelivery}</summary>
          <p>{siteCopy.fabricationDelay}. {siteCopy.deliveryLine}</p>
        </details>
      </div>

      <div className="purchase-panel__links">
        {showProductLink ? (
          <Link href={`${getLocalizedRoute(productId, locale)}?finish=${activeFinishId}`}>
            {content.common.viewAllDetails}
          </Link>
        ) : null}
        <button type="button" onClick={() => openTechnicalSheet(productId)}>
          {content.common.technicalSheet}
        </button>
        <a href={`mailto:${siteMeta.leadEmail}`}>
          {content.common.speakToStudio}
        </a>
      </div>

      <div
        className={`mobile-buy-bar${showMobileBuyBar ? " mobile-buy-bar--visible" : ""}`}
        aria-hidden={!showMobileBuyBar}
      >
        {mobileConfiguratorOpen && onProductChange ? (
          <div className="mobile-buy-configurator">
            <div className="mobile-buy-configurator__header">
              <p>{content.common.selection}</p>
              <button
                type="button"
                onClick={() => setMobileConfiguratorOpen(false)}
                aria-label={content.common.close}
              >
                <X className="size-4" />
              </button>
            </div>
            <ProductIdentityPicker
              compact
              productId={productId}
              finishId={activeFinishId}
              locale={locale}
              onChange={onProductChange}
            />
            <div className="mobile-buy-configurator__finishes">
              {getAvailableFinishes(productId).map((finish) => (
                <button
                  key={finish.id}
                  type="button"
                  aria-pressed={finish.id === activeFinishId}
                  aria-label={finish.labels[locale]}
                  onClick={() => onFinishChange(finish.id)}
                  onFocus={() => void preloadProductMedia(productId, finish.id)}
                  onPointerEnter={() => void preloadProductMedia(productId, finish.id)}
                  onPointerDown={() => void preloadProductMedia(productId, finish.id)}
                >
                  <span style={{ backgroundColor: finish.hex }} />
                  {finish.labels[locale]}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                onAddToCart();
                setMobileConfiguratorOpen(false);
              }}
            >
              {content.commerce.addToBag}
            </Button>
          </div>
        ) : null}
        <button
          type="button"
          className="mobile-buy-bar__selection"
          onClick={() => setMobileConfiguratorOpen((current) => !current)}
          aria-expanded={mobileConfiguratorOpen}
        >
          <span className="mobile-buy-bar__image">
            <Image
              src={product.finishes[activeFinishId].packshot.thumbnailSrc}
              alt=""
              fill
              sizes="48px"
              unoptimized
              className="object-cover"
            />
          </span>
          <span>
            <p>{copy.name} · {getFinishLabel(activeFinishId, locale)}</p>
            <strong>{formattedPrice}</strong>
          </span>
          <ChevronUp className="size-4" aria-hidden="true" />
        </button>
        <Button onClick={buyNow} disabled={buyState.loading}>
          {content.commerce.buyNow}
        </Button>
      </div>
    </aside>
  );
}
