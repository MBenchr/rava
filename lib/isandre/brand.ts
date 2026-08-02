export const brandPalette = {
  ink: "#1B1917",
  limewash: "#F4EFE6",
  paper: "#FCFBF7",
  stone: "#C9C0B2",
  umber: "#6D5B4B",
  passageCobalt: "#274C77",
} as const;

export const finishPalette = {
  chalk: "#F1EBE0",
  butter: "#E8CF7A",
  sage: "#7A8A77",
  "rose-clay": "#D8AB9E",
} as const;

export const brandTypography = {
  wordmark: "ISANDRE custom capitals",
  display: "Bodoni Moda",
  interface: "Manrope",
  references: "Manrope Medium with tabular numerals",
} as const;

/**
 * Human clearance gate. This value is deliberately code-reviewed rather than
 * environment-controlled: a deployment variable must never be able to turn an
 * unverified name into a cleared brand.
 */
export const brandClearance = {
  brandCleared: false,
  status: "pending-legal-and-linguistic-clearance",
  blockers: ["H-001", "H-002", "H-003"],
} as const;

export const brandAssets = {
  wordmark: {
    ink: "/brand/isandre-wordmark-positive.svg",
    paper: "/brand/isandre-wordmark-negative.svg",
  },
  entaille: {
    ink: "/brand/isandre-entaille-positive.svg",
    paper: "/brand/isandre-entaille-negative.svg",
  },
  lockup: {
    ink: "/brand/isandre-taqa-lockup-positive.svg",
    paper: "/brand/isandre-taqa-lockup-negative.svg",
  },
  favicon: "/brand/isandre-favicon.svg",
} as const;

export const entailleGeometry = {
  width: 100,
  height: 155,
  notchSize: 34,
  notchCenterY: 96.1,
} as const;

export const originPlateSpec = {
  widthMm: 42.07,
  heightMm: 26,
  ratio: 1.618,
  cornerRadiusMm: 0.8,
  thicknessMm: 1.2,
  frontSetbackMm: { min: 28, max: 32 },
  material: "Dark silicon bronze",
  finish: "Fine horizontal brush, matte patina",
  status: "prototype-required",
} as const;

export const brandUsageRules = {
  wordmarkMinimumScreenPx: 90,
  wordmarkMinimumPrintMm: 18,
  entaille: [
    "Never transform the notch into an arch.",
    "Never add a second notch.",
    "Never round the sign.",
    "Never repeat it as a decorative pattern.",
    "Never fill it with photography, gradients or effects.",
  ],
  origin: [
    "Use DESIGNED IN FRANCE and MADE TO ORDER IN ITALY only with matching supplier and order records.",
    "Keep the plate invisible in a strict frontal product view.",
    "Validate legibility, fixation and NFC on a physical prototype.",
  ],
} as const;

export type BrandTone = "ink" | "paper";
