import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import { CartProvider } from "@/components/cart-provider";
import { MarketProvider } from "@/components/market-provider";
import { detectMarketFromHeaders } from "@/lib/market-detection";
import { brandIdentity, getProductById, siteMeta } from "@/lib/rava-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://viaire.fr";
const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});
const ogImage = getProductById("elan-o1").storefrontHero;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMeta.title,
    template: `%s | ${brandIdentity.name}`,
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  alternates: {
    canonical: "/",
    languages: { "en-GB": "/", "fr-FR": "/fr", "x-default": "/" },
  },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: "website",
    url: siteUrl,
    siteName: brandIdentity.name,
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
    images: [{ url: ogImage.src, alt: ogImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: [ogImage.src],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3F1EB",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const activeLocale = requestHeaders.get("x-viaire-locale") === "fr" ? "fr" : "en";
  const htmlLocale = activeLocale === "fr" ? "fr-FR" : "en-GB";
  const initialMarketCode = detectMarketFromHeaders(requestHeaders, activeLocale);

  return (
    <html
      lang={htmlLocale}
      className={`${sans.variable} ${display.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body>
        <MarketProvider locale={activeLocale} initialMarketCode={initialMarketCode}>
          <CartProvider>{children}</CartProvider>
        </MarketProvider>
      </body>
    </html>
  );
}
