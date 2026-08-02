"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import BuyPanel from "@/components/buy-panel";
import { useCart } from "@/components/cart-provider";
import ProjectionModal from "@/components/projection-modal";
import type { ProjectionRuntimeState } from "@/components/projection-modal";
import ProjectionStudio from "@/components/projection-studio";
import ResponsiveProductImage from "@/components/responsive-product-image";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { useTechnicalSheet } from "@/components/technical-sheet-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import skipStyles from "@/components/skip-link.module.css";
import { getContent } from "@/content";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  getFinishPriceCents,
  getLocalizedRoute,
  getProductById,
  getProductCopy,
  getProductGallery,
  getSiteCopy,
  getStartingPrice,
  normalizeFinishForProduct,
  productList,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";

type ProductPageComponentProps = {
  locale: Locale;
  productId: ProductId;
  initialFinishId: FinishId;
};

export default function ProductPage({
  locale,
  productId,
  initialFinishId,
}: ProductPageComponentProps) {
  const pathname = usePathname();
  const { addItem, openCart } = useCart();
  const { openTechnicalSheet } = useTechnicalSheet();
  const content = getContent(locale);
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const siteCopy = getSiteCopy(locale);
  const [finishId, setFinishId] = useState(normalizeFinishForProduct(productId, initialFinishId));
  const [quantity, setQuantity] = useState(1);
  const [projectionOpen, setProjectionOpen] = useState(false);
  const [projectionActive, setProjectionActive] = useState(false);
  const [projectionRuntime, setProjectionRuntime] =
    useState<ProjectionRuntimeState>({
      phase: "idle",
      progress: 0,
      label: "",
      thumbnail: null,
    });
  const [zoomOpen, setZoomOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const detailsRef = useRef<HTMLElement | null>(null);
  const commerceGallery = getProductGallery(productId, finishId, locale)
    .filter((item) => item.kind === "hero" || item.kind === "packshot" || item.kind === "scene")
    .slice(0, 5);
  const [activeMediaId, setActiveMediaId] = useState(commerceGallery[0].id);
  const activeMedia =
    commerceGallery.find((item) => item.id === activeMediaId) ?? commerceGallery[0];

  useEffect(() => {
    trackCommerceEvent("view_item", {
      currency: "EUR",
      value: (getFinishPriceCents(productId, finishId) ?? 0) / 100,
      items: [{ item_id: productId, item_variant: finishId, quantity: 1 }],
    });
  }, [finishId, productId]);

  useEffect(() => {
    trackCommerceEvent("gallery_image_view", {
      item_id: productId,
      item_variant: finishId,
      media_id: activeMedia.id,
      media_kind: activeMedia.kind,
    });
  }, [activeMedia.id, activeMedia.kind, finishId, productId]);

  useEffect(() => {
    const node = detailsRef.current;
    if (!node) return;

    let tracked = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked) {
          tracked = true;
          trackCommerceEvent("dimensions_open", {
            item_id: productId,
            item_variant: finishId,
            method: "section_view",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [finishId, productId]);

  function selectFinish(next: FinishId) {
    const normalized = normalizeFinishForProduct(productId, next);
    trackCommerceEvent("select_finish", {
      items: [{ item_id: productId, item_variant: normalized }],
    });
    setFinishId(normalized);
    setActiveMediaId(`${productId}-${normalized}-context`);
    setCartMessage(null);
    const params = new URLSearchParams(window.location.search);
    params.set("finish", normalized);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }

  function addSelection() {
    addItem({ productId, finishId, quantity });
    trackCommerceEvent("add_to_cart", {
      currency: "EUR",
      value: ((getFinishPriceCents(productId, finishId) ?? 0) * quantity) / 100,
      items: [{ item_id: productId, item_variant: finishId, quantity }],
    });
    setCartMessage(`${copy.name} · ${content.commerce.added}`);
    openCart();
  }

  function openProjection() {
    trackCommerceEvent("projection_open", {
      items: [{ item_id: productId, item_variant: finishId }],
    });
    setProjectionActive(true);
    setProjectionOpen(true);
  }

  const updateProjectionRuntime = useCallback(
    (runtime: ProjectionRuntimeState) => setProjectionRuntime(runtime),
    [],
  );

  const storyMedia = product.storefrontStoryMedia[finishId];
  const proofMedia = product.openBackProof ?? product.depthProof;
  const secondaryProofMedia =
    product.geometryStatus === "approved" ? product.technicalPlate : product.scaleProof;
  const related = productList.filter((item) => item.id !== productId);
  const projectHref = `${
    locale === "fr" ? "/fr/contact" : "/contact"
  }?kind=project&product=${productId}&finish=${finishId}`;

  return (
    <>
      <a className={skipStyles.skipLink} href="#main-content">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} onProjectionOpen={openProjection} />

      <main id="main-content" tabIndex={-1}>
      <section className="product-commerce">
        <div className="product-gallery">
          <div className="product-gallery__stage">
            <ResponsiveProductImage
              media={activeMedia.media}
              priority
              sizes="(max-width: 1023px) 100vw, 68vw"
              className={
                activeMedia.kind === "packshot"
                  ? "object-contain product-gallery__product-view"
                  : "object-cover"
              }
            />
            <button
              type="button"
              className="product-gallery__zoom"
              onClick={() => {
                setZoomOpen(true);
                trackCommerceEvent("zoom_open", {
                  item_id: productId,
                  item_variant: finishId,
                  media_id: activeMedia.id,
                });
              }}
              aria-label={
                locale === "fr" ? "Agrandir l’image" : "Enlarge image"
              }
            >
              <Maximize2 aria-hidden="true" />
            </button>
          </div>
          <div className="product-gallery__label" aria-live="polite">
            <strong>{activeMedia.label}</strong>
            <span>{activeMedia.caption}</span>
          </div>
          <div className="product-gallery__thumbs">
            {commerceGallery.map((item) => (
              <button
                key={item.id}
                type="button"
                data-active={item.id === activeMedia.id}
                onClick={() => setActiveMediaId(item.id)}
                aria-label={item.label}
              >
                <Image
                  src={item.media.thumbnailSrc}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized
                  className={item.kind === "packshot" ? "object-contain" : "object-cover"}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="product-commerce__buy">
          <BuyPanel
            locale={locale}
            productId={productId}
            finishId={finishId}
            quantity={quantity}
            onFinishChange={selectFinish}
            onQuantityChange={setQuantity}
            onAddToCart={addSelection}
            onProjectionOpen={openProjection}
            cartMessage={cartMessage}
            headingLevel={1}
          />
        </div>
      </section>

      <section className="product-story">
        <div className="page-shell">
          <div className="product-story__heading">
            <div>
              <p className="eyebrow">{copy.descriptor}</p>
              <h2 className="display-title">{copy.galleryHeading}</h2>
            </div>
            <p>{copy.story}</p>
          </div>
          <div className="product-story__gallery">
            <figure>
              <ResponsiveProductImage
                media={storyMedia}
                sizes="(max-width: 1023px) 100vw, 64vw"
                className="object-cover"
              />
              <figcaption>{copy.shortStatement}</figcaption>
            </figure>
            <aside>
              <figure>
                <ResponsiveProductImage
                  media={proofMedia}
                  sizes="(max-width: 1023px) 50vw, 32vw"
                  className="object-contain"
                />
                <figcaption>
                  {product.openBackProof
                    ? copy.openBackCaption
                    : copy.scaleCaption}
                </figcaption>
              </figure>
              <figure>
                <ResponsiveProductImage
                  media={secondaryProofMedia}
                  sizes="(max-width: 1023px) 50vw, 32vw"
                  className="object-contain"
                />
                <figcaption>
                  {product.geometryStatus === "approved"
                    ? content.service.technicalBody
                    : copy.scaleCaption}
                </figcaption>
              </figure>
            </aside>
          </div>
        </div>
      </section>

      <section className="product-details" ref={detailsRef}>
        <div className="product-details__copy">
          <p className="eyebrow text-white/45">{copy.heroEyebrow}</p>
          <h2 className="display-title">{copy.statement}</h2>
          <p>{copy.serviceLine}</p>
          <div className="product-detail-list">
            <div>
              <span>{content.common.dimensionsAndMaterial}</span>
              <strong>{product.dimensionsLabel ?? copy.detailLines.at(-1)}</strong>
            </div>
            <div><span>{content.glossary.openBacked.term}</span><strong>{copy.openBackCaption}</strong></div>
            <div><span>{content.common.production}</span><strong>{siteCopy.fabricationDelay}</strong></div>
            <div><span>{content.common.delivery}</span><strong>{siteCopy.deliveryLine}</strong></div>
          </div>
          <div className="product-action-links">
            <button
              type="button"
              onClick={() => openTechnicalSheet(productId)}
            >
              {content.common.technicalSheet}
            </button>
            <Link
              href={projectHref}
              onClick={() =>
                trackCommerceEvent("project_request", {
                  item_id: productId,
                  item_variant: finishId,
                  stage: "opened",
                })
              }
            >
              {content.common.speakToStudio}
            </Link>
          </div>
        </div>
        <div className="related-products">
          <p className="eyebrow text-white/45">{content.home.collectionEyebrow}</p>
          <h3 className="related-products__title display-title">
            {content.common.relatedProducts}
          </h3>
          <div className="related-products__grid">
            {related.map((item) => {
              const itemCopy = getProductCopy(item.id, locale);
              return (
                <Link key={item.id} href={getLocalizedRoute(item.id, locale)}>
                  <div>
                    <ResponsiveProductImage
                      media={item.storefrontCardMedia}
                      sizes="(max-width: 767px) 46vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <p>{itemCopy.name}</p>
                  <p>{getStartingPrice(item.id, locale)}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      </main>
      <SiteFooter locale={locale} />
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent
          className="product-zoom-dialog"
          aria-describedby="product-zoom-description"
        >
          <DialogTitle className="sr-only">{activeMedia.label}</DialogTitle>
          <DialogDescription id="product-zoom-description" className="sr-only">
            {activeMedia.caption}
          </DialogDescription>
          <ResponsiveProductImage
            media={activeMedia.media}
            sizes="100vw"
            className={
              activeMedia.kind === "packshot" ? "object-contain" : "object-cover"
            }
          />
        </DialogContent>
      </Dialog>
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
