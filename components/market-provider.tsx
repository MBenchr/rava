"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getDefaultMarketCode,
  getMarket,
  isMarketCode,
  type MarketCode,
} from "@/lib/markets";
import type { Locale } from "@/lib/rava-content";

type MarketContextValue = {
  marketCode: MarketCode;
  market: ReturnType<typeof getMarket>;
  setMarketCode: (marketCode: MarketCode) => void;
};

const STORAGE_KEY = "viaire-market-v1";
const MarketContext = createContext<MarketContextValue | null>(null);

function inferBrowserMarket(locale: Locale): MarketCode {
  const region = navigator.language.split("-")[1]?.toUpperCase();

  if (isMarketCode(region)) {
    return region;
  }

  return getDefaultMarketCode(locale);
}

export function MarketProvider({
  children,
  locale,
}: PropsWithChildren<{ locale?: Locale }>) {
  const activeLocale =
    locale ??
    (typeof window !== "undefined" && window.location.pathname.startsWith("/fr") ? "fr" : "en");
  const [marketCode, setMarketCode] = useState<MarketCode>(getDefaultMarketCode(activeLocale));

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const next = isMarketCode(saved) ? saved : inferBrowserMarket(activeLocale);
    window.queueMicrotask(() => setMarketCode(next));
  }, [activeLocale]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, marketCode);
  }, [marketCode]);

  const value = useMemo(
    () => ({ marketCode, market: getMarket(marketCode), setMarketCode }),
    [marketCode],
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const context = useContext(MarketContext);

  if (!context) {
    throw new Error("useMarket must be used inside MarketProvider.");
  }

  return context;
}
