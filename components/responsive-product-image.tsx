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
      {/* Optimized WebP derivatives are generated ahead of time for both breakpoints. */}
      <img
        src={media.src}
        alt={media.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        sizes={sizes}
        className={`absolute inset-0 h-full w-full ${className ?? ""}`}
      />
    </picture>
  );
}
