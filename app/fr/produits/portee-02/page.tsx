import type { Metadata } from "next";

import ProductPage from "@/components/product-page";
import { normalizeFinishId } from "@/lib/isandre/catalog";
import { buildProductMetadata } from "@/lib/isandre/metadata";
import { buildProductStructuredData } from "@/lib/isandre/structured-data";

type PageProps = {
  searchParams?: Promise<{ finish?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const finishId = normalizeFinishId((await searchParams)?.finish) ?? "sage";

  return buildProductMetadata("portee-02", "fr", finishId);
}

export default async function Page({ searchParams }: PageProps) {
  const finish = (await searchParams)?.finish;
  const initialFinishId = normalizeFinishId(finish) ?? "sage";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductStructuredData("portee-02", "fr")),
        }}
      />
      <ProductPage locale="fr" productId="portee-02" initialFinishId={initialFinishId} />
    </>
  );
}
