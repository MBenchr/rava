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
import type { Locale } from "@/lib/isandre/catalog";

type MarketContextValue = {
  marketCode: MarketCode;
  market: ReturnType<typeof getMarket>;
  setMarketCode: (marketCode: MarketCode) => void;
  source: "detected" | "manual";
};

const STORAGE_KEY = "isandre-market-v1";
const COOKIE_KEY = "isandre-market";
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
  initialMarketCode,
  locale,
}: PropsWithChildren<{ initialMarketCode?: MarketCode; locale?: Locale }>) {
  const activeLocale =
    locale ??
    (typeof window !== "undefined" && window.location.pathname.startsWith("/fr") ? "fr" : "en");
  const [marketCode, setMarketCodeState] = useState<MarketCode>(
    initialMarketCode ?? getDefaultMarketCode(activeLocale),
  );
  const [source, setSource] = useState<"detected" | "manual">("detected");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (isMarketCode(saved)) {
      window.localStorage.setItem(STORAGE_KEY, saved);
      window.queueMicrotask(() => {
        setMarketCodeState(saved);
        setSource("manual");
      });
      return;
    }

    if (!initialMarketCode) {
      window.queueMicrotask(() => setMarketCodeState(inferBrowserMarket(activeLocale)));
    }
  }, [activeLocale, initialMarketCode]);

  function setMarketCode(nextMarketCode: MarketCode) {
    setMarketCodeState(nextMarketCode);
    setSource("manual");
    window.localStorage.setItem(STORAGE_KEY, nextMarketCode);
    document.cookie = `${COOKIE_KEY}=${nextMarketCode}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  const value = useMemo(
    () => ({ marketCode, market: getMarket(marketCode), setMarketCode, source }),
    [marketCode, source],
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
