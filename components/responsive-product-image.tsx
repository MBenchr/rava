import Image from "next/image";

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
  return (
    <picture className="absolute inset-0 block">
      <source media="(max-width: 639px)" srcSet={media.mobileSrc} />
      <Image
        src={media.src}
        alt={media.alt}
        fill
        preload={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className={className}
      />
    </picture>
  );
}
