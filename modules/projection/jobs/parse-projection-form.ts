import { z } from "zod";

import type { GenerateProjectionInput } from "@/lib/openai-projection";
import {
  finishIds,
  placementModeIds,
  productIds,
} from "@/lib/isandre/catalog";
import { isProjectionProductReady } from "@/lib/isandre/geometry";

export const PROJECTION_UPLOAD_LIMIT_BYTES = 12 * 1024 * 1024;
export const PROJECTION_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

async function hasSupportedImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const isWebp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

  return isJpeg || isPng || isWebp;
}

const placementBoxSchema = z
  .object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().min(0.05).max(1),
    height: z.number().min(0.05).max(1),
  })
  .strict()
  .superRefine((box, context) => {
    if (box.x + box.width > 1 || box.y + box.height > 1) {
      context.addIssue({
        code: "custom",
        message: "The placement must stay inside the complete room photo.",
      });
    }
  });

const payloadSchema = z
  .object({
    productId: z.enum(productIds),
    finishId: z.enum(finishIds),
    placementMode: z.enum(placementModeIds),
    message: z.string().max(320).optional().default(""),
    placementBox: placementBoxSchema,
  })
  .strict();

export class ProjectionRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ProjectionRequestError";
    this.status = status;
  }
}

export async function parseProjectionForm(request: Request): Promise<GenerateProjectionInput> {
  const formData = await request.formData();
  const image = formData.get("image");
  const messageValue = formData.get("message");

  if (!(image instanceof File)) {
    throw new ProjectionRequestError("No room image received.");
  }
  if (
    !PROJECTION_UPLOAD_TYPES.includes(
      image.type as (typeof PROJECTION_UPLOAD_TYPES)[number],
    )
  ) {
    throw new ProjectionRequestError("Formats accepted: png, jpg, webp.", 415);
  }
  if (image.size < 64 || image.size > PROJECTION_UPLOAD_LIMIT_BYTES) {
    throw new ProjectionRequestError(
      "The room image must be a valid file no larger than 12 MB.",
      413,
    );
  }
  if (!(await hasSupportedImageSignature(image))) {
    throw new ProjectionRequestError(
      "The room image content does not match a supported format.",
      415,
    );
  }

  const rawPlacementBox = formData.get("placementBox");
  if (typeof rawPlacementBox !== "string") {
    throw new ProjectionRequestError("Place the product before creating the projection.");
  }

  let placementBox: unknown;
  try {
    placementBox = JSON.parse(rawPlacementBox);
  } catch {
    throw new ProjectionRequestError("The supplied placement is invalid.");
  }

  const parsed = payloadSchema.safeParse({
    productId: formData.get("productId"),
    finishId: formData.get("finishId"),
    placementMode: formData.get("placementMode"),
    message: typeof messageValue === "string" ? messageValue : "",
    placementBox,
  });

  if (!parsed.success) {
    throw new ProjectionRequestError("The projection settings are incomplete or invalid.");
  }

  if (!isProjectionProductReady(parsed.data.productId)) {
    throw new ProjectionRequestError(
      "Projection is not available for this piece until its dimensions are validated.",
      422,
    );
  }

  return {
    file: image,
    ...parsed.data,
  };
}
