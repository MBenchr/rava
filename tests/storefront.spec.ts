import path from "node:path";

import { expect, test } from "@playwright/test";

const roomImage = path.join(
  process.cwd(),
  "public",
  "viaire",
  "elan-o1",
  "scenes",
  "viaire-seuil-chalk-lifestyle.webp",
);

test("variant changes keep the current hero visible while the next image decodes", async ({
  page,
}) => {
  let releaseButterImage: () => void = () => {};
  const butterImageGate = new Promise<void>((resolve) => {
    releaseButterImage = resolve;
  });

  await page.route(
    "**/viaire/elan-o1/scenes/viaire-seuil-butter-lifestyle-mobile.webp",
    async (route) => {
      await butterImageGate;
      await route.continue();
    },
  );

  await page.goto("/");

  const heroPicture = page.locator(".campaign-hero__visual picture");
  const heroImage = heroPicture.locator("img");
  await expect(heroPicture).toHaveAttribute("data-image-src", /chalk-lifestyle/);
  await expect
    .poll(() => heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);

  await page.getByRole("button", { name: /Butter/ }).first().click();

  await expect(heroPicture).toHaveAttribute("data-image-src", /chalk-lifestyle/, {
    timeout: 1_000,
  });
  await expect
    .poll(() => heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  releaseButterImage();
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /butter-lifestyle/,
    { timeout: 10_000 },
  );

  await page
    .getByRole("button", { name: "PORTÉE, Open Low Cabinet", exact: true })
    .click();
  await expect(page).toHaveURL(/product=portee-o2&finish=butter/);
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /viaire-portee-butter-lifestyle/,
  );

  await page
    .getByRole("button", { name: "VEILLE, Bedside Table", exact: true })
    .click();
  await expect(page).toHaveURL(/product=veille-o4&finish=butter/);
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /viaire-veille-butter-lifestyle/,
  );

  await page.getByRole("button", { name: /Sage/ }).first().click();
  await expect(page).toHaveURL(/product=veille-o4&finish=sage/);
  await expect(heroPicture).toHaveAttribute(
    "data-image-src",
    /viaire-veille-sage-lifestyle/,
  );
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
          productId: "elan-o1",
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
          productId: "elan-o1",
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
              "/viaire/elan-o1/scenes/viaire-seuil-butter-lifestyle.webp",
            promptDigest: "e2e-prompt",
            requestId: "e2e-request",
            productId: "elan-o1",
            finishId: "butter",
            placementBox,
            referenceKitVersion: "official-finish-photo-v1",
            promptVersion: "single-reference-room-edit-v1",
            rendererVersion: "single-reference-openai-v1",
          },
        },
      }),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Let life through");
  await page.getByLabel("Delivery country").selectOption("CH");
  await expect(page.getByText("CHF 3,000", { exact: true }).first()).toBeVisible();
  await page.getByLabel("Delivery country").selectOption("US");
  await expect(page.getByText("$3,300", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /Butter/ }).first().click();
  await expect(page).toHaveURL(/finish=butter/);

  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("dialog", { name: /The bag/ })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: /View this finish in your room/ }).click();
  await page.locator('input[type="file"]').setInputFiles(roomImage);
  const room = page.getByRole("img", { name: "Full photo of your room" });
  await expect(room).toHaveJSProperty("complete", true);
  await room.click();
  await expect(page.getByRole("button", { name: "Create view" })).toBeVisible();

  const jobRequest = page.waitForRequest((request) =>
    request.url().endsWith("/api/projection/jobs") && request.method() === "POST",
  );
  await page.getByRole("button", { name: "Create view" }).click();
  await jobRequest;

  await expect(page.getByRole("img", { name: "Projection" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Compare before and after" })).toBeVisible();
  await page.getByRole("slider", { name: "Compare before and after" }).fill("72");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download image" }).click();
  await expect((await download).suggestedFilename()).toContain("viaire-seuil-butter");

  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("dialog", { name: /The bag/ })).toBeVisible();
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
          productId: "elan-o1",
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
          productId: "elan-o1",
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
  await page.getByRole("button", { name: /View this finish in your room/ }).click();
  await page.locator('input[type="file"]').setInputFiles(roomImage);
  await page.getByRole("img", { name: "Full photo of your room" }).click();
  await page.getByRole("button", { name: "Create view" }).click();

  await expect(
    page.getByText("The OpenAI projection credit limit has been reached.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Create view" })).toBeEnabled();
});
