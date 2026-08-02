"use client";

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import BuyPanel from "@/components/buy-panel";
import { useCart } from "@/components/cart-provider";
import { useMarket } from "@/components/market-provider";
import ProjectionModal from "@/components/projection-modal";
import type { ProjectionRuntimeState } from "@/components/projection-modal";
import ProjectionStudio from "@/components/projection-studio";
import ResponsiveProductImage from "@/components/responsive-product-image";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { useTechnicalSheet } from "@/components/technical-sheet-provider";
import skipStyles from "@/components/skip-link.module.css";
import { getContent } from "@/content";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  preloadProductMedia,
} from "@/lib/image-preload";
import {
  brandIdentity,
  getFinishLabel,
  getFinishMedia,
  getFinishPriceCents,
  getLocalizedRoute,
  getProductCopy,
  normalizeFinishForProduct,
  productList,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";
import {
  formatMarketPriceFromEur,
  getMarket,
  getMarketAmountCentsFromEur,
} from "@/lib/markets";

type StorefrontProps = {
  locale: Locale;
  initialProductId: ProductId;
  initialFinishId: FinishId;
};

export default function StorefrontExperience({
  locale,
  initialProductId,
  initialFinishId,
}: StorefrontProps) {
  const pathname = usePathname();
  const { addItem, openCart } = useCart();
  const { marketCode } = useMarket();
  const { openTechnicalSheet } = useTechnicalSheet();
  const content = getContent(locale);
  const [productId, setProductId] = useState(initialProductId);
  const [finishId, setFinishId] = useState(
    normalizeFinishForProduct(initialProductId, initialFinishId),
  );
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [projectionOpen, setProjectionOpen] = useState(false);
  const [projectionActive, setProjectionActive] = useState(false);
  const [projectionRuntime, setProjectionRuntime] =
    useState<ProjectionRuntimeState>({
      phase: "idle",
      progress: 0,
      label: "",
      thumbnail: null,
    });

  const copy = getProductCopy(productId, locale);
  const activeProduct =
    productList.find((product) => product.id === productId) ?? productList[0];
  const heroMedia = getFinishMedia(productId, finishId).hero;
  const packshotMedia = getFinishMedia(productId, finishId).packshot;
  const productNumber = String(productList.findIndex((item) => item.id === productId) + 1).padStart(2, "0");

  useEffect(() => {
    const canonicalPrice = getFinishPriceCents(productId, finishId) ?? 0;
    const market = getMarket(marketCode);

    trackCommerceEvent("view_item", {
      currency: market.currency,
      value: getMarketAmountCentsFromEur(canonicalPrice, marketCode) / 100,
      items: [{ item_id: productId, item_variant: finishId, quantity: 1 }],
    });
    trackCommerceEvent("hero_view", {
      locale,
      items: [{ item_id: productId, item_variant: finishId }],
    });
  }, [finishId, locale, marketCode, productId]);

  useEffect(() => {
    trackCommerceEvent("view_item_list", {
      item_list_id: "taqa-collection",
      locale,
      items: productList.map((item, index) => ({
        item_id: item.id,
        index,
      })),
    });
  }, [locale]);

  function syncUrl(nextProduct: ProductId, nextFinish: FinishId) {
    const params = new URLSearchParams(window.location.search);
    params.set("product", nextProduct);
    params.set("finish", nextFinish);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }

  function selectProduct(nextProduct: ProductId) {
    const nextFinish = normalizeFinishForProduct(nextProduct, finishId);
    setProductId(nextProduct);
    setFinishId(nextFinish);
    setQuantity(1);
    setCartMessage(null);
    syncUrl(nextProduct, nextFinish);
    trackCommerceEvent("select_item", {
      items: [{ item_id: nextProduct, item_variant: nextFinish }],
    });
  }

  function selectFinish(nextFinish: FinishId) {
    const normalized = normalizeFinishForProduct(productId, nextFinish);
    setFinishId(normalized);
    setCartMessage(null);
    syncUrl(productId, normalized);
    trackCommerceEvent("select_finish", {
      items: [{ item_id: productId, item_variant: normalized }],
    });
  }

  function addSelection() {
    const canonicalPrice = getFinishPriceCents(productId, finishId) ?? 0;
    const market = getMarket(marketCode);

    addItem({ productId, finishId, quantity });
    setCartMessage(`${copy.name} · ${content.commerce.added}`);
    openCart();
    trackCommerceEvent("add_to_cart", {
      currency: market.currency,
      value:
        (getMarketAmountCentsFromEur(canonicalPrice, marketCode) * quantity) /
        100,
      items: [{ item_id: productId, item_variant: finishId, quantity }],
    });
  }

  function openProjection() {
    setProjectionActive(true);
    setProjectionOpen(true);
    trackCommerceEvent("projection_open", {
      items: [{ item_id: productId, item_variant: finishId }],
    });
  }

  const updateProjectionRuntime = useCallback(
    (runtime: ProjectionRuntimeState) => setProjectionRuntime(runtime),
    [],
  );

  return (
    <>
      <a className={skipStyles.skipLink} href="#main-content">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} onProjectionOpen={openProjection} />

      <main id="main-content" tabIndex={-1}>
      <section className="storefront-fold" aria-labelledby="storefront-title">
        <div className="storefront-fold__visual">
          <ResponsiveProductImage
            media={heroMedia}
            priority
            sizes="(max-width: 1023px) 100vw, 66vw"
            className="object-cover storefront-fold__hero-image"
          />
          <div className="storefront-fold__shade" />
          <div className="storefront-fold__copy">
            <p className="eyebrow text-white/70">
              {brandIdentity.collectionLabels[locale]} · {productNumber}
            </p>
            <h1 id="storefront-title" className="storefront-fold__title">
              {content.home.heroTitle}
            </h1>
            <p className="storefront-fold__line">{content.home.heroBody}</p>
          </div>
          <div className="storefront-fold__caption">
            <span>{copy.name}</span>
            <span>{getFinishLabel(finishId, locale)}</span>
          </div>
          <div className="storefront-fold__packshot" aria-hidden="true">
            <div>
              <ResponsiveProductImage
                media={packshotMedia}
                sizes="(max-width: 767px) 26vw, 10rem"
                className="object-contain"
              />
            </div>
            <p>
              <span>{copy.name}</span>
              <span>{getFinishLabel(finishId, locale)}</span>
            </p>
          </div>
        </div>

        <div className="storefront-fold__commerce">
          <BuyPanel
            locale={locale}
            productId={productId}
            finishId={finishId}
            quantity={quantity}
            onProductChange={selectProduct}
            onFinishChange={selectFinish}
            onQuantityChange={setQuantity}
            onAddToCart={addSelection}
            onProjectionOpen={openProjection}
            cartMessage={cartMessage}
            showProductLink
            showProductSwitch
          />
          <div className="storefront-fold__trust" aria-label={content.common.service}>
            <span>{content.brand.origin}</span>
            <span>{content.commerce.productionEstimate}</span>
            <span>{content.commerce.deliveryCalculated}</span>
          </div>
        </div>
      </section>

      <section id="collection" className="storefront-collection section-anchor">
        <div className="page-shell">
          <div className="storefront-heading">
            <p className="eyebrow">{content.home.collectionEyebrow}</p>
            <h2 className="display-title">{content.home.collectionTitle}</h2>
            <p>{content.home.collectionBody}</p>
          </div>

          <div className="collection-switcher">
            {productList.map((item, index) => {
              const itemCopy = getProductCopy(item.id, locale);
              const itemFinish = normalizeFinishForProduct(item.id, finishId);
              return (
                <article
                  key={item.id}
                  className="collection-switch-card"
                  data-active={item.id === productId}
                >
                  <button
                    type="button"
                    className="collection-switch-card__visual"
                    onClick={() => selectProduct(item.id)}
                    onFocus={() => void preloadProductMedia(item.id, itemFinish)}
                    onPointerEnter={() => void preloadProductMedia(item.id, itemFinish)}
                    onPointerDown={() => void preloadProductMedia(item.id, itemFinish)}
                    aria-label={`${content.common.choose} ${itemCopy.name}`}
                  >
                    <ResponsiveProductImage
                      media={getFinishMedia(item.id, itemFinish).hero}
                      sizes="(max-width: 767px) 86vw, 33vw"
                      className="object-cover"
                    />
                    <span className="collection-switch-card__number">0{index + 1}</span>
                    <span className="collection-switch-card__packshot">
                      <ResponsiveProductImage
                        media={getFinishMedia(item.id, itemFinish).packshot}
                        sizes="(max-width: 767px) 22vw, 8rem"
                        className="object-contain"
                      />
                    </span>
                    <span className="collection-switch-card__choose">
                      {content.common.choose} <ArrowRight className="size-4" />
                    </span>
                  </button>
                  <div className="collection-switch-card__copy">
                    <div>
                      <h3>{itemCopy.name}</h3>
                      <p>{itemCopy.shortStatement}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {content.commerce.from}{" "}
                        {formatMarketPriceFromEur(
                          getFinishPriceCents(item.id, "chalk") ?? 0,
                          marketCode,
                          locale,
                        )}
                      </p>
                      <Link href={`${getLocalizedRoute(item.id, locale)}?finish=${itemFinish}`}>
                        {content.common.discoverPiece}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="story" className="storefront-story section-anchor">
        <div className="page-shell storefront-story__heading">
          <p className="eyebrow">{content.home.storyEyebrow}</p>
          <h2 className="display-title">{content.home.storyTitle}</h2>
          <p>{content.home.storyBody}</p>
        </div>

        <div className="storefront-story__strip">
          {productList.map((item) => {
            const itemCopy = getProductCopy(item.id, locale);
            const itemFinish = normalizeFinishForProduct(item.id, finishId);
            return (
              <figure key={item.id} className="storefront-story__frame">
                <ResponsiveProductImage
                  media={item.storefrontStoryMedia[itemFinish]}
                  sizes="(max-width: 767px) 88vw, 34vw"
                  className="object-cover"
                />
                <figcaption>
                  <span>{itemCopy.name}</span>
                  <span>{itemCopy.statement}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <section className="storefront-proof">
        <div className="storefront-proof__media">
          <figure className="storefront-proof__primary">
            <ResponsiveProductImage
              media={activeProduct.depthProof}
              sizes="(max-width: 1023px) 72vw, 36vw"
              className="object-contain"
            />
            <figcaption>{copy.scaleCaption}</figcaption>
          </figure>
          <div className="storefront-proof__side">
            {activeProduct.openBackProof ? (
              <figure className="storefront-proof__open-back">
                <ResponsiveProductImage
                  media={activeProduct.openBackProof}
                  sizes="(max-width: 767px) 38vw, 14vw"
                  className="object-contain"
                />
                <figcaption>{copy.openBackCaption}</figcaption>
              </figure>
            ) : null}
            <figure className="storefront-proof__technical">
              <ResponsiveProductImage
                media={activeProduct.technicalPlate}
                sizes="(max-width: 767px) 38vw, 14vw"
                className="object-contain"
              />
            </figure>
          </div>
        </div>
        <div className="storefront-proof__content">
          <p className="eyebrow">{content.home.serviceEyebrow}</p>
          <h2 className="display-title">{content.home.serviceTitle}</h2>
          <p className="storefront-proof__intro">{content.home.serviceBody}</p>
          <div className="service-list">
            <div>
              <span>01</span>
              <p>{content.service.technicalBody}</p>
            </div>
            <div>
              <span>02</span>
              <p>{content.service.productionBody}</p>
            </div>
            <div>
              <span>03</span>
              <p>{content.service.deliveryBody}</p>
            </div>
          </div>
          <div className="storefront-proof__actions">
            <button type="button" onClick={openProjection}>
              {content.home.viewAtHome} <MoveRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => openTechnicalSheet(productId)}
            >
              {content.common.technicalSheet}
            </button>
            <Link href={getLocalizedRoute(productId, locale)}>
              {content.common.viewAllDetails}
            </Link>
          </div>
        </div>
      </section>

      </main>
      <SiteFooter locale={locale} />
      <ProjectionModal
        active={projectionActive}
        open={projectionOpen}
        onExpand={() => setProjectionOpen(true)}
        onMinimize={() => setProjectionOpen(false)}
        onDismiss={() => {
          setProjectionOpen(false);
          setProjectionActive(false);
        }}
        title={`${content.projection.title} · ${copy.name}`}
        subtitle={content.projection.subtitle}
        runtime={projectionRuntime}
        locale={locale}
      >
        <ProjectionStudio
          locale={locale}
          productId={productId}
          finishId={finishId}
          onProductChange={selectProduct}
          onFinishChange={selectFinish}
          onUseForRequest={() => {
            addSelection();
            setProjectionOpen(false);
            setProjectionActive(false);
          }}
          onRuntimeChange={updateProjectionRuntime}
        />
      </ProjectionModal>
    </>
  );
}
