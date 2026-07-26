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
} from "@/lib/rava-content";
import {
  getContainRect,
  mapPlacementBoxToContainedCanvas,
  getNormalizedBoxAspect,
  type PixelRect,
  type PixelSize,
} from "@/lib/projection-geometry";
import { requestStructuredJson } from "@/lib/openai-structured-output";
import { getServerEnv } from "@/lib/server-env";
import { getApprovedProductReferenceKit } from "@/modules/projection/core/reference-kits";
import type { PlacementTransform, ProjectionArtifact } from "@/modules/projection/core/types";
import { evaluateProjectionQuality, ProjectionQualityError } from "@/modules/projection/quality/quality-gate";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_EDGE = 1600;
const PROMPT_VERSION = "reference-guided-full-photo-v3";

export type ProjectionProgressStage = "analysing" | "rendering" | "integrating" | "verifying";

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

type SceneScaleEvaluation = {
  confidence: number;
  suggestedHeight: number;
  horizonY: number;
  reason: string;
  cameraView: string;
  lightDirection: string;
  lightQuality: string;
  decorStyle: string;
  stylingObjects: string[];
};

type VisualProjectionEvaluation = {
  productBox: PlacementBox;
  geometrySimilarity: number;
  placementConfidence: number;
  realismScore: number;
  roomPreservationScore: number;
  openingCountMatches: boolean;
  openingLayoutMatches: boolean;
  silhouetteMatches: boolean;
  railThicknessMatches: boolean;
  frontAspectMatches: boolean;
  finishMatches: boolean;
  reasons: string[];
};

function dataUrl(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lockBoxToProductAtFloorAnchor(
  suggestedHeight: number,
  floorAnchor: { x: number; y: number },
  productAspect: number,
  source: PixelSize,
) {
  const normalizedAspect = getNormalizedBoxAspect(productAspect, source);
  let height = clamp(suggestedHeight, 0.2, 0.72);
  let width = height * normalizedAspect;
  const availableWidth = Math.max(0.12, 2 * Math.min(floorAnchor.x, 1 - floorAnchor.x));
  const availableHeight = Math.max(0.12, floorAnchor.y);
  const fitScale = Math.min(
    1,
    (availableWidth * 0.96) / width,
    (availableHeight * 0.98) / height,
    0.9 / width,
    0.78 / height,
  );
  width *= fitScale;
  height *= fitScale;

  return {
    width,
    height,
    x: floorAnchor.x - width / 2,
    y: floorAnchor.y - height,
  };
}

async function analyseSceneScale(
  client: OpenAI,
  original: NormalizedImage,
  requestedBox: PlacementBox,
  productId: ProductId,
) {
  const kit = getApprovedProductReferenceKit(productId);
  const product = getProductById(productId);
  const floorAnchor = {
    x: requestedBox.x + requestedBox.width / 2,
    y: requestedBox.y + requestedBox.height,
  };
  const model =
    getServerEnv("OPENAI_VISION_MODEL") ??
    getServerEnv("OPENAI_CHAT_MODEL") ??
    "gpt-5-mini";
  const evaluation = await requestStructuredJson<SceneScaleEvaluation>({
    label: "Scene scale analysis",
    initialMaxOutputTokens: 700,
    retryMaxOutputTokens: 2400,
    create: (maxOutputTokens) =>
      client.responses.create({
        model,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Analyse this interior photograph for physically credible furniture placement and photographic integration.
The customer selected floor anchor x=${floorAnchor.x.toFixed(4)}, y=${floorAnchor.y.toFixed(4)} in normalized full-image coordinates.
The exact product is ${product.localized.en.name}, ${kit.dimensionsMm.width} mm wide × ${kit.dimensionsMm.height} mm high × ${kit.dimensionsMm.depth} mm deep.
Infer the horizon, floor plane and scale from architecture, doors, windows, furniture and perspective. Return the normalized image height that this product should occupy when its base touches the selected anchor. Never move the selected floor anchor. Do not infer a different product aspect ratio.
Also identify the camera view, the direction and quality of light, the interior style, and up to four restrained objects that could naturally sit in this product without obscuring its openings. Suggested objects must suit the room already photographed and look collected rather than staged.`,
              },
              {
                type: "input_image",
                image_url: dataUrl(original.buffer, "image/png"),
                detail: "high",
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "scene_scale",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                confidence: { type: "number", minimum: 0, maximum: 1 },
                suggestedHeight: { type: "number", minimum: 0.1, maximum: 0.9 },
                horizonY: { type: "number", minimum: 0, maximum: 1 },
                reason: { type: "string" },
                cameraView: { type: "string" },
                lightDirection: { type: "string" },
                lightQuality: { type: "string" },
                decorStyle: { type: "string" },
                stylingObjects: {
                  type: "array",
                  maxItems: 4,
                  items: { type: "string" },
                },
              },
              required: [
                "confidence",
                "suggestedHeight",
                "horizonY",
                "reason",
                "cameraView",
                "lightDirection",
                "lightQuality",
                "decorStyle",
                "stylingObjects",
              ],
            },
          },
        },
        max_output_tokens: maxOutputTokens,
      }),
  });

  if (
    !Number.isFinite(evaluation.confidence) ||
    !Number.isFinite(evaluation.suggestedHeight)
  ) {
    throw new Error("Scene scale analysis returned invalid coordinates.");
  }

  return evaluation;
}

async function evaluateGeneratedProjection(
  client: OpenAI,
  generated: Buffer,
  original: Buffer,
  officialProductReference: Buffer,
  identityBoard: Buffer,
  productId: ProductId,
  requestedBox: PlacementBox,
) {
  const kit = getApprovedProductReferenceKit(productId);
  const model =
    getServerEnv("OPENAI_VISION_MODEL") ??
    getServerEnv("OPENAI_CHAT_MODEL") ??
    "gpt-5-mini";
  return requestStructuredJson<VisualProjectionEvaluation>({
    label: "Projection quality evaluation",
    initialMaxOutputTokens: 1200,
    retryMaxOutputTokens: 3600,
    create: (maxOutputTokens) =>
      client.responses.create({
        model,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `You are a strict furniture projection quality inspector.
IMAGE 1 is the generated full-room result.
IMAGE 2 is the original room.
IMAGE 3 is the immutable approved product photograph.
IMAGE 4 is the approved identity board showing front, right and rear geometry.

The expected product has exactly ${kit.openings.length} openings and external dimensions ${kit.dimensionsMm.width} × ${kit.dimensionsMm.height} × ${kit.dimensionsMm.depth} mm. The requested normalized product box is x=${requestedBox.x.toFixed(4)}, y=${requestedBox.y.toFixed(4)}, width=${requestedBox.width.toFixed(4)}, height=${requestedBox.height.toFixed(4)}.

Reject geometry drift, wrong opening count or layout, changed arch/base/depth, thinner rails, wrong width-to-height ratio, wrong finish, floating floor contact, visible collage edges, CGI material, incorrect lighting, or unnecessary changes to the room. Return a tight normalized bounding box around the generated product in IMAGE 1 and conservative 0–1 scores. Scores above 0.9 require strong visual evidence. Return at most six short rejection reasons.`,
              },
              {
                type: "input_image",
                image_url: dataUrl(generated, "image/png"),
                detail: "high",
              },
              {
                type: "input_image",
                image_url: dataUrl(original, "image/png"),
                detail: "high",
              },
              {
                type: "input_image",
                image_url: dataUrl(officialProductReference, "image/webp"),
                detail: "high",
              },
              {
                type: "input_image",
                image_url: dataUrl(identityBoard, "image/png"),
                detail: "high",
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "projection_quality",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                productBox: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    x: { type: "number", minimum: 0, maximum: 1 },
                    y: { type: "number", minimum: 0, maximum: 1 },
                    width: { type: "number", minimum: 0.01, maximum: 1 },
                    height: { type: "number", minimum: 0.01, maximum: 1 },
                  },
                  required: ["x", "y", "width", "height"],
                },
                geometrySimilarity: { type: "number", minimum: 0, maximum: 1 },
                placementConfidence: { type: "number", minimum: 0, maximum: 1 },
                realismScore: { type: "number", minimum: 0, maximum: 1 },
                roomPreservationScore: { type: "number", minimum: 0, maximum: 1 },
                openingCountMatches: { type: "boolean" },
                openingLayoutMatches: { type: "boolean" },
                silhouetteMatches: { type: "boolean" },
                railThicknessMatches: { type: "boolean" },
                frontAspectMatches: { type: "boolean" },
                finishMatches: { type: "boolean" },
                reasons: {
                  type: "array",
                  maxItems: 6,
                  items: { type: "string" },
                },
              },
              required: [
                "productBox",
                "geometrySimilarity",
                "placementConfidence",
                "realismScore",
                "roomPreservationScore",
                "openingCountMatches",
                "openingLayoutMatches",
                "silhouetteMatches",
                "railThicknessMatches",
                "frontAspectMatches",
                "finishMatches",
                "reasons",
              ],
            },
          },
        },
        max_output_tokens: maxOutputTokens,
      }),
  });
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

function boxWasAdjusted(original: PlacementBox, next: PlacementBox) {
  return (
    Math.abs(original.x - next.x) > 0.0005 ||
    Math.abs(original.y - next.y) > 0.0005 ||
    Math.abs(original.width - next.width) > 0.0005 ||
    Math.abs(original.height - next.height) > 0.0005
  );
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
        ? "The room image was reduced without cropping to keep the projection stable."
        : undefined,
  };
}

function roundToImageGrid(value: number) {
  return Math.max(16, Math.round(value / 16) * 16);
}

export function chooseApiCanvas(source: PixelSize): PixelSize & { apiSize: ApiImageSize } {
  const sourceAspect = source.width / source.height;
  const aspect = clamp(sourceAspect, 1 / 3, 3);
  const targetPixels = 1536 * 1024;
  const minimumPixels = 655_360;
  const maximumEdge = 1536;
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

  const outputWidth = Math.min(maximumEdge, roundToImageGrid(width));
  const outputHeight = Math.min(maximumEdge, roundToImageGrid(height));

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

async function outsideIntegrationChangeRatio(
  baseline: Buffer,
  generated: Buffer,
  box: PlacementBox,
  size: PixelSize,
) {
  const [before, after] = await Promise.all([
    sharp(baseline).ensureAlpha().raw().toBuffer(),
    sharp(generated).ensureAlpha().raw().toBuffer(),
  ]);
  const left = clamp(Math.floor((box.x - box.width * 0.18) * size.width), 0, size.width);
  const right = clamp(
    Math.ceil((box.x + box.width * 1.18) * size.width),
    0,
    size.width,
  );
  const top = clamp(Math.floor((box.y - box.height * 0.1) * size.height), 0, size.height);
  const bottom = clamp(
    Math.ceil((box.y + box.height * 1.16) * size.height),
    0,
    size.height,
  );
  let changed = 0;
  let inspected = 0;

  for (let y = 0; y < size.height; y += 1) {
    for (let x = 0; x < size.width; x += 1) {
      if (x >= left && x <= right && y >= top && y <= bottom) continue;

      const offset = (y * size.width + x) * 4;
      const delta =
        Math.abs(before[offset] - after[offset]) +
        Math.abs(before[offset + 1] - after[offset + 1]) +
        Math.abs(before[offset + 2] - after[offset + 2]);
      inspected += 1;
      if (delta > 42) changed += 1;
    }
  }

  return inspected ? changed / inspected : 0;
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
  const horizontalPadding = Math.max(24, Math.round(rect.width * 0.18));
  const topPadding = Math.max(20, Math.round(rect.height * 0.1));
  const floorPadding = Math.max(28, Math.round(rect.height * 0.16));
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
  switch (mode) {
    case "against-wall":
      return "The product stands against the wall; the wall remains visible through every opening.";
    case "divider":
      return "The product is freestanding as a room divider; the room remains visible through every opening.";
    case "behind-sofa":
      return "The product stands behind the sofa while keeping the supplied placement unchanged.";
    case "under-window":
      return "The product stands under the window while keeping the supplied placement unchanged.";
    case "bedside":
      return "The product stands beside the bed while keeping the supplied placement unchanged.";
    default:
      return "Keep the supplied placement unchanged.";
  }
}

function buildPrompt(input: {
  productId: ProductId;
  finishId: FinishId;
  placementMode: PlacementMode;
  transform: PlacementTransform;
  scene: SceneScaleEvaluation | null;
  message: string;
}) {
  const kit = getApprovedProductReferenceKit(input.productId);
  const product = getProductById(input.productId);
  const finish = getFinishById(input.finishId);
  const box = input.transform.box;
  const note = input.message.trim().slice(0, 320);
  const scene = input.scene;
  const stylingObjects = scene?.stylingObjects
    .map((object) => object.trim())
    .filter(Boolean)
    .slice(0, 4);

  return `GOAL
Regenerate one complete, coherent, photorealistic interior photograph with the approved product naturally present in the selected location. This is a premium furniture room-view result intended to help a customer decide to purchase. It must look like one real camera exposure, never a cutout, overlay, pasted render, 3D mockup or collage.

INPUTS
IMAGE 1 — Original customer room and primary composition. Preserve its camera, crop, architecture, furniture, objects and visual identity.
IMAGE 2 — Official ${product.localized.en.name} campaign photograph in ${finish.labels.en}. This is the immutable product identity, finish and photographic realism reference.
IMAGE 3 — Approved product identity board. It proves the exact front, right and rear geometry.
IMAGE 4 — Approved front orthographic reference. It proves the exact front proportions and opening coordinates.
IMAGE 5 — Approved rear three-quarter reference. It proves the exact ${kit.dimensionsMm.depth} mm depth and open-backed construction.

PRODUCT — IMMUTABLE
${product.localized.en.name}, reference kit ${kit.version}.
External dimensions: ${kit.dimensionsMm.width} mm wide × ${kit.dimensionsMm.height} mm high × ${kit.dimensionsMm.depth} mm deep.
Exactly ${kit.openings.length} openings in the coordinates shown on Image 3. Open-backed. Continuous solid base. No feet.
The visible rails, uprights and junctions must keep the same ${kit.wallThicknessMm} mm material density as the approved reference. Do not make the horizontal model thinner or lighter.

PLACEMENT — IMMUTABLE
Normalized box: x ${box.x.toFixed(4)}, y ${box.y.toFixed(4)}, width ${box.width.toFixed(4)}, height ${box.height.toFixed(4)}.
Yaw: ${input.transform.yawDeg.toFixed(0)} degrees. Floor anchor: ${input.transform.floorAnchor.x.toFixed(4)}, ${input.transform.floorAnchor.y.toFixed(4)}.
Scale was inferred automatically from the room perspective, known architectural cues and the canonical metric dimensions. The customer selected only the floor anchor.
${placementInstruction(input.placementMode)}
The product must fill the supplied box, with its base touching the supplied floor anchor. The floor contact, centre, width-to-height ratio and selected anchor are immutable. Infer room perspective from Image 1 without changing the approved front proportions. Respect believable occlusion by existing foreground objects.

SCENE MATCH
${scene ? `Camera: ${scene.cameraView}. Light direction: ${scene.lightDirection}. Light quality: ${scene.lightQuality}. Interior character: ${scene.decorStyle}.` : "Read camera perspective, light direction, colour temperature and interior character only from Image 1."}
Do not redesign or restyle the customer's room. You may rebalance exposure and colour only inside the edit mask so product and room read as one photograph.

PHOTOGRAPHIC INTEGRATION
Inside the supplied edit mask, rebuild the local room pixels and the product together. Match lens perspective, exposure, light direction, colour temperature, contact shadow, indirect bounce light, edge softness, depth of field, sensor noise and photographic grain. The product surface is premium hand-applied mineral plaster: refined matte, approximately 5–8 gloss units, smooth at normal viewing distance, with faint tonal clouding and microscopic trowel variation visible only in grazing light. It must never look plastic, flat-shaded or computer-generated.

LIVED-IN STYLING
Use zero to four physically plausible objects inside the openings only when they improve realism. Prefer an edited mix of books, hand-thrown stoneware, a small framed photograph, a restrained vessel or one sculptural found object. Match the customer's existing taste and scale. Keep generous empty space, do not repeat identical objects and never hide an opening.${stylingObjects?.length ? ` Suitable cues from the room analysis: ${stylingObjects.join(", ")}.` : ""}

CONSTRAINTS
Change only the masked integration area. Keep everything else the same.
Never invent, remove, merge, close or reshape an opening. Never change the arch, base, depth, rail thickness or proportions. Never make the product plastic, lacquered, glossy, sandy, embossed, grainy or CGI-looking. Never crop or redesign the room. Never copy the room or decorative arrangement from an input reference. No text, logo or watermark.${note ? `\n\nOPTIONAL CUSTOMER NOTE\n${note}` : ""}`;
}

async function absolutePublicFile(publicPath: string) {
  return readFile(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

export async function generateProjection(input: GenerateProjectionInput): Promise<ProjectionArtifact> {
  validateInputImage(input.file);
  const apiKey = getServerEnv("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const client = new OpenAI({ apiKey });
  const kit = getApprovedProductReferenceKit(input.productId);
  input.onProgress?.("analysing");
  const original = await normalizeImage(input.file);
  const initialFloorAnchor = {
    x: input.placementBox.x + input.placementBox.width / 2,
    y: input.placementBox.y + input.placementBox.height,
  };
  let scaleAnalysis: SceneScaleEvaluation | null = null;
  let scaleWarning: string | undefined;

  try {
    scaleAnalysis = await analyseSceneScale(
      client,
      original,
      input.placementBox,
      input.productId,
    );
  } catch {
    scaleWarning =
      "Automatic room scale analysis was unavailable; the perspective-safe placement estimate was used.";
  }

  const suggestedHeight =
    scaleAnalysis && scaleAnalysis.confidence >= 0.55
      ? scaleAnalysis.suggestedHeight
      : input.placementBox.height;
  const sourceBox = lockBoxToProductAtFloorAnchor(
    suggestedHeight,
    initialFloorAnchor,
    kit.dimensionsMm.width / kit.dimensionsMm.height,
    original,
  );
  const canvas = await prepareEditCanvas(original);
  const canvasBox = mapPlacementBoxToContainedCanvas(sourceBox, canvas.sourceRect, canvas);
  const transform: PlacementTransform = {
    box: canvasBox,
    yawDeg: 0,
    floorAnchor: {
      x: canvasBox.x + canvasBox.width / 2,
      y: canvasBox.y + canvasBox.height,
    },
  };
  input.onProgress?.("rendering");
  const editMask = await createPhotographicEditMask(canvas, canvasBox);
  const basePrompt = buildPrompt({
    productId: input.productId,
    finishId: input.finishId,
    placementMode: input.placementMode,
    transform,
    scene: scaleAnalysis,
    message: input.message,
  });
  const officialProductReference = await absolutePublicFile(
    getProductById(input.productId).finishes[input.finishId].packshot.src,
  );
  const frontOrthographic = await absolutePublicFile(kit.assets.frontOrthographic);
  const rearLeft30 = await absolutePublicFile(kit.assets.rearLeft30);
  const identityBoard = await absolutePublicFile(kit.assets.identityBoard);
  const baseline = await restoreOriginalPhotoFrame(canvas.buffer, canvas, original);
  const imageModel = getServerEnv("OPENAI_IMAGE_MODEL") ?? "gpt-image-2";

  async function runAttempt(prompt: string) {
    input.onProgress?.("integrating");
    const response = await client.images.edit({
      model: imageModel,
      image: [
        await toFile(canvas.buffer, "01-original-room.png", { type: "image/png" }),
        await toFile(officialProductReference, "02-official-product-reference.webp", {
          type: "image/webp",
        }),
        await toFile(identityBoard, "03-approved-identity-board.png", {
          type: "image/png",
        }),
        await toFile(frontOrthographic, "04-approved-front-orthographic.png", {
          type: "image/png",
        }),
        await toFile(rearLeft30, "05-approved-rear-left-30.png", {
          type: "image/png",
        }),
      ],
      mask: await toFile(editMask, "photographic-integration-mask.png", {
        type: "image/png",
      }),
      prompt,
      quality: "high",
      size: canvas.apiSize,
      output_format: "png",
    });
    const base64 = response.data?.[0]?.b64_json;
    if (!base64) throw new Error("OpenAI returned no usable projection image.");

    const restored = await restoreOriginalPhotoFrame(
      Buffer.from(base64, "base64"),
      canvas,
      original,
    );
    input.onProgress?.("verifying");
    const visual = await evaluateGeneratedProjection(
      client,
      restored,
      original.buffer,
      officialProductReference,
      identityBoard,
      input.productId,
      sourceBox,
    );
    const outsideChange = await outsideIntegrationChangeRatio(
      baseline,
      restored,
      sourceBox,
      original,
    );
    const scores = evaluateProjectionQuality({
      requestedBox: sourceBox,
      renderedBox: visual.productBox,
      geometryLocked:
        visual.openingCountMatches &&
        visual.openingLayoutMatches &&
        visual.silhouetteMatches &&
        visual.railThicknessMatches &&
        visual.frontAspectMatches &&
        visual.finishMatches,
      geometrySimilarity: visual.geometrySimilarity,
      placementConfidence: visual.placementConfidence,
      realismScore: visual.realismScore,
      roomPreservationScore: visual.roomPreservationScore,
      outsideIntegrationChangeRatio: outsideChange,
    });
    scores.reasons.push(...visual.reasons.filter((reason) => !scores.reasons.includes(reason)));

    return { restored, scores };
  }

  let finalPrompt = basePrompt;
  let attempt = await runAttempt(finalPrompt);

  if (!attempt.scores.passed) {
    finalPrompt = `${basePrompt}

CORRECTION REQUIRED AFTER AUTOMATIC QUALITY REVIEW
The previous result was rejected for: ${attempt.scores.reasons.join(", ")}.
Regenerate from the original room and immutable references. Correct every listed issue while keeping the exact floor anchor, bounding box, opening layout and room outside the mask unchanged.`;
    attempt = await runAttempt(finalPrompt);
  }

  if (!attempt.scores.passed) throw new ProjectionQualityError(attempt.scores);

  const restored = await sharp(attempt.restored).webp({ quality: 92 }).toBuffer();
  const warningParts = [
    original.warning,
    scaleWarning,
    scaleAnalysis && scaleAnalysis.confidence < 0.55
      ? "The room contained too few reliable scale cues; a conservative perspective estimate was used."
      : undefined,
    boxWasAdjusted(input.placementBox, sourceBox)
      ? "Scale was calculated from the room while the selected floor anchor was preserved."
      : undefined,
  ].filter(Boolean);

  return {
    projectionImage: `data:image/webp;base64,${restored.toString("base64")}`,
    promptDigest: createHash("sha256").update(finalPrompt).digest("hex").slice(0, 20),
    requestId: randomUUID(),
    warning: warningParts.length ? warningParts.join(" ") : undefined,
    productId: input.productId,
    finishId: input.finishId,
    placementBox: sourceBox,
    referenceKitVersion: kit.version,
    promptVersion: PROMPT_VERSION,
    rendererVersion: "reference-guided-full-photo-v3",
    scores: attempt.scores,
  };
}
