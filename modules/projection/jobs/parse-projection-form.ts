import { z } from "zod";

import type { GenerateProjectionInput } from "@/lib/openai-projection";
import {
  finishIds,
  placementModeIds,
  productIds,
} from "@/lib/rava-content";
import { isProjectionProductReady } from "@/modules/projection/core/reference-kits";

const payloadSchema = z.object({
  productId: z.enum(productIds),
  finishId: z.enum(finishIds),
  placementMode: z.enum(placementModeIds),
  message: z.string().max(500).optional().default(""),
  placementBox: z.object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().min(0.05).max(1),
    height: z.number().min(0.05).max(1),
  }),
});

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
      "This product will be available in the simulator once its final dimensions are approved.",
      409,
    );
  }

  return {
    file: image,
    ...parsed.data,
  };
}
