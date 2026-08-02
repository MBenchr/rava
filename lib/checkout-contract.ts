import { z } from "zod";

import { marketCodes } from "@/lib/markets";
import {
  finishIds,
  productIds,
  type CheckoutPayload,
} from "@/lib/isandre/catalog";

const checkoutLineSchema = z
  .object({
    productId: z.enum(productIds),
    finishId: z.enum(finishIds),
    quantity: z.number().int().min(1).max(12),
  })
  .strict();

export const checkoutPayloadSchema = z
  .object({
    items: z.array(checkoutLineSchema).min(1).max(12),
    locale: z.enum(["en", "fr"]).default("en"),
    marketCode: z.enum(marketCodes),
    email: z.string().email().optional(),
    checkoutAttemptId: z.string().uuid(),
  })
  .strict();

export type ValidatedCheckoutPayload = CheckoutPayload & {
  checkoutAttemptId: string;
};

export function parseCheckoutPayload(value: unknown): ValidatedCheckoutPayload {
  return checkoutPayloadSchema.parse(value);
}

export function checkoutIdempotencyKey(
  payload: ValidatedCheckoutPayload,
  mode: "hosted" | "express",
) {
  return `isandre-taqa-${mode}-${payload.checkoutAttemptId}`;
}
