"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import BuyPanel from "@/components/buy-panel";
import { useCart } from "@/components/cart-provider";
import { useMarket } from "@/components/market-provider";
import ProjectionModal from "@/components/projection-modal";
import ProjectionStudio from "@/components/projection-studio";
import ResponsiveProductImage from "@/components/responsive-product-image";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  brandIdentity,
  finishIds,
  getFinishLabel,
  getFinishMedia,
  getFinishPriceCents,
  getLocalizedRoute,
  getMaterialDetail,
  getProductCopy,
  getSiteCopy,
  normalizeFinishForProduct,
  productList,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/rava-content";
import {
  formatMarketPriceFromEur,
  getMarket,
  getMarketAmountCentsFromEur,
} from "@/lib/markets";

type StorefrontExperienceProps = {
  locale: Locale;
  initialProductId: ProductId;
  initialFinishId: FinishId;
};

export default function StorefrontExperience({
  locale,
  initialProductId,
  initialFinishId,
}: StorefrontExperienceProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { marketCode } = useMarket();
  const [productId, setProductId] = useState(initialProductId);
  const [finishId, setFinishId] = useState(
    normalizeFinishForProduct(initialProductId, initialFinishId),
  );
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [projectionOpen, setProjectionOpen] = useState(false);

  const copy = getProductCopy(productId, locale);
  const siteCopy = getSiteCopy(locale);
  const heroMedia = getFinishMedia(productId, finishId).hero;
  const materialMedia = getMaterialDetail(finishId);
  const productNumber = String(productList.findIndex((item) => item.id === productId) + 1).padStart(2, "0");
  const storyFinishes = [
    finishId,
    ...finishIds.filter((candidate) => candidate !== finishId),
  ].slice(0, 3) as FinishId[];

  useEffect(() => {
    const canonicalPrice = getFinishPriceCents(productId, finishId) ?? 0;
    const market = getMarket(marketCode);

    trackCommerceEvent("view_item", {
      currency: market.currency,
      value: getMarketAmountCentsFromEur(canonicalPrice, marketCode) / 100,
      items: [{ item_id: productId, item_variant: finishId, quantity: 1 }],
    });
  }, [finishId, marketCode, productId]);

  function syncUrl(nextProduct: ProductId, nextFinish: FinishId) {
    startTransition(() =>
      router.replace(`${pathname}?product=${nextProduct}&finish=${nextFinish}`, {
        scroll: false,
      }),
    );
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
    trackCommerceEvent("select_item", {
      items: [{ item_id: productId, item_variant: normalized }],
    });
  }

  function addSelection() {
    const canonicalPrice = getFinishPriceCents(productId, finishId) ?? 0;
    const market = getMarket(marketCode);

    addItem({ productId, finishId, quantity });
    setCartMessage(
      locale === "fr" ? `${copy.name} ajouté au panier.` : `${copy.name} added to your bag.`,
    );
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
    setProjectionOpen(true);
    trackCommerceEvent("projection_open", {
      items: [{ item_id: productId, item_variant: finishId }],
    });
  }

  return (
    <main>
      <SiteHeader locale={locale} onProjectionOpen={openProjection} />

      <section className="campaign-hero">
        <div className="campaign-hero__visual" key={heroMedia.src}>
          <ResponsiveProductImage
            media={heroMedia}
            priority
            sizes="(max-width: 1023px) 100vw, 68vw"
            className="object-cover"
          />
          <div className="campaign-hero__shade" />
          <div className="campaign-hero__copy">
            <p className="eyebrow text-white/70">
              {brandIdentity.collectionLabels[locale]} · {productNumber}
            </p>
            <h1 className="campaign-hero__title">{siteCopy.signature}</h1>
            <p className="campaign-hero__line">{siteCopy.subline}</p>
          </div>
          <div className="campaign-hero__caption">
            <span>{copy.name}</span>
            <span>{getFinishLabel(finishId, locale)}</span>
          </div>
        </div>

        <div className="campaign-hero__commerce">
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
        </div>
      </section>

      <div className="promise-ribbon" aria-label={locale === "fr" ? "Services" : "Services"}>
        <span>{locale === "fr" ? "Dessiné en France" : "Designed in France"}</span>
        <span>{locale === "fr" ? "Fabriqué sur commande" : "Made to order"}</span>
        <span>{locale === "fr" ? "20 jours ouvrés" : "20 working days"}</span>
        <span>{locale === "fr" ? "Livraison internationale" : "International delivery"}</span>
      </div>

      <section id="collection" className="collection-chapter section-anchor">
        <div className="page-shell">
          <div className="chapter-heading">
            <p className="eyebrow">{brandIdentity.collectionLabels[locale]}</p>
            <h2 className="display-title">
              {locale === "fr"
                ? "Trois façons de laisser la pièce respirer."
                : "Three ways to let a room breathe."}
            </h2>
            <p>
              {locale === "fr"
                ? "Une forme haute, une ligne basse, une présence près du lit. Chacune accueille la vie sans interrompre l’espace."
                : "A tall form, a low line, a presence by the bed. Each holds daily life without interrupting the space."}
            </p>
          </div>

          <div className="editorial-collection">
            {productList.map((item, index) => {
              const itemCopy = getProductCopy(item.id, locale);
              const itemFinish = normalizeFinishForProduct(item.id, finishId);
              return (
                <article
                  key={item.id}
                  className="editorial-product"
                  data-active={item.id === productId}
                >
                  <button
                    type="button"
                    className="editorial-product__visual"
                    onClick={() => selectProduct(item.id)}
                    aria-label={`${locale === "fr" ? "Choisir" : "Choose"} ${itemCopy.name}`}
                  >
                    <ResponsiveProductImage
                      media={getFinishMedia(item.id, itemFinish).hero}
                      sizes="(max-width: 767px) 92vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <span className="editorial-product__number">0{index + 1}</span>
                    <span className="editorial-product__choose">
                      {locale === "fr" ? "Choisir" : "Choose"} <ArrowRight className="size-4" />
                    </span>
                  </button>
                  <div className="editorial-product__copy">
                    <div>
                      <h3>{itemCopy.name}</h3>
                      <p>{itemCopy.shortStatement}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {locale === "fr" ? "Dès " : "From "}
                        {formatMarketPriceFromEur(
                          getFinishPriceCents(item.id, "chalk") ?? 0,
                          marketCode,
                          locale,
                        )}
                      </p>
                      <Link href={`${getLocalizedRoute(item.id, locale)}?finish=${itemFinish}`}>
                        {locale === "fr" ? "Découvrir la pièce" : "Discover the piece"}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="story" className="life-chapter">
        <div className="life-chapter__lead">
          <p className="eyebrow text-white/60">{locale === "fr" ? "Une forme, plusieurs vies" : "One form, many lives"}</p>
          <h2 className="display-title">
            {locale === "fr"
              ? "Les objets changent. La lumière reste."
              : "The objects change. The light remains."}
          </h2>
          <p>
            {locale === "fr"
              ? "Un livre posé le soir, des fleurs le dimanche, un passage entre deux pièces. Le meuble devient le cadre discret de ce qui compte."
              : "A book left at night, Sunday flowers, a passage between two rooms. The piece becomes a quiet frame for what matters."}
          </p>
        </div>

        <div className="life-gallery">
          {storyFinishes.map((storyFinish, index) => (
            <figure key={`${productId}-${storyFinish}`} className="life-gallery__frame">
              <ResponsiveProductImage
                media={getFinishMedia(productId, storyFinish).hero}
                sizes={index === 0 ? "(max-width: 1023px) 100vw, 62vw" : "(max-width: 1023px) 100vw, 38vw"}
                className="object-cover"
              />
              <figcaption>
                <span>{getFinishLabel(storyFinish, locale)}</span>
                <span>
                  {index === 0
                    ? copy.statement
                    : locale === "fr"
                      ? "La même silhouette, une autre atmosphère."
                      : "The same silhouette, another atmosphere."}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="craft-chapter">
        <div className="craft-chapter__image">
          <Image
            src={materialMedia.src}
            alt={materialMedia.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="craft-chapter__content">
          <p className="eyebrow">{locale === "fr" ? "Matière, service, confiance" : "Material, service, confidence"}</p>
          <h2 className="display-title">
            {locale === "fr" ? "Une présence douce. Une décision simple." : "A soft presence. A simple decision."}
          </h2>
          <p className="craft-chapter__intro">
            {locale === "fr"
              ? "Surface minérale mate, bords adoucis, dos ouvert. Chaque pièce est produite pour vous, puis accompagnée jusqu’à son arrivée."
              : "A matte mineral surface, softened edges, an open back. Each piece is produced for you, then followed through to arrival."}
          </p>
          <div className="service-list">
            <div>
              <span>01</span>
              <p>{locale === "fr" ? "Choisissez la forme et la finition." : "Choose the form and finish."}</p>
            </div>
            <div>
              <span>02</span>
              <p>{locale === "fr" ? "Visualisez-la chez vous si vous le souhaitez." : "View it in your room if you wish."}</p>
            </div>
            <div>
              <span>03</span>
              <p>{locale === "fr" ? "Payez en ligne. Nous organisons la suite." : "Pay online. We arrange everything that follows."}</p>
            </div>
          </div>
          <div className="craft-chapter__actions">
            <button type="button" onClick={openProjection}>
              {locale === "fr" ? "Voir dans votre pièce" : "View in your room"} <MoveRight className="size-4" />
            </button>
            <Link href={locale === "fr" ? "/fr/fiche-technique" : "/technical-sheet"}>
              {locale === "fr" ? "Lire la fiche technique" : "Read the technical sheet"}
            </Link>
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
            ? "Votre photo, votre emplacement, une projection cohérente."
            : "Your photograph, your placement, one coherent projection."
        }
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
          }}
        />
      </ProjectionModal>
    </main>
  );
}
