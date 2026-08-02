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
  const finishId = normalizeFinishId((await searchParams)?.finish) ?? "chalk";

  return buildProductMetadata("seuil-01", "en", finishId);
}

export default async function Page({ searchParams }: PageProps) {
  const finish = (await searchParams)?.finish;
  const initialFinishId = normalizeFinishId(finish) ?? "chalk";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductStructuredData("seuil-01", "en")),
        }}
      />
      <ProductPage locale="en" productId="seuil-01" initialFinishId={initialFinishId} />
    </>
  );
}
