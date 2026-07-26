import type { PlacementBox } from "@/lib/rava-content";

export type PixelSize = {
  width: number;
  height: number;
};

export type PixelRect = PixelSize & {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getContainRect(container: PixelSize, source: PixelSize): PixelRect {
  if (
    container.width <= 0 ||
    container.height <= 0 ||
    source.width <= 0 ||
    source.height <= 0
  ) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const scale = Math.min(container.width / source.width, container.height / source.height);
  const width = source.width * scale;
  const height = source.height * scale;

  return {
    x: (container.width - width) / 2,
    y: (container.height - height) / 2,
    width,
    height,
  };
}

// Placement boxes are normalized to the source image. Their normalized ratio
// must account for the image ratio so the visible box keeps the product ratio.
export function getNormalizedBoxAspect(productAspect: number, source: PixelSize) {
  return productAspect * (source.height / source.width);
}

export function clampPlacementBox(box: PlacementBox): PlacementBox {
  const width = clamp(box.width, 0.01, 1);
  const height = clamp(box.height, 0.01, 1);

  return {
    width,
    height,
    x: clamp(box.x, 0, 1 - width),
    y: clamp(box.y, 0, 1 - height),
  };
}

export function fitPlacementBoxToPixelAspect(
  box: PlacementBox,
  productAspect: number,
  source: PixelSize,
): PlacementBox {
  const safeBox = clampPlacementBox(box);
  const normalizedAspect = getNormalizedBoxAspect(productAspect, source);
  const currentRatio = safeBox.width / safeBox.height;
  let width = safeBox.width;
  let height = safeBox.height;

  if (currentRatio > normalizedAspect) {
    width = safeBox.height * normalizedAspect;
  } else {
    height = safeBox.width / normalizedAspect;
  }

  return clampPlacementBox({
    x: safeBox.x + (safeBox.width - width) / 2,
    y: safeBox.y + (safeBox.height - height) / 2,
    width,
    height,
  });
}

export function mapPlacementBoxToContainedCanvas(
  box: PlacementBox,
  sourceRect: PixelRect,
  canvas: PixelSize,
): PlacementBox {
  return clampPlacementBox({
    x: (sourceRect.x + box.x * sourceRect.width) / canvas.width,
    y: (sourceRect.y + box.y * sourceRect.height) / canvas.height,
    width: (box.width * sourceRect.width) / canvas.width,
    height: (box.height * sourceRect.height) / canvas.height,
  });
}
