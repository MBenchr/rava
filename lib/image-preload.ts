"use client";

import {
  finishIds,
  getFinishMedia,
  normalizeFinishForProduct,
  productList,
  type FinishId,
  type MediaAsset,
  type ProductId,
} from "@/lib/rava-content";

const decodedImages = new Map<string, Promise<void>>();

function viewportSource(media: MediaAsset) {
  if (typeof window === "undefined") return media.src;
  return window.matchMedia("(max-width: 639px)").matches
    ? media.mobileSrc
    : media.src;
}

export function preloadMediaAsset(media: MediaAsset) {
  if (typeof window === "undefined") return Promise.resolve();

  const source = viewportSource(media);
  const cached = decodedImages.get(source);
  if (cached) return cached;

  const pending = new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      image
        .decode()
        .catch(() => undefined)
        .finally(resolve);
    };
    image.onerror = () => reject(new Error(`Unable to preload ${source}`));
    image.src = source;
  }).catch((error) => {
    decodedImages.delete(source);
    throw error;
  });

  decodedImages.set(source, pending);
  return pending;
}

export function preloadProductMedia(productId: ProductId, finishId: FinishId) {
  return preloadMediaAsset(getFinishMedia(productId, finishId).hero);
}

export function scheduleStorefrontPreload(
  activeProductId: ProductId,
  activeFinishId: FinishId,
) {
  if (typeof window === "undefined") return () => undefined;

  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;
  if (connection?.saveData || connection?.effectiveType === "2g") {
    return () => undefined;
  }

  const media = [
    ...finishIds.map((finishId) =>
      getFinishMedia(activeProductId, finishId).hero,
    ),
    ...productList.map((product) =>
      getFinishMedia(
        product.id,
        normalizeFinishForProduct(product.id, activeFinishId),
      ).hero,
    ),
  ];
  const uniqueMedia = [...new Map(media.map((item) => [viewportSource(item), item])).values()];
  let cancelled = false;

  const preload = () => {
    if (cancelled) return;
    void Promise.allSettled(uniqueMedia.map(preloadMediaAsset));
  };
  const idleWindow = window as unknown as {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };
  const requestIdle = idleWindow.requestIdleCallback?.bind(window);
  const cancelIdle = idleWindow.cancelIdleCallback?.bind(window);
  let handle: number | undefined;
  const scheduleAfterLoad = () => {
    handle = requestIdle
      ? requestIdle(preload, { timeout: 1_500 })
      : window.setTimeout(preload, 500);
  };

  if (document.readyState === "complete") scheduleAfterLoad();
  else window.addEventListener("load", scheduleAfterLoad, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", scheduleAfterLoad);
    if (handle === undefined) return;
    if (requestIdle && cancelIdle) cancelIdle(handle);
    else window.clearTimeout(handle);
  };
}
