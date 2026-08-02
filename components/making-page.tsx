import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import ResponsiveProductImage from "@/components/responsive-product-image";
import SiteShell from "@/components/site-shell";
import {
  getLocalizedRoute,
  getProductCopy,
  productList,
  type Locale,
} from "@/lib/isandre/catalog";
import { preproductionMedia } from "@/lib/isandre/preproduction-media";

const copy = {
  en: {
    eyebrow: "FORM AND PROCESS",
    title: "One form. Made as one.",
    lead:
      "ṬĀQA is conceived as a continuous open-backed shell. Its openings, depth and radii belong to one architecture, made without added panels.",
    mouldEyebrow: "01 · THE FORM",
    mouldTitle: "The mould holds the whole architecture.",
    mouldBody:
      "Every opening and radius is resolved before material enters the mould. The same proportions remain fixed across all four finishes.",
    colourEyebrow: "02 · SURFACE AND LIGHT",
    colourTitle: "The finish belongs to the room.",
    colourBody:
      "Edges are refined, geometry inspected and colour read under changing light. The result is tactile, low-sheen and made for daily life.",
    roomEyebrow: "03 · IN THE ROOM",
    roomTitle: "The room remains open.",
    roomBody:
      "Each form holds objects, marks a threshold and preserves the view beyond it.",
    productCta: "Discover the piece",
  },
  fr: {
    eyebrow: "FORME ET PROCÉDÉ",
    title: "Une forme. Faite d’un seul tenant.",
    lead:
      "ṬĀQA est pensée comme une coque continue et traversante. Ses ouvertures, sa profondeur et ses rayons composent une seule architecture, sans panneau rapporté.",
    mouldEyebrow: "01 · LA FORME",
    mouldTitle: "Le moule contient toute l’architecture.",
    mouldBody:
      "Chaque ouverture et chaque rayon sont résolus avant l’entrée de la matière. Les mêmes proportions restent fixes dans les quatre finitions.",
    colourEyebrow: "02 · SURFACE ET LUMIÈRE",
    colourTitle: "La finition appartient à la pièce.",
    colourBody:
      "Les arêtes sont affinées, la géométrie contrôlée et la couleur relue sous plusieurs lumières. La surface reste tactile, mate et faite pour la vie quotidienne.",
    roomEyebrow: "03 · DANS LA PIÈCE",
    roomTitle: "La pièce reste ouverte.",
    roomBody:
      "Chaque forme accueille les objets, marque un seuil et préserve le regard vers ce qui se trouve derrière.",
    productCta: "Découvrir la pièce",
  },
} as const;

function WorkshopImage({
  assetId,
  locale,
  className,
  priority = false,
  sizes,
}: {
  assetId: keyof typeof preproductionMedia;
  locale: Locale;
  className?: string;
  priority?: boolean;
  sizes: string;
}) {
  const asset = preproductionMedia[assetId];

  return (
    <figure className={className}>
      <div className="making-media">
        <ResponsiveProductImage
          media={asset.media[locale]}
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
      <figcaption>{asset.caption[locale]}</figcaption>
    </figure>
  );
}

export default function MakingPage({ locale }: { locale: Locale }) {
  const pageCopy = copy[locale];

  return (
    <SiteShell
      locale={locale}
      alternateLocaleHref={locale === "en" ? "/fr/fabrication" : "/making"}
    >
      <main className="making-page">
        <section className="making-hero">
          <ResponsiveProductImage
            media={preproductionMedia.W02.media[locale]}
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="making-hero__veil" />
          <div className="page-shell making-hero__content">
            <p className="eyebrow">{pageCopy.eyebrow}</p>
            <h1 className="display-title">{pageCopy.title}</h1>
            <p>{pageCopy.lead}</p>
          </div>
        </section>

        <section className="making-chapter making-chapter--mould">
          <div className="page-shell making-chapter__heading">
            <p className="eyebrow">{pageCopy.mouldEyebrow}</p>
            <h2 className="display-title">{pageCopy.mouldTitle}</h2>
            <p>{pageCopy.mouldBody}</p>
          </div>
          <WorkshopImage
            assetId="W01"
            locale={locale}
            className="making-frame making-frame--wide"
            sizes="100vw"
          />
        </section>

        <section className="page-shell making-chapter making-chapter--colour">
          <div className="making-chapter__heading making-chapter__heading--split">
            <div>
              <p className="eyebrow">{pageCopy.colourEyebrow}</p>
              <h2 className="display-title">{pageCopy.colourTitle}</h2>
            </div>
            <p>{pageCopy.colourBody}</p>
          </div>
          <div className="making-colour-grid">
            <WorkshopImage
              assetId="W04"
              locale={locale}
              className="making-frame making-frame--portrait"
              sizes="(max-width: 767px) 100vw, 42vw"
            />
            <WorkshopImage
              assetId="W03"
              locale={locale}
              className="making-frame making-frame--portrait"
              sizes="(max-width: 767px) 100vw, 42vw"
            />
          </div>
        </section>

        <section className="making-room">
          <div className="page-shell making-room__heading">
            <p className="eyebrow">{pageCopy.roomEyebrow}</p>
            <h2 className="display-title">{pageCopy.roomTitle}</h2>
            <p>{pageCopy.roomBody}</p>
          </div>
          <div className="making-room__grid">
            {productList.map((product) => {
              const productCopy = getProductCopy(product.id, locale);
              return (
                <Link
                  key={product.id}
                  href={getLocalizedRoute(product.id, locale)}
                  className="making-room-card"
                >
                  <div className="making-room-card__visual">
                    <ResponsiveProductImage
                      media={product.storefrontHero}
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="making-room-card__copy">
                    <div>
                      <p>{productCopy.name}</p>
                      <span>{productCopy.descriptor}</span>
                    </div>
                    <span className="making-room-card__link">
                      {pageCopy.productCta}
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
