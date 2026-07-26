"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import CartDrawer from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import {
  brandIdentity,
  getHomeRoute,
  getLocalizedRoute,
  getProductCopy,
  productList,
  siteMeta,
  type Locale,
} from "@/lib/rava-content";

type SiteHeaderProps = {
  locale: Locale;
  onProjectionOpen?: () => void;
};

export function SiteHeader({ locale, onProjectionOpen }: SiteHeaderProps) {
  const { openCart, totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const home = getHomeRoute(locale);
  const otherLocaleHref = locale === "en" ? "/fr" : "/";

  function openRoomView() {
    setMenuOpen(false);
    onProjectionOpen?.();
  }

  return (
    <>
      <div className="launch-note">
        <span>{locale === "fr" ? "L’édition française" : "The French Edition"}</span>
        <span>{locale === "fr" ? "Livraison vers 30 destinations" : "Delivering to 30 destinations"}</span>
      </div>
      <header className="site-header">
        <div className="page-shell site-header__inner">
          <Link href={home} className="site-wordmark" aria-label="VIAIRE home">
            {brandIdentity.name}
          </Link>

          <nav className="site-nav">
            <Link href={`${home}#collection`}>{locale === "fr" ? "Les pièces" : "The pieces"}</Link>
            <Link href={`${home}#story`}>{locale === "fr" ? "L’histoire" : "The story"}</Link>
            {onProjectionOpen ? (
              <button type="button" onClick={onProjectionOpen}>
                {locale === "fr" ? "Voir chez vous" : "View at home"}
              </button>
            ) : (
              <Link href={home}>{locale === "fr" ? "Voir chez vous" : "View at home"}</Link>
            )}
          </nav>

          <div className="site-header__actions">
            <Link href={otherLocaleHref} className="site-locale">
              {locale === "en" ? "FR" : "EN"}
            </Link>
            <button
              type="button"
              className="bag-button"
              onClick={openCart}
              aria-label={locale === "fr" ? "Ouvrir le panier" : "Open bag"}
            >
              <ShoppingBag className="size-4" />
              <span>{locale === "fr" ? "Panier" : "Bag"}</span>
              <strong>{totalItems}</strong>
            </button>
            <Button
              className="md:hidden"
              size="icon-sm"
              variant="ghost"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Menu"
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {menuOpen ? (
          <div className="mobile-menu">
            <div className="page-shell">
              <Link href={`${home}#collection`} onClick={() => setMenuOpen(false)}>
                {locale === "fr" ? "Les pièces" : "The pieces"}
              </Link>
              <Link href={`${home}#story`} onClick={() => setMenuOpen(false)}>
                {locale === "fr" ? "L’histoire" : "The story"}
              </Link>
              {onProjectionOpen ? (
                <button type="button" onClick={openRoomView}>
                  {locale === "fr" ? "Voir chez vous" : "View at home"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openCart();
                }}
              >
                <span>{locale === "fr" ? "Panier" : "Bag"}</span>
                <span>{totalItems}</span>
              </button>
              <Link href={otherLocaleHref} onClick={() => setMenuOpen(false)}>
                {locale === "en" ? "Français" : "English"}
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
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__top">
        <div>
          <p className="eyebrow text-white/45">{locale === "fr" ? "Maison française" : "French design house"}</p>
          <p className="display-title site-footer__promise">{brandIdentity.signatures[locale]}</p>
          <p className="site-footer__origin">{brandIdentity.originClaim[locale]}</p>
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
          <p className="site-footer__label">{locale === "fr" ? "Service" : "Service"}</p>
          <Link href={locale === "fr" ? "/fr/fiche-technique" : "/technical-sheet"}>
            {locale === "fr" ? "Fiche technique" : "Technical sheet"}
          </Link>
          <Link href={locale === "fr" ? "/fr/mentions-legales" : "/legal"}>
            {locale === "fr" ? "Mentions légales" : "Legal"}
          </Link>
          <a href={`mailto:${siteMeta.leadEmail}`}>{locale === "fr" ? "Contact" : "Contact"}</a>
        </div>
      </div>
      <div className="page-shell">
        <p className="site-footer__wordmark">{brandIdentity.name}</p>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} VIAIRE</span>
          <span>{locale === "fr" ? "Dessiné en France" : "Designed in France"}</span>
        </div>
      </div>
    </footer>
  );
}
