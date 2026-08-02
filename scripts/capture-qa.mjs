import { mkdir } from "node:fs/promises";

import { chromium } from "@playwright/test";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3012";
const viewports = [
  { label: "desktop-1440", width: 1440, height: 1000 },
  { label: "tablet-834", width: 834, height: 1112 },
  { label: "mobile-390", width: 390, height: 844 },
];

await mkdir("output/qa", { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      locale: "en-GB",
      viewport,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?product=seuil-01&finish=chalk`, {
      waitUntil: "domcontentloaded",
    });
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.8, 480);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForLoadState("load");
    await page.waitForTimeout(250);
    await page.screenshot({
      path: `output/qa/storefront-${viewport.label}.png`,
      fullPage: true,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`Captured ${viewports.length} production QA screenshots in output/qa.`);
