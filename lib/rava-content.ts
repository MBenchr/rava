export type FormatId = "vertical" | "horizontal" | "undecided";
export type UsageId =
  | "against-wall"
  | "divider"
  | "behind-sofa"
  | "under-window"
  | "other";
export type AmbianceId =
  | "neutral"
  | "sage-teal"
  | "soft-butter"
  | "plaster-rose";

export type PlacementBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: Exclude<FormatId, "undecided">;
  piece: string;
  title: string;
  dimensions: string;
  sizeCm: { width: number; height: number; depth: number };
  intro: string;
  usage: string;
  priceFrom: string;
  alt: string;
  image: {
    src: string;
    mobileSrc: string;
  };
  projectionReferences: string[];
};

export type LifestyleScene = {
  id: string;
  label: string;
  caption: string;
  alt: string;
  src: string;
  mobileSrc: string;
};

export type FinishAccent = {
  id: AmbianceId;
  name: string;
  hex: string;
  price: string;
  note: string;
};

export type ProjectionRequestPayload = {
  format: FormatId;
  usage: UsageId;
  ambiance: AmbianceId;
  message: string;
  placementBox: PlacementBox;
};

export type EstimateRequestPayload = {
  name: string;
  email: string;
  location: string;
  format: FormatId;
  usage: UsageId;
  ambiance: AmbianceId;
  message: string;
};

export const siteMeta = {
  name: "RAVA Éditions",
  title: "RAVA Éditions — Cabinet Mura, meuble sculptural pour l’intérieur",
  description:
    "Cabinet Mura est une bibliothèque sculpturale autoportante, disponible en version verticale ou horizontale. Une pièce monobloc à finition mate texturée, pensée pour structurer l’espace.",
  baseline: "Pièces sculpturales pour l’intérieur",
  priceFrom: "Dès 2 000 €",
  leadEmail: "bonjour@rava-editions.com",
  fabricationDelay:
    "Délai indicatif : à partir de 20 jours après validation du format, de la teinte et de la livraison.",
  deliveryLine: "Livraison calculée selon l’adresse.",
  keywords: [
    "meuble sculptural",
    "bibliothèque design",
    "meuble autoportant",
    "séparation d’espace design",
    "mobilier d’auteur",
    "meuble sur demande",
    "meuble finition mate",
    "bibliothèque sans fond",
    "meuble niche",
    "architecture intérieure",
  ],
};

export const productVariants: ProductVariant[] = [
  {
    id: "vertical",
    piece: "Pièce 001",
    title: "Cabinet Mura vertical",
    dimensions: "102 × 184 × 42 cm",
    sizeCm: { width: 102, height: 184, depth: 42 },
    intro:
      "Pour habiter un mur, structurer une entrée ou séparer sans fermer.",
    usage:
      "Une présence haute, calme et ouverte.",
    priceFrom: siteMeta.priceFrom,
    alt: "Cabinet Mura vertical dans un studio clair avec accents colorés subtils.",
    image: {
      src: "/rava-v2/packshot-vertical.webp",
      mobileSrc: "/rava-v2/packshot-vertical-mobile.webp",
    },
    projectionReferences: [
      "/rava-v2/packshot-vertical-source.png",
      "/rava-v2/vertical-detail-base-source.png",
    ],
  },
  {
    id: "horizontal",
    piece: "Pièce 002",
    title: "Cabinet Mura horizontal",
    dimensions: "184 × 120 × 42 cm",
    sizeCm: { width: 184, height: 120, depth: 42 },
    intro:
      "Pour accompagner un canapé, vivre sous une fenêtre ou créer une limite basse.",
    usage:
      "Une présence basse, utile et sculpturale.",
    priceFrom: siteMeta.priceFrom,
    alt: "Cabinet Mura horizontal dans un intérieur lumineux aux tons chauds.",
    image: {
      src: "/rava-v2/horizontal-main.webp",
      mobileSrc: "/rava-v2/horizontal-main-mobile.webp",
    },
    projectionReferences: [
      "/rava-v2/horizontal-main-source.png",
      "/rava-v2/horizontal-secondary-source.png",
    ],
  },
];

export const finishAccents: FinishAccent[] = [
  {
    id: "neutral",
    name: "Ivoire chaud",
    hex: "#F4EFE6",
    price: "2 000 €",
    note: "La teinte fondatrice. La plus calme.",
  },
  {
    id: "soft-butter",
    name: "Beurre pâle",
    hex: "#F1D37A",
    price: "2 200 €",
    note: "Plus solaire. Toujours mate.",
  },
  {
    id: "sage-teal",
    name: "Vert grisé",
    hex: "#5F746A",
    price: "2 300 €",
    note: "Plus végétal. Plus dense.",
  },
  {
    id: "plaster-rose",
    name: "Rose plâtre",
    hex: "#E7B5A6",
    price: "2 300 €",
    note: "Plus douce. Plus poudrée.",
  },
];

export const lifestyleScenes: LifestyleScene[] = [
  {
    id: "heritage",
    label: "Maison de maître",
    caption: "Sous la lumière.",
    alt: "Cabinet Mura vertical dans un intérieur patrimonial lumineux.",
    src: "/rava-v2/heritage-room.webp",
    mobileSrc: "/rava-v2/heritage-room-mobile.webp",
  },
  {
    id: "winter-garden",
    label: "Jardin d’hiver",
    caption: "Matière et feuillage.",
    alt: "Cabinet Mura vertical dans un jardin d’hiver lumineux.",
    src: "/rava-v2/winter-garden.webp",
    mobileSrc: "/rava-v2/winter-garden-mobile.webp",
  },
  {
    id: "dark-salon",
    label: "Salon moderniste",
    caption: "Contraste calme.",
    alt: "Cabinet Mura vertical dans un salon moderniste sombre.",
    src: "/rava-v2/dark-salon.webp",
    mobileSrc: "/rava-v2/dark-salon-mobile.webp",
  },
  {
    id: "family-living",
    label: "Intérieur vivant",
    caption: "À hauteur de vie.",
    alt: "Cabinet Mura vertical dans un salon familial contemporain.",
    src: "/rava-v2/family-living.webp",
    mobileSrc: "/rava-v2/family-living-mobile.webp",
  },
  {
    id: "space-divider",
    label: "Séparation douce",
    caption: "Ouvert, sans fond.",
    alt: "Cabinet Mura utilisé comme séparation douce dans un espace ouvert.",
    src: "/rava-v2/space-divider.webp",
    mobileSrc: "/rava-v2/space-divider-mobile.webp",
  },
  {
    id: "horizontal",
    label: "Version horizontale",
    caption: "Derrière un canapé.",
    alt: "Cabinet Mura horizontal dans un intérieur lumineux.",
    src: "/rava-v2/horizontal-secondary.webp",
    mobileSrc: "/rava-v2/horizontal-secondary-mobile.webp",
  },
  {
    id: "detail",
    label: "Détail matière",
    caption: "Finalisé à la main.",
    alt: "Détail de la texture et des arrondis du Cabinet Mura.",
    src: "/rava-v2/material-detail.webp",
    mobileSrc: "/rava-v2/material-detail-mobile.webp",
  },
  {
    id: "tints",
    label: "Teintes",
    caption: "Quatre présences.",
    alt: "Cabinet Mura vertical présenté avec quatre intentions de teinte.",
    src: "/rava-v2/packshot-vertical.webp",
    mobileSrc: "/rava-v2/packshot-vertical-mobile.webp",
  },
];

export const processSteps = [
  "Choisir le format",
  "Choisir la teinte",
  "Envoyer une photo ou les dimensions",
  "Recevoir la projection",
  "Confirmer la livraison",
  "Lancer la fabrication",
];

export const usageHighlights = [
  {
    title: "Contre un mur",
    copy: "Un point focal immédiat.",
  },
  {
    title: "En séparation",
    copy: "Une limite douce, sans cloison.",
  },
  {
    title: "Derrière un canapé",
    copy: "Une console sculpturale, ouverte et utile.",
  },
  {
    title: "Dans un intérieur vivant",
    copy: "Un objet fort, mais habitable.",
  },
];

export const usageOptions: { id: UsageId; label: string }[] = [
  { id: "against-wall", label: "Contre un mur" },
  { id: "divider", label: "Séparation" },
  { id: "behind-sofa", label: "Derrière canapé" },
  { id: "under-window", label: "Sous fenêtre" },
  { id: "other", label: "Autre" },
];

export const formatOptions: { id: FormatId; label: string }[] = [
  { id: "vertical", label: "Vertical" },
  { id: "horizontal", label: "Horizontal" },
  { id: "undecided", label: "Pas encore décidé" },
];

export const ambianceOptions: { id: AmbianceId; label: string }[] = [
  { id: "neutral", label: "Ivoire chaud" },
  { id: "sage-teal", label: "Vert grisé" },
  { id: "soft-butter", label: "Beurre pâle" },
  { id: "plaster-rose", label: "Rose plâtre" },
];

export const heroImage = {
  src: "/rava-v2/hero-main.webp",
  mobileSrc: "/rava-v2/hero-main-mobile.webp",
  alt: "Cabinet Mura vertical dans un intérieur calme, lumineux et premium.",
};

export const materialsImage = {
  src: "/rava-v2/packshot-vertical.webp",
  mobileSrc: "/rava-v2/packshot-vertical-mobile.webp",
  alt: "Cabinet Mura vertical présenté avec trois accents colorés subtils.",
};

export const openBackImage = {
  src: "/rava-v2/space-divider.webp",
  mobileSrc: "/rava-v2/space-divider-mobile.webp",
  alt: "Cabinet Mura utilisé comme séparation douce laissant voir l’espace derrière.",
};

export const handFinishedImages = [
  {
    src: "/rava-v2/material-detail.webp",
    mobileSrc: "/rava-v2/material-detail-mobile.webp",
    alt: "Détail de matière du Cabinet Mura.",
  },
  {
    src: "/rava-v2/hand-finished-detail.webp",
    mobileSrc: "/rava-v2/hand-finished-detail-mobile.webp",
    alt: "Détail du Cabinet Mura dans un intérieur lumineux, montrant ses arêtes arrondies.",
  },
];

export const footerLinks = [
  { href: "/instagram", label: "Instagram" },
  { href: "#estimation", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/fiche-technique", label: "Fiche technique" },
];

export function getVariantByFormat(format: FormatId) {
  if (format === "horizontal") {
    return productVariants.find((variant) => variant.id === "horizontal")!;
  }

  return productVariants.find((variant) => variant.id === "vertical")!;
}

export function getFinishAccent(accentId: AmbianceId) {
  return finishAccents.find((accent) => accent.id === accentId) ?? finishAccents[0];
}
