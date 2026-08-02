import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import { CartProvider } from "@/components/cart-provider";
import { MarketProvider } from "@/components/market-provider";
import MeasurementConsentManager from "@/components/measurement-consent";
import TechnicalSheetProvider from "@/components/technical-sheet-provider";
import { detectMarketFromHeaders } from "@/lib/market-detection";
import { brandIdentity, getProductById, siteMeta } from "@/lib/isandre/catalog";
import { isCatalogReleased } from "@/lib/isandre/release";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://taqa.isandre.com";
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});
const ogImage = getProductById("seuil-01").storefrontHero;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMeta.title,
    template: `%s | ${brandIdentity.name}`,
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  robots: isCatalogReleased()
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
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
  const activeLocale = requestHeaders.get("x-isandre-locale") === "fr" ? "fr" : "en";
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
          <CartProvider>
            <TechnicalSheetProvider locale={activeLocale}>
              {children}
              <MeasurementConsentManager locale={activeLocale} />
            </TechnicalSheetProvider>
          </CartProvider>
        </MarketProvider>
      </body>
    </html>
  );
}
