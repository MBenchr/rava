"use client";

import { useEffect, useState } from "react";

import { preloadMediaAsset } from "@/lib/image-preload";
import type { MediaAsset } from "@/lib/isandre/catalog";

type ResponsiveProductImageProps = {
  media: MediaAsset;
  className?: string;
  priority?: boolean;
  sizes: string;
};

export default function ResponsiveProductImage({
  media,
  className,
  priority = false,
  sizes,
}: ResponsiveProductImageProps) {
  const [displayedMedia, setDisplayedMedia] = useState(media);

  useEffect(() => {
    if (
      media.src === displayedMedia.src &&
      media.mobileSrc === displayedMedia.mobileSrc
    ) {
      return;
    }

    let active = true;
    void preloadMediaAsset(media)
      .then(() => {
        if (active) setDisplayedMedia(media);
      })
      .catch(() => {
        // Keep the previous decoded image visible when a derivative is unavailable.
      });

    return () => {
      active = false;
    };
  }, [displayedMedia.mobileSrc, displayedMedia.src, media]);

  return (
    <picture
      key={displayedMedia.src}
      className="absolute inset-0 block"
      data-image-src={displayedMedia.src}
    >
      {displayedMedia.mobileAvifSrcSet ? (
        <source
          media="(max-width: 639px)"
          type="image/avif"
          srcSet={displayedMedia.mobileAvifSrcSet}
          sizes={sizes}
        />
      ) : null}
      <source
        media="(max-width: 639px)"
        type="image/webp"
        srcSet={displayedMedia.mobileSrcSet ?? displayedMedia.mobileSrc}
        sizes={sizes}
      />
      {displayedMedia.mobileJpegSrcSet ? (
        <source
          media="(max-width: 639px)"
          type="image/jpeg"
          srcSet={displayedMedia.mobileJpegSrcSet}
          sizes={sizes}
        />
      ) : null}
      {displayedMedia.avifSrcSet ? (
        <source
          type="image/avif"
          srcSet={displayedMedia.avifSrcSet}
          sizes={sizes}
        />
      ) : null}
      {displayedMedia.srcSet ? (
        <source
          type="image/webp"
          srcSet={displayedMedia.srcSet}
          sizes={sizes}
        />
      ) : null}
      <img
        src={displayedMedia.fallbackSrc ?? displayedMedia.src}
        srcSet={displayedMedia.jpegSrcSet}
        alt={displayedMedia.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        sizes={sizes}
        className={`absolute inset-0 h-full w-full ${className ?? ""}`}
      />
    </picture>
  );
}
