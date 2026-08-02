import { z } from "zod";

import {
  finishIds,
  locales,
  productIds,
} from "@/lib/isandre/catalog";
import {
  serviceRequestKinds,
  serviceRequestSources,
} from "@/lib/service-requests/types";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const serviceRequestInputSchema = z
  .object({
    clientRequestId: z.string().uuid(),
    kind: z.enum(serviceRequestKinds),
    source: z.enum(serviceRequestSources).default("contact"),
    locale: z.enum(locales),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    organization: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(160).optional(),
    ),
    phone: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(6).max(40).optional(),
    ),
    location: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(160).optional(),
    ),
    productId: z.preprocess(
      emptyToUndefined,
      z.enum(productIds).optional(),
    ),
    finishId: z.preprocess(
      emptyToUndefined,
      z.enum(finishIds).optional(),
    ),
    quantity: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number().int().min(1).max(500).optional(),
    ),
    message: z.string().trim().min(10).max(3000),
    privacyAccepted: z.literal(true),
    marketingConsent: z.boolean().default(false),
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((value, context) => {
    if (value.finishId && !value.productId) {
      context.addIssue({
        code: "custom",
        path: ["productId"],
        message: "A finish requires a product.",
      });
    }
  })
  .transform((value) => ({
    clientRequestId: value.clientRequestId,
    kind: value.kind,
    source: value.source,
    locale: value.locale,
    name: value.name,
    email: value.email,
    organization: value.organization ?? null,
    phone: value.phone ?? null,
    location: value.location ?? null,
    productId: value.productId ?? null,
    finishId: value.finishId ?? null,
    quantity: value.quantity ?? null,
    message: value.message,
    privacyAccepted: value.privacyAccepted,
    marketingConsent: value.marketingConsent,
  }));

export type ParsedServiceRequestInput = z.infer<
  typeof serviceRequestInputSchema
>;
