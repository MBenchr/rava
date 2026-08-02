/* eslint-disable @next/next/no-img-element */
"use client";

import { type ChangeEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { Download, RefreshCw, Share2, ShoppingBag, SlidersHorizontal } from "lucide-react";

import PlacementEditor from "@/components/placement-editor";
import type { ProjectionRuntimeState } from "@/components/projection-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { getContent } from "@/content";
import { trackCommerceEvent } from "@/lib/commerce-events";
import {
  finishes,
  getFinishLabel,
  getFinishPrice,
  getPlacementModesForProduct,
  getProductById,
  getProductCopy,
  normalizeFinishForProduct,
  productList,
  type FinishId,
  type Locale,
  type PlacementBox,
  type PlacementMode,
  type ProductId,
  type ProjectionResponsePayload,
} from "@/lib/isandre/catalog";
import { isProjectionProductReady } from "@/lib/isandre/geometry";
import { getContainRect, type PixelSize } from "@/lib/projection-geometry";
import { cn } from "@/lib/utils";
import type { ProjectionJob } from "@/modules/projection/core/types";

export type ProjectionStudioContext = {
  sourceFile: File | null;
  result: ProjectionResponsePayload | null;
  placementMode: PlacementMode;
  productId: ProductId;
  finishId: FinishId;
  placementBox: PlacementBox | null;
};

type Props = {
  locale?: Locale;
  productId: ProductId;
  finishId: FinishId;
  onProductChange?: (productId: ProductId) => void;
  onFinishChange?: (finishId: FinishId) => void;
  allowProductSwitch?: boolean;
  onUseForRequest?: () => void;
  onContextChange?: (context: ProjectionStudioContext) => void;
  onRuntimeChange?: (runtime: ProjectionRuntimeState) => void;
};

function clamp(value: number) { return Math.min(100, Math.max(0, value)); }

function Compare({
  before,
  after,
  referenceSrc,
  referenceAlt,
  locale,
}: {
  before: string;
  after: string;
  referenceSrc: string;
  referenceAlt: string;
  locale: Locale;
}) {
  const content = getContent(locale);
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [frameSize, setFrameSize] = useState<PixelSize>({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState<PixelSize>({ width: 0, height: 0 });
  const imageRect = getContainRect(frameSize, imageSize);
  const splitX = imageRect.x + (position / 100) * imageRect.width;

  useEffect(() => {
    const element = frame.current;

    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setFrameSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  function move(clientX: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (rect && imageRect.width > 0) {
      setPosition(clamp(((clientX - rect.left - imageRect.x) / imageRect.width) * 100));
    }
  }

  function down(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    move(event.clientX);
  }

  function up(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  }

  return (
    <div className="h-full min-h-0">
      <div ref={frame} className="relative h-full min-h-0 cursor-ew-resize touch-none overflow-hidden bg-muted" onPointerDown={down} onPointerMove={(event) => dragging && move(event.clientX)} onPointerUp={up} onPointerCancel={up}>
        <img src={after} alt={content.projection.after} className="absolute inset-0 h-full w-full object-contain" />
        <img
          src={before}
          alt={content.projection.before}
          className="absolute inset-0 h-full w-full object-contain"
          onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
          style={{ clipPath: `inset(0 ${Math.max(0, frameSize.width - splitX)}px 0 0)` }}
        />
        {imageRect.width > 0 ? (
          <>
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              className="absolute z-30 h-12 cursor-ew-resize opacity-0"
              style={{ left: imageRect.x, top: imageRect.y, width: imageRect.width }}
              aria-label={content.projection.compare}
            />
            <div className="pointer-events-none absolute z-20 rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur" style={{ left: imageRect.x + 12, top: imageRect.y + 12 }}>{content.projection.before}</div>
            <div className="pointer-events-none absolute z-20 rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur" style={{ right: frameSize.width - imageRect.x - imageRect.width + 12, top: imageRect.y + 12 }}>{content.projection.after}</div>
            <div className="pointer-events-none absolute z-20 flex items-center gap-2 rounded-lg bg-black/65 p-1.5 pr-3 text-white shadow-lg backdrop-blur" style={{ right: frameSize.width - imageRect.x - imageRect.width + 12, bottom: frameSize.height - imageRect.y - imageRect.height + 12 }}>
              <img src={referenceSrc} alt={referenceAlt} className="h-14 w-11 rounded-md bg-white object-contain" />
              <span className="max-w-24 text-[10px] font-semibold uppercase leading-4 tracking-[0.12em]">{content.projection.productReference}</span>
            </div>
            <div className="pointer-events-none absolute z-20 w-0.5 bg-white shadow" style={{ left: splitX, top: imageRect.y, height: imageRect.height }}><div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white text-sm text-black shadow-lg">↔</div></div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function ProjectionStudio({ locale = "en", productId, finishId, onProductChange, onFinishChange, allowProductSwitch = false, onUseForRequest, onContextChange, onRuntimeChange }: Props) {
  const content = getContent(locale);
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [placementBox, setPlacementBox] = useState<PlacementBox | null>(null);
  const [placementMode, setPlacementMode] = useState<PlacementMode>(getProductById(productId).placementModes[0]);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ProjectionResponsePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [job, setJob] = useState<ProjectionJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const copy = getProductCopy(productId, locale);
  const activeFinish = normalizeFinishForProduct(productId, finishId);
  const referenceMedia = getProductById(productId).finishes[activeFinish].packshot;
  const product = getProductById(productId);
  const projectionReady = isProjectionProductReady(productId);

  useEffect(() => {
    onContextChange?.({
      sourceFile: file,
      result,
      placementMode,
      productId,
      finishId: activeFinish,
      placementBox,
    });
  }, [
    activeFinish,
    file,
    onContextChange,
    placementBox,
    placementMode,
    productId,
    result,
  ]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    discardProjection();
    if (preview) URL.revokeObjectURL(preview);
    setFile(next); setPreview(next ? URL.createObjectURL(next) : null); setPlacementBox(null); setError(null);
    if (next) {
      trackCommerceEvent("projection_upload", {
        product_id: productId,
        finish_id: activeFinish,
        file_type: next.type,
        file_size: next.size,
      });
    }
  }

  function selectProduct(next: ProductId) {
    if (!isProjectionProductReady(next)) return;
    discardProjection();
    onProductChange?.(next); setPlacementMode(getProductById(next).placementModes[0]); setPlacementBox(null);
  }

  async function pollProjectionJob(jobId: string) {
    for (let attempt = 0; attempt < 240; attempt += 1) {
      const response = await fetch(`/api/projection/jobs/${jobId}`, { cache: "no-store" });
      const payload = (await response.json()) as { job?: ProjectionJob; error?: string };

      if (!response.ok || !payload.job) {
        throw new Error(payload.error ?? content.projection.errors.generic);
      }

      setJob(payload.job);
      if (payload.job.status === "completed" && payload.job.artifact) return payload.job.artifact;
      if (payload.job.status === "failed") {
        throw new Error(payload.job.error?.message ?? content.projection.errors.generic);
      }

      await new Promise((resolve) => window.setTimeout(resolve, 1250));
    }

    throw new Error(content.projection.errors.unavailable);
  }

  async function runProjection() {
    if (!projectionReady) {
      setError(content.projection.errors.geometryBlocked);
      return;
    }
    if (!file || !placementBox) { setError(content.projection.errors.placement); return; }
    setLoading(true); setJob(null); setError(null); setResult(null);
    try {
      const data = new FormData();
      data.append("image", file); data.append("productId", productId); data.append("finishId", activeFinish); data.append("placementMode", placementMode); data.append("message", message); data.append("placementBox", JSON.stringify(placementBox));
      const response = await fetch("/api/projection/jobs", { method: "POST", body: data });
      const payload = (await response.json()) as { job?: ProjectionJob; error?: string };
      if (!response.ok || !payload.job) throw new Error(payload.error ?? content.projection.errors.generic);
      setJob(payload.job);
      const artifact = await pollProjectionJob(payload.job.id);
      setResult(artifact);
      trackCommerceEvent("projection_completed", {
        product_id: productId,
        finish_id: activeFinish,
      });
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : content.projection.errors.generic;
      setError(message);
      trackCommerceEvent("projection_failed", {
        product_id: productId,
        finish_id: activeFinish,
        reason: message,
      });
    } finally { setLoading(false); }
  }

  const loadingLabel = job?.stageLabel ?? content.projection.states.reading;

  useEffect(() => {
    const phase: ProjectionRuntimeState["phase"] = loading
      ? "processing"
      : result
        ? "completed"
        : error
          ? "failed"
          : preview
            ? "ready"
            : "idle";
    const label =
      phase === "completed"
        ? content.projection.after
        : phase === "failed"
          ? error ?? content.projection.errors.generic
          : phase === "ready"
            ? content.projection.place
            : phase === "idle"
              ? content.projection.startTitle
              : loadingLabel;

    onRuntimeChange?.({
      phase,
      progress: job?.progress ?? (loading ? 6 : result ? 100 : 0),
      label,
      thumbnail: result?.projectionImage ?? preview,
    });
  }, [
    content.projection.after,
    content.projection.errors.generic,
    content.projection.place,
    content.projection.startTitle,
    error,
    job?.progress,
    loading,
    loadingLabel,
    onRuntimeChange,
    preview,
    result,
  ]);

  function updatePlacement(next: PlacementBox | null) {
    if (next && !placementBox) {
      trackCommerceEvent("projection_placement", {
        product_id: productId,
        finish_id: activeFinish,
      });
    }
    setPlacementBox(next);
  }

  function projectionFilename() {
    return `isandre-${product.code.toLowerCase().replaceAll(" ", "-")}-${activeFinish}-room-view.webp`;
  }

  function discardProjection() {
    const jobId = job?.id;

    setResult(null);
    setJob(null);

    if (jobId) {
      void fetch(`/api/projection/jobs/${jobId}`, { method: "DELETE" });
    }
  }

  async function rerunProjection() {
    const jobId = job?.id;

    if (jobId) {
      await fetch(`/api/projection/jobs/${jobId}`, { method: "DELETE" });
    }

    setResult(null);
    setJob(null);
    await runProjection();
  }

  function downloadProjection() {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.projectionImage;
    link.download = projectionFilename();
    document.body.appendChild(link);
    link.click();
    link.remove();
    trackCommerceEvent("projection_download", {
      product_id: productId,
      finish_id: activeFinish,
    });
  }

  async function shareProjection() {
    if (!result || sharing) return;
    setSharing(true);
    try {
      const response = await fetch(result.projectionImage);
      const blob = await response.blob();
      const sharedFile = new File([blob], projectionFilename(), { type: blob.type });
      const shareData = {
        title: `${copy.name} · ${getFinishLabel(activeFinish, locale)}`,
        text: `${content.projection.after} · ${copy.name}`,
        files: [sharedFile],
      };

      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
        trackCommerceEvent("projection_share", {
          product_id: productId,
          finish_id: activeFinish,
        });
      } else {
        downloadProjection();
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      downloadProjection();
    } finally {
      setSharing(false);
    }
  }

  function addProjectionSelectionToBag() {
    trackCommerceEvent("add_to_cart_from_projection", {
      product_id: productId,
      finish_id: activeFinish,
      value: getFinishPrice(productId, activeFinish, locale),
    });
    onUseForRequest?.();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void runProjection();
      }}
      className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] bg-background"
    >
      <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={chooseFile} />

      <div className="projection-toolbar grid gap-2 border-b border-border bg-card p-3 sm:flex sm:overflow-x-auto sm:px-5">
        <Button type="button" size="sm" variant="outline" className="col-span-3 sm:col-auto" onClick={() => fileInput.current?.click()}>{file ? content.projection.replacePhoto : content.projection.upload}</Button>
        {allowProductSwitch ? productList.map((item) => {
          const ready = isProjectionProductReady(item.id);
          return (
            <button
              key={item.id}
              type="button"
              disabled={!ready}
              title={
                ready
                  ? item.code
                  : content.projection.errors.geometryBlocked
              }
              className={cn(
                "min-h-9 rounded-lg border px-2 text-xs sm:shrink-0 sm:px-3",
                item.id === productId
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card",
                !ready && "cursor-not-allowed opacity-45",
              )}
              onClick={() => selectProduct(item.id)}
            >
              {item.code}
            </button>
          );
        }) : null}
        <div className="projection-finish-grid col-span-3 grid gap-2 sm:contents">
          {finishes.map((finish) => <button key={finish.id} type="button" aria-label={finish.labels[locale]} title={finish.labels[locale]} className={cn("flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-[11px] sm:shrink-0 sm:justify-start sm:px-3 sm:text-xs", finish.id === activeFinish ? "border-foreground bg-secondary" : "border-border")} onClick={() => { discardProjection(); onFinishChange?.(finish.id); }}><span className="size-3 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: finish.hex }} /><span className="truncate sm:hidden">{finish.id === "rose-clay" ? "Rose" : finish.labels[locale]}</span><span className="hidden truncate sm:inline">{finish.labels[locale]}</span></button>)}
        </div>
        <div className="projection-placement-grid col-span-3 grid gap-2 sm:contents">
          {getPlacementModesForProduct(productId, locale).slice(0, 3).map((mode) => <button key={mode.id} type="button" className={cn("min-h-9 rounded-lg border px-2 text-[11px] sm:shrink-0 sm:px-3 sm:text-xs", mode.id === placementMode ? "border-foreground bg-secondary" : "border-border")} onClick={() => setPlacementMode(mode.id)}>{mode.label}</button>)}
        </div>
      </div>

      <div className="relative min-h-0 overflow-hidden bg-muted">
        {!projectionReady ? (
          <div className="grid h-full place-items-center px-6 text-center">
            <div>
              <p className="eyebrow">{copy.name}</p>
              <h3 className="display-title mt-3 text-3xl sm:text-5xl">{content.projection.unavailableTitle}</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">{content.projection.unavailableBody}</p>
            </div>
          </div>
        ) : !preview ? (
          <div className="grid h-full place-items-center px-6 text-center"><div><p className="eyebrow">{content.projection.title}</p><h3 className="display-title mt-3 text-3xl sm:mt-4 sm:text-5xl">{content.projection.startTitle}</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:mt-4 sm:leading-7">{content.projection.startBody}</p><Button type="button" className="mt-5 sm:mt-6" onClick={() => fileInput.current?.click()}>{content.projection.upload}</Button></div></div>
        ) : loading ? (
          <div className="relative h-full"><img src={preview} alt="" className="h-full w-full object-contain blur-[3px] saturate-75" /><div className="absolute inset-0 bg-black/30" /><div className="scanline scanline-shade absolute inset-x-0 top-0 h-28" /><div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="text-xs uppercase tracking-[0.18em] opacity-75">{content.projection.creating}</p><p className="mt-2 text-2xl font-medium">{loadingLabel}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25"><span className="block h-full bg-white transition-[width] duration-500" style={{ width: `${job?.progress ?? 6}%` }} /></div><p className="mt-2 text-xs text-white/70">{job?.progress ?? 6}% · {content.projection.keepOpen}</p></div></div>
        ) : result ? (
          <Compare before={preview} after={result.projectionImage} referenceSrc={referenceMedia.mobileSrc} referenceAlt={referenceMedia.alt} locale={locale} />
        ) : (
          <PlacementEditor imageUrl={preview} productId={productId} finishId={activeFinish} placementBox={placementBox} onChange={updatePlacement} locale={locale} compact />
        )}
      </div>

      <div className="grid gap-3 border-t border-border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{copy.name} · {getFinishLabel(activeFinish, locale)}</p>
          <p className="truncate text-xs text-muted-foreground">
            {result
              ? `${product.dimensionsLabel ?? copy.descriptor} · ${getFinishPrice(productId, activeFinish, locale)}`
              : file
                ? file.name
                : content.projection.noPhoto}
          </p>
          {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          {result ? (
            <>
              {onUseForRequest ? (
                <Button type="button" onClick={addProjectionSelectionToBag}>
                  <ShoppingBag aria-hidden="true" />
                  {content.projection.addToBag}
                </Button>
              ) : null}
              <Button type="button" size="icon" variant="outline" onClick={downloadProjection} aria-label={content.projection.download}>
                <Download aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="outline" disabled={sharing} onClick={() => void shareProjection()} aria-label={content.projection.share}>
                <Share2 aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={discardProjection} aria-label={content.projection.adjust}>
                <SlidersHorizontal aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => void rerunProjection()} aria-label={content.projection.retry}>
                <RefreshCw aria-hidden="true" />
              </Button>
            </>
          ) : (
            <>
              {file ? (
                <input
                  value={message}
                  maxLength={320}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={content.projection.optionalPlaceholder}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm sm:w-56"
                />
              ) : null}
              <button type={file ? "submit" : "button"} onClick={!file ? () => fileInput.current?.click() : undefined} disabled={!projectionReady || loading || Boolean(file && !placementBox)} className={buttonVariants()}>
                {!file ? content.common.choose : placementBox ? content.projection.generate : content.projection.place}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
