import type { Locale } from "@/lib/rava-content";

export const marketCodes = [
  "FR",
  "MC",
  "BE",
  "LU",
  "CH",
  "NL",
  "DE",
  "GB",
  "AT",
  "IE",
  "ES",
  "IT",
  "PT",
  "DK",
  "CZ",
  "SE",
  "NO",
  "FI",
  "PL",
  "US",
  "CA",
  "AU",
  "NZ",
  "JP",
  "KR",
  "SG",
  "HK",
  "AE",
  "QA",
  "SA",
] as const;

export type MarketCode = (typeof marketCodes)[number];

export type Market = {
  code: MarketCode;
  labels: Record<Locale, string>;
  currency: string;
  currencyRateFromEur: number;
  catalogAnchorMajor: number;
  priceRoundMajor: number;
  shippingRoundMajor: number;
  shippingEurCents: 6000 | 6500 | 7000 | 7500 | 8000 | 8500 | 9000;
  taxBehavior: "inclusive" | "exclusive";
  stripeLocale:
    | "auto"
    | "cs"
    | "da"
    | "de"
    | "en"
    | "en-GB"
    | "es"
    | "fi"
    | "fr"
    | "it"
    | "ja"
    | "ko"
    | "nb"
    | "nl"
    | "pl"
    | "pt"
    | "sv";
  storefrontLocale: Locale;
  region: "france" | "near-eu" | "europe" | "international";
};

const eur = {
  currency: "EUR",
  currencyRateFromEur: 1,
  catalogAnchorMajor: 3000,
  priceRoundMajor: 50,
  shippingRoundMajor: 5,
  taxBehavior: "inclusive" as const,
} as const;

export const markets: Record<MarketCode, Market> = {
  FR: { code: "FR", labels: { en: "France", fr: "France" }, ...eur, shippingEurCents: 6000, stripeLocale: "fr", storefrontLocale: "fr", region: "france" },
  MC: { code: "MC", labels: { en: "Monaco", fr: "Monaco" }, ...eur, shippingEurCents: 6000, stripeLocale: "fr", storefrontLocale: "fr", region: "france" },
  BE: { code: "BE", labels: { en: "Belgium", fr: "Belgique" }, ...eur, shippingEurCents: 6500, stripeLocale: "auto", storefrontLocale: "fr", region: "near-eu" },
  LU: { code: "LU", labels: { en: "Luxembourg", fr: "Luxembourg" }, ...eur, shippingEurCents: 6500, stripeLocale: "fr", storefrontLocale: "fr", region: "near-eu" },
  CH: { code: "CH", labels: { en: "Switzerland", fr: "Suisse" }, currency: "CHF", currencyRateFromEur: 0.96, catalogAnchorMajor: 3000, priceRoundMajor: 50, shippingRoundMajor: 5, shippingEurCents: 6500, taxBehavior: "exclusive", stripeLocale: "auto", storefrontLocale: "fr", region: "near-eu" },
  NL: { code: "NL", labels: { en: "Netherlands", fr: "Pays-Bas" }, ...eur, shippingEurCents: 7000, stripeLocale: "nl", storefrontLocale: "en", region: "near-eu" },
  DE: { code: "DE", labels: { en: "Germany", fr: "Allemagne" }, ...eur, shippingEurCents: 7000, stripeLocale: "de", storefrontLocale: "en", region: "near-eu" },
  GB: { code: "GB", labels: { en: "United Kingdom", fr: "Royaume-Uni" }, currency: "GBP", currencyRateFromEur: 0.86, catalogAnchorMajor: 2600, priceRoundMajor: 50, shippingRoundMajor: 5, shippingEurCents: 7000, taxBehavior: "exclusive", stripeLocale: "en-GB", storefrontLocale: "en", region: "near-eu" },
  AT: { code: "AT", labels: { en: "Austria", fr: "Autriche" }, ...eur, shippingEurCents: 7500, stripeLocale: "de", storefrontLocale: "en", region: "europe" },
  IE: { code: "IE", labels: { en: "Ireland", fr: "Irlande" }, ...eur, shippingEurCents: 7500, stripeLocale: "en", storefrontLocale: "en", region: "europe" },
  ES: { code: "ES", labels: { en: "Spain", fr: "Espagne" }, ...eur, shippingEurCents: 7500, stripeLocale: "es", storefrontLocale: "en", region: "europe" },
  IT: { code: "IT", labels: { en: "Italy", fr: "Italie" }, ...eur, shippingEurCents: 7500, stripeLocale: "it", storefrontLocale: "en", region: "europe" },
  PT: { code: "PT", labels: { en: "Portugal", fr: "Portugal" }, ...eur, shippingEurCents: 8000, stripeLocale: "pt", storefrontLocale: "en", region: "europe" },
  DK: { code: "DK", labels: { en: "Denmark", fr: "Danemark" }, currency: "DKK", currencyRateFromEur: 7.46, catalogAnchorMajor: 22500, priceRoundMajor: 500, shippingRoundMajor: 25, shippingEurCents: 8000, taxBehavior: "inclusive", stripeLocale: "da", storefrontLocale: "en", region: "europe" },
  CZ: { code: "CZ", labels: { en: "Czechia", fr: "Tchéquie" }, currency: "CZK", currencyRateFromEur: 24.8, catalogAnchorMajor: 75000, priceRoundMajor: 1000, shippingRoundMajor: 100, shippingEurCents: 8000, taxBehavior: "inclusive", stripeLocale: "cs", storefrontLocale: "en", region: "europe" },
  SE: { code: "SE", labels: { en: "Sweden", fr: "Suède" }, currency: "SEK", currencyRateFromEur: 11.2, catalogAnchorMajor: 34000, priceRoundMajor: 500, shippingRoundMajor: 50, shippingEurCents: 8500, taxBehavior: "inclusive", stripeLocale: "sv", storefrontLocale: "en", region: "europe" },
  NO: { code: "NO", labels: { en: "Norway", fr: "Norvège" }, currency: "NOK", currencyRateFromEur: 11.7, catalogAnchorMajor: 35000, priceRoundMajor: 500, shippingRoundMajor: 50, shippingEurCents: 8500, taxBehavior: "exclusive", stripeLocale: "nb", storefrontLocale: "en", region: "europe" },
  FI: { code: "FI", labels: { en: "Finland", fr: "Finlande" }, ...eur, shippingEurCents: 8500, stripeLocale: "fi", storefrontLocale: "en", region: "europe" },
  PL: { code: "PL", labels: { en: "Poland", fr: "Pologne" }, currency: "PLN", currencyRateFromEur: 4.3, catalogAnchorMajor: 13000, priceRoundMajor: 100, shippingRoundMajor: 20, shippingEurCents: 8500, taxBehavior: "inclusive", stripeLocale: "pl", storefrontLocale: "en", region: "europe" },
  US: { code: "US", labels: { en: "United States", fr: "États-Unis" }, currency: "USD", currencyRateFromEur: 1.09, catalogAnchorMajor: 3300, priceRoundMajor: 100, shippingRoundMajor: 10, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "en", storefrontLocale: "en", region: "international" },
  CA: { code: "CA", labels: { en: "Canada", fr: "Canada" }, currency: "CAD", currencyRateFromEur: 1.49, catalogAnchorMajor: 4500, priceRoundMajor: 100, shippingRoundMajor: 10, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "auto", storefrontLocale: "en", region: "international" },
  AU: { code: "AU", labels: { en: "Australia", fr: "Australie" }, currency: "AUD", currencyRateFromEur: 1.66, catalogAnchorMajor: 5000, priceRoundMajor: 100, shippingRoundMajor: 10, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "en", storefrontLocale: "en", region: "international" },
  NZ: { code: "NZ", labels: { en: "New Zealand", fr: "Nouvelle-Zélande" }, currency: "NZD", currencyRateFromEur: 1.81, catalogAnchorMajor: 5500, priceRoundMajor: 100, shippingRoundMajor: 10, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "en", storefrontLocale: "en", region: "international" },
  JP: { code: "JP", labels: { en: "Japan", fr: "Japon" }, currency: "JPY", currencyRateFromEur: 170, catalogAnchorMajor: 510000, priceRoundMajor: 5000, shippingRoundMajor: 500, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "ja", storefrontLocale: "en", region: "international" },
  KR: { code: "KR", labels: { en: "South Korea", fr: "Corée du Sud" }, currency: "KRW", currencyRateFromEur: 1600, catalogAnchorMajor: 4800000, priceRoundMajor: 50000, shippingRoundMajor: 5000, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "ko", storefrontLocale: "en", region: "international" },
  SG: { code: "SG", labels: { en: "Singapore", fr: "Singapour" }, currency: "SGD", currencyRateFromEur: 1.47, catalogAnchorMajor: 4400, priceRoundMajor: 50, shippingRoundMajor: 5, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "en", storefrontLocale: "en", region: "international" },
  HK: { code: "HK", labels: { en: "Hong Kong", fr: "Hong Kong" }, currency: "HKD", currencyRateFromEur: 8.5, catalogAnchorMajor: 25500, priceRoundMajor: 500, shippingRoundMajor: 50, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "en", storefrontLocale: "en", region: "international" },
  AE: { code: "AE", labels: { en: "United Arab Emirates", fr: "Émirats arabes unis" }, currency: "AED", currencyRateFromEur: 4, catalogAnchorMajor: 12000, priceRoundMajor: 500, shippingRoundMajor: 25, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "auto", storefrontLocale: "en", region: "international" },
  QA: { code: "QA", labels: { en: "Qatar", fr: "Qatar" }, currency: "QAR", currencyRateFromEur: 3.97, catalogAnchorMajor: 12000, priceRoundMajor: 500, shippingRoundMajor: 25, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "auto", storefrontLocale: "en", region: "international" },
  SA: { code: "SA", labels: { en: "Saudi Arabia", fr: "Arabie saoudite" }, currency: "SAR", currencyRateFromEur: 4.09, catalogAnchorMajor: 12500, priceRoundMajor: 500, shippingRoundMajor: 25, shippingEurCents: 9000, taxBehavior: "exclusive", stripeLocale: "auto", storefrontLocale: "en", region: "international" },
};

export const marketList = marketCodes.map((code) => markets[code]);

export function isMarketCode(value: unknown): value is MarketCode {
  return typeof value === "string" && marketCodes.includes(value as MarketCode);
}

export function getMarket(code: MarketCode) {
  return markets[code];
}

function roundMajor(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function getMarketAmountCentsFromEur(
  euroCents: number,
  marketCode: MarketCode,
  kind: "price" | "shipping" = "price",
) {
  const market = getMarket(marketCode);
  const major =
    kind === "price"
      ? (euroCents / 300_000) * market.catalogAnchorMajor
      : (euroCents / 100) * market.currencyRateFromEur;
  const step = kind === "price" ? market.priceRoundMajor : market.shippingRoundMajor;

  return roundMajor(major, step) * 100;
}

export function getMarketShippingCents(marketCode: MarketCode) {
  const market = getMarket(marketCode);

  return getMarketAmountCentsFromEur(market.shippingEurCents, marketCode, "shipping");
}

export function formatMarketAmount(amountCents: number, marketCode: MarketCode, locale: Locale) {
  const market = getMarket(marketCode);

  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: market.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

export function formatMarketPriceFromEur(
  euroCents: number,
  marketCode: MarketCode,
  locale: Locale,
) {
  return formatMarketAmount(
    getMarketAmountCentsFromEur(euroCents, marketCode, "price"),
    marketCode,
    locale,
  );
}

export function getDefaultMarketCode(locale: Locale): MarketCode {
  return locale === "fr" ? "FR" : "GB";
}
