import type { Metadata } from "next";

import ProductPage from "@/components/rava-product-page";
import { isFinishId } from "@/lib/rava-content";
import { buildProductStructuredData } from "@/lib/rava-schema";

export const metadata: Metadata = {
  title: "PORTÉE — Open Low Cabinet",
  description: "A low open cabinet that connects both sides of the room.",
  alternates: {
    canonical: "/products/portee",
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
          __html: JSON.stringify(buildProductStructuredData("portee-o2", "en")),
        }}
      />
      <ProductPage locale="en" productId="portee-o2" initialFinishId={initialFinishId} />
    </>
  );
}
