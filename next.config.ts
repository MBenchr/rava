import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.129.10"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/viaire/:path*",
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
      { source: "/mura-01", destination: "/products/seuil", statusCode: 301 },
      { source: "/mura-02", destination: "/products/portee", statusCode: 301 },
      { source: "/mura-04", destination: "/products/veille", statusCode: 301 },
      { source: "/products/elan-o1", destination: "/products/seuil", statusCode: 301 },
      { source: "/products/portee-o2", destination: "/products/portee", statusCode: 301 },
      { source: "/products/veille-o4", destination: "/products/veille", statusCode: 301 },
      { source: "/products/seuil-01", destination: "/products/seuil", statusCode: 301 },
      { source: "/products/horizon-02", destination: "/products/portee", statusCode: 301 },
      { source: "/products/aube-04", destination: "/products/veille", statusCode: 301 },
      { source: "/fr/products/elan-o1", destination: "/fr/products/seuil", statusCode: 301 },
      { source: "/fr/products/portee-o2", destination: "/fr/products/portee", statusCode: 301 },
      { source: "/fr/products/veille-o4", destination: "/fr/products/veille", statusCode: 301 },
      { source: "/fr/products/seuil-01", destination: "/fr/products/seuil", statusCode: 301 },
      { source: "/fr/products/horizon-02", destination: "/fr/products/portee", statusCode: 301 },
      { source: "/fr/products/aube-04", destination: "/fr/products/veille", statusCode: 301 },
    ];
  },
};

export default nextConfig;
