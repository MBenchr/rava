"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/rava-content";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  tone?: "light" | "dark";
  className?: string;
  locale?: Locale;
};

export default function QuantityStepper({
  value,
  onChange,
  tone = "light",
  className,
  locale = "en",
}: QuantityStepperProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1 py-1",
        dark
          ? "border-white/10 bg-white/10 text-white"
          : "border-black/8 bg-white/78 text-foreground",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label={locale === "fr" ? "Réduire la quantité" : "Decrease quantity"}
        className={
          dark
            ? "border-white/14 bg-white/10 text-white hover:border-white/20 hover:bg-white/14"
            : undefined
        }
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus />
      </Button>
      <span className={cn("min-w-8 text-center text-sm font-medium", dark ? "text-white" : "text-foreground")}>
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-label={locale === "fr" ? "Augmenter la quantité" : "Increase quantity"}
        className={
          dark
            ? "border-white/14 bg-white/10 text-white hover:border-white/20 hover:bg-white/14"
            : undefined
        }
        onClick={() => onChange(Math.min(12, value + 1))}
      >
        <Plus />
      </Button>
    </div>
  );
}
