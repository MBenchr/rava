"use client";

import { ChevronRight, Download, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import ResponsiveProductImage from "@/components/responsive-product-image";
import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  getProductById,
  getProductCopy,
  getSiteCopy,
  getStartingPrice,
  productList,
  type Locale,
  type ProductId,
} from "@/lib/isandre/catalog";
import { cn } from "@/lib/utils";

type TechnicalSheetContextValue = {
  openTechnicalSheet: (productId?: ProductId) => void;
};

const TechnicalSheetContext = createContext<TechnicalSheetContextValue | null>(
  null,
);

export function useTechnicalSheet() {
  const context = useContext(TechnicalSheetContext);

  if (!context) {
    throw new Error(
      "useTechnicalSheet must be used inside TechnicalSheetProvider",
    );
  }

  return context;
}

export default function TechnicalSheetProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const content = getContent(locale);
  const siteCopy = getSiteCopy(locale);
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<ProductId>("seuil-01");
  const product = getProductById(productId);
  const copy = getProductCopy(productId, locale);
  const labels =
    locale === "fr"
      ? {
          title: "Fiche technique",
          subtitle: "Dimensions, matière et fabrication.",
          dimensions: "Dimensions",
          price: "Prix",
          material: "Matière",
          construction: "Construction",
          production: "Fabrication",
          delivery: "Livraison",
          download: "Ouvrir la version complète",
          openBack: "Structure traversante, ouverte des deux côtés.",
        }
      : {
          title: "Technical sheet",
          subtitle: "Dimensions, material and production.",
          dimensions: "Dimensions",
          price: "Price",
          material: "Material",
          construction: "Construction",
          production: "Production",
          delivery: "Delivery",
          download: "Open full version",
          openBack: "Open-backed construction, visible from both sides.",
        };

  const contextValue = useMemo<TechnicalSheetContextValue>(
    () => ({
      openTechnicalSheet(nextProductId = "seuil-01") {
        setProductId(nextProductId);
        setOpen(true);
        trackCommerceEvent("dimensions_open", {
          item_id: nextProductId,
          locale,
          method: "popup",
        });
      },
    }),
    [locale],
  );

  return (
    <TechnicalSheetContext.Provider value={contextValue}>
      {children}
      {open ? (
        <div className="technical-sheet-layer">
          <button
            type="button"
            className="technical-sheet-backdrop"
            aria-label={content.common.close}
            onClick={() => setOpen(false)}
          />
          <section
            className="technical-sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="technical-sheet-title"
          >
            <div className="technical-sheet-header">
              <div>
                <p className="eyebrow">{copy.name}</p>
                <h2 id="technical-sheet-title" className="display-title">
                  {labels.title}
                </h2>
                <p>{labels.subtitle}</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
                aria-label={content.common.close}
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <div className="technical-sheet-products" role="tablist">
              {productList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === productId}
                  className={cn(
                    item.id === productId && "technical-sheet-product--active",
                  )}
                  onClick={() => setProductId(item.id)}
                >
                  {getProductCopy(item.id, locale).name}
                </button>
              ))}
            </div>

            <div className="technical-sheet-body">
              <figure>
                <ResponsiveProductImage
                  media={product.technicalPlate}
                  sizes="(max-width: 767px) 92vw, 280px"
                  className="object-contain"
                />
              </figure>
              <dl>
                <div>
                  <dt>{labels.dimensions}</dt>
                  <dd>
                    {product.dimensionsLabel ??
                      (locale === "fr"
                        ? "Dimensions en validation"
                        : "Dimensions under validation")}
                  </dd>
                </div>
                <div>
                  <dt>{labels.price}</dt>
                  <dd>{getStartingPrice(product.id, locale)}</dd>
                </div>
                <div>
                  <dt>{labels.material}</dt>
                  <dd>{content.common.materialSummary}</dd>
                </div>
                <div>
                  <dt>{labels.construction}</dt>
                  <dd>{labels.openBack}</dd>
                </div>
                <div>
                  <dt>{labels.production}</dt>
                  <dd>{siteCopy.fabricationDelay}</dd>
                </div>
                <div>
                  <dt>{labels.delivery}</dt>
                  <dd>{siteCopy.deliveryLine}</dd>
                </div>
              </dl>
            </div>

            <a
              className="technical-sheet-full-link"
              href={locale === "fr" ? "/fr/fiche-technique" : "/technical-sheet"}
              onClick={() =>
                trackCommerceEvent("technical_sheet_download", {
                  item_id: productId,
                  locale,
                  source: "popup",
                })
              }
            >
              <Download aria-hidden="true" />
              {labels.download}
              <ChevronRight aria-hidden="true" />
            </a>
          </section>
        </div>
      ) : null}
    </TechnicalSheetContext.Provider>
  );
}
