import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production QA isolated from a concurrently running local dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.129.10"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/isandre/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/projection-kits/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/mura-01", destination: "/products/seuil-01", statusCode: 301 },
      { source: "/mura-02", destination: "/products/portee-02", statusCode: 301 },
      { source: "/mura-04", destination: "/products/veille-03", statusCode: 301 },
      { source: "/products/elan-o1", destination: "/products/seuil-01", statusCode: 301 },
      { source: "/products/portee-o2", destination: "/products/portee-02", statusCode: 301 },
      { source: "/products/veille-o4", destination: "/products/veille-03", statusCode: 301 },
      { source: "/products/seuil", destination: "/products/seuil-01", statusCode: 301 },
      { source: "/products/portee", destination: "/products/portee-02", statusCode: 301 },
      { source: "/products/veille", destination: "/products/veille-03", statusCode: 301 },
      { source: "/products/horizon-02", destination: "/products/portee-02", statusCode: 301 },
      { source: "/products/aube-04", destination: "/products/veille-03", statusCode: 301 },
      { source: "/fr/products/elan-o1", destination: "/fr/produits/seuil-01", statusCode: 301 },
      { source: "/fr/products/portee-o2", destination: "/fr/produits/portee-02", statusCode: 301 },
      { source: "/fr/products/veille-o4", destination: "/fr/produits/veille-03", statusCode: 301 },
      { source: "/fr/products/seuil", destination: "/fr/produits/seuil-01", statusCode: 301 },
      { source: "/fr/products/portee", destination: "/fr/produits/portee-02", statusCode: 301 },
      { source: "/fr/products/veille", destination: "/fr/produits/veille-03", statusCode: 301 },
      { source: "/fr/products/seuil-01", destination: "/fr/produits/seuil-01", statusCode: 301 },
      { source: "/fr/products/horizon-02", destination: "/fr/produits/portee-02", statusCode: 301 },
      { source: "/fr/products/aube-04", destination: "/fr/produits/veille-03", statusCode: 301 },
    ];
  },
};

export default nextConfig;
