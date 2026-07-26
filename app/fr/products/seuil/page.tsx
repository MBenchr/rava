import type { Metadata } from "next";

import ProductPage from "@/components/rava-product-page";
import { isFinishId } from "@/lib/rava-content";
import { buildProductStructuredData } from "@/lib/rava-schema";

export const metadata: Metadata = {
  title: "SEUIL — Cabinet vertical ouvert",
  description: "Un cabinet vertical qui dessine la pièce sans jamais la fermer.",
  alternates: {
    canonical: "/fr/products/seuil",
    languages: { "en-GB": "/products/seuil", "fr-FR": "/fr/products/seuil" },
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ finish?: string }>;
}) {
  const finish = (await searchParams)?.finish;
  const initialFinishId = finish && isFinishId(finish) ? finish : "chalk";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductStructuredData("elan-o1", "fr")),
        }}
      />
      <ProductPage locale="fr" productId="elan-o1" initialFinishId={initialFinishId} />
    </>
  );
}
