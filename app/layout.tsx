import type { Metadata } from "next";

import "./globals.css";

import { siteMeta } from "@/lib/rava-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rava-editions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteMeta.title,
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: "website",
    url: siteUrl,
    siteName: siteMeta.name,
    images: [
      {
        url: `${siteUrl}/rava-v2/hero-main.webp`,
        width: 1672,
        height: 941,
        alt: "Cabinet Mura vertical dans un intérieur lumineux.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: [`${siteUrl}/rava-v2/hero-main.webp`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
