import type { MetadataRoute } from "next";

import { isCatalogReleased } from "@/lib/isandre/release";

export default function robots(): MetadataRoute.Robots {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://isandre.com"
  ).replace(/\/$/, "");

  if (!isCatalogReleased()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
