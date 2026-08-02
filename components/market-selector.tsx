"use client";

import { Globe2 } from "lucide-react";

import { useMarket } from "@/components/market-provider";
import { marketList } from "@/lib/markets";
import type { Locale } from "@/lib/isandre/catalog";

type MarketSelectorProps = {
  locale: Locale;
  compact?: boolean;
};

export default function MarketSelector({ locale, compact = false }: MarketSelectorProps) {
  const { market, marketCode, setMarketCode } = useMarket();

  return (
    <label className={compact ? "market-selector market-selector--compact" : "market-selector"}>
      <Globe2 aria-hidden="true" className="size-4" />
      <span className="sr-only">{locale === "fr" ? "Pays de livraison" : "Delivery country"}</span>
      <select
        aria-label={locale === "fr" ? "Pays de livraison" : "Delivery country"}
        value={marketCode}
        onChange={(event) => setMarketCode(event.target.value as typeof marketCode)}
      >
        {marketList.map((option) => (
          <option key={option.code} value={option.code}>
            {option.labels[locale]} · {option.currency}
          </option>
        ))}
      </select>
      {compact ? <span aria-hidden="true">{market.currency}</span> : null}
    </label>
  );
}
