"use client";

import {
  getFinishMedia,
  type FinishId,
  type MediaAsset,
  type ProductId,
} from "@/lib/isandre/catalog";

const decodedImages = new Map<string, Promise<void>>();

function viewportSources(media: MediaAsset) {
  const mobile = window.matchMedia("(max-width: 639px)").matches;
  const srcSet = mobile
    ? media.mobileAvifSrcSet ?? media.mobileSrcSet
    : media.avifSrcSet ?? media.srcSet;

  return {
    fallback: mobile ? media.mobileSrc : media.src,
    srcSet,
    sizes: mobile ? "100vw" : "min(68vw, 1100px)",
  };
}

export function preloadMediaAsset(media: MediaAsset) {
  if (typeof window === "undefined") return Promise.resolve();

  const sources = viewportSources(media);
  const cacheKey = sources.srcSet ?? sources.fallback;
  const cached = decodedImages.get(cacheKey);
  if (cached) return cached;

  const pending = new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    if (sources.srcSet) {
      image.srcset = sources.srcSet;
      image.sizes = sources.sizes;
    }
    image.onload = () => {
      image
        .decode()
        .catch(() => undefined)
        .finally(resolve);
    };
    image.onerror = () =>
      reject(new Error(`Unable to preload ${sources.fallback}`));
    image.src = sources.fallback;
  }).catch((error) => {
    decodedImages.delete(cacheKey);
    throw error;
  });

  decodedImages.set(cacheKey, pending);
  return pending;
}

export function preloadProductMedia(productId: ProductId, finishId: FinishId) {
  return preloadMediaAsset(getFinishMedia(productId, finishId).hero);
}
