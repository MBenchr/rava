"use client";

import { useEffect, useState } from "react";

import { preloadMediaAsset } from "@/lib/image-preload";
import type { MediaAsset } from "@/lib/rava-content";

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
      <source media="(max-width: 639px)" srcSet={displayedMedia.mobileSrc} />
      {/* Optimized WebP derivatives are generated ahead of time for both breakpoints. */}
      <img
        src={displayedMedia.src}
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
