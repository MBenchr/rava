import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

import { chromium } from "@playwright/test";

const baseUrl = process.env.PERFORMANCE_BASE_URL ?? "http://127.0.0.1:3012";
const viewports = [
  { width: 1440, height: 1000 },
  { width: 1280, height: 900 },
  { width: 834, height: 1112 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      locale: "en-GB",
      viewport,
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__isandreVitals = { cls: 0, inp: 0, lcp: 0 };

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries.at(-1);
        if (last) window.__isandreVitals.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__isandreVitals.cls += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.interactionId) {
            window.__isandreVitals.inp = Math.max(
              window.__isandreVitals.inp,
              entry.duration,
            );
          }
        }
      }).observe({ type: "event", buffered: true, durationThreshold: 16 });
    });

    await page.goto(`${baseUrl}/?product=seuil-01&finish=chalk`, {
      waitUntil: "domcontentloaded",
    });

    const hero = page.locator(".storefront-fold__visual img").first();
    await hero.waitFor({ state: "visible" });
    await page.waitForFunction(
      () =>
        document.querySelector(".storefront-fold__visual img")?.naturalWidth >
        0,
    );
    await page.waitForTimeout(800);

    await page.getByRole("button", { name: /^Butter —/ }).first().click();
    await page.waitForURL(/finish=butter/u);
    await page.waitForFunction(() =>
      document
        .querySelector(".storefront-fold__visual > picture")
        ?.getAttribute("data-image-src")
        ?.includes("/butter/"),
    );
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(() => window.__isandreVitals);
    const result = { viewport, ...metrics };
    results.push(result);

    assert.ok(
      result.lcp > 0 && result.lcp <= 2_500,
      `${viewport.width}px LCP ${result.lcp.toFixed(1)}ms exceeds 2500ms`,
    );
    assert.ok(
      result.cls <= 0.1,
      `${viewport.width}px CLS ${result.cls.toFixed(4)} exceeds 0.1`,
    );
    assert.ok(
      result.inp <= 200,
      `${viewport.width}px INP ${result.inp.toFixed(1)}ms exceeds 200ms`,
    );

    await context.close();
  }
} finally {
  await browser.close();
}

await mkdir("output/qa", { recursive: true });
await writeFile(
  "output/qa/performance.json",
  `${JSON.stringify(
    {
      baseUrl,
      measuredAt: new Date().toISOString(),
      thresholds: { cls: 0.1, inpMs: 200, lcpMs: 2_500 },
      results,
    },
    null,
    2,
  )}\n`,
);

console.log(
  results
    .map(
      ({ viewport, lcp, cls, inp }) =>
        `${viewport.width}px: LCP ${lcp.toFixed(0)}ms, CLS ${cls.toFixed(3)}, INP ${inp.toFixed(0)}ms`,
    )
    .join("\n"),
);
