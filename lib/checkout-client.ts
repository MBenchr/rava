import type { CheckoutPayload } from "@/lib/isandre/catalog";

export async function openStripeCheckout(payload: CheckoutPayload) {
  const checkoutAttemptId = crypto.randomUUID();
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, checkoutAttemptId }),
  });
  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Checkout is unavailable.");
  }

  window.location.assign(data.url);
}
