import type { FinishId, ProductId } from "@/lib/isandre/catalog";

export type IndustrialStatus =
  | "target"
  | "prototype-required"
  | "supplier-required"
  | "laboratory-required"
  | "blocked"
  | "approved";

export type NumericRange = {
  min: number;
  max: number;
  unit: string;
  status: IndustrialStatus;
};

export type ProductIndustrialSpec = {
  productId: ProductId;
  status: IndustrialStatus;
  manufacturingRoute: "rotomoulded-lldpe" | "unvalidated";
  fallbackRoute: "gfrp-mineral-finish" | null;
  nominalSkinMm: number | null;
  installedWeightKg: NumericRange | null;
  removableBallastKg: NumericRange | null;
  targetFactoryCostEur: NumericRange | null;
  maximumLandedCostEur: NumericRange | null;
  declaredLoadsKg: Record<string, NumericRange>;
  blockingReason?: string;
};

export const materialPlatform = {
  version: "2026.07.27-1",
  status: "prototype-required" as const,
  primary: "rotomoulded-lldpe" as const,
  fallback: "gfrp-mineral-finish" as const,
  marketUse: "indoor-launch" as const,
  resin: {
    family: "Furniture-grade LLDPE",
    colour: "Mass-coloured",
    uvStabilisation: "Supplier declaration required before any outdoor claim",
  },
  surface: {
    description: "Nearly smooth, low eggshell sheen, no decorative grain",
    gloss60Gu: { min: 8, max: 15, unit: "GU", status: "prototype-required" },
    opticalReliefUm: {
      min: 30,
      max: 50,
      unit: "µm",
      status: "prototype-required",
    },
    openPorosityAllowed: false,
    visibleMouldJointAllowed: false,
    visibleVentAllowed: false,
    fauxMaterialEffectsAllowed: false,
  },
  architecture: {
    nominalSkinMm: 7,
    localMinimumMm: null,
    visualSectionMm: 80,
    removableBallast: true,
    hiddenAdjustableFeet: true,
    antiTipKitForTallProduct: true,
  },
} as const;

export const industrialFinishSpecs = {
  chalk: {
    id: "chalk",
    commercialName: { en: "Chalk", fr: "Craie" },
    industrialWorkingName: "Warm ivory",
    goldenSampleStatus: "prototype-required",
  },
  butter: {
    id: "butter",
    commercialName: { en: "Butter", fr: "Beurre" },
    industrialWorkingName: "Pale warm yellow",
    goldenSampleStatus: "prototype-required",
  },
  sage: {
    id: "sage",
    commercialName: { en: "Sage", fr: "Sauge" },
    industrialWorkingName: "Greyed sage green",
    goldenSampleStatus: "prototype-required",
  },
  "rose-clay": {
    id: "rose-clay",
    commercialName: { en: "Rose Clay", fr: "Argile rose" },
    industrialWorkingName: "Plaster rose",
    goldenSampleStatus: "prototype-required",
  },
} as const satisfies Record<
  FinishId,
  {
    id: FinishId;
    commercialName: { en: string; fr: string };
    industrialWorkingName: string;
    goldenSampleStatus: IndustrialStatus;
  }
>;

const load = (min: number, max: number): NumericRange => ({
  min,
  max,
  unit: "kg",
  status: "laboratory-required",
});

export const productIndustrialSpecs: Record<ProductId, ProductIndustrialSpec> = {
  "seuil-01": {
    productId: "seuil-01",
    status: "prototype-required",
    manufacturingRoute: "rotomoulded-lldpe",
    fallbackRoute: "gfrp-mineral-finish",
    nominalSkinMm: 7,
    installedWeightKg: {
      min: 80,
      max: 88,
      unit: "kg",
      status: "prototype-required",
    },
    removableBallastKg: {
      min: 20,
      max: 25,
      unit: "kg",
      status: "prototype-required",
    },
    targetFactoryCostEur: {
      min: 650,
      max: 900,
      unit: "EUR",
      status: "supplier-required",
    },
    maximumLandedCostEur: {
      min: 850,
      max: 1150,
      unit: "EUR",
      status: "supplier-required",
    },
    declaredLoadsKg: {
      smallOpening: load(3, 5),
      mainArch: load(8, 12),
      horizontalOpening: load(8, 10),
      lowerOpening: load(10, 15),
    },
  },
  "portee-02": {
    productId: "portee-02",
    status: "prototype-required",
    manufacturingRoute: "rotomoulded-lldpe",
    fallbackRoute: "gfrp-mineral-finish",
    nominalSkinMm: 7,
    installedWeightKg: {
      min: 72,
      max: 80,
      unit: "kg",
      status: "prototype-required",
    },
    removableBallastKg: {
      min: 10,
      max: 15,
      unit: "kg",
      status: "laboratory-required",
    },
    targetFactoryCostEur: {
      min: 700,
      max: 950,
      unit: "EUR",
      status: "supplier-required",
    },
    maximumLandedCostEur: {
      min: 900,
      max: 1200,
      unit: "EUR",
      status: "supplier-required",
    },
    declaredLoadsKg: {
      smallOpening: load(3, 5),
      mainArch: load(8, 12),
      longOpening: load(8, 15),
    },
  },
  "veille-03": {
    productId: "veille-03",
    status: "blocked",
    manufacturingRoute: "unvalidated",
    fallbackRoute: null,
    nominalSkinMm: null,
    installedWeightKg: null,
    removableBallastKg: null,
    targetFactoryCostEur: null,
    maximumLandedCostEur: null,
    declaredLoadsKg: {},
    blockingReason:
      "External dimensions, opening coordinates and manufacturing geometry require approval before RFQ pricing.",
  },
};

export const validationProgramme = {
  couponFamilies: [
    "LLDPE 15–30 µm at 8, 12 and 15 GU",
    "LLDPE 30–50 µm at 8, 12 and 15 GU",
    "LLDPE 50–80 µm at 8, 12 and 15 GU",
    "LLDPE 80–150 µm rejection witness",
    "GFRP mineral-finish fallback witness",
    "Full-scale moulded radius and trimming/joint sample",
  ],
  standardsToConfirmWithLaboratory: [
    "EN 14749:2016+A1:2022",
    "EN 16122",
    "Regulation (EU) 2023/988 (GPSR)",
    "ISTA 2C development test",
    "ISTA 3B LTL distribution test",
    "Regulation (EU) 2025/40 (PPWR)",
  ],
  hardGates: [
    "Canonical geometry unchanged",
    "No visible joint, vent, sink or open porosity on A-surfaces",
    "Stable on hard floor and carpet",
    "Declared load, creep and residual deflection accepted by laboratory",
    "Packaged product passes the selected distribution test",
    "Golden sample approved under D65 and warm residential light",
  ],
} as const;

export const packagingTargets = {
  status: "prototype-required" as const,
  packedVolumeM3: { min: 1, max: 1.2, unit: "m³" },
  design: [
    "Non-abrasive reusable sleeve",
    "Reusable EPP or PE corner and edge protectors",
    "Honeycomb board frame",
    "Demountable pallet base",
    "Separate ballast package",
    "Two-person handling straps integrated into packaging only",
  ],
  prohibited: [
    "Loose expanded-polystyrene fill",
    "Permanent adhesive directly on the product",
    "Decorative void or double-boxing without test evidence",
    "Wooden crate for routine European deliveries",
  ],
} as const;
