import {
  getCanonicalMediaAsset,
  type MediaAsset,
} from "@/lib/isandre/media";
import { contentDecks } from "@/content";
import type { ProductEditorialCopy } from "@/content/schema";
import {
  finishIds,
  legacyFinishIdMap,
  legacyProductIdMap,
  locales,
  placementModeIds,
  productIds,
  type FinishId,
  type LegacyFinishId,
  type LegacyProductId,
  type Locale,
  type PlacementMode,
  type ProductId,
} from "@/lib/isandre/ids";

export type { MediaAsset } from "@/lib/isandre/media";
export {
  finishIds,
  legacyFinishIdMap,
  legacyProductIdMap,
  locales,
  placementModeIds,
  productIds,
};
export type {
  FinishId,
  LegacyFinishId,
  LegacyProductId,
  Locale,
  PlacementMode,
  ProductId,
};

export type PlacementBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProductGalleryItem = {
  id: string;
  label: string;
  caption: string;
  kind: "packshot" | "hero" | "scene" | "detail" | "proof";
  media: MediaAsset;
};

export type LocalizedContent<T> = Record<Locale, T>;

export type Finish = {
  id: FinishId;
  label: string;
  labels: LocalizedContent<string>;
  seoLabel: string;
  technicalLabel: string;
  hex: string;
  note: string;
  notes: LocalizedContent<string>;
};

export type ProductFinishMedia = {
  packshot: MediaAsset;
  threeQuarter: MediaAsset;
  hero: MediaAsset;
  secondaryScene?: MediaAsset;
  available: boolean;
  status: "ready" | "generated" | "fallback";
  note?: string;
};

export type ProductCopy = ProductEditorialCopy;

export type ProductPiece = {
  id: ProductId;
  code: string;
  route: string;
  title: string;
  navigationLabel: string;
  category: string;
  collectionLabel: string;
  baseline: string;
  promise: string;
  localized: LocalizedContent<ProductCopy>;
  hero: MediaAsset;
  heroFinishId: FinishId;
  cardImage: MediaAsset;
  storefrontHero: MediaAsset;
  storefrontCardMedia: MediaAsset;
  storefrontStoryMedia: Record<FinishId, MediaAsset>;
  depthProof: MediaAsset;
  openBackProof?: MediaAsset;
  technicalPlate: MediaAsset;
  scaleProof: MediaAsset;
  storefrontUsageScenes: Array<{
    id: string;
    label: string;
    caption: string;
    media: MediaAsset;
  }>;
  commerceProofs: Array<{ label: string; value: string }>;
  dimensionsLabel?: string;
  sizeCm?: { width: number; height: number; depth: number };
  displayPrice: string;
  priceByFinish: Record<FinishId, string>;
  priceCentsByFinish: Record<FinishId, number>;
  finishes: Record<FinishId, ProductFinishMedia>;
  descriptionLines: string[];
  detailBullets: string[];
  finishHeading: string;
  finishBody: string;
  lifestyleHeading: string;
  lifestyleBody: string;
  lifestyleScenes: Array<{
    id: string;
    label: string;
    caption: string;
    media: MediaAsset;
  }>;
  outlinePath: string;
  maskPath: string;
  placementModes: PlacementMode[];
  projectionReferences: string[];
  projectionAspectRatio: number;
  geometryPromptLines: string[];
  legalStatus: "pending-clearance" | "cleared";
  geometryStatus: "approved" | "design-frozen" | "blocked";
};

export type ProjectionRequestPayload = {
  productId: ProductId;
  finishId: FinishId;
  placementMode: PlacementMode;
  message: string;
  placementBox: PlacementBox;
};

export type ProjectionResponsePayload = {
  projectionImage: string;
  promptDigest: string;
  requestId: string;
  warning?: string;
  productId: ProductId;
  finishId: FinishId;
  placementBox: PlacementBox;
};

export type CheckoutPayload = {
  items: Array<{ productId: ProductId; finishId: FinishId; quantity: number }>;
  locale: Locale;
  marketCode: import("@/lib/markets").MarketCode;
  email?: string;
  checkoutAttemptId?: string;
};

export const brandIdentity = {
  name: "ISANDRE",
  legalStatus: "pending-clearance",
  collection: "ṬĀQA",
  technicalCollectionName: "TAQA",
  collectionLegalStatus: "pending-clearance",
  collectionLabels: {
    en: "ṬĀQA",
    fr: "ṬĀQA",
  },
  signatures: {
    en: contentDecks.en.brand.signature,
    fr: contentDecks.fr.brand.signature,
  },
  promises: {
    en: contentDecks.en.brand.promise,
    fr: contentDecks.fr.brand.promise,
  },
  campaign: {
    en: contentDecks.en.brand.campaign,
    fr: contentDecks.fr.brand.campaign,
  },
  originClaim: {
    en: contentDecks.en.brand.origin,
    fr: contentDecks.fr.brand.origin,
  },
} as const;

export const siteMeta = {
  name: brandIdentity.name,
  title: contentDecks.en.meta.title,
  description: contentDecks.en.meta.description,
  baseline: brandIdentity.signatures.en,
  heroLine: brandIdentity.signatures.en,
  heroSubline: contentDecks.en.home.heroBody,
  leadEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "studio@isandre.com",
  fabricationDelay: "Made to order in Italy · 20 working days",
  deliveryLine: "Delivery, duties and taxes calculated for your address.",
  storefrontLead: contentDecks.en.home.collectionBody,
  projectionLead: contentDecks.en.projection.subtitle,
  orderLead: contentDecks.en.home.serviceBody,
  keywords: [
    "ISANDRE furniture",
    "TAQA collection",
    "French furniture design",
    "open cabinet",
    "sculptural furniture",
    "French design furniture made in Italy",
    "Seuil open cabinet",
    "Portée low cabinet",
    "Veille bedside table",
  ],
};

export const localizedSiteCopy: LocalizedContent<{
  title: string;
  description: string;
  signature: string;
  subline: string;
  collectionLead: string;
  livingTitle: string;
  livingCopy: string;
  originTitle: string;
  originCopy: string;
  makingDisclaimer: string;
  fabricationDelay: string;
  deliveryLine: string;
}> = {
  en: {
    title: contentDecks.en.meta.title,
    description: contentDecks.en.meta.description,
    signature: contentDecks.en.brand.signature,
    subline: contentDecks.en.brand.promise,
    collectionLead: contentDecks.en.brand.collectionLead,
    livingTitle: contentDecks.en.home.storyTitle,
    livingCopy: contentDecks.en.home.storyBody,
    originTitle: contentDecks.en.service.productionTitle,
    originCopy: contentDecks.en.faq.find((item) => item.id === "origin")!.answer,
    makingDisclaimer: contentDecks.en.service.technicalBody,
    fabricationDelay: contentDecks.en.commerce.productionEstimate,
    deliveryLine: contentDecks.en.commerce.deliveryCalculated,
  },
  fr: {
    title: contentDecks.fr.meta.title,
    description: contentDecks.fr.meta.description,
    signature: contentDecks.fr.brand.signature,
    subline: contentDecks.fr.brand.promise,
    collectionLead: contentDecks.fr.brand.collectionLead,
    livingTitle: contentDecks.fr.home.storyTitle,
    livingCopy: contentDecks.fr.home.storyBody,
    originTitle: contentDecks.fr.service.productionTitle,
    originCopy: contentDecks.fr.faq.find((item) => item.id === "origin")!.answer,
    makingDisclaimer: contentDecks.fr.service.technicalBody,
    fabricationDelay: contentDecks.fr.commerce.productionEstimate,
    deliveryLine: contentDecks.fr.commerce.deliveryCalculated,
  },
};

const productMedia = {
  elan: {
    chalk: getCanonicalMediaAsset("seuil-01", "C01", "chalk", "SEUIL 01 in Chalk, shown frontally on a neutral background."),
    butter: getCanonicalMediaAsset("seuil-01", "C01", "butter", "SEUIL 01 in Butter, shown frontally on a neutral background."),
    sage: getCanonicalMediaAsset("seuil-01", "C01", "sage", "SEUIL 01 in Sage, shown frontally on a neutral background."),
    rose: getCanonicalMediaAsset("seuil-01", "C01", "rose-clay", "SEUIL 01 in Rose Clay, shown frontally on a neutral background."),
  },
  portee: {
    chalk: getCanonicalMediaAsset("portee-02", "C01", "chalk", "PORTÉE 02 in Chalk, shown frontally on a neutral background."),
    butter: getCanonicalMediaAsset("portee-02", "C01", "butter", "PORTÉE 02 in Butter, shown frontally on a neutral background."),
    sage: getCanonicalMediaAsset("portee-02", "C01", "sage", "PORTÉE 02 in Sage, shown frontally on a neutral background."),
    rose: getCanonicalMediaAsset("portee-02", "C01", "rose-clay", "PORTÉE 02 in Rose Clay, shown frontally on a neutral background."),
  },
  veille: {
    chalk: getCanonicalMediaAsset("veille-03", "C01", "chalk", "VEILLE 03 in Chalk, shown frontally on a neutral background."),
    butter: getCanonicalMediaAsset("veille-03", "C01", "butter", "VEILLE 03 in Butter, shown frontally on a neutral background."),
    sage: getCanonicalMediaAsset("veille-03", "C01", "sage", "VEILLE 03 in Sage, shown frontally on a neutral background."),
    rose: getCanonicalMediaAsset("veille-03", "C01", "rose-clay", "VEILLE 03 in Rose Clay, shown frontally on a neutral background."),
  },
};

const productThreeQuarterMedia: Record<
  ProductId,
  Record<FinishId, MediaAsset>
> = {
  "seuil-01": {
    chalk: getCanonicalMediaAsset("seuil-01", "C02", "chalk", "SEUIL 01 in Chalk, seen from a shallow front-right angle."),
    butter: getCanonicalMediaAsset("seuil-01", "C02", "butter", "SEUIL 01 in Butter, seen from a shallow front-right angle."),
    sage: getCanonicalMediaAsset("seuil-01", "C02", "sage", "SEUIL 01 in Sage, seen from a shallow front-right angle."),
    "rose-clay": getCanonicalMediaAsset("seuil-01", "C02", "rose-clay", "SEUIL 01 in Rose Clay, seen from a shallow front-right angle."),
  },
  "portee-02": {
    chalk: getCanonicalMediaAsset("portee-02", "C02", "chalk", "PORTÉE 02 in Chalk, seen from a shallow front-right angle."),
    butter: getCanonicalMediaAsset("portee-02", "C02", "butter", "PORTÉE 02 in Butter, seen from a shallow front-right angle."),
    sage: getCanonicalMediaAsset("portee-02", "C02", "sage", "PORTÉE 02 in Sage, seen from a shallow front-right angle."),
    "rose-clay": getCanonicalMediaAsset("portee-02", "C02", "rose-clay", "PORTÉE 02 in Rose Clay, seen from a shallow front-right angle."),
  },
  "veille-03": {
    chalk: getCanonicalMediaAsset("veille-03", "C02", "chalk", "VEILLE 03 in Chalk, seen from a shallow front-right angle."),
    butter: getCanonicalMediaAsset("veille-03", "C02", "butter", "VEILLE 03 in Butter, seen from a shallow front-right angle."),
    sage: getCanonicalMediaAsset("veille-03", "C02", "sage", "VEILLE 03 in Sage, seen from a shallow front-right angle."),
    "rose-clay": getCanonicalMediaAsset("veille-03", "C02", "rose-clay", "VEILLE 03 in Rose Clay, seen from a shallow front-right angle."),
  },
};

function storefrontHero(productId: ProductId, finishId: FinishId, alt: string) {
  return getCanonicalMediaAsset(productId, "D01", finishId, alt);
}

const productHeroes: Record<ProductId, Record<FinishId, MediaAsset>> = {
  "seuil-01": {
    chalk: storefrontHero("seuil-01", "chalk", "SEUIL 01 in Chalk, fully visible in a lived-in threshold."),
    butter: storefrontHero("seuil-01", "butter", "SEUIL 01 in Butter, fully visible in a lived-in threshold."),
    sage: storefrontHero("seuil-01", "sage", "SEUIL 01 in Sage, fully visible in a lived-in threshold."),
    "rose-clay": storefrontHero("seuil-01", "rose-clay", "SEUIL 01 in Rose Clay, fully visible in a lived-in threshold."),
  },
  "portee-02": {
    chalk: storefrontHero("portee-02", "chalk", "PORTÉE 02 in Chalk, fully visible as an open room divider."),
    butter: storefrontHero("portee-02", "butter", "PORTÉE 02 in Butter, fully visible as an open room divider."),
    sage: storefrontHero("portee-02", "sage", "PORTÉE 02 in Sage, fully visible as an open room divider."),
    "rose-clay": storefrontHero("portee-02", "rose-clay", "PORTÉE 02 in Rose Clay, fully visible as an open room divider."),
  },
  "veille-03": {
    chalk: storefrontHero("veille-03", "chalk", "VEILLE 03 in Chalk, fully visible beside a low upholstered bed."),
    butter: storefrontHero("veille-03", "butter", "VEILLE 03 in Butter, fully visible beside a low upholstered bed."),
    sage: storefrontHero("veille-03", "sage", "VEILLE 03 in Sage, fully visible beside a low upholstered bed."),
    "rose-clay": storefrontHero("veille-03", "rose-clay", "VEILLE 03 in Rose Clay, fully visible beside a low upholstered bed."),
  },
};

function desireScene(
  productId: ProductId,
  role: "D02" | "D03",
  finishId: FinishId,
  productName: string,
  context: string,
) {
  return getCanonicalMediaAsset(
    productId,
    role,
    finishId,
    `${productName} in ${finishId === "rose-clay" ? "Rose Clay" : finishId[0].toUpperCase() + finishId.slice(1)}, shown in ${context}.`,
  );
}

const productStoryScenes: Record<
  ProductId,
  Record<FinishId, MediaAsset>
> = {
  "seuil-01": {
    chalk: desireScene("seuil-01", "D02", "chalk", "SEUIL 01", "a calm lived-in passage in morning light"),
    butter: desireScene("seuil-01", "D02", "butter", "SEUIL 01", "a bright lived-in passage in morning light"),
    sage: desireScene("seuil-01", "D03", "sage", "SEUIL 01", "a calm lived-in interior at blue hour"),
    "rose-clay": desireScene("seuil-01", "D03", "rose-clay", "SEUIL 01", "a warm lived-in interior at blue hour"),
  },
  "portee-02": {
    chalk: desireScene("portee-02", "D02", "chalk", "PORTÉE 02", "a calm open living room in morning light"),
    butter: desireScene("portee-02", "D02", "butter", "PORTÉE 02", "a bright open living room in morning light"),
    sage: desireScene("portee-02", "D03", "sage", "PORTÉE 02", "a calm open living room at blue hour"),
    "rose-clay": desireScene("portee-02", "D03", "rose-clay", "PORTÉE 02", "a warm open living room at blue hour"),
  },
  "veille-03": {
    chalk: desireScene("veille-03", "D02", "chalk", "VEILLE 03", "a calm bedroom in morning light"),
    butter: desireScene("veille-03", "D02", "butter", "VEILLE 03", "a bright bedroom in morning light"),
    sage: desireScene("veille-03", "D03", "sage", "VEILLE 03", "a calm bedroom at blue hour"),
    "rose-clay": desireScene("veille-03", "D03", "rose-clay", "VEILLE 03", "a bedroom at blue hour"),
  },
};

const productDepthProof: Record<ProductId, MediaAsset> = {
  "seuil-01": getCanonicalMediaAsset(
    "seuil-01",
    "P01",
    "chalk",
    "SEUIL 01 in profile, showing its canonical 42 cm depth.",
  ),
  "portee-02": getCanonicalMediaAsset(
    "portee-02",
    "P01",
    "chalk",
    "PORTÉE 02 in profile, showing its canonical 42 cm depth.",
  ),
  "veille-03": getCanonicalMediaAsset(
    "veille-03",
    "P01",
    "chalk",
    "VEILLE 03 in profile; this digital concept does not validate dimensions.",
  ),
};

const productOpenBackProof: Partial<Record<ProductId, MediaAsset>> = {
  "seuil-01": getCanonicalMediaAsset(
    "seuil-01",
    "P02",
    "chalk",
    "Rear three-quarter view of SEUIL 01 showing its open-backed construction.",
  ),
  "portee-02": getCanonicalMediaAsset(
    "portee-02",
    "P02",
    "chalk",
    "Rear three-quarter view of PORTÉE 02 showing its open-backed construction.",
  ),
};

const productTechnicalPlate: Record<ProductId, MediaAsset> = {
  "seuil-01": getCanonicalMediaAsset(
    "seuil-01",
    "P03",
    "chalk",
    "Dimensioned technical plate for SEUIL 01: 1020 by 1840 by 420 millimetres.",
  ),
  "portee-02": getCanonicalMediaAsset(
    "portee-02",
    "P03",
    "chalk",
    "Dimensioned technical plate for PORTÉE 02: 1840 by 1020 by 420 millimetres.",
  ),
  "veille-03": getCanonicalMediaAsset(
    "veille-03",
    "P03",
    "chalk",
    "VEILLE 03 technical plate indicating that dimensions remain under validation.",
  ),
};

const productScaleProof: Record<ProductId, MediaAsset> = {
  "seuil-01": getCanonicalMediaAsset(
    "seuil-01",
    "P04",
    "chalk",
    "SEUIL 01 beside a dining table, providing a familiar reference for its 184 centimetre height.",
  ),
  "portee-02": getCanonicalMediaAsset(
    "portee-02",
    "P04",
    "chalk",
    "PORTÉE 02 behind a sofa, providing a familiar reference for its 102 centimetre height.",
  ),
  "veille-03": getCanonicalMediaAsset(
    "veille-03",
    "P04",
    "chalk",
    "VEILLE 03 beside a bed; this digital concept indicates use but does not validate dimensions.",
  ),
};

const materialDetails: Partial<Record<FinishId, MediaAsset>> = {};

export const finishes: Finish[] = [
  {
    id: "chalk",
    label: contentDecks.en.finishes.chalk.label,
    labels: {
      en: contentDecks.en.finishes.chalk.label,
      fr: contentDecks.fr.finishes.chalk.label,
    },
    seoLabel: "warm chalk mineral matte",
    technicalLabel: "Chalk",
    hex: "#F1EBE0",
    note: contentDecks.en.finishes.chalk.note,
    notes: {
      en: contentDecks.en.finishes.chalk.note,
      fr: contentDecks.fr.finishes.chalk.note,
    },
  },
  {
    id: "butter",
    label: contentDecks.en.finishes.butter.label,
    labels: {
      en: contentDecks.en.finishes.butter.label,
      fr: contentDecks.fr.finishes.butter.label,
    },
    seoLabel: "butter yellow mineral matte",
    technicalLabel: "Butter",
    hex: "#E8CF7A",
    note: contentDecks.en.finishes.butter.note,
    notes: {
      en: contentDecks.en.finishes.butter.note,
      fr: contentDecks.fr.finishes.butter.note,
    },
  },
  {
    id: "sage",
    label: contentDecks.en.finishes.sage.label,
    labels: {
      en: contentDecks.en.finishes.sage.label,
      fr: contentDecks.fr.finishes.sage.label,
    },
    seoLabel: "grey sage mineral matte",
    technicalLabel: "Sage",
    hex: "#7A8A77",
    note: contentDecks.en.finishes.sage.note,
    notes: {
      en: contentDecks.en.finishes.sage.note,
      fr: contentDecks.fr.finishes.sage.note,
    },
  },
  {
    id: "rose-clay",
    label: contentDecks.en.finishes["rose-clay"].label,
    labels: {
      en: contentDecks.en.finishes["rose-clay"].label,
      fr: contentDecks.fr.finishes["rose-clay"].label,
    },
    seoLabel: "muted rose clay mineral matte",
    technicalLabel: "Rose plaster golden sample",
    hex: "#D8AB9E",
    note: contentDecks.en.finishes["rose-clay"].note,
    notes: {
      en: contentDecks.en.finishes["rose-clay"].note,
      fr: contentDecks.fr.finishes["rose-clay"].note,
    },
  },
];

function scene(
  id: string,
  label: string,
  caption: string,
  mediaAsset: MediaAsset,
) {
  return { id, label, caption, media: mediaAsset };
}

export const products: Record<ProductId, ProductPiece> = {
  "seuil-01": {
    id: "seuil-01",
    code: "SEUIL 01",
    route: "/products/seuil-01",
    title: "Open Tall Cabinet",
    navigationLabel: "SEUIL",
    category: "Open Tall Cabinet",
    collectionLabel: "ṬĀQA",
    baseline: "A vertical marker for open rooms.",
    promise: "The room remains visible through every opening.",
    localized: {
      en: contentDecks.en.products["seuil-01"],
      fr: contentDecks.fr.products["seuil-01"],
    },
    hero: productHeroes["seuil-01"].chalk,
    heroFinishId: "chalk",
    cardImage: productHeroes["seuil-01"].chalk,
    storefrontHero: productHeroes["seuil-01"].chalk,
    storefrontCardMedia: productHeroes["seuil-01"].chalk,
    storefrontStoryMedia: productStoryScenes["seuil-01"],
    depthProof: productDepthProof["seuil-01"],
    openBackProof: productOpenBackProof["seuil-01"],
    technicalPlate: productTechnicalPlate["seuil-01"],
    scaleProof: productScaleProof["seuil-01"],
    storefrontUsageScenes: [
      scene("seuil-threshold", "Between rooms", "A boundary that never becomes a wall.", productStoryScenes["seuil-01"].sage),
      scene("seuil-life", "Through the day", "Objects settle in. Light keeps moving.", productStoryScenes["seuil-01"].butter),
      scene("seuil-shadow", "Another atmosphere", "The same silhouette, held by evening colour.", productStoryScenes["seuil-01"]["rose-clay"]),
    ],
    commerceProofs: [
      { label: "Dimensions", value: "102 × 184 × 42 cm" },
      { label: "Lead time", value: "20 working days" },
      { label: "Origin", value: "France · Italy" },
    ],
    dimensionsLabel: "102 × 184 × 42 cm",
    sizeCm: { width: 102, height: 184, depth: 42 },
    displayPrice: "From €3,000",
    priceByFinish: { chalk: "€3,000", butter: "€3,200", sage: "€3,300", "rose-clay": "€3,500" },
    priceCentsByFinish: { chalk: 300000, butter: 320000, sage: 330000, "rose-clay": 350000 },
    finishes: {
      chalk: { packshot: productMedia.elan.chalk, threeQuarter: productThreeQuarterMedia["seuil-01"].chalk, hero: productHeroes["seuil-01"].chalk, secondaryScene: productStoryScenes["seuil-01"].chalk, available: true, status: "generated" },
      butter: { packshot: productMedia.elan.butter, threeQuarter: productThreeQuarterMedia["seuil-01"].butter, hero: productHeroes["seuil-01"].butter, secondaryScene: productStoryScenes["seuil-01"].butter, available: true, status: "generated" },
      sage: { packshot: productMedia.elan.sage, threeQuarter: productThreeQuarterMedia["seuil-01"].sage, hero: productHeroes["seuil-01"].sage, secondaryScene: productStoryScenes["seuil-01"].sage, available: true, status: "generated" },
      "rose-clay": { packshot: productMedia.elan.rose, threeQuarter: productThreeQuarterMedia["seuil-01"]["rose-clay"], hero: productHeroes["seuil-01"]["rose-clay"], secondaryScene: productStoryScenes["seuil-01"]["rose-clay"], available: true, status: "generated" },
    },
    descriptionLines: ["A tall form that lets the room continue.", "Open on both sides.", "Designed in France. Made to order in Italy."],
    detailBullets: ["Open-backed and freestanding.", "Eight immutable openings.", "Soft mineral matte finish."],
    finishHeading: "Four moods. One exact silhouette.",
    finishBody: "The colour shifts the atmosphere. The geometry never moves.",
    lifestyleHeading: "A boundary without a wall.",
    lifestyleBody: "SEUIL holds daily objects and keeps every sightline alive.",
    lifestyleScenes: [],
    outlinePath: "/isandre/reference/seuil-01-outline.svg",
    maskPath: "/isandre/reference/seuil-01-mask.svg",
    placementModes: ["against-wall", "divider"],
    projectionReferences: [
      "/projection-kits/seuil-01/2026.07.27-1/front-orthographic.png",
      "/projection-kits/seuil-01/2026.07.27-1/front-right-30.png",
      "/projection-kits/seuil-01/2026.07.27-1/rear-left-30.png",
    ],
    projectionAspectRatio: 102 / 184,
    geometryPromptLines: [
      "Exact product: ISANDRE SEUIL 01 open tall cabinet, 102 x 184 x 42 cm.",
      "Canonical source of truth: the dimensioned manufacturer geometry, not a stylistic reinterpretation.",
      "The front face is exactly 1020 mm wide by 1840 mm high: width/height ratio 0.55435. The depth is exactly 420 mm, or 41.18% of the front width.",
      "Visual wall thickness is 70-80 mm. Exterior corner radius is 45-55 mm. Interior niche radius is 55-70 mm. Never make the frame thicker or the corners more bulbous.",
      "Left column: four identical 230 x 355 mm vertical niches at x 80-310 mm and y 80-435, 515-870, 950-1305 and 1385-1740 mm.",
      "Right column: one 550 x 540 mm dominant arch at x 390-940 and y 80-620 mm; two 550 x 230 mm niches at y 690-920 and 990-1220 mm; one 550 x 450 mm lower niche at y 1290-1740 mm.",
      "The base is a full uninterrupted 100 mm plinth from y 1740 to 1840 mm, slightly recessed, with no opening or visible feet.",
      "Every opening is open-backed. Preserve all coordinates, the continuous base and the exact asymmetric column proportions.",
    ],
    legalStatus: "pending-clearance",
    geometryStatus: "approved",
  },
  "portee-02": {
    id: "portee-02",
    code: "PORTÉE 02",
    route: "/products/portee-02",
    title: "Open Low Cabinet",
    navigationLabel: "PORTÉE",
    category: "Open Low Cabinet",
    collectionLabel: "ṬĀQA",
    baseline: "A low horizon between two uses.",
    promise: "Both sides of the room remain connected.",
    localized: {
      en: contentDecks.en.products["portee-02"],
      fr: contentDecks.fr.products["portee-02"],
    },
    hero: productHeroes["portee-02"].sage,
    heroFinishId: "sage",
    cardImage: productHeroes["portee-02"].sage,
    storefrontHero: productHeroes["portee-02"].sage,
    storefrontCardMedia: productHeroes["portee-02"].sage,
    storefrontStoryMedia: productStoryScenes["portee-02"],
    depthProof: productDepthProof["portee-02"],
    openBackProof: productOpenBackProof["portee-02"],
    technicalPlate: productTechnicalPlate["portee-02"],
    scaleProof: productScaleProof["portee-02"],
    storefrontUsageScenes: [
      scene("portee-open", "Across the room", "A low landmark made of light and objects.", productStoryScenes["portee-02"].sage),
      scene("portee-distance", "Between two uses", "Living and dining remain visibly connected.", productStoryScenes["portee-02"].chalk),
      scene("portee-line", "Along the view", "The long silhouette keeps the room connected.", productStoryScenes["portee-02"].butter),
    ],
    commerceProofs: [
      { label: "Dimensions", value: "184 × 102 × 42 cm" },
      { label: "Lead time", value: "20 working days" },
      { label: "Origin", value: "France · Italy" },
    ],
    dimensionsLabel: "184 × 102 × 42 cm",
    sizeCm: { width: 184, height: 102, depth: 42 },
    displayPrice: "From €3,000",
    priceByFinish: { chalk: "€3,000", butter: "€3,200", sage: "€3,300", "rose-clay": "€3,500" },
    priceCentsByFinish: { chalk: 300000, butter: 320000, sage: 330000, "rose-clay": 350000 },
    finishes: {
      chalk: { packshot: productMedia.portee.chalk, threeQuarter: productThreeQuarterMedia["portee-02"].chalk, hero: productHeroes["portee-02"].chalk, secondaryScene: productStoryScenes["portee-02"].chalk, available: true, status: "generated" },
      butter: { packshot: productMedia.portee.butter, threeQuarter: productThreeQuarterMedia["portee-02"].butter, hero: productHeroes["portee-02"].butter, secondaryScene: productStoryScenes["portee-02"].butter, available: true, status: "generated" },
      sage: { packshot: productMedia.portee.sage, threeQuarter: productThreeQuarterMedia["portee-02"].sage, hero: productHeroes["portee-02"].sage, secondaryScene: productStoryScenes["portee-02"].sage, available: true, status: "generated" },
      "rose-clay": { packshot: productMedia.portee.rose, threeQuarter: productThreeQuarterMedia["portee-02"]["rose-clay"], hero: productHeroes["portee-02"]["rose-clay"], secondaryScene: productStoryScenes["portee-02"]["rose-clay"], available: true, status: "generated" },
    },
    descriptionLines: ["A low form that separates without dividing.", "Open on both sides.", "Designed in France. Made to order in Italy."],
    detailBullets: ["Open-backed and freestanding.", "Eight immutable openings.", "Wall, sofa or divider placement."],
    finishHeading: "Colour changes the room, never the form.",
    finishBody: "The long silhouette remains exact in every finish.",
    lifestyleHeading: "More distance. No extra wall.",
    lifestyleBody: "PORTÉE stretches the room without weighing it down.",
    lifestyleScenes: [],
    outlinePath: "/isandre/reference/portee-02-outline.svg",
    maskPath: "/isandre/reference/portee-02-mask.svg",
    placementModes: ["against-wall", "divider"],
    projectionReferences: [
      "/projection-kits/portee-02/2026.07.27-1/front-orthographic.png",
      "/projection-kits/portee-02/2026.07.27-1/front-right-30.png",
      "/projection-kits/portee-02/2026.07.27-1/rear-left-30.png",
    ],
    projectionAspectRatio: 184 / 102,
    geometryPromptLines: [
      "Exact product: ISANDRE PORTÉE 02 open low cabinet, 184 x 102 x 42 cm.",
      "Canonical source of truth: the dimensioned manufacturer geometry, not a stylistic reinterpretation.",
      "The front face is exactly 1840 mm wide by 1020 mm high: width/height ratio 1.80392. The depth is exactly 420 mm, or 22.83% of the front width.",
      "Every external margin, upright and horizontal junction is 80 mm, matching SEUIL's visual material density. Exterior corner radius is 45-55 mm. Interior niche radius is 55-70 mm.",
      "Left column: three 300 mm-wide vertical niches at x 80-380 mm and y 80-307, 387-614 and 694-920 mm.",
      "Centre: one 580 x 440 mm dominant arch at x 460-1040 and y 80-520 mm; one 580 x 320 mm lower niche at y 600-920 mm.",
      "Right: two 640 x 200 mm niches at x 1120-1760 and y 80-280 and 360-560 mm; one 640 x 280 mm lower niche at y 640-920 mm.",
      "The base is a full uninterrupted 100 mm plinth from y 920 to 1020 mm, slightly recessed, with no opening or visible feet.",
      "Every opening is open-backed. Preserve all coordinates, the continuous base and the exact three-column proportions.",
    ],
    legalStatus: "pending-clearance",
    geometryStatus: "approved",
  },
  "veille-03": {
    id: "veille-03",
    code: "VEILLE 03",
    route: "/products/veille-03",
    title: "Bedside Table",
    navigationLabel: "VEILLE",
    category: "Bedside Table",
    collectionLabel: "ṬĀQA",
    baseline: "Night keeps its essentials close.",
    promise: "A small open architecture beside the bed.",
    localized: {
      en: contentDecks.en.products["veille-03"],
      fr: contentDecks.fr.products["veille-03"],
    },
    hero: productHeroes["veille-03"]["rose-clay"],
    heroFinishId: "rose-clay",
    cardImage: productHeroes["veille-03"]["rose-clay"],
    storefrontHero: productHeroes["veille-03"]["rose-clay"],
    storefrontCardMedia: productHeroes["veille-03"]["rose-clay"],
    storefrontStoryMedia: productStoryScenes["veille-03"],
    depthProof: productDepthProof["veille-03"],
    technicalPlate: productTechnicalPlate["veille-03"],
    scaleProof: productScaleProof["veille-03"],
    storefrontUsageScenes: [
      scene("veille-night", "Before sleep", "The essential stays close, the room stays calm.", productStoryScenes["veille-03"]["rose-clay"]),
      scene("veille-light", "At first light", "A small form catches the morning.", productStoryScenes["veille-03"].butter),
      scene("veille-ritual", "Every night", "A book, a glass, one quiet place.", productStoryScenes["veille-03"].sage),
    ],
    commerceProofs: [
      { label: "Price", value: "From €750" },
      { label: "Lead time", value: "20 working days" },
      { label: "Origin", value: "France · Italy" },
    ],
    displayPrice: "From €750",
    sizeCm: { width: 38.3, height: 62, depth: 42 },
    priceByFinish: { chalk: "€750", butter: "€800", sage: "€850", "rose-clay": "€900" },
    priceCentsByFinish: { chalk: 75000, butter: 80000, sage: 85000, "rose-clay": 90000 },
    finishes: {
      chalk: { packshot: productMedia.veille.chalk, threeQuarter: productThreeQuarterMedia["veille-03"].chalk, hero: productHeroes["veille-03"].chalk, secondaryScene: productStoryScenes["veille-03"].chalk, available: true, status: "generated" },
      butter: { packshot: productMedia.veille.butter, threeQuarter: productThreeQuarterMedia["veille-03"].butter, hero: productHeroes["veille-03"].butter, secondaryScene: productStoryScenes["veille-03"].butter, available: true, status: "generated" },
      sage: { packshot: productMedia.veille.sage, threeQuarter: productThreeQuarterMedia["veille-03"].sage, hero: productHeroes["veille-03"].sage, secondaryScene: productStoryScenes["veille-03"].sage, available: true, status: "generated" },
      "rose-clay": { packshot: productMedia.veille.rose, threeQuarter: productThreeQuarterMedia["veille-03"]["rose-clay"], hero: productHeroes["veille-03"]["rose-clay"], secondaryScene: productStoryScenes["veille-03"]["rose-clay"], available: true, status: "generated" },
    },
    descriptionLines: ["A small open architecture beside the bed.", "Exactly two openings.", "Designed in France. Made to order in Italy."],
    detailBullets: ["Two open compartments.", "Rounded monolithic silhouette.", "Mineral matte finish."],
    finishHeading: "A small form with a distinct presence.",
    finishBody: "Each finish shifts the mood beside the bed.",
    lifestyleHeading: "The essential, close at hand.",
    lifestyleBody: "VEILLE holds a book, a glass and the quiet of night.",
    lifestyleScenes: [],
    outlinePath: "/isandre/reference/veille-03-outline.svg",
    maskPath: "/isandre/reference/veille-03-mask.svg",
    placementModes: ["bedside", "against-wall"],
    projectionReferences: [],
    projectionAspectRatio: 383 / 620,
    geometryPromptLines: [
      "Exact product: VEILLE monolithic bedside table.",
      "Immutable geometry with exactly two visible openings.",
      "One large upper arch and one horizontal lower niche.",
      "Canonical external dimensions: exactly 383 mm wide, 620 mm high and 420 mm deep.",
      "Upper arch: exactly 223 × 270 mm at x80 y60; lower niche: exactly 223 × 120 mm at x80 y400.",
      "No third niche, drawer, door or back panel.",
      "Preserve the rounded silhouette, full base, depth and proportions exactly.",
    ],
    legalStatus: "pending-clearance",
    geometryStatus: "design-frozen",
  },
};

for (const product of Object.values(products)) {
  product.lifestyleScenes = product.storefrontUsageScenes;
}

export const productList = productIds.map((id) => products[id]);

export function getSiteCopy(locale: Locale) {
  return localizedSiteCopy[locale];
}

export function getProductById(productId: ProductId) {
  return products[productId];
}

export function getProductCopy(productId: ProductId, locale: Locale) {
  return products[productId].localized[locale];
}

export function isProductId(value: string): value is ProductId {
  return productIds.includes(value as ProductId);
}

export function normalizeProductId(value: string | null | undefined): ProductId | null {
  if (!value) return null;
  if (isProductId(value)) return value;
  return legacyProductIdMap[value as LegacyProductId] ?? null;
}

export function getFinishById(finishId: FinishId) {
  return finishes.find((finish) => finish.id === finishId) ?? finishes[0];
}

export function getFinishLabel(finishId: FinishId, locale: Locale) {
  return getFinishById(finishId).labels[locale];
}

export function isFinishId(value: string): value is FinishId {
  return finishIds.includes(value as FinishId);
}

export function normalizeFinishId(value: string | null | undefined): FinishId | null {
  if (!value) return null;
  if (isFinishId(value)) return value;
  return legacyFinishIdMap[value as LegacyFinishId] ?? null;
}

export function getAvailableFinishes(productId: ProductId) {
  const product = getProductById(productId);
  return finishes.filter((finish) => product.finishes[finish.id]?.available);
}

export function normalizeFinishForProduct(productId: ProductId, finishId: FinishId) {
  const product = getProductById(productId);
  if (product.finishes[finishId]?.available) return finishId;
  return finishes.find((finish) => product.finishes[finish.id]?.available)?.id ?? product.heroFinishId;
}

export function getFinishMedia(productId: ProductId, finishId: FinishId) {
  const normalized = normalizeFinishForProduct(productId, finishId);
  return products[productId].finishes[normalized];
}

export function getMaterialDetail(finishId: FinishId) {
  return materialDetails[finishId];
}

export function getFinishPrice(productId: ProductId, finishId: FinishId, locale: Locale = "en") {
  const cents = getFinishPriceCents(productId, finishId);
  return cents ? formatEuroAmount(cents, locale) : products[productId].displayPrice;
}

export function getFinishPriceCents(productId: ProductId, finishId: FinishId) {
  return products[productId].priceCentsByFinish[finishId] ?? null;
}

export function getStartingPrice(productId: ProductId, locale: Locale = "en") {
  const amount = Math.min(...Object.values(products[productId].priceCentsByFinish));
  const formatted = formatEuroAmount(amount, locale);
  return locale === "fr" ? `À partir de ${formatted}` : `From ${formatted}`;
}

export function formatEuroAmount(valueInCents: number, locale: Locale = "en") {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(valueInCents / 100);
}

export function getLocalizedRoute(productId: ProductId, locale: Locale) {
  if (locale === "fr") {
    return `/fr/produits/${productId}`;
  }
  return products[productId].route;
}

export function getHomeRoute(locale: Locale) {
  return locale === "fr" ? "/fr" : "/";
}

export function getProductGallery(productId: ProductId, finishId: FinishId, locale: Locale = "en"): ProductGalleryItem[] {
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const finish = getFinishMedia(productId, finishId);
  const gallery: ProductGalleryItem[] = [
    { id: `${productId}-${finishId}-context`, label: locale === "fr" ? "Dans la pièce" : "In the room", caption: copy.shortStatement, kind: "hero", media: finish.hero },
    { id: `${productId}-${finishId}-packshot`, label: locale === "fr" ? "Vue produit" : "Product view", caption: copy.statement, kind: "packshot", media: finish.packshot },
    { id: `${productId}-${finishId}-three-quarter`, label: locale === "fr" ? "Profondeur" : "Depth", caption: locale === "fr" ? "Une vue légère de trois quarts rend la profondeur lisible." : "A shallow three-quarter view makes the depth legible.", kind: "packshot", media: finish.threeQuarter },
  ];
  if (finish.secondaryScene) {
    gallery.push({
      id: `${productId}-${finishId}-functional`,
      label: locale === "fr" ? "À vivre" : "Lived with",
      caption:
        locale === "fr"
          ? "Les objets du quotidien donnent l’échelle sans masquer la forme."
          : "Daily objects reveal the scale without obscuring the form.",
      kind: "scene",
      media: finish.secondaryScene,
    });
  }
  gallery.push({
    id: `${productId}-${finishId}-atmosphere`,
    label: locale === "fr" ? "Atmosphère" : "Atmosphere",
    caption:
      locale === "fr"
        ? "Une scène plus large montre la pièce dans le rythme du quotidien."
        : "A wider scene shows the piece within the rhythm of daily life.",
    kind: "scene",
    media: getCanonicalMediaAsset(
      productId,
      "D04",
      finishId,
      `${copy.name} in ${getFinishLabel(finishId, locale)}, fully visible in a lived-in interior.`,
    ),
  });
  gallery.push({
      id: `${productId}-depth-proof`,
      label: locale === "fr" ? "Profil" : "Profile",
      caption:
        locale === "fr"
          ? "Le profil rend la profondeur et le contact au sol lisibles."
          : "The profile makes depth and floor contact legible.",
      kind: "proof",
      media: product.depthProof,
    });
  if (product.openBackProof) {
    gallery.push({
      id: `${productId}-open-back-proof`,
      label: locale === "fr" ? "Dos traversant" : "Open back",
      caption:
        locale === "fr"
          ? "La vue arrière confirme une construction ouverte des deux côtés."
          : "The rear view confirms construction that remains open on both sides.",
      kind: "proof",
      media: product.openBackProof,
    });
  }
  gallery.push({
    id: `${productId}-technical-plate`,
    label: locale === "fr" ? "Dimensions" : "Dimensions",
    caption:
      product.geometryStatus !== "blocked"
        ? locale === "fr"
          ? "Les cotes extérieures canoniques, sans approximation."
          : "Canonical external dimensions, without approximation."
        : locale === "fr"
          ? "Les dimensions restent en validation et ne sont pas publiées."
          : "Dimensions remain under validation and are not published.",
    kind: "proof",
    media: product.technicalPlate,
  });
  gallery.push({
    id: `${productId}-scale-proof`,
    label: locale === "fr" ? "Dans l’espace" : "In scale",
    caption:
      product.geometryStatus !== "blocked"
        ? locale === "fr"
          ? "Un repère familier permet de lire immédiatement l’échelle de la pièce."
          : "A familiar reference makes the piece’s scale immediately legible."
        : locale === "fr"
          ? "Une mise en situation d’usage, sans affirmation dimensionnelle."
          : "A use-context concept, without a dimensional claim.",
    kind: "proof",
    media: product.scaleProof,
  });
  const material = materialDetails[finishId];
  if (material) {
    gallery.push({
      id: `${productId}-${finishId}-detail`,
      label: locale === "fr" ? "Matière" : "Material",
      caption: localizedSiteCopy[locale].originCopy,
      kind: "detail",
      media: material,
    });
  }
  return gallery;
}

export function getPlacementModesForProduct(productId: ProductId, locale: Locale = "en") {
  return products[productId].placementModes.map((id) => ({ id, label: getPlacementModeLabel(id, locale) }));
}

export function getPlacementModeLabel(mode: PlacementMode, locale: Locale = "en") {
  return contentDecks[locale].placementModes[mode];
}
