import { productVariants, siteMeta } from "@/lib/rava-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rava-editions.com";

export function buildStructuredData() {
  const productGroup = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${siteUrl}#cabinet-mura-group`,
    name: "Cabinet Mura",
    brand: {
      "@type": "Brand",
      name: siteMeta.name,
    },
    description: siteMeta.description,
    url: siteUrl,
    variesBy: [
      "https://schema.org/size",
      "https://schema.org/color",
      "https://schema.org/material",
    ],
    hasVariant: productVariants.map((variant) => ({
      "@type": "Product",
      "@id": `${siteUrl}#cabinet-mura-${variant.id}`,
      name: `${variant.piece} — ${variant.title}`,
      sku: variant.id === "vertical" ? "RAVA-MURA-001" : "RAVA-MURA-002",
      color: "Ivoire chaud",
      material: "Finition mate texturée effet minéral",
      size: variant.dimensions,
      image: [`${siteUrl}${variant.image.src}`],
      description: `${variant.intro} ${variant.usage}`,
      offers: {
        "@type": "Offer",
        price: "2000",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        url: siteUrl,
        category: "Made to order",
        seller: {
          "@type": "Organization",
          name: siteMeta.name,
        },
      },
    })),
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: siteMeta.name,
    url: siteUrl,
    email: siteMeta.leadEmail,
    description: siteMeta.baseline,
  };

  return [organization, productGroup];
}

