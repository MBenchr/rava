import StorefrontExperience from "@/components/rava-experience";
import { isFinishId, isProductId, normalizeFinishForProduct } from "@/lib/rava-content";
import { buildHomeStructuredData } from "@/lib/rava-schema";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const rawProduct = Array.isArray(params.product) ? params.product[0] : params.product;
  const rawFinish = Array.isArray(params.finish) ? params.finish[0] : params.finish;
  const productId = rawProduct && isProductId(rawProduct) ? rawProduct : "elan-o1";
  const finishId = rawFinish && isFinishId(rawFinish) ? rawFinish : "chalk";

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
