import { expect, test } from "@playwright/test";

test("landmarks, skip navigation and keyboard focus form a coherent document", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("main header")).toHaveCount(0);
  await expect(page.locator("main footer")).toHaveCount(0);

  const consent = page.getByRole("region", {
    name: "Your privacy, kept simple.",
  });
  await expect(consent).toBeVisible();
  await consent.getByRole("button", { name: "Essential only" }).click();
  await expect(consent).toBeHidden();

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("interactive storefront controls expose names, states and keyboard operation", async ({
  page,
}) => {
  await page.goto("/?product=seuil-01&finish=chalk");

  const buttons = page.locator("button:visible");
  const count = await buttons.count();
  for (let index = 0; index < count; index += 1) {
    await expect(buttons.nth(index)).not.toHaveAccessibleName("");
  }

  const selectedFinish = page.getByRole("button", { name: /^Chalk —/ }).first();
  await expect(selectedFinish).toHaveAttribute("aria-pressed", "true");

  const addToBag = page.getByRole("button", { name: "Add to bag" }).first();
  await addToBag.focus();
  await page.keyboard.press("Enter");
  const bag = page.getByRole("dialog", { name: /Your bag/ });
  await expect(bag).toBeVisible();
  await expect
    .poll(() =>
      bag.evaluate((dialog) => dialog.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(bag).toBeHidden();
  await expect(addToBag).toBeFocused();

  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll<HTMLElement>("[id]")]
      .map((element) => element.id)
      .filter(Boolean);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicateIds).toEqual([]);
});

test("French navigation exposes the matching language and skip label", async ({
  page,
}) => {
  await page.goto("/fr");

  await expect(page.locator("html")).toHaveAttribute("lang", "fr-FR");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Aller au contenu" }),
  ).toBeFocused();
});

test("deployment health remains public-safe while commerce is gated", async ({
  request,
}) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();
  await expect(health.json()).resolves.toEqual({
    brand: "gated",
    catalog: "gated",
    service: "isandre-taqa",
    status: "ok",
  });

  const feed = await request.get("/merchant-feed.xml");
  expect(feed.status()).toBe(404);
});
