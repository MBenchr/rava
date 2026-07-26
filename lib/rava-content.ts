export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const productIds = ["elan-o1", "portee-o2", "veille-o4"] as const;
export type ProductId = (typeof productIds)[number];

export const finishIds = ["chalk", "butter", "sage", "plaster-rose"] as const;
export type FinishId = (typeof finishIds)[number];

export const placementModeIds = [
  "against-wall",
  "divider",
  "behind-sofa",
  "under-window",
  "bedside",
  "other",
] as const;
export type PlacementMode = (typeof placementModeIds)[number];

export type PlacementBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MediaAsset = {
  src: string;
  mobileSrc: string;
  thumbnailSrc: string;
  alt: string;
};

export type ProductGalleryItem = {
  id: string;
  label: string;
  caption: string;
  kind: "packshot" | "hero" | "scene" | "detail";
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
  hero: MediaAsset;
  secondaryScene?: MediaAsset;
  available: boolean;
  status: "ready" | "generated" | "fallback";
  note?: string;
};

export type ProductCopy = {
  name: string;
  descriptor: string;
  statement: string;
  shortStatement: string;
  story: string;
  galleryHeading: string;
  detailLines: string[];
};

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
  openBack: MediaAsset;
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

export type EstimateRequestPayload = {
  name: string;
  email: string;
  location: string;
  productId: ProductId;
  finishId: FinishId;
  placementMode: PlacementMode;
  message: string;
};

export type CheckoutPayload = {
  items: Array<{ productId: ProductId; finishId: FinishId; quantity: number }>;
  locale: Locale;
  marketCode: import("@/lib/markets").MarketCode;
  email?: string;
};

export const brandIdentity = {
  name: "VIAIRE",
  collection: "OPENINGS 01",
  collectionLabels: {
    en: "OPENINGS 01",
    fr: "OUVERTURES 01",
  },
  signatures: {
    en: "Let life through.",
    fr: "Laissez passer la vie.",
  },
  campaign: {
    en: "THE FRENCH EDITION — NOW DELIVERING TO LONDON",
    fr: "L’ÉDITION FRANÇAISE — LIVRAISON À LONDRES",
  },
  originClaim: {
    en: "Designed in France. Made to order.",
    fr: "Dessiné en France. Fabriqué sur commande.",
  },
} as const;

export const siteMeta = {
  name: brandIdentity.name,
  title: "VIAIRE — Let life through",
  description:
    "Sculptural open furniture designed in France. Discover SEUIL, PORTÉE and VEILLE.",
  baseline: brandIdentity.signatures.en,
  heroLine: brandIdentity.signatures.en,
  heroSubline: "Sculptural furniture for the light, objects and people that make a room yours.",
  leadEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "studio@viaire.fr",
  fabricationDelay: "Made to order · 20 working days",
  deliveryLine: "Delivery, duties and taxes calculated for your address.",
  storefrontLead: "Three forms. Four mineral finishes. Space left open.",
  projectionLead: "Place the selected piece in your room before ordering.",
  orderLead: "Select the piece, finish and quantity. Checkout securely with Stripe.",
  keywords: [
    "Viaire furniture",
    "Openings 01",
    "French furniture design",
    "open cabinet",
    "sculptural furniture",
    "made to order furniture France",
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
    title: "VIAIRE — Let life through",
    description:
      "Sculptural open furniture designed in France. Discover SEUIL, PORTÉE and VEILLE.",
    signature: "Let life through.",
    subline: "Open furniture for the light, objects and people that make a room yours.",
    collectionLead: "Three pieces. One open way of living.",
    livingTitle: "Made for everything that happens around it.",
    livingCopy: "Books gather, flowers change and people pass. The piece holds what matters while the room keeps moving.",
    originTitle: "Soft to the eye. Precise in its making.",
    originCopy: "A quiet mineral surface wraps a geometry designed to remain open from every side.",
    makingDisclaimer: "Production photography will be published once the first pieces enter the workshop.",
    fabricationDelay: "Made to order · 20 working days",
    deliveryLine: "Delivery, duties and taxes calculated for your address.",
  },
  fr: {
    title: "VIAIRE — Laissez passer la vie",
    description:
      "Des meubles sculpturaux ouverts, dessinés en France. Découvrez SEUIL, PORTÉE et VEILLE.",
    signature: "Laissez passer la vie.",
    subline: "Des meubles ouverts pour la lumière, les objets et les personnes qui rendent une pièce unique.",
    collectionLead: "Trois pièces. Une même façon de vivre l’espace.",
    livingTitle: "Pensée pour tout ce qui se passe autour.",
    livingCopy: "Les livres s’accumulent, les fleurs changent et les gens circulent. La pièce tient l’essentiel tandis que la vie continue.",
    originTitle: "Douce au regard. Précise dans sa forme.",
    originCopy: "Une surface minérale calme enveloppe une géométrie ouverte de tous les côtés.",
    makingDisclaimer: "Les photographies de production seront publiées avec les premières pièces entrées en atelier.",
    fabricationDelay: "Fabriqué sur commande · 20 jours ouvrés",
    deliveryLine: "Livraison, droits et taxes calculés selon votre adresse.",
  },
};

function media(pathname: string, alt: string, mobilePathname = `${pathname}-mobile`): MediaAsset {
  return {
    src: `${pathname}.webp`,
    mobileSrc: `${mobilePathname}.webp`,
    thumbnailSrc: `${pathname}-thumb.webp`,
    alt,
  };
}

const productMedia = {
  elan: {
    chalk: media("/viaire/elan-o1/scenes/viaire-seuil-chalk-lifestyle", "SEUIL in Chalk in a lived-in London threshold."),
    butter: media("/viaire/elan-o1/scenes/viaire-seuil-butter-lifestyle", "SEUIL in Butter in a young collector's apartment."),
    sage: media("/viaire/elan-o1/scenes/viaire-seuil-sage-lifestyle", "SEUIL in Sage as an open garden-room divider."),
    rose: media("/viaire/elan-o1/scenes/viaire-seuil-plaster-rose-lifestyle", "SEUIL in Rose Clay in an evening salon."),
  },
  portee: {
    chalk: media("/viaire/portee-o2/scenes/viaire-portee-chalk-lifestyle", "PORTÉE in Chalk as an open room divider."),
    butter: media("/viaire/portee-o2/scenes/viaire-portee-butter-lifestyle", "PORTÉE in Butter along a Parisian wall."),
    sage: media("/viaire/portee-o2/scenes/viaire-portee-sage-lifestyle", "PORTÉE in Sage connecting living and dining."),
    rose: media("/viaire/portee-o2/scenes/viaire-portee-plaster-rose-lifestyle", "PORTÉE in Rose Clay in a collector's salon."),
  },
  veille: {
    chalk: media("/viaire/veille-o4/scenes/viaire-veille-chalk-lifestyle", "VEILLE in Chalk beside a linen bed."),
    butter: media("/viaire/veille-o4/scenes/viaire-veille-butter-lifestyle", "VEILLE in Butter in a bright young bedroom."),
    sage: media("/viaire/veille-o4/scenes/viaire-veille-sage-lifestyle", "VEILLE in Sage in a calm garden bedroom."),
    rose: media("/viaire/veille-o4/scenes/viaire-veille-plaster-rose-lifestyle", "VEILLE in Rose Clay at early evening."),
  },
};

function storefrontHero(productId: ProductId, finishId: FinishId, alt: string) {
  const productName =
    productId === "elan-o1"
      ? "seuil"
      : productId === "portee-o2"
        ? "portee"
        : "veille";
  return media(
    `/viaire/${productId}/scenes/viaire-${productName}-${finishId}-lifestyle`,
    alt,
  );
}

const productHeroes: Record<ProductId, Record<FinishId, MediaAsset>> = {
  "elan-o1": {
    chalk: storefrontHero("elan-o1", "chalk", "SEUIL in Chalk, fully visible in a lived-in London townhouse."),
    butter: storefrontHero("elan-o1", "butter", "SEUIL in Butter, fully visible in a lived-in London townhouse."),
    sage: storefrontHero("elan-o1", "sage", "SEUIL in Sage, fully visible in a lived-in London townhouse."),
    "plaster-rose": storefrontHero("elan-o1", "plaster-rose", "SEUIL in Rose Clay, fully visible in a lived-in London townhouse."),
  },
  "portee-o2": {
    chalk: storefrontHero("portee-o2", "chalk", "PORTÉE in Chalk, fully visible as an open room divider."),
    butter: storefrontHero("portee-o2", "butter", "PORTÉE in Butter, fully visible as an open room divider."),
    sage: storefrontHero("portee-o2", "sage", "PORTÉE in Sage, fully visible as an open room divider."),
    "plaster-rose": storefrontHero("portee-o2", "plaster-rose", "PORTÉE in Rose Clay, fully visible as an open room divider."),
  },
  "veille-o4": {
    chalk: storefrontHero("veille-o4", "chalk", "VEILLE in Chalk, fully visible beside a low upholstered bed."),
    butter: storefrontHero("veille-o4", "butter", "VEILLE in Butter, fully visible beside a low upholstered bed."),
    sage: storefrontHero("veille-o4", "sage", "VEILLE in Sage, fully visible beside a low upholstered bed."),
    "plaster-rose": storefrontHero("veille-o4", "plaster-rose", "VEILLE in Rose Clay, fully visible beside a low upholstered bed."),
  },
};

const openBackMedia: Record<ProductId, MediaAsset> = {
  "elan-o1": productMedia.elan.sage,
  "portee-o2": productMedia.portee.sage,
  "veille-o4": productMedia.veille.sage,
};

const materialDetails: Record<FinishId, MediaAsset> = {
  chalk: media("/viaire/elan-o1/details/viaire-seuil-chalk-material-detail", "Silky matte Chalk mineral surface under grazing light."),
  butter: media("/viaire/elan-o1/details/viaire-seuil-butter-material-detail", "Silky matte Butter mineral surface under grazing light."),
  sage: media("/viaire/elan-o1/details/viaire-seuil-sage-material-detail", "Silky matte Sage mineral surface under grazing light."),
  "plaster-rose": media("/viaire/elan-o1/details/viaire-seuil-plaster-rose-material-detail", "Silky matte Rose Clay mineral surface under grazing light."),
};

export const finishes: Finish[] = [
  {
    id: "chalk",
    label: "Chalk",
    labels: { en: "Chalk", fr: "Craie" },
    seoLabel: "warm chalk mineral matte",
    technicalLabel: "Chalk",
    hex: "#F1EBE0",
    note: "A soft white that holds the light.",
    notes: { en: "A soft white that holds the light.", fr: "Un blanc doux qui retient la lumière." },
  },
  {
    id: "butter",
    label: "Butter",
    labels: { en: "Butter", fr: "Beurre" },
    seoLabel: "butter yellow mineral matte",
    technicalLabel: "Butter",
    hex: "#E8CF7A",
    note: "A low, lingering sunlight.",
    notes: { en: "A low, lingering sunlight.", fr: "Un soleil bas qui reste dans la pièce." },
  },
  {
    id: "sage",
    label: "Sage",
    labels: { en: "Sage", fr: "Sauge" },
    seoLabel: "grey sage mineral matte",
    technicalLabel: "Sage",
    hex: "#7A8A77",
    note: "Quiet green with a shadowed depth.",
    notes: { en: "Quiet green with a shadowed depth.", fr: "Un vert calme, assombri juste ce qu’il faut." },
  },
  {
    id: "plaster-rose",
    label: "Rose Clay",
    labels: { en: "Rose Clay", fr: "Argile rose" },
    seoLabel: "muted rose clay mineral matte",
    technicalLabel: "Rose Clay",
    hex: "#D8AB9E",
    note: "Earth, skin and evening light.",
    notes: { en: "Earth, skin and evening light.", fr: "La terre, la peau et la lumière du soir." },
  },
];

function scene(id: string, label: string, caption: string, pathname: string, alt: string) {
  return { id, label, caption, media: media(pathname, alt) };
}

export const products: Record<ProductId, ProductPiece> = {
  "elan-o1": {
    id: "elan-o1",
    code: "SEUIL",
    route: "/products/seuil",
    title: "Open Tall Cabinet",
    navigationLabel: "SEUIL",
    category: "Open Tall Cabinet",
    collectionLabel: "OPENINGS 01",
    baseline: "The room continues through it.",
    promise: "Tall enough to shape a room. Open enough to leave it whole.",
    localized: {
      en: {
        name: "SEUIL",
        descriptor: "Open Tall Cabinet",
        statement: "A threshold made of light and objects.",
        shortStatement: "A tall landmark that keeps every view alive.",
        story: "Beside a doorway, across an open plan or against a wall, SEUIL gives treasured objects a place while light, movement and conversation continue through it.",
        galleryHeading: "A presence the room can see through.",
        detailLines: ["Open on both sides.", "Eight fixed openings.", "102 × 184 × 42 cm."],
      },
      fr: {
        name: "SEUIL",
        descriptor: "Cabinet vertical ouvert",
        statement: "Un seuil fait de lumière et d’objets.",
        shortStatement: "Un repère vertical qui préserve chaque perspective.",
        story: "Près d’un passage, en séparation ou contre un mur, SEUIL donne une place aux objets choisis tandis que la lumière, les gestes et les conversations le traversent.",
        galleryHeading: "Une présence à travers laquelle la pièce reste visible.",
        detailLines: ["Ouvert des deux côtés.", "Huit ouvertures fixes.", "102 × 184 × 42 cm."],
      },
    },
    hero: productHeroes["elan-o1"].chalk,
    heroFinishId: "chalk",
    cardImage: productHeroes["elan-o1"].chalk,
    storefrontHero: productHeroes["elan-o1"].chalk,
    storefrontCardMedia: productHeroes["elan-o1"].chalk,
    openBack: openBackMedia["elan-o1"],
    storefrontUsageScenes: [
      scene("seuil-threshold", "Between rooms", "A boundary that never becomes a wall.", "/viaire/elan-o1/scenes/viaire-seuil-sage-lifestyle", "SEUIL in Sage between room and garden."),
      scene("seuil-life", "Through the day", "Objects settle in. Light keeps moving.", "/viaire/elan-o1/scenes/viaire-seuil-butter-lifestyle", "SEUIL in Butter in a lived-in apartment."),
      scene("seuil-shadow", "From every side", "The open back keeps the long view alive.", "/viaire/elan-o1/scenes/viaire-seuil-plaster-rose-lifestyle", "SEUIL in Rose Clay at blue hour."),
    ],
    commerceProofs: [
      { label: "Dimensions", value: "102 × 184 × 42 cm" },
      { label: "Lead time", value: "20 working days" },
      { label: "Design", value: "Designed in France" },
    ],
    dimensionsLabel: "102 × 184 × 42 cm",
    sizeCm: { width: 102, height: 184, depth: 42 },
    displayPrice: "From €3,000",
    priceByFinish: { chalk: "€3,000", butter: "€3,200", sage: "€3,300", "plaster-rose": "€3,500" },
    priceCentsByFinish: { chalk: 300000, butter: 320000, sage: 330000, "plaster-rose": 350000 },
    finishes: {
      chalk: { packshot: productMedia.elan.chalk, hero: productHeroes["elan-o1"].chalk, available: true, status: "generated" },
      butter: { packshot: productMedia.elan.butter, hero: productHeroes["elan-o1"].butter, available: true, status: "generated" },
      sage: { packshot: productMedia.elan.sage, hero: productHeroes["elan-o1"].sage, available: true, status: "generated" },
      "plaster-rose": { packshot: productMedia.elan.rose, hero: productHeroes["elan-o1"]["plaster-rose"], available: true, status: "generated" },
    },
    descriptionLines: ["A tall form that lets the room continue.", "Open on both sides.", "Designed in France. Made to order."],
    detailBullets: ["Open-backed and freestanding.", "Eight immutable openings.", "Soft mineral matte finish."],
    finishHeading: "Four moods. One exact silhouette.",
    finishBody: "The colour shifts the atmosphere. The geometry never moves.",
    lifestyleHeading: "A boundary without a wall.",
    lifestyleBody: "SEUIL holds daily objects and keeps every sightline alive.",
    lifestyleScenes: [],
    outlinePath: "/reference/viaire-seuil-outline.svg",
    maskPath: "/reference/viaire-seuil-mask.svg",
    placementModes: ["against-wall", "divider"],
    projectionReferences: [
      "public/projection-kits/elan-o1/front-orthographic.png",
      "public/projection-kits/elan-o1/front-right-30.png",
      "public/projection-kits/elan-o1/rear-left-30.png",
    ],
    projectionAspectRatio: 102 / 184,
    geometryPromptLines: [
      "Exact product: VIAIRE SEUIL open tall cabinet, 102 x 184 x 42 cm.",
      "Canonical source of truth: the dimensioned manufacturer geometry, not a stylistic reinterpretation.",
      "The front face is exactly 1020 mm wide by 1840 mm high: width/height ratio 0.55435. The depth is exactly 420 mm, or 41.18% of the front width.",
      "Visual wall thickness is 70-80 mm. Exterior corner radius is 45-55 mm. Interior niche radius is 55-70 mm. Never make the frame thicker or the corners more bulbous.",
      "Left column: four identical 230 x 355 mm vertical niches at x 80-310 mm and y 80-435, 515-870, 950-1305 and 1385-1740 mm.",
      "Right column: one 550 x 540 mm dominant arch at x 390-940 and y 80-620 mm; two 550 x 230 mm niches at y 690-920 and 990-1220 mm; one 550 x 450 mm lower niche at y 1290-1740 mm.",
      "The base is a full uninterrupted 100 mm plinth from y 1740 to 1840 mm, slightly recessed, with no opening or visible feet.",
      "Every opening is open-backed. Preserve all coordinates, the continuous base and the exact asymmetric column proportions.",
    ],
  },
  "portee-o2": {
    id: "portee-o2",
    code: "PORTÉE",
    route: "/products/portee",
    title: "Open Low Cabinet",
    navigationLabel: "PORTÉE",
    category: "Open Low Cabinet",
    collectionLabel: "OPENINGS 01",
    baseline: "A long line. No new wall.",
    promise: "A low horizon that connects rather than divides.",
    localized: {
      en: {
        name: "PORTÉE",
        descriptor: "Open Low Cabinet",
        statement: "Two spaces. Still one room.",
        shortStatement: "A low horizon that draws the room together.",
        story: "Across a room, behind a sofa or along a wall, PORTÉE gathers books, ceramics and the traces of a life while both sides remain visibly connected.",
        galleryHeading: "A line that brings the room together.",
        detailLines: ["Open on both sides.", "Eight fixed openings.", "184 × 102 × 42 cm."],
      },
      fr: {
        name: "PORTÉE",
        descriptor: "Cabinet horizontal ouvert",
        statement: "Deux espaces. Toujours une seule pièce.",
        shortStatement: "Un horizon bas qui rassemble la pièce.",
        story: "En séparation, derrière un canapé ou le long d’un mur, PORTÉE accueille livres, céramiques et traces de vie tandis que les deux côtés restent reliés par le regard.",
        galleryHeading: "Une ligne qui rassemble la pièce.",
        detailLines: ["Ouvert des deux côtés.", "Huit ouvertures fixes.", "184 × 102 × 42 cm."],
      },
    },
    hero: productHeroes["portee-o2"].sage,
    heroFinishId: "sage",
    cardImage: productHeroes["portee-o2"].sage,
    storefrontHero: productHeroes["portee-o2"].sage,
    storefrontCardMedia: productHeroes["portee-o2"].sage,
    openBack: openBackMedia["portee-o2"],
    storefrontUsageScenes: [
      scene("portee-open", "Across the room", "A low landmark made of light and objects.", "/viaire/portee-o2/scenes/viaire-portee-sage-lifestyle", "PORTÉE in Sage across an open room."),
      scene("portee-distance", "Between two uses", "Living and dining remain visibly connected.", "/viaire/portee-o2/scenes/viaire-portee-chalk-lifestyle", "PORTÉE in Chalk connecting living and dining."),
      scene("portee-line", "Along the view", "The long silhouette never blocks the room.", "/viaire/portee-o2/scenes/viaire-portee-butter-lifestyle", "PORTÉE in Butter along a wall."),
    ],
    commerceProofs: [
      { label: "Dimensions", value: "184 × 102 × 42 cm" },
      { label: "Lead time", value: "20 working days" },
      { label: "Placement", value: "Wall or room divider" },
    ],
    dimensionsLabel: "184 × 102 × 42 cm",
    sizeCm: { width: 184, height: 102, depth: 42 },
    displayPrice: "From €3,000",
    priceByFinish: { chalk: "€3,000", butter: "€3,200", sage: "€3,300", "plaster-rose": "€3,500" },
    priceCentsByFinish: { chalk: 300000, butter: 320000, sage: 330000, "plaster-rose": 350000 },
    finishes: {
      chalk: { packshot: productMedia.portee.chalk, hero: productHeroes["portee-o2"].chalk, available: true, status: "generated" },
      butter: { packshot: productMedia.portee.butter, hero: productHeroes["portee-o2"].butter, available: true, status: "generated" },
      sage: { packshot: productMedia.portee.sage, hero: productHeroes["portee-o2"].sage, available: true, status: "generated" },
      "plaster-rose": { packshot: productMedia.portee.rose, hero: productHeroes["portee-o2"]["plaster-rose"], available: true, status: "generated" },
    },
    descriptionLines: ["A low form that separates without dividing.", "Open on both sides.", "Designed in France. Made to order."],
    detailBullets: ["Open-backed and freestanding.", "Eight immutable openings.", "Wall, sofa or divider placement."],
    finishHeading: "Colour changes the room, never the form.",
    finishBody: "The long silhouette remains exact in every finish.",
    lifestyleHeading: "More distance. No extra wall.",
    lifestyleBody: "PORTÉE stretches the room without weighing it down.",
    lifestyleScenes: [],
    outlinePath: "/reference/viaire-portee-outline.svg",
    maskPath: "/reference/viaire-portee-mask.svg",
    placementModes: ["against-wall", "divider"],
    projectionReferences: [
      "public/projection-kits/portee-o2/front-orthographic.png",
      "public/projection-kits/portee-o2/front-right-30.png",
      "public/projection-kits/portee-o2/rear-left-30.png",
    ],
    projectionAspectRatio: 184 / 102,
    geometryPromptLines: [
      "Exact product: VIAIRE PORTÉE open low cabinet, 184 x 102 x 42 cm.",
      "Canonical source of truth: the dimensioned manufacturer geometry, not a stylistic reinterpretation.",
      "The front face is exactly 1840 mm wide by 1020 mm high: width/height ratio 1.80392. The depth is exactly 420 mm, or 22.83% of the front width.",
      "Every external margin, upright and horizontal junction is 80 mm, matching SEUIL's visual material density. Exterior corner radius is 45-55 mm. Interior niche radius is 55-70 mm.",
      "Left column: three 300 mm-wide vertical niches at x 80-380 mm and y 80-307, 387-614 and 694-920 mm.",
      "Centre: one 580 x 440 mm dominant arch at x 460-1040 and y 80-520 mm; one 580 x 320 mm lower niche at y 600-920 mm.",
      "Right: two 640 x 200 mm niches at x 1120-1760 and y 80-280 and 360-560 mm; one 640 x 280 mm lower niche at y 640-920 mm.",
      "The base is a full uninterrupted 100 mm plinth from y 920 to 1020 mm, slightly recessed, with no opening or visible feet.",
      "Every opening is open-backed. Preserve all coordinates, the continuous base and the exact three-column proportions.",
    ],
  },
  "veille-o4": {
    id: "veille-o4",
    code: "VEILLE",
    route: "/products/veille",
    title: "Bedside Table",
    navigationLabel: "VEILLE",
    category: "Bedside Table",
    collectionLabel: "OPENINGS 01",
    baseline: "Night keeps its essentials close.",
    promise: "A small open architecture beside the bed.",
    localized: {
      en: {
        name: "VEILLE",
        descriptor: "Bedside Table",
        statement: "Last at night. First in the morning.",
        shortStatement: "A small open architecture for private rituals.",
        story: "A book before sleep. A glass in the night. Morning light across two quiet openings. VEILLE gives the smallest rituals a place of their own.",
        galleryHeading: "The quiet side of the room.",
        detailLines: ["Exactly two open compartments.", "Rounded monolithic silhouette.", "For books, a glass and the quiet beside the bed."],
      },
      fr: {
        name: "VEILLE",
        descriptor: "Table de chevet",
        statement: "Dernière le soir. Première le matin.",
        shortStatement: "Une petite architecture ouverte pour les rituels intimes.",
        story: "Un livre avant de dormir. Un verre dans la nuit. La lumière du matin sur deux ouvertures calmes. VEILLE donne aux plus petits rituels une place à eux.",
        galleryHeading: "Le côté calme de la pièce.",
        detailLines: ["Exactement deux compartiments ouverts.", "Silhouette monolithique arrondie.", "Pour les livres, un verre et le calme près du lit."],
      },
    },
    hero: productHeroes["veille-o4"]["plaster-rose"],
    heroFinishId: "plaster-rose",
    cardImage: productHeroes["veille-o4"]["plaster-rose"],
    storefrontHero: productHeroes["veille-o4"]["plaster-rose"],
    storefrontCardMedia: productHeroes["veille-o4"]["plaster-rose"],
    openBack: openBackMedia["veille-o4"],
    storefrontUsageScenes: [
      scene("veille-night", "Before sleep", "The essential stays close, the room stays calm.", "/viaire/veille-o4/scenes/viaire-veille-plaster-rose-lifestyle", "VEILLE in Rose Clay at early evening."),
      scene("veille-light", "At first light", "A small form catches the morning.", "/viaire/veille-o4/scenes/viaire-veille-butter-lifestyle", "VEILLE in Butter in morning light."),
      scene("veille-ritual", "Every night", "A book, a glass, one quiet place.", "/viaire/veille-o4/scenes/viaire-veille-sage-lifestyle", "VEILLE in Sage beside the bed."),
    ],
    commerceProofs: [
      { label: "Price", value: "From €750" },
      { label: "Lead time", value: "20 working days" },
      { label: "Form", value: "Two open compartments" },
    ],
    displayPrice: "From €750",
    priceByFinish: { chalk: "€750", butter: "€800", sage: "€850", "plaster-rose": "€900" },
    priceCentsByFinish: { chalk: 75000, butter: 80000, sage: 85000, "plaster-rose": 90000 },
    finishes: {
      chalk: { packshot: productMedia.veille.chalk, hero: productHeroes["veille-o4"].chalk, available: true, status: "generated" },
      butter: { packshot: productMedia.veille.butter, hero: productHeroes["veille-o4"].butter, available: true, status: "generated" },
      sage: { packshot: productMedia.veille.sage, hero: productHeroes["veille-o4"].sage, available: true, status: "generated" },
      "plaster-rose": { packshot: productMedia.veille.rose, hero: productHeroes["veille-o4"]["plaster-rose"], available: true, status: "generated" },
    },
    descriptionLines: ["A small open architecture beside the bed.", "Exactly two openings.", "Designed in France. Made to order."],
    detailBullets: ["Two open compartments.", "Rounded monolithic silhouette.", "Mineral matte finish."],
    finishHeading: "A small form with a distinct presence.",
    finishBody: "Each finish shifts the mood beside the bed.",
    lifestyleHeading: "The essential, close at hand.",
    lifestyleBody: "VEILLE holds a book, a glass and the quiet of night.",
    lifestyleScenes: [],
    outlinePath: "/reference/viaire-veille-outline.svg",
    maskPath: "/reference/viaire-veille-mask.svg",
    placementModes: ["against-wall", "divider"],
    projectionReferences: [
      "public/viaire/veille-o4/scenes/viaire-veille-chalk-lifestyle.webp",
      "public/viaire/veille-o4/scenes/viaire-veille-sage-lifestyle.webp",
      "public/viaire/veille-o4/scenes/viaire-veille-plaster-rose-lifestyle.webp",
    ],
    projectionAspectRatio: 0.68,
    geometryPromptLines: [
      "Exact product: VEILLE monolithic bedside table.",
      "Immutable geometry with exactly two visible openings.",
      "One large upper arch and one horizontal lower niche.",
      "No third niche, drawer, door or back panel.",
      "Preserve the rounded silhouette, full base, depth and proportions exactly.",
    ],
  },
};

for (const product of Object.values(products)) {
  product.lifestyleScenes = product.storefrontUsageScenes;
}

export const productList = productIds.map((id) => products[id]);

export const footerLinks = [
  { href: "/fiche-technique", label: "Technical sheet" },
  { href: "/mentions-legales", label: "Legal" },
  { href: `mailto:${siteMeta.leadEmail}`, label: "Contact" },
];

export const storefrontTrustPills = ["Designed in France", "Made to order", "Secure checkout"] as const;
export const storefrontCommerceNotes = [
  { title: "Made to order", copy: "Each piece is produced for your order and finished by hand." },
  { title: "Delivery", copy: "Shipping, duties and taxes are shown for your address before payment." },
  { title: "Assistance", copy: "Technical sheet and project support remain available before purchase." },
] as const;
export const projectionSellingPoints = ["Upload a room photo.", "Place the piece.", "Compare before and after."] as const;
export const homeFinishGallery = finishIds.map((finishId) => ({ finishId, media: products["elan-o1"].finishes[finishId].packshot }));
export const homeStoryScenes = [
  products["elan-o1"].storefrontUsageScenes[0],
  products["portee-o2"].storefrontUsageScenes[0],
  products["veille-o4"].storefrontUsageScenes[0],
  { id: "material-detail", label: "Material", caption: "A soft mineral surface, finished by hand.", media: materialDetails.chalk },
];
export const processNotes = storefrontCommerceNotes;
export const projectionLoadingSteps = [
  { title: "Reading the room", detail: "Floor, perspective and available space are being analysed." },
  { title: "Setting the scale", detail: "The selected geometry is placed without changing its proportions." },
  { title: "Matching light", detail: "Shadows and matte finish are adjusted to the room." },
] as const;

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

export function getFinishById(finishId: FinishId) {
  return finishes.find((finish) => finish.id === finishId) ?? finishes[0];
}

export function getFinishLabel(finishId: FinishId, locale: Locale) {
  return getFinishById(finishId).labels[locale];
}

export function isFinishId(value: string): value is FinishId {
  return finishIds.includes(value as FinishId);
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
  return `${locale === "fr" ? "/fr" : ""}${products[productId].route}`;
}

export function getHomeRoute(locale: Locale) {
  return locale === "fr" ? "/fr" : "/";
}

export function getProductGallery(productId: ProductId, finishId: FinishId, locale: Locale = "en"): ProductGalleryItem[] {
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const finish = getFinishMedia(productId, finishId);
  return [
    { id: `${productId}-${finishId}-context`, label: locale === "fr" ? "Dans la pièce" : "In the room", caption: copy.shortStatement, kind: "hero", media: finish.hero },
    { id: `${productId}-${finishId}-detail`, label: locale === "fr" ? "Matière" : "Material", caption: localizedSiteCopy[locale].originCopy, kind: "detail", media: materialDetails[finishId] },
    { id: `${productId}-open-back`, label: locale === "fr" ? "Dans une autre lumière" : "In another light", caption: locale === "fr" ? "La construction reste ouverte des deux côtés." : "The construction remains open on both sides.", kind: "scene", media: product.openBack },
  ];
}

export function getPlacementModesForProduct(productId: ProductId, locale: Locale = "en") {
  return products[productId].placementModes.map((id) => ({ id, label: getPlacementModeLabel(id, locale) }));
}

export function getPlacementModeLabel(mode: PlacementMode, locale: Locale = "en") {
  const labels: Record<Locale, Record<PlacementMode, string>> = {
    en: { "against-wall": "Against a wall", divider: "Room divider", "behind-sofa": "Behind a sofa", "under-window": "Under a window", bedside: "Beside the bed", other: "Other" },
    fr: { "against-wall": "Contre un mur", divider: "Séparation", "behind-sofa": "Derrière un canapé", "under-window": "Sous une fenêtre", bedside: "À côté du lit", other: "Autre" },
  };
  return labels[locale][mode];
}
