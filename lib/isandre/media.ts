export const mediaRoles = [
  "C01",
  "C02",
  "D01",
  "D02",
  "D03",
  "D04",
  "P01",
  "P02",
  "P03",
  "P04",
] as const;
export type MediaRole = (typeof mediaRoles)[number];

export const mediaReleaseStatuses = [
  "digital-approved",
  "concept-blocked",
  "real-proof-required",
] as const;
export type MediaReleaseStatus = (typeof mediaReleaseStatuses)[number];

export type MediaAsset = {
  src: string;
  mobileSrc: string;
  thumbnailSrc: string;
  alt: string;
  srcSet?: string;
  mobileSrcSet?: string;
  avifSrcSet?: string;
  mobileAvifSrcSet?: string;
  jpegSrcSet?: string;
  mobileJpegSrcSet?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  role?: MediaRole;
  releaseStatus?: MediaReleaseStatus;
};

export type MediaProductId = "seuil-01" | "portee-02" | "veille-03";
export type MediaFinishId = "chalk" | "butter" | "sage" | "rose-clay";

const desktopWidths = [480, 768, 1024, 1440] as const;
const mobileWidths = [720, 960] as const;

const releaseStatusByProduct: Record<MediaProductId, MediaReleaseStatus> = {
  "seuil-01": "digital-approved",
  "portee-02": "digital-approved",
  "veille-03": "concept-blocked",
};

function setFor(
  base: string,
  widths: readonly number[],
  extension: "webp" | "avif" | "jpg",
  prefix: "w" | "mobile",
) {
  return widths
    .map((width) => `${base}/${prefix}-${width}.${extension} ${width}w`)
    .join(", ");
}

export function getCanonicalMediaAsset(
  productId: MediaProductId,
  role: MediaRole,
  finishId: MediaFinishId,
  alt: string,
): MediaAsset {
  const base = `/isandre/media/${productId}/${role.toLowerCase()}/${finishId}`;

  return {
    src: `${base}/index.webp`,
    mobileSrc: `${base}/mobile-960.webp`,
    thumbnailSrc: `${base}/thumb.webp`,
    fallbackSrc: `${base}/index.jpg`,
    srcSet: setFor(base, desktopWidths, "webp", "w"),
    mobileSrcSet: setFor(base, mobileWidths, "webp", "mobile"),
    avifSrcSet: setFor(base, desktopWidths, "avif", "w"),
    mobileAvifSrcSet: setFor(base, mobileWidths, "avif", "mobile"),
    jpegSrcSet: setFor(base, desktopWidths, "jpg", "w"),
    mobileJpegSrcSet: setFor(base, mobileWidths, "jpg", "mobile"),
    alt,
    role,
    releaseStatus: releaseStatusByProduct[productId],
  };
}

export function getProductMediaReleaseStatus(productId: MediaProductId) {
  return releaseStatusByProduct[productId];
}
