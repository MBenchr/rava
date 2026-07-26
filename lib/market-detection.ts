import {
  getDefaultMarketCode,
  isMarketCode,
  type MarketCode,
} from "@/lib/markets";
import type { Locale } from "@/lib/rava-content";

const COUNTRY_HEADERS = [
  "x-viaire-country",
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-country-code",
] as const;

export function detectMarketFromHeaders(
  headers: Pick<Headers, "get">,
  locale: Locale,
): MarketCode {
  for (const header of COUNTRY_HEADERS) {
    const country = headers.get(header)?.trim().toUpperCase();

    if (isMarketCode(country)) {
      return country;
    }
  }

  const browserRegion = headers
    .get("accept-language")
    ?.match(/\b[a-z]{2}-([A-Z]{2})\b/i)?.[1]
    ?.toUpperCase();

  return isMarketCode(browserRegion)
    ? browserRegion
    : getDefaultMarketCode(locale);
}

export function detectLocaleFromHeaders(headers: Pick<Headers, "get">): Locale {
  const accepted = headers.get("accept-language")?.toLowerCase() ?? "";

  return accepted
    .split(",")
    .map((entry) => entry.trim())
    .some((entry) => entry === "fr" || entry.startsWith("fr-"))
    ? "fr"
    : "en";
}
