import type { Locale, ProductId } from "@/lib/isandre/ids";
import type { MediaAsset } from "@/lib/isandre/media";

export type PreproductionMediaId =
  | "W01"
  | "W02"
  | "W03"
  | "W04"
  | "W05"
  | "W06"
  | "W07";

export type PreproductionMediaAsset = {
  id: PreproductionMediaId;
  productId: ProductId | null;
  media: Record<Locale, MediaAsset>;
  caption: Record<Locale, string>;
  displayRatio: "landscape" | "portrait";
  evidenceStatus: "preproduction-visualisation";
};

function media(
  slug: string,
  alt: Record<Locale, string>,
): Record<Locale, MediaAsset> {
  const base = `/isandre/preproduction/${slug}`;
  return {
    en: {
      src: `${base}/index.webp`,
      mobileSrc: `${base}/mobile.webp`,
      thumbnailSrc: `${base}/thumb.webp`,
      fallbackSrc: `${base}/index.jpg`,
      alt: alt.en,
    },
    fr: {
      src: `${base}/index.webp`,
      mobileSrc: `${base}/mobile.webp`,
      thumbnailSrc: `${base}/thumb.webp`,
      fallbackSrc: `${base}/index.jpg`,
      alt: alt.fr,
    },
  };
}

export const preproductionMedia: Record<
  PreproductionMediaId,
  PreproductionMediaAsset
> = {
  W01: {
    id: "W01",
    productId: "seuil-01",
    media: media("w01-seuil-mould-preparation", {
      en: "Preparing the aluminium mould for SEUIL 01.",
      fr: "Préparation du moule aluminium de SEUIL 01.",
    }),
    caption: {
      en: "Preparing the aluminium mould before rotational moulding.",
      fr: "Préparation du moule aluminium avant rotomoulage.",
    },
    displayRatio: "landscape",
    evidenceStatus: "preproduction-visualisation",
  },
  W02: {
    id: "W02",
    productId: "portee-02",
    media: media("w02-portee-demoulding", {
      en: "PORTÉE 02 during cooling and demoulding.",
      fr: "PORTÉE 02 pendant son refroidissement et son démoulage.",
    }),
    caption: {
      en: "Cooling and demoulding the single-piece open form.",
      fr: "Refroidissement et démoulage de la forme ouverte monobloc.",
    },
    displayRatio: "landscape",
    evidenceStatus: "preproduction-visualisation",
  },
  W03: {
    id: "W03",
    productId: "seuil-01",
    media: media("w03-seuil-quality-control", {
      en: "Surface and geometry inspection of SEUIL 01.",
      fr: "Contrôle de surface et de géométrie de SEUIL 01.",
    }),
    caption: {
      en: "Inspecting radii, continuity and the low-sheen surface.",
      fr: "Contrôle des rayons, de la continuité et de la surface satinée mate.",
    },
    displayRatio: "portrait",
    evidenceStatus: "preproduction-visualisation",
  },
  W04: {
    id: "W04",
    productId: null,
    media: media("w04-finish-coupons", {
      en: "Four standard LLDPE finish samples under controlled light.",
      fr: "Quatre échantillons de finition LLDPE sous lumière contrôlée.",
    }),
    caption: {
      en: "Comparing Chalk, Butter, Sage and Rose Clay under controlled light.",
      fr: "Comparaison de Craie, Beurre, Sauge et Argile rose sous lumière contrôlée.",
    },
    displayRatio: "portrait",
    evidenceStatus: "preproduction-visualisation",
  },
  W05: {
    id: "W05",
    productId: "veille-03",
    media: media("w05-veille-demoulding", {
      en: "VEILLE 03 after demoulding on a worn inspection bench.",
      fr: "VEILLE 03 après démoulage sur un établi d’inspection patiné.",
    }),
    caption: {
      en: "The compact form is released, cooled and checked as a single piece.",
      fr: "La forme compacte est libérée, refroidie et contrôlée d’un seul tenant.",
    },
    displayRatio: "landscape",
    evidenceStatus: "preproduction-visualisation",
  },
  W06: {
    id: "W06",
    productId: "veille-03",
    media: media("w06-veille-hand-finishing", {
      en: "A craftsperson hand-finishing VEILLE 03 in Butter.",
      fr: "Une artisane finalise à la main VEILLE 03 en Beurre.",
    }),
    caption: {
      en: "Edges and radii are finished by hand until the surface reads as one continuous gesture.",
      fr: "Arêtes et rayons sont finalisés à la main jusqu’à former un geste continu.",
    },
    displayRatio: "portrait",
    evidenceStatus: "preproduction-visualisation",
  },
  W07: {
    id: "W07",
    productId: "portee-02",
    media: media("w07-portee-opening-finish", {
      en: "PORTÉE 02 in Sage during the finishing of its central arch.",
      fr: "PORTÉE 02 en Sauge pendant la finition de son arche centrale.",
    }),
    caption: {
      en: "The central opening is refined by hand while the complete geometry remains visible.",
      fr: "L’ouverture centrale est reprise à la main tandis que la géométrie complète reste lisible.",
    },
    displayRatio: "landscape",
    evidenceStatus: "preproduction-visualisation",
  },
};

export const preproductionMediaList = [
  preproductionMedia.W01,
  preproductionMedia.W02,
  preproductionMedia.W03,
  preproductionMedia.W04,
  preproductionMedia.W05,
  preproductionMedia.W06,
  preproductionMedia.W07,
] as const;

export function getPreproductionMediaForProduct(productId: ProductId) {
  if (productId === "portee-02") return preproductionMedia.W02;
  if (productId === "seuil-01") return preproductionMedia.W03;
  return preproductionMedia.W05;
}
