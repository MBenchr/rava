"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import BuyPanel from "@/components/buy-panel";
import { useCart } from "@/components/cart-provider";
import ProjectionModal from "@/components/projection-modal";
import ProjectionStudio from "@/components/projection-studio";
import ResponsiveProductImage from "@/components/responsive-product-image";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  getFinishMedia,
  getFinishPriceCents,
  getLocalizedRoute,
  getMaterialDetail,
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
} from "@/lib/rava-content";

type ProductPageProps = {
  locale: Locale;
  productId: ProductId;
  initialFinishId: FinishId;
};

export default function ProductPage({ locale, productId, initialFinishId }: ProductPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const siteCopy = getSiteCopy(locale);
  const [finishId, setFinishId] = useState(normalizeFinishForProduct(productId, initialFinishId));
  const [quantity, setQuantity] = useState(1);
  const [projectionOpen, setProjectionOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const gallery = getProductGallery(productId, finishId, locale);
  const [activeMediaId, setActiveMediaId] = useState(gallery[0].id);
  const activeMedia = gallery.find((item) => item.id === activeMediaId) ?? gallery[0];

  useEffect(() => {
    trackCommerceEvent("view_item", {
      currency: "EUR",
      value: (getFinishPriceCents(productId, finishId) ?? 0) / 100,
      items: [{ item_id: productId, item_variant: finishId, quantity: 1 }],
    });
  }, [finishId, productId]);

  function selectFinish(next: FinishId) {
    const normalized = normalizeFinishForProduct(productId, next);
    trackCommerceEvent("select_item", {
      items: [{ item_id: productId, item_variant: normalized }],
    });
    setFinishId(normalized);
    setActiveMediaId(`${productId}-${normalized}-context`);
    setCartMessage(null);
    startTransition(() => router.replace(`${pathname}?finish=${normalized}`, { scroll: false }));
  }

  function addSelection() {
    addItem({ productId, finishId, quantity });
    trackCommerceEvent("add_to_cart", {
      currency: "EUR",
      value: ((getFinishPriceCents(productId, finishId) ?? 0) * quantity) / 100,
      items: [{ item_id: productId, item_variant: finishId, quantity }],
    });
    setCartMessage(locale === "fr" ? `${copy.name} ajouté au panier.` : `${copy.name} added to your bag.`);
    openCart();
  }

  function openProjection() {
    trackCommerceEvent("projection_open", {
      items: [{ item_id: productId, item_variant: finishId }],
    });
    setProjectionOpen(true);
  }

  const contextMedia = getFinishMedia(productId, finishId).hero;
  const materialMedia = getMaterialDetail(finishId);
  const related = productList.filter((item) => item.id !== productId);

  return (
    <main>
      <SiteHeader locale={locale} onProjectionOpen={openProjection} />

      <section className="product-commerce">
        <div className="product-gallery">
          <div className="product-gallery__stage" key={activeMedia.media.src}>
            <ResponsiveProductImage
              media={activeMedia.media}
              priority
              sizes="(max-width: 1023px) 100vw, 68vw"
              className="object-cover"
            />
          </div>
          <div className="product-gallery__label">{activeMedia.label}</div>
          <div className="product-gallery__thumbs">
            {gallery.map((item) => (
              <button
                key={item.id}
                type="button"
                data-active={item.id === activeMedia.id}
                onClick={() => setActiveMediaId(item.id)}
                aria-label={item.label}
              >
                <Image src={item.media.src} alt="" fill sizes="80px" className="object-cover" />
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
                media={contextMedia}
                sizes="(max-width: 1023px) 100vw, 64vw"
                className="object-cover"
              />
              <figcaption>{copy.shortStatement}</figcaption>
            </figure>
            <aside>
              <figure>
                <Image
                  src={product.openBack.src}
                  alt={product.openBack.alt}
                  fill
                  sizes="(max-width: 1023px) 50vw, 32vw"
                  className="object-cover"
                />
                <figcaption>
                  {locale === "fr" ? "Ouvert, quel que soit le point de vue." : "Open, from every point of view."}
                </figcaption>
              </figure>
              <figure>
                <Image
                  src={materialMedia.src}
                  alt={materialMedia.alt}
                  fill
                  sizes="(max-width: 1023px) 50vw, 32vw"
                  className="object-cover"
                />
                <figcaption>{siteCopy.originCopy}</figcaption>
              </figure>
            </aside>
          </div>
        </div>
      </section>

      <section className="product-details">
        <div className="product-details__copy">
          <p className="eyebrow text-white/45">{locale === "fr" ? "La pièce, précisément" : "The piece, precisely"}</p>
          <h2 className="display-title">{copy.statement}</h2>
          <p>
            {locale === "fr"
              ? "Une géométrie stable, une surface minérale mate et une fabrication lancée pour chaque commande."
              : "A stable geometry, a matte mineral surface and production started for each order."}
          </p>
          <div className="product-detail-list">
            <div><span>{locale === "fr" ? "Dimensions" : "Dimensions"}</span><strong>{product.dimensionsLabel ?? "—"}</strong></div>
            <div><span>{locale === "fr" ? "Structure" : "Structure"}</span><strong>{locale === "fr" ? "Ouverte des deux côtés" : "Open on both sides"}</strong></div>
            <div><span>{locale === "fr" ? "Fabrication" : "Production"}</span><strong>{siteCopy.fabricationDelay}</strong></div>
            <div><span>{locale === "fr" ? "Livraison" : "Delivery"}</span><strong>{siteCopy.deliveryLine}</strong></div>
          </div>
        </div>
        <div className="related-products">
          <p className="eyebrow text-white/45">{locale === "fr" ? "Compléter la collection" : "Continue the collection"}</p>
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

      <SiteFooter locale={locale} />
      <ProjectionModal
        open={projectionOpen}
        onClose={() => setProjectionOpen(false)}
        title={locale === "fr" ? `Voir ${copy.name} chez vous` : `View ${copy.name} in your room`}
        subtitle={
          locale === "fr"
            ? "Ajoutez une photo, placez la forme et comparez."
            : "Add a photograph, place the form and compare."
        }
      >
        <ProjectionStudio
          locale={locale}
          productId={productId}
          finishId={finishId}
          onFinishChange={selectFinish}
          onUseForRequest={() => {
            addSelection();
            setProjectionOpen(false);
          }}
        />
      </ProjectionModal>
    </main>
  );
}
