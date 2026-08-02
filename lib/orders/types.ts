import type { Locale, FinishId, ProductId } from "@/lib/isandre/catalog";
import type { MarketCode } from "@/lib/markets";

export const orderStatuses = [
  "paid",
  "preparing",
  "ready_to_ship",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type OrderLine = {
  productId: ProductId | null;
  finishId: FinishId | null;
  name: string;
  quantity: number;
  unitAmountCents: number | null;
  totalAmountCents: number | null;
};

export type OrderAddress = {
  line1: string | null;
  line2: string | null;
  city: string | null;
  postalCode: string | null;
  state: string | null;
  country: string | null;
};

export type OrderRecord = {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  reference: string;
  status: OrderStatus;
  locale: Locale;
  marketCode: MarketCode | null;
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  customerEmail: string | null;
  customerName: string | null;
  customerPhone: string | null;
  shippingAddress: OrderAddress | null;
  lines: OrderLine[];
  notificationStatus: "pending" | "sent" | "partially_sent";
  createdAt: string;
  updatedAt: string;
};

export type OrderAuditEvent = {
  id: string;
  stripeEventId: string;
  stripeSessionId: string;
  kind: string;
  status: "processing" | "completed" | "failed";
  errorCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WebhookClaim = "claimed" | "already_completed" | "already_processing";
