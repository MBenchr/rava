import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 1440, height: 1000 },
  { width: 1280, height: 900 },
  { width: 834, height: 1112 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth + 1);
}

test("storefront remains usable across the release viewport matrix", async ({
  page,
}) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/?product=seuil-01&finish=chalk");

    await expect(
      page.getByRole("heading", { level: 1, name: /The room continues/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add to bag" }).first(),
    ).toBeVisible();
    const heroImage = page
      .getByRole("region", { name: "The room continues." })
      .getByRole("img")
      .first();
    await expect(heroImage).toBeVisible();
    await expect
      .poll(() => heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
    await expectNoHorizontalOverflow(page);
  }
});

test("product page preserves purchase controls without overflow", async ({
  page,
}) => {
  for (const viewport of [
    { width: 834, height: 1112 },
    { width: 360, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/products/portee-02?finish=sage");

    await expect(
      page.getByRole("heading", { level: 1, name: "PORTÉE 02" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add to bag" }).first(),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("mobile sticky purchase bar is not obscured by inline Stripe UI", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/products/veille-03?finish=butter");
  await page.evaluate(() => window.scrollTo(0, 1400));

  const stickyBar = page.locator(".mobile-buy-bar");
  await expect(stickyBar).toBeVisible();
  await expect(stickyBar.getByRole("button", { name: "Buy now" })).toBeVisible();
  await expect(page.locator(".purchase-panel__express")).toHaveCount(0);
});

test("making story remains complete and responsive in both languages", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/making");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "One form. Made as one.",
      }),
    ).toBeVisible();
    await expect(page.locator(".making-frame")).toHaveCount(3);
    await expect(page.locator(".making-room-card")).toHaveCount(3);
    await expectNoHorizontalOverflow(page);
  }

  await page.goto("/fr/fabrication");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Une forme. Faite d’un seul tenant.",
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr-FR");
});
