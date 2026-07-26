/* eslint-disable @next/next/no-img-element */

"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  getFinishById,
  getProductById,
  type FinishId,
  type Locale,
  type PlacementBox,
  type ProductId,
} from "@/lib/rava-content";
import {
  getContainRect,
  getNormalizedBoxAspect,
  type PixelSize,
} from "@/lib/projection-geometry";

type Point = { x: number; y: number };

type PlacementEditorProps = {
  imageUrl: string;
  productId: ProductId;
  finishId: FinishId;
  placementBox: PlacementBox | null;
  onChange: (box: PlacementBox | null) => void;
  locale: Locale;
  compact?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getAutomaticBox(
  anchor: Point,
  productId: ProductId,
  source: PixelSize,
): PlacementBox {
  const product = getProductById(productId);
  const normalizedAspect = getNormalizedBoxAspect(product.projectionAspectRatio, source);

  // The floor point drives perspective: an object placed deeper in the room
  // appears smaller, while its immutable product aspect ratio is preserved.
  const depthScale = clamp((anchor.y - 0.3) / 0.65, 0, 1);
  let height =
    product.projectionAspectRatio < 1
      ? 0.34 + depthScale * 0.24
      : 0.24 + depthScale * 0.16;
  let width = height * normalizedAspect;

  const fitScale = Math.min(1, 0.82 / width, 0.72 / height);
  width *= fitScale;
  height *= fitScale;

  return {
    width,
    height,
    x: clamp(anchor.x - width / 2, 0, 1 - width),
    y: clamp(anchor.y - height, 0, 1 - height),
  };
}

export default function PlacementEditor({
  imageUrl,
  productId,
  finishId,
  placementBox,
  onChange,
  locale,
  compact = false,
}: PlacementEditorProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState<PixelSize>({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState<PixelSize>({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const product = getProductById(productId);
  const finish = getFinishById(finishId);
  const imageRect = getContainRect(frameSize, imageSize);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateSize = () => {
      const rect = frame.getBoundingClientRect();
      setFrameSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  function getPoint(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || imageRect.width <= 0 || imageRect.height <= 0) return null;

    const x = event.clientX - rect.left - imageRect.x;
    const y = event.clientY - rect.top - imageRect.y;
    if (x < 0 || y < 0 || x > imageRect.width || y > imageRect.height) return null;

    return {
      x: clamp(x / imageRect.width, 0.06, 0.94),
      y: clamp(y / imageRect.height, 0.2, 0.98),
    };
  }

  function placeFromEvent(event: ReactPointerEvent<HTMLDivElement>) {
    const point = getPoint(event);
    if (!point || imageSize.width <= 0 || imageSize.height <= 0) return;

    onChange(getAutomaticBox(point, productId, imageSize));
  }

  function releasePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  return (
    <div className={compact ? "h-full min-h-0" : "space-y-4"}>
      {!compact ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm leading-7 text-muted-foreground">
              {locale === "fr"
                ? "Touchez le sol à l’endroit où la pièce doit se poser. Sa taille est calculée automatiquement."
                : "Tap the floor where the piece should stand. Its scale is calculated automatically."}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              {locale === "fr"
                ? "Un point d’ancrage, aucune déformation"
                : "One floor anchor, no distortion"}
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            onClick={() => onChange(null)}
          >
            {locale === "fr" ? "Replacer" : "Reposition"}
          </button>
        </div>
      ) : null}

      <div
        ref={frameRef}
        className={`relative overflow-hidden rounded-2xl border border-border bg-muted touch-none ${
          compact ? "h-full min-h-[260px]" : "min-h-[420px]"
        }`}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          placeFromEvent(event);
        }}
        onPointerMove={(event) => {
          if (dragging) placeFromEvent(event);
        }}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        style={{ cursor: dragging ? "grabbing" : "crosshair" }}
      >
        <img
          src={imageUrl}
          alt={locale === "fr" ? "Photo complète de votre espace" : "Full photo of your room"}
          className="absolute inset-0 h-full w-full select-none object-contain"
          onLoad={(event) => {
            setImageSize({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            });
          }}
        />

        {imageRect.width > 0 && imageRect.height > 0 ? (
          <div
            className="pointer-events-none absolute"
            style={{
              left: imageRect.x,
              top: imageRect.y,
              width: imageRect.width,
              height: imageRect.height,
            }}
          >
            {placementBox ? (
              <div
                className="absolute shadow-[0_0_0_9999px_rgb(0_0_0/0.12)]"
                style={{
                  left: `${placementBox.x * 100}%`,
                  top: `${placementBox.y * 100}%`,
                  width: `${placementBox.width * 100}%`,
                  height: `${placementBox.height * 100}%`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-80 drop-shadow-[0_12px_16px_rgb(0_0_0/0.28)]"
                  style={{
                    background: `linear-gradient(115deg, color-mix(in srgb, ${finish.hex} 82%, white), ${finish.hex} 58%, color-mix(in srgb, ${finish.hex} 76%, black))`,
                    maskImage: `url(${product.maskPath})`,
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    maskSize: "100% 100%",
                    WebkitMaskImage: `url(${product.maskPath})`,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "100% 100%",
                  }}
                />
                <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                  {product.code} · {product.dimensionsLabel}
                </span>
                <span
                  className="absolute bottom-0 left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white bg-black shadow-[0_4px_14px_rgb(0_0_0/0.35)]"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-lg bg-black/70 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur">
                  {locale === "fr" ? "Touchez le sol pour poser" : "Tap the floor to place"}{" "}
                  {product.code}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
