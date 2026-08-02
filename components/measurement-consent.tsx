"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import {
  createMeasurementConsent,
  getMeasurementConsent,
  saveMeasurementConsent,
} from "@/lib/measurement-consent";
import type { Locale } from "@/lib/isandre/catalog";

export default function MeasurementConsentManager({
  locale,
}: {
  locale: Locale;
}) {
  const copy = getContent(locale).measurement;
  const [open, setOpen] = useState(false);
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;

    window.queueMicrotask(() => {
      if (!cancelled) {
        setOpen(getMeasurementConsent() === null);
      }
    });

    function openPreferences() {
      setOpen(true);
    }

    window.addEventListener("isandre:consent-open", openPreferences);
    return () => {
      cancelled = true;
      window.removeEventListener("isandre:consent-open", openPreferences);
    };
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!open || !banner) return;

    function syncModalInertState() {
      if (!banner) return;
      banner.hidden =
        banner.hasAttribute("data-base-ui-inert") ||
        banner.getAttribute("aria-hidden") === "true";
    }

    syncModalInertState();
    const observer = new MutationObserver(syncModalInertState);
    observer.observe(banner, {
      attributes: true,
      attributeFilter: ["aria-hidden", "data-base-ui-inert"],
    });

    return () => observer.disconnect();
  }, [open]);

  function choose(analytics: boolean) {
    saveMeasurementConsent(createMeasurementConsent(analytics));
    setOpen(false);
  }

  if (!open) return null;

  return (
    <aside
      ref={bannerRef}
      className="measurement-consent"
      aria-labelledby="measurement-consent-title"
      role="region"
    >
      <div>
        <p id="measurement-consent-title">{copy.title}</p>
        <p>{copy.body}</p>
      </div>
      <div className="measurement-consent__actions">
        <Button variant="outline" onClick={() => choose(false)}>
          {copy.essentialOnly}
        </Button>
        <Button onClick={() => choose(true)}>{copy.allowAnalytics}</Button>
      </div>
    </aside>
  );
}
