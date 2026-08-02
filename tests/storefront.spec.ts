import path from "node:path";

import { expect, test } from "@playwright/test";

const roomImage = path.join(
  process.cwd(),
  "media",
  "a7-sources",
  "seuil-01",
  "d01",
  "chalk.png",
);

test("root remains English even when the browser prefers French", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({
    "accept-language": "fr-FR,fr;q=0.9,en;q=0.8",
  });
  await page.goto("/");

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
  await expect(
    page.getByRole("heading", { level: 1, name: /The room continues/ }),
  ).toBeVisible();
});

test("variant changes keep the current hero visible while the next image decodes", async ({
  page,
}) => {
  let releaseButterImage: () => void = () => {};
  const butterImageGate = new Promise<void>((resolve) => {
    releaseButterImage = resolve;
  });

  await page.route(
    "**/isandre/media/seuil-01/d01/butter/*",
    async (route) => {
      await butterImageGate;
      await route.continue();
    },
  );

  await page.goto("/");

  const heroPicture = page.locator(".storefront-fold__visual > picture");
  const heroImage = heroPicture.locator("img");
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /seuil-01\/d01\/chalk\/index\.webp/,
  );
  await expect
    .poll(() => heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);

  await page.getByRole("button", { name: /Butter/ }).first().click();

  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /seuil-01\/d01\/chalk\/index\.webp/,
    { timeout: 1_000 },
  );
  await expect
    .poll(() => heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  releaseButterImage();
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /seuil-01\/d01\/butter\/index\.webp/,
    { timeout: 10_000 },
  );

  await page
    .getByRole("button", { name: "PORTÉE 02, Open Low Cabinet", exact: true })
    .click();
  await expect(page).toHaveURL(/product=portee-02&finish=butter/);
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /portee-02\/d01\/butter\/index\.webp/,
  );

  await page
    .getByRole("button", { name: "VEILLE 03, Bedside Table", exact: true })
    .click();
  await expect(page).toHaveURL(/product=veille-03&finish=butter/);
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /veille-03\/d01\/butter\/index\.webp/,
  );

  await page.getByRole("button", { name: /Sage/ }).first().click();
  await expect(page).toHaveURL(/product=veille-03&finish=sage/);
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /veille-03\/d01\/sage\/index\.webp/,
  );
});

test("shared product pages keep commerce, proof and project support aligned", async ({
  page,
}) => {
  await page.goto("/products/seuil-01?finish=chalk");

  await expect(page.locator(".product-commerce")).toHaveCount(1);
  await expect(page.locator(".product-story")).toHaveCount(1);
  await expect(page.locator(".product-details")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "SEUIL 01" })).toBeVisible();

  await page.getByRole("button", { name: /Sage/ }).first().click();
  await expect(page).toHaveURL(/\/products\/seuil-01\?finish=sage/);

  await page.getByRole("button", { name: "Product view" }).click();
  await expect
    .poll(() =>
      page
        .locator(".product-gallery__stage img")
        .evaluate((image) => getComputedStyle(image).objectFit),
    )
    .toBe("contain");

  const proofImages = page.locator(".product-story__gallery img");
  await expect(proofImages).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await proofImages.nth(index).scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        proofImages
          .nth(index)
          .evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  const productDetails = page.locator(".product-details");
  const technicalSheetButton = productDetails.getByRole("button", {
    name: "Technical sheet",
  });
  await expect(technicalSheetButton).toBeVisible();
  await technicalSheetButton.click();
  await expect(
    page.getByRole("dialog", { name: "Technical sheet" }),
  ).toBeVisible();
  await page
    .getByRole("dialog", { name: "Technical sheet" })
    .getByRole("button", { name: "Close" })
    .click();
  await expect(
    productDetails.getByRole("link", { name: "Speak to the studio" }),
  ).toBeVisible();

  await page.goto("/products/veille-03?finish=butter");
  await expect(
    page.locator(".product-story__gallery figure picture").nth(2),
  ).toHaveAttribute("data-image-src", /veille-03\/p04\/chalk\/index\.webp/);
  await expect(page.getByText("Final dimensions under validation.", { exact: true })).toBeVisible();

  await page.goto("/fr/produits/portee-02?finish=sage");
  await expect(page.getByRole("heading", { name: "PORTÉE 02" })).toBeVisible();
  await expect(
    page
      .locator(".product-details")
      .getByRole("button", { name: "Fiche technique" }),
  ).toBeVisible();
});

test("storefront selection, cart and successful projection stay usable", async ({ page }) => {
  const jobId = "projection-e2e-completed";
  const placementBox = { x: 0.32, y: 0.2, width: 0.25, height: 0.5 };

  await page.route("**/api/projection/jobs", async (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        job: {
          id: jobId,
          status: "queued",
          progress: 2,
          stageLabel: "Queued",
          productId: "seuil-01",
          finishId: "butter",
          placementMode: "against-wall",
          transform: {
            box: placementBox,
            yawDeg: 0,
            floorAnchor: { x: 0.445, y: 0.7 },
          },
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
        },
      }),
    });
  });

  await page.route(`**/api/projection/jobs/${jobId}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        job: {
          id: jobId,
          status: "completed",
          progress: 100,
          stageLabel: "Projection ready",
          productId: "seuil-01",
          finishId: "butter",
          placementMode: "against-wall",
          transform: {
            box: placementBox,
            yawDeg: 0,
            floorAnchor: { x: 0.445, y: 0.7 },
          },
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          artifact: {
            projectionImage:
              "/isandre/media/seuil-01/d01/butter/index.webp",
            promptDigest: "e2e-prompt",
            requestId: "e2e-request",
            productId: "seuil-01",
            finishId: "butter",
            placementBox,
            referenceKitVersion: "2026.07.27-1",
            promptVersion: "single-reference-room-edit-v2",
            rendererVersion: "single-reference-openai-v1",
          },
        },
      }),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("The room continues");
  await page.getByLabel("Delivery country").selectOption("CH");
  await expect(page.locator(".purchase-panel__price")).toHaveText("CHF 3,000");
  await page.getByLabel("Delivery country").selectOption("US");
  await expect(page.locator(".purchase-panel__price")).toHaveText("$3,300");

  await page.getByRole("button", { name: /Butter/ }).first().click();
  await expect(page).toHaveURL(/finish=butter/);

  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("dialog", { name: /Your bag/ })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "View in your room" }).first().click();
  await page.locator('input[type="file"]').setInputFiles(roomImage);
  const room = page.getByRole("img", { name: "Full photo of your room" });
  await expect(room).toHaveJSProperty("complete", true);
  await room.click();
  await expect(page.getByRole("button", { name: "Create the view" })).toBeVisible();

  const jobRequest = page.waitForRequest((request) =>
    request.url().endsWith("/api/projection/jobs") && request.method() === "POST",
  );
  await page.getByRole("button", { name: "Create the view" }).click();
  await jobRequest;

  await expect(page.getByRole("img", { name: "After" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Drag to compare" })).toBeVisible();
  await page.getByRole("slider", { name: "Drag to compare" }).fill("72");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download image" }).click();
  await expect((await download).suggestedFilename()).toContain("isandre-seuil-01-butter");

  await page.getByRole("button", { name: "Add this piece to your bag" }).click();
  await expect(page.getByRole("dialog", { name: /Your bag/ })).toBeVisible();
});

test("projection billing failure is explicit and leaves the studio usable", async ({ page }) => {
  const jobId = "projection-e2e-failed";

  await page.route("**/api/projection/jobs", async (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        job: {
          id: jobId,
          status: "queued",
          progress: 2,
          stageLabel: "Queued",
          productId: "seuil-01",
          finishId: "chalk",
          placementMode: "against-wall",
          transform: {
            box: { x: 0.3, y: 0.2, width: 0.25, height: 0.5 },
            yawDeg: 0,
            floorAnchor: { x: 0.425, y: 0.7 },
          },
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
        },
      }),
    });
  });
  await page.route(`**/api/projection/jobs/${jobId}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        job: {
          id: jobId,
          status: "failed",
          progress: 100,
          stageLabel: "Projection failed",
          productId: "seuil-01",
          finishId: "chalk",
          placementMode: "against-wall",
          transform: {
            box: { x: 0.3, y: 0.2, width: 0.25, height: 0.5 },
            yawDeg: 0,
            floorAnchor: { x: 0.425, y: 0.7 },
          },
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          error: {
            code: "PROJECTION_BILLING",
            message:
              "The OpenAI projection credit limit has been reached. Update OpenAI billing, then try again.",
          },
        },
      }),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "View in your room" }).first().click();
  await page.locator('input[type="file"]').setInputFiles(roomImage);
  await page.getByRole("img", { name: "Full photo of your room" }).click();
  await page.getByRole("button", { name: "Create the view" }).click();

  await expect(
    page.getByText("The OpenAI projection credit limit has been reached.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Create the view" })).toBeEnabled();
});

test("legacy routes migrate and unvalidated VEILLE geometry cannot reach generation", async ({
  page,
}) => {
  await page.goto("/products/elan-o1?finish=sage");
  await expect(page).toHaveURL(/\/products\/seuil-01\?finish=sage/);

  await page.goto("/?product=veille-03&finish=chalk");
  await page.getByRole("button", { name: "View in your room" }).first().click();
  await expect(page.getByText("Room projection coming soon.")).toBeVisible();
  await expect(
    page.getByText(
      "This tool will be released after the manufacturing dimensions are approved.",
    ),
  ).toBeVisible();
});
