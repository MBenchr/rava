import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import OpenAI, { toFile } from "openai";
import sharp from "sharp";

import {
  type FinishId,
  getFinishById,
  getProductById,
  type PlacementBox,
  type PlacementMode,
  type ProductId,
} from "@/lib/isandre/catalog";
import {
  getContainRect,
  getNormalizedBoxAspect,
  mapPlacementBoxToContainedCanvas,
  type PixelRect,
  type PixelSize,
} from "@/lib/projection-geometry";
import { getServerEnv } from "@/lib/server-env";
import type { ProjectionArtifact } from "@/modules/projection/core/types";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_EDGE = 1280;
export const PROJECTION_PROMPT_VERSION = "single-reference-room-edit-v2";

export type ProjectionProgressStage = "preparing" | "generating";

export type GenerateProjectionInput = {
  file: File;
  productId: ProductId;
  finishId: FinishId;
  placementMode: PlacementMode;
  message: string;
  placementBox: PlacementBox;
  onProgress?: (stage: ProjectionProgressStage) => void;
};

type NormalizedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  warning?: string;
};

type ApiImageSize = `${number}x${number}`;

type PreparedEditCanvas = PixelSize & {
  buffer: Buffer;
  sourceRect: PixelRect;
  apiSize: ApiImageSize;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function fitPlacementBoxToProductAspect(
  box: PlacementBox,
  productAspect: number,
  source: PixelSize,
): PlacementBox {
  const floorAnchor = {
    x: box.x + box.width / 2,
    y: box.y + box.height,
  };
  const normalizedAspect = getNormalizedBoxAspect(productAspect, source);
  let height = clamp(box.height, 0.12, 0.82);
  let width = height * normalizedAspect;
  const availableWidth = Math.max(0.12, 2 * Math.min(floorAnchor.x, 1 - floorAnchor.x));
  const availableHeight = Math.max(0.12, floorAnchor.y);
  const fitScale = Math.min(
    1,
    (availableWidth * 0.96) / width,
    (availableHeight * 0.98) / height,
    0.92 / width,
    0.82 / height,
  );
  width *= fitScale;
  height *= fitScale;

  return {
    x: clamp(floorAnchor.x - width / 2, 0, 1 - width),
    y: clamp(floorAnchor.y - height, 0, 1 - height),
    width,
    height,
  };
}

function validateInputImage(file: File) {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Formats accepted: png, jpg, webp.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("The room image is too large. Current limit: 12 MB.");
  }
}

async function normalizeImage(file: File): Promise<NormalizedImage> {
  const source = Buffer.from(await file.arrayBuffer());
  const oriented = await sharp(source, { failOn: "none" }).rotate().png().toBuffer();
  const metadata = await sharp(oriented).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Unable to read the room image dimensions.");
  }

  const output = await sharp(oriented)
    .resize({
      width: metadata.width >= metadata.height ? MAX_EDGE : undefined,
      height: metadata.height > metadata.width ? MAX_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
  const outputMetadata = await sharp(output).metadata();

  if (!outputMetadata.width || !outputMetadata.height) {
    throw new Error("Unable to normalize the room image.");
  }

  return {
    buffer: output,
    width: outputMetadata.width,
    height: outputMetadata.height,
    warning:
      outputMetadata.width !== metadata.width || outputMetadata.height !== metadata.height
        ? "The room image was reduced without cropping to keep generation fast."
        : undefined,
  };
}

function roundToImageGrid(value: number) {
  return Math.max(16, Math.round(value / 16) * 16);
}

export function chooseApiCanvas(source: PixelSize): PixelSize & { apiSize: ApiImageSize } {
  const sourceAspect = source.width / source.height;
  const aspect = clamp(sourceAspect, 1 / 3, 3);
  const targetPixels = 1024 * 1024;
  const minimumPixels = 655_360;
  const maximumEdge = 1280;
  let width = Math.sqrt(targetPixels * aspect);
  let height = width / aspect;
  const edgeScale = Math.min(1, maximumEdge / Math.max(width, height));
  width *= edgeScale;
  height *= edgeScale;

  if (width * height < minimumPixels) {
    const minimumScale = Math.sqrt(minimumPixels / (width * height));
    width *= minimumScale;
    height *= minimumScale;
  }

  let outputWidth = Math.min(maximumEdge, roundToImageGrid(width));
  let outputHeight = Math.min(maximumEdge, roundToImageGrid(height));

  if (outputWidth * outputHeight < minimumPixels) {
    if (outputWidth >= outputHeight) {
      outputHeight = Math.min(
        maximumEdge,
        Math.ceil(minimumPixels / outputWidth / 16) * 16,
      );
    } else {
      outputWidth = Math.min(
        maximumEdge,
        Math.ceil(minimumPixels / outputHeight / 16) * 16,
      );
    }
  }

  return {
    width: outputWidth,
    height: outputHeight,
    apiSize: `${outputWidth}x${outputHeight}`,
  };
}

async function prepareEditCanvas(image: NormalizedImage): Promise<PreparedEditCanvas> {
  const canvas = chooseApiCanvas(image);
  const fitted = getContainRect(canvas, image);
  const sourceRect = {
    x: Math.round(fitted.x),
    y: Math.round(fitted.y),
    width: Math.round(fitted.width),
    height: Math.round(fitted.height),
  };
  const contained = await sharp(image.buffer)
    .resize({ width: sourceRect.width, height: sourceRect.height, fit: "fill" })
    .png()
    .toBuffer();
  const buffer = await sharp({
    create: {
      width: canvas.width,
      height: canvas.height,
      channels: 4,
      background: { r: 232, g: 230, b: 224, alpha: 1 },
    },
  })
    .composite([{ input: contained, left: sourceRect.x, top: sourceRect.y }])
    .png()
    .toBuffer();

  return { ...canvas, buffer, sourceRect };
}

async function restoreOriginalPhotoFrame(
  editedBuffer: Buffer,
  canvas: PreparedEditCanvas,
  original: NormalizedImage,
) {
  const metadata = await sharp(editedBuffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("The generated projection has no usable dimensions.");
  }

  const scaleX = metadata.width / canvas.width;
  const scaleY = metadata.height / canvas.height;
  const left = Math.max(0, Math.round(canvas.sourceRect.x * scaleX));
  const top = Math.max(0, Math.round(canvas.sourceRect.y * scaleY));
  const width = Math.min(
    metadata.width - left,
    Math.max(1, Math.round(canvas.sourceRect.width * scaleX)),
  );
  const height = Math.min(
    metadata.height - top,
    Math.max(1, Math.round(canvas.sourceRect.height * scaleY)),
  );

  return sharp(editedBuffer)
    .extract({ left, top, width, height })
    .resize({ width: original.width, height: original.height, fit: "fill" })
    .png()
    .toBuffer();
}

function placementPixels(box: PlacementBox, canvas: PixelSize) {
  const left = Math.max(0, Math.round(box.x * canvas.width));
  const top = Math.max(0, Math.round(box.y * canvas.height));

  return {
    left,
    top,
    width: Math.min(canvas.width - left, Math.max(1, Math.round(box.width * canvas.width))),
    height: Math.min(canvas.height - top, Math.max(1, Math.round(box.height * canvas.height))),
  };
}

async function createPhotographicEditMask(canvas: PixelSize, box: PlacementBox) {
  const rect = placementPixels(box, canvas);
  const horizontalPadding = Math.max(24, Math.round(rect.width * 0.2));
  const topPadding = Math.max(20, Math.round(rect.height * 0.12));
  const floorPadding = Math.max(28, Math.round(rect.height * 0.18));
  const editRect = {
    left: Math.max(0, rect.left - horizontalPadding),
    top: Math.max(0, rect.top - topPadding),
    right: Math.min(canvas.width, rect.left + rect.width + horizontalPadding),
    bottom: Math.min(canvas.height, rect.top + rect.height + floorPadding),
  };
  const pixels = Buffer.alloc(canvas.width * canvas.height * 4, 255);

  for (let y = editRect.top; y < editRect.bottom; y += 1) {
    for (let x = editRect.left; x < editRect.right; x += 1) {
      pixels[(y * canvas.width + x) * 4 + 3] = 0;
    }
  }

  return sharp(pixels, {
    raw: { width: canvas.width, height: canvas.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

function placementInstruction(mode: PlacementMode) {
  if (mode === "divider") {
    return "The product is freestanding in the room and the room remains visible through it.";
  }

  return "The product stands naturally against the nearest wall or beside the selected furniture.";
}

export function buildProjectionPrompt(input: {
  productId: ProductId;
  finishId: FinishId;
  placementMode: PlacementMode;
  placementBox: PlacementBox;
  message: string;
}) {
  const product = getProductById(input.productId);
  const finish = getFinishById(input.finishId);
  const box = input.placementBox;
  const dimensions = product.sizeCm
    ? `${product.sizeCm.width} cm wide × ${product.sizeCm.height} cm high × ${product.sizeCm.depth} cm deep`
    : "Use the exact real-world bedside-table scale shown in IMAGE 2; no numeric dimensions are approved yet.";
  const note = input.message.trim().slice(0, 320);

  return `Create one realistic complete photograph.

IMAGE 1 is the customer's room. Preserve its camera position, architecture, furniture and identity.
IMAGE 2 is the only authorised reference for the product. Copy that exact product and finish. Do not invent a variation or use another furniture design.

PRODUCT
${product.localized.en.name}, ${finish.labels.en}.
Real dimensions: ${dimensions}.
Keep exactly the same silhouette, width-to-height ratio, depth, frame thickness, base, opening count, opening order and opening shapes as IMAGE 2. The product is open-backed. Do not add, remove, merge or reshape an opening.

PLACEMENT
Place the complete product inside this normalized IMAGE 1 box: x=${box.x.toFixed(4)}, y=${box.y.toFixed(4)}, width=${box.width.toFixed(4)}, height=${box.height.toFixed(4)}.
The base must touch the bottom centre of that box. ${placementInstruction(input.placementMode)}

PHOTOGRAPH
Regenerate the masked area as one coherent camera photograph, not a collage or 3D overlay. Match the room's exact perspective, light direction, exposure, colour temperature, shadows, floor contact, occlusions, lens softness and grain. Preserve IMAGE 1 outside the mask.
The finish is refined mineral plaster: matte, smooth at normal viewing distance, with faint natural hand-applied variation in grazing light. Never plastic, glossy, CGI or flat-shaded.
You may place a few realistic books, ceramics or personal objects in the openings when they suit the existing room. Keep several openings empty and never hide the product geometry.
No text, logo or watermark. Do not copy the room around the product from IMAGE 2.${note ? `\n\nCustomer note: ${note}` : ""}`;
}

async function absolutePublicFile(publicPath: string) {
  return readFile(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

async function prepareProductReference(publicPath: string) {
  const source = await absolutePublicFile(publicPath);
  return sharp(source)
    .rotate()
    .resize({
      width: 1024,
      height: 1024,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90 })
    .toBuffer();
}

export async function generateProjection(input: GenerateProjectionInput): Promise<ProjectionArtifact> {
  validateInputImage(input.file);
  const apiKey = getServerEnv("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  input.onProgress?.("preparing");
  const client = new OpenAI({ apiKey });
  const product = getProductById(input.productId);
  const original = await normalizeImage(input.file);
  const sourceBox = fitPlacementBoxToProductAspect(
    input.placementBox,
    product.projectionAspectRatio,
    original,
  );
  const canvas = await prepareEditCanvas(original);
  const canvasBox = mapPlacementBoxToContainedCanvas(sourceBox, canvas.sourceRect, canvas);
  const editMask = await createPhotographicEditMask(canvas, canvasBox);
  const productReference = await prepareProductReference(
    product.finishes[input.finishId].packshot.src,
  );
  const prompt = buildProjectionPrompt({
    productId: input.productId,
    finishId: input.finishId,
    placementMode: input.placementMode,
    placementBox: canvasBox,
    message: input.message,
  });

  input.onProgress?.("generating");
  const response = await client.images.edit({
    model: getServerEnv("OPENAI_IMAGE_MODEL") ?? "gpt-image-2",
    image: [
      await toFile(canvas.buffer, "01-customer-room.png", { type: "image/png" }),
      await toFile(productReference, "02-exact-product-reference.webp", {
        type: "image/webp",
      }),
    ],
    mask: await toFile(editMask, "placement-mask.png", { type: "image/png" }),
    prompt,
    quality: "medium",
    size: canvas.apiSize,
    output_format: "png",
  });
  const base64 = response.data?.[0]?.b64_json;
  if (!base64) throw new Error("OpenAI returned no usable projection image.");

  const restoredFrame = await restoreOriginalPhotoFrame(
    Buffer.from(base64, "base64"),
    canvas,
    original,
  );
  const output = await sharp(restoredFrame).webp({ quality: 90 }).toBuffer();
  return {
    projectionImage: `data:image/webp;base64,${output.toString("base64")}`,
    promptDigest: createHash("sha256").update(prompt).digest("hex").slice(0, 20),
    requestId: randomUUID(),
    warning: original.warning,
    productId: input.productId,
    finishId: input.finishId,
    placementBox: sourceBox,
    referenceKitVersion: "official-finish-photo-v1",
    promptVersion: PROJECTION_PROMPT_VERSION,
    rendererVersion: "single-reference-openai-v1",
  };
}
