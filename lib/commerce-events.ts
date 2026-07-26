export type CommerceEventName =
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "projection_open";

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
