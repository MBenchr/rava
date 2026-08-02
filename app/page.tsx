import StorefrontExperience from "@/components/storefront-experience";
import {
  normalizeFinishForProduct,
  normalizeFinishId,
  normalizeProductId,
} from "@/lib/isandre/catalog";
import { buildHomeStructuredData } from "@/lib/isandre/structured-data";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const rawProduct = Array.isArray(params.product) ? params.product[0] : params.product;
  const rawFinish = Array.isArray(params.finish) ? params.finish[0] : params.finish;
  const productId = normalizeProductId(rawProduct) ?? "seuil-01";
  const finishId = normalizeFinishId(rawFinish) ?? "chalk";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeStructuredData("en")) }} />
      <StorefrontExperience
        locale="en"
        initialProductId={productId}
        initialFinishId={normalizeFinishForProduct(productId, finishId)}
      />
    </>
  );
}
