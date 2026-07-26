"use client";

import Image from "next/image";

import {
  getFinishMedia,
  getProductCopy,
  normalizeFinishForProduct,
  productList,
  type FinishId,
  type Locale,
  type ProductId,
} from "@/lib/rava-content";

type ProductIdentityPickerProps = {
  finishId: FinishId;
  locale: Locale;
  onChange: (productId: ProductId) => void;
  productId: ProductId;
  compact?: boolean;
};

export default function ProductIdentityPicker({
  compact = false,
  finishId,
  locale,
  onChange,
  productId,
}: ProductIdentityPickerProps) {
  return (
    <div
      className={`product-identity-picker${compact ? " product-identity-picker--compact" : ""}`}
      aria-label={locale === "fr" ? "Choisir une pièce" : "Choose a piece"}
    >
      {productList.map((product) => {
        const copy = getProductCopy(product.id, locale);
        const activeFinish = normalizeFinishForProduct(product.id, finishId);
        const image = getFinishMedia(product.id, activeFinish).packshot;

        return (
          <button
            key={product.id}
            type="button"
            aria-pressed={product.id === productId}
            aria-label={`${copy.name}, ${copy.descriptor}`}
            onClick={() => onChange(product.id)}
          >
            <span className="product-identity-picker__image">
              <Image
                src={image.src}
                alt=""
                fill
                sizes={compact ? "72px" : "120px"}
                className="object-cover"
              />
            </span>
            <span className="product-identity-picker__copy">
              <strong>{copy.name}</strong>
              <small>{copy.descriptor}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
