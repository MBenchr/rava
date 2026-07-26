import type { Metadata } from "next";

import ProductPage from "@/components/rava-product-page";
import { isFinishId } from "@/lib/rava-content";
import { buildProductStructuredData } from "@/lib/rava-schema";

export const metadata: Metadata = {
  title: "PORTÉE — Cabinet horizontal ouvert",
  description: "Un cabinet bas et traversant qui relie les deux côtés de la pièce.",
  alternates: {
    canonical: "/fr/products/portee",
    languages: { "en-GB": "/products/portee", "fr-FR": "/fr/products/portee" },
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ finish?: string }>;
}) {
  const finish = (await searchParams)?.finish;
  const initialFinishId = finish && isFinishId(finish) ? finish : "sage";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductStructuredData("portee-o2", "fr")),
        }}
      />
      <ProductPage locale="fr" productId="portee-o2" initialFinishId={initialFinishId} />
    </>
  );
}
