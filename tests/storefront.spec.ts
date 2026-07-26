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

test("storefront selection, cart and projection failure stay usable", async ({ page }) => {
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
  await page.getByRole("button", { name: "Close" }).last().click();

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

  await expect(
    page.getByText("The OpenAI projection credit limit has been reached.", {
      exact: false,
    }),
  ).toBeVisible();
});
