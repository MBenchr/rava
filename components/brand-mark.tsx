import Image from "next/image";

import { brandAssets, type BrandTone } from "@/lib/isandre/brand";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
  tone?: BrandTone;
};

export function BrandMark({ className, priority = false, tone = "ink" }: BrandMarkProps) {
  return (
    <Image
      src={brandAssets.wordmark[tone]}
      alt=""
      width={1000}
      height={180}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
