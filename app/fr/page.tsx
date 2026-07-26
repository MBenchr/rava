import type { Metadata } from "next";

import StorefrontExperience from "@/components/rava-experience";
import { isFinishId, isProductId, normalizeFinishForProduct } from "@/lib/rava-content";
import { buildHomeStructuredData } from "@/lib/rava-schema";

export const metadata: Metadata = {
  title: "Des meubles qui ouvrent la pièce",
  description: "Des meubles sculpturaux ouverts, dessinés en France et fabriqués sur commande.",
  alternates: { canonical: "/fr", languages: { "en-GB": "/", "fr-FR": "/fr", "x-default": "/" } },
};

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function FrenchHome({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const rawProduct = Array.isArray(params.product) ? params.product[0] : params.product;
  const rawFinish = Array.isArray(params.finish) ? params.finish[0] : params.finish;
  const productId = rawProduct && isProductId(rawProduct) ? rawProduct : "elan-o1";
  const finishId = rawFinish && isFinishId(rawFinish) ? rawFinish : "chalk";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeStructuredData("fr")) }} />
      <StorefrontExperience
        locale="fr"
        initialProductId={productId}
        initialFinishId={normalizeFinishForProduct(productId, finishId)}
      />
    </>
  );
}
