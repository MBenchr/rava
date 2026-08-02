import {
  canDispatchAnalytics,
  getMeasurementConsent,
} from "@/lib/measurement-consent";

export const commerceEventNames = [
  "hero_view",
  "view_item_list",
  "view_item",
  "select_item",
  "select_finish",
  "gallery_image_view",
  "zoom_open",
  "dimensions_open",
  "technical_sheet_download",
  "view_cart",
  "add_to_cart",
  "begin_checkout",
  "purchase",
  "projection_open",
  "projection_upload",
  "projection_placement",
  "projection_completed",
  "projection_failed",
  "projection_download",
  "projection_share",
  "add_to_cart_from_projection",
  "project_request",
  "trade_request",
  "press_request",
] as const;

export type CommerceEventName = (typeof commerceEventNames)[number];

const blockedKeys = new Set([
  "address",
  "email",
  "first_name",
  "last_name",
  "message",
  "name",
  "phone",
  "room_image",
]);

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.slice(0, 20).map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !blockedKeys.has(key.toLowerCase()))
        .map(([key, item]) => [key, sanitizeValue(item)]),
    );
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  return undefined;
}

export function trackCommerceEvent(
  event: CommerceEventName,
  ecommerce: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;

  const detail = {
    event,
    ecommerce: sanitizeValue(ecommerce) as Record<string, unknown>,
  };

  // This local event is the canonical first-party measurement bus. It makes
  // flows testable without sending data to a vendor.
  window.dispatchEvent(new CustomEvent("isandre:commerce", { detail }));

  const consent = getMeasurementConsent();

  if (canDispatchAnalytics(consent)) {
    window.dataLayer ??= [];
    window.dataLayer.push(detail);
  }
}
