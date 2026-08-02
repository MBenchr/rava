"use client";

import Image from "next/image";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import CartDrawer from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { useTechnicalSheet } from "@/components/technical-sheet-provider";
import { getContent } from "@/content";
import {
  brandIdentity,
  getHomeRoute,
  getFinishMedia,
  getLocalizedRoute,
  getProductCopy,
  productList,
  type Locale,
} from "@/lib/isandre/catalog";

type SiteHeaderProps = {
  locale: Locale;
  onProjectionOpen?: () => void;
  alternateLocaleHref?: string;
};

export function SiteHeader({
  locale,
  onProjectionOpen,
  alternateLocaleHref,
}: SiteHeaderProps) {
  const content = getContent(locale);
  const { items, openCart, totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const home = getHomeRoute(locale);
  const otherLocaleHref =
    alternateLocaleHref ?? (locale === "en" ? "/fr" : "/");
  const makingHref = locale === "fr" ? "/fr/fabrication" : "/making";
  const firstCartImage = items[0]
    ? getFinishMedia(items[0].productId, items[0].finishId).packshot
    : null;

  function openRoomView() {
    setMenuOpen(false);
    onProjectionOpen?.();
  }

  return (
    <>
      <div className="launch-note">
        <span>{content.launch.edition}</span>
        <span>{content.launch.delivery}</span>
      </div>
      <header className="site-header">
        <div className="page-shell site-header__inner">
          <Link href={home} className="site-wordmark" aria-label="ISANDRE home">
            <BrandMark priority />
          </Link>

          <nav className="site-nav">
            <Link href={`${home}#collection`}>{content.navigation.pieces}</Link>
            <Link href={makingHref}>{content.navigation.making}</Link>
            {onProjectionOpen ? (
              <button type="button" onClick={onProjectionOpen}>
                {content.navigation.projection}
              </button>
            ) : (
              <Link href={home}>{content.navigation.projection}</Link>
            )}
          </nav>

          <div className="site-header__actions">
            <Link
              href={otherLocaleHref}
              className="site-locale"
              onClick={() => {
                document.cookie = `isandre-locale=${locale === "en" ? "fr" : "en"}; Path=/; Max-Age=31536000; SameSite=Lax`;
              }}
            >
              {locale === "en" ? "FR" : "EN"}
            </Link>
            <button
              type="button"
              className="bag-button"
              onClick={openCart}
              aria-label={content.navigation.bag}
            >
              {firstCartImage ? (
                <span className="bag-button__thumb">
                  <Image
                    src={firstCartImage.thumbnailSrc}
                    alt=""
                    fill
                    sizes="28px"
                    unoptimized
                    className="object-cover"
                  />
                </span>
              ) : (
                <ShoppingBag className="size-4" />
              )}
              <span className="bag-button__label">{content.navigation.bag}</span>
              <strong>{totalItems}</strong>
            </button>
            <Button
              className="md:hidden"
              size="icon-sm"
              variant="ghost"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={
                menuOpen
                  ? content.navigation.closeMenu
                  : content.navigation.openMenu
              }
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {menuOpen ? (
          <div className="mobile-menu">
            <div className="page-shell">
              <Link href={`${home}#collection`} onClick={() => setMenuOpen(false)}>
                {content.navigation.pieces}
              </Link>
              <Link href={makingHref} onClick={() => setMenuOpen(false)}>
                {content.navigation.making}
              </Link>
              {onProjectionOpen ? (
                <button type="button" onClick={openRoomView}>
                  {content.navigation.projection}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openCart();
                }}
              >
                <span>{content.navigation.bag}</span>
                <span>{totalItems}</span>
              </button>
              <Link
                href={otherLocaleHref}
                onClick={() => {
                  document.cookie = `isandre-locale=${locale === "en" ? "fr" : "en"}; Path=/; Max-Age=31536000; SameSite=Lax`;
                  setMenuOpen(false);
                }}
              >
                {content.navigation.language}
              </Link>
            </div>
          </div>
        ) : null}
      </header>
      <CartDrawer locale={locale} />
    </>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { openTechnicalSheet } = useTechnicalSheet();
  const makingHref = locale === "fr" ? "/fr/fabrication" : "/making";

  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__top">
        <div>
          <p className="eyebrow text-white/45">{content.brand.collectionLead}</p>
          <p className="display-title site-footer__promise">{content.brand.signature}</p>
          <p className="site-footer__origin">{content.brand.origin}</p>
        </div>
        <div>
          <p className="site-footer__label">{brandIdentity.collectionLabels[locale]}</p>
          {productList.map((product) => (
            <Link key={product.id} href={getLocalizedRoute(product.id, locale)}>
              {getProductCopy(product.id, locale).name}
            </Link>
          ))}
        </div>
        <div>
          <p className="site-footer__label">{content.common.service}</p>
          <Link href={makingHref}>{content.navigation.making}</Link>
          <button type="button" onClick={() => openTechnicalSheet()}>
            {content.common.technicalSheet}
          </button>
          <Link href={locale === "fr" ? "/fr/mentions-legales" : "/legal"}>
            {content.common.legal}
          </Link>
          <Link href={locale === "fr" ? "/fr/contact?kind=project" : "/contact?kind=project"}>
            {content.common.contact}
          </Link>
          <Link href={locale === "fr" ? "/fr/contact?kind=trade" : "/contact?kind=trade"}>
            {content.trade.cta}
          </Link>
          <Link href={locale === "fr" ? "/fr/contact?kind=press" : "/contact?kind=press"}>
            {locale === "fr" ? "Presse" : "Press"}
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("isandre:consent-open"))}
          >
            {content.measurement.preferences}
          </button>
        </div>
      </div>
      <div className="page-shell">
        <BrandMark className="site-footer__wordmark" tone="paper" />
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} ISANDRE</span>
          <span>{content.brand.origin}</span>
        </div>
      </div>
    </footer>
  );
}

export default function SiteShell({
  children,
  locale,
  alternateLocaleHref,
}: {
  children: ReactNode;
  locale: Locale;
  alternateLocaleHref?: string;
}) {
  return (
    <>
      <SiteHeader
        locale={locale}
        alternateLocaleHref={alternateLocaleHref}
      />
      {children}
      <SiteFooter locale={locale} />
    </>
  );
}
