export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const productIds = ["seuil-01", "portee-02", "veille-03"] as const;
export type ProductId = (typeof productIds)[number];

export const finishIds = ["chalk", "butter", "sage", "rose-clay"] as const;
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

export const legacyProductIdMap = {
  "elan-o1": "seuil-01",
  "portee-o2": "portee-02",
  "veille-o4": "veille-03",
} as const satisfies Record<string, ProductId>;

export const legacyFinishIdMap = {
  "plaster-rose": "rose-clay",
} as const satisfies Record<string, FinishId>;

export type LegacyProductId = keyof typeof legacyProductIdMap;
export type LegacyFinishId = keyof typeof legacyFinishIdMap;
