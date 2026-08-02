import { expect, test } from "@playwright/test";

type ProductCase = {
  id: "seuil-01" | "portee-02" | "veille-03";
  name: string;
  route: string;
  frenchRoute: string;
  sagePrice: string;
};

const products: ProductCase[] = [
  {
    id: "seuil-01",
    name: "SEUIL 01",
    route: "/products/seuil-01",
    frenchRoute: "/fr/produits/seuil-01",
    sagePrice: "€3,300",
  },
  {
    id: "portee-02",
    name: "PORTÉE 02",
    route: "/products/portee-02",
    frenchRoute: "/fr/produits/portee-02",
    sagePrice: "€3,300",
  },
  {
    id: "veille-03",
    name: "VEILLE 03",
    route: "/products/veille-03",
    frenchRoute: "/fr/produits/veille-03",
    sagePrice: "€850",
  },
];

for (const product of products) {
  test(`${product.name} keeps PDP, URL, cart and ProductGroup in sync`, async ({
    page,
  }) => {
    await page.goto(`${product.route}?finish=chalk`);

    await expect(
      page.getByRole("heading", { level: 1, name: product.name }),
    ).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(`${product.name} — Chalk`));

    const consent = page.getByRole("region", {
      name: "Your privacy, kept simple.",
    });
    await consent.getByRole("button", { name: "Essential only" }).click();
    await expect(consent).toBeHidden();

    await page.getByRole("button", { name: "Enlarge image" }).click();
    const zoom = page.getByRole("dialog");
    await expect(zoom).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(zoom).toBeHidden();

    await page.getByLabel("Delivery country").selectOption("FR");
    await page
      .getByRole("button", { name: /^Sage —/ })
      .first()
      .click();

    await expect(page).toHaveURL(
      new RegExp(`${product.route.replaceAll("/", "\\/")}\\?finish=sage`),
    );
    await expect(
      page.getByText(product.sagePrice, { exact: true }).first(),
    ).toBeVisible();
    await expect(page.locator(".product-action-links")).toHaveCSS(
      "display",
      "flex",
    );
    const relatedTitleSize = await page
      .locator(".related-products__title")
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    expect(relatedTitleSize).toBeGreaterThan(40);

    await page.getByRole("button", { name: "Add to bag" }).click();
    const bag = page.getByRole("dialog", { name: /Your bag/ });
    await expect(bag).toBeVisible();
    await expect(
      bag.getByRole("paragraph").filter({ hasText: product.name }),
    ).toBeVisible();
    await expect(bag.getByText("Sage", { exact: true }).first()).toBeVisible();
    await expect(
      bag.getByText(product.sagePrice, { exact: true }).first(),
    ).toBeVisible();

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const nodes = jsonLd.flatMap((value) => {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [parsed];
    });
    const group = nodes.find(
      (node) =>
        typeof node === "object" &&
        node !== null &&
        "@type" in node &&
        node["@type"] === "ProductGroup",
    ) as
      | {
          hasVariant?: Array<{
            color?: string;
            offers?: { price?: number | string };
          }>;
        }
      | undefined;

    expect(group).toBeDefined();
    expect(group?.hasVariant).toHaveLength(4);
    expect(group?.hasVariant?.every((variant) => variant.offers === undefined)).toBe(
      true,
    );
  });
}

test("French PDPs preserve locale, canonical content and validated dimensions", async ({
  page,
}) => {
  for (const product of products) {
    await page.goto(`${product.frenchRoute}?finish=chalk`);
    await expect(
      page.getByRole("heading", { level: 1, name: product.name }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "fr-FR");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${product.frenchRoute.replaceAll("/", "\\/")}\\?finish=chalk`),
    );
  }

  await page.goto("/fr/produits/veille-03?finish=chalk");
  await expect(
    page.getByText("Dimensions finales en validation.", { exact: true }).last(),
  ).toBeVisible();
  await expect(page.locator(".product-details")).not.toContainText(
    /[0-9]+\s*×\s*[0-9]+/,
  );
});

test("deferred PDP proof images decode when their section enters the viewport", async ({
  page,
}) => {
  await page.goto("/products/portee-02?finish=sage");

  const figures = page.locator(".product-story__gallery figure");
  await expect(figures).toHaveCount(3);

  for (const figure of await figures.all()) {
    await figure.scrollIntoViewIfNeeded();
    const image = figure.getByRole("img");
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0);
  }
});
