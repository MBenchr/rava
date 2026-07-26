export type CommerceEventName =
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "projection_open"
  | "projection_upload"
  | "projection_placement"
  | "projection_completed"
  | "projection_download"
  | "projection_share"
  | "add_to_cart_from_projection";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackCommerceEvent(event: CommerceEventName, ecommerce: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dataLayer ??= [];
  window.dataLayer.push({ event, ecommerce });
  window.dispatchEvent(new CustomEvent("traversee:commerce", { detail: { event, ecommerce } }));
}
