import { enContent } from "@/content/en";
import { frContent } from "@/content/fr";
import type { ContentDeck } from "@/content/schema";
import type { Locale } from "@/lib/isandre/ids";

export type { ContentDeck, ProductEditorialCopy } from "@/content/schema";

export const contentDecks = {
  en: enContent,
  fr: frContent,
} as const satisfies Record<Locale, ContentDeck>;

export function getContent(locale: Locale): ContentDeck {
  return contentDecks[locale];
}
