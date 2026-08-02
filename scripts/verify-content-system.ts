import { readFileSync } from "node:fs";

import { contentDecks } from "../content";
import {
  finishIds,
  locales,
  placementModeIds,
  productIds,
} from "../lib/isandre/ids";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenKeys(item, `${prefix}[${index}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nested]) =>
      flattenKeys(nested, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

const enKeys = flattenKeys(contentDecks.en).filter((key) => key !== "locale");
const frKeys = flattenKeys(contentDecks.fr).filter((key) => key !== "locale");
assert(
  JSON.stringify(enKeys) === JSON.stringify(frKeys),
  "English and French copy decks do not share the same structure.",
);

for (const locale of locales) {
  const deck = contentDecks[locale];
  assert(deck.locale === locale, `Invalid locale marker for ${locale}.`);

  for (const productId of productIds) {
    const product = deck.products[productId];
    assert(product, `Missing ${locale} copy for ${productId}.`);
    assert(
      words(product.story) <= 45,
      `${locale}/${productId} story exceeds 45 words.`,
    );
    assert(
      product.detailLines.length === 3,
      `${locale}/${productId} must expose exactly three detail lines.`,
    );
  }

  for (const finishId of finishIds) {
    assert(deck.finishes[finishId], `Missing ${locale} finish copy for ${finishId}.`);
  }

  for (const placementMode of placementModeIds) {
    assert(
      deck.placementModes[placementMode],
      `Missing ${locale} placement label for ${placementMode}.`,
    );
  }

  for (const field of [
    deck.home.heroBody,
    deck.home.collectionBody,
    deck.home.storyBody,
    deck.home.serviceBody,
  ]) {
    assert(words(field) <= 45, `${locale} home paragraph exceeds 45 words.`);
  }

  const allCopy = collectStrings(deck);
  assert(allCopy.every((value) => value.trim().length > 0), `${locale} contains empty copy.`);

  const joined = allCopy.join("\n");
  assert(
    !/\b(rava|mura|viaire|forme ouverte)\b/iu.test(joined),
    `${locale} copy contains a retired brand or collection name.`,
  );
  assert(
    !/\b(made in france|fabriqu[ée]e? en france)\b/iu.test(joined),
    `${locale} copy makes an unvalidated manufacturing-origin claim.`,
  );
  assert(
    /ital(?:y|ie)/iu.test(deck.brand.origin),
    `${locale} origin copy must identify made-to-order production in Italy.`,
  );
  assert(
    !/\b(best-?seller|sold out|waiting list|liste d’attente|viral|most popular|le plus vendu)\b/iu.test(
      joined,
    ),
    `${locale} copy contains an unproven popularity claim.`,
  );
  assert(
    !/\b(interface|single screen|all options|scroll|intuitive|intuitif|tous les choix)\b/iu.test(
      joined,
    ),
    `${locale} copy describes the interface instead of the product or service.`,
  );
}

const catalogSource = readFileSync("lib/isandre/catalog.ts", "utf8");
assert(
  catalogSource.includes('from "@/content"'),
  "The canonical catalogue is not connected to the copy deck.",
);

console.log(
  `Verified ${locales.length} locales, ${productIds.length} products, ${finishIds.length} finishes and ${enKeys.length} copy fields.`,
);
