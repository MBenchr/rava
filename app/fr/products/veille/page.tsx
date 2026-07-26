import type { Metadata } from "next";

import ProductPage from "@/components/rava-product-page";
import { isFinishId } from "@/lib/rava-content";
import { buildProductStructuredData } from "@/lib/rava-schema";

export const metadata: Metadata = {
  title: "VEILLE — Table de chevet",
  description: "Une petite architecture ouverte pour l’essentiel près du lit.",
  alternates: {
    canonical: "/fr/products/veille",
    languages: { "en-GB": "/products/veille", "fr-FR": "/fr/products/veille" },
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ finish?: string }>;
}) {
  const finish = (await searchParams)?.finish;
  const initialFinishId = finish && isFinishId(finish) ? finish : "plaster-rose";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductStructuredData("veille-o4", "fr")),
        }}
      />
      <ProductPage locale="fr" productId="veille-o4" initialFinishId={initialFinishId} />
    </>
  );
}
