import { randomUUID } from "node:crypto";

import { getServerEnv } from "@/lib/server-env";
import type {
  OrderAuditEvent,
  OrderRecord,
  WebhookClaim,
} from "@/lib/orders/types";

export type OrderRepository = {
  claimWebhookEvent(event: OrderAuditEvent): Promise<WebhookClaim>;
  completeWebhookEvent(stripeEventId: string): Promise<void>;
  failWebhookEvent(stripeEventId: string, errorCode: string): Promise<void>;
  upsertOrder(order: OrderRecord): Promise<void>;
  getOrderByStripeSession(stripeSessionId: string): Promise<OrderRecord | null>;
};

type MemoryOrderRegistry = {
  events: Map<string, OrderAuditEvent>;
  orders: Map<string, OrderRecord>;
};

declare global {
  var isandreOrderRegistry: MemoryOrderRegistry | undefined;
}

function memoryRegistry(): MemoryOrderRegistry {
  return (
    globalThis.isandreOrderRegistry ??
    (globalThis.isandreOrderRegistry = {
      events: new Map(),
      orders: new Map(),
    })
  );
}

export function createMemoryOrderRepository(): OrderRepository {
  const registry = memoryRegistry();

  return {
    async claimWebhookEvent(event) {
      const existing = registry.events.get(event.stripeEventId);

      if (existing?.status === "completed") return "already_completed";
      if (existing?.status === "processing") return "already_processing";

      registry.events.set(event.stripeEventId, structuredClone(event));
      return "claimed";
    },
    async completeWebhookEvent(stripeEventId) {
      const event = registry.events.get(stripeEventId);
      if (!event) return;
      event.status = "completed";
      event.errorCode = null;
      event.updatedAt = new Date().toISOString();
    },
    async failWebhookEvent(stripeEventId, errorCode) {
      const event = registry.events.get(stripeEventId);
      if (!event) return;
      event.status = "failed";
      event.errorCode = errorCode;
      event.updatedAt = new Date().toISOString();
    },
    async upsertOrder(order) {
      registry.orders.set(order.stripeSessionId, structuredClone(order));
    },
    async getOrderByStripeSession(stripeSessionId) {
      const order = registry.orders.get(stripeSessionId);
      return order ? structuredClone(order) : null;
    },
  };
}

function toOrderRow(order: OrderRecord) {
  return {
    id: order.id,
    stripe_session_id: order.stripeSessionId,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    reference: order.reference,
    status: order.status,
    locale: order.locale,
    market_code: order.marketCode,
    currency: order.currency,
    subtotal_cents: order.subtotalCents,
    shipping_cents: order.shippingCents,
    tax_cents: order.taxCents,
    total_cents: order.totalCents,
    customer_email: order.customerEmail,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    shipping_address: order.shippingAddress,
    lines: order.lines,
    notification_status: order.notificationStatus,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

function fromOrderRow(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id),
    stripeSessionId: String(row.stripe_session_id),
    stripePaymentIntentId:
      typeof row.stripe_payment_intent_id === "string"
        ? row.stripe_payment_intent_id
        : null,
    reference: String(row.reference),
    status: row.status as OrderRecord["status"],
    locale: row.locale === "fr" ? "fr" : "en",
    marketCode: (row.market_code as OrderRecord["marketCode"]) ?? null,
    currency: String(row.currency),
    subtotalCents: Number(row.subtotal_cents),
    shippingCents: Number(row.shipping_cents),
    taxCents: Number(row.tax_cents),
    totalCents: Number(row.total_cents),
    customerEmail: typeof row.customer_email === "string" ? row.customer_email : null,
    customerName: typeof row.customer_name === "string" ? row.customer_name : null,
    customerPhone: typeof row.customer_phone === "string" ? row.customer_phone : null,
    shippingAddress:
      row.shipping_address && typeof row.shipping_address === "object"
        ? (row.shipping_address as OrderRecord["shippingAddress"])
        : null,
    lines: Array.isArray(row.lines) ? (row.lines as OrderRecord["lines"]) : [],
    notificationStatus: row.notification_status as OrderRecord["notificationStatus"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function createSupabaseOrderRepository(
  supabaseUrl: string,
  serviceRoleKey: string,
): OrderRepository {
  const baseUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1`;
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  async function request(
    path: string,
    init: RequestInit = {},
    preference?: string,
  ) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...headers,
        ...(preference ? { Prefer: preference } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`ORDER_STORE_HTTP_${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json() as Promise<unknown>;
  }

  return {
    async claimWebhookEvent(event) {
      const existing = (await request(
        `/isandre_order_events?stripe_event_id=eq.${encodeURIComponent(event.stripeEventId)}&select=status&limit=1`,
      )) as Array<{ status: OrderAuditEvent["status"] }>;

      if (existing[0]?.status === "completed") return "already_completed";
      if (existing[0]?.status === "processing") return "already_processing";

      const row = {
        id: event.id,
        stripe_event_id: event.stripeEventId,
        stripe_session_id: event.stripeSessionId,
        kind: event.kind,
        status: "processing",
        error_code: null,
        created_at: event.createdAt,
        updated_at: event.updatedAt,
      };

      await request(
        "/isandre_order_events?on_conflict=stripe_event_id",
        { method: "POST", body: JSON.stringify(row) },
        "resolution=merge-duplicates,return=minimal",
      );

      return "claimed";
    },
    async completeWebhookEvent(stripeEventId) {
      await request(
        `/isandre_order_events?stripe_event_id=eq.${encodeURIComponent(stripeEventId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "completed",
            error_code: null,
            updated_at: new Date().toISOString(),
          }),
        },
        "return=minimal",
      );
    },
    async failWebhookEvent(stripeEventId, errorCode) {
      await request(
        `/isandre_order_events?stripe_event_id=eq.${encodeURIComponent(stripeEventId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "failed",
            error_code: errorCode.slice(0, 120),
            updated_at: new Date().toISOString(),
          }),
        },
        "return=minimal",
      );
    },
    async upsertOrder(order) {
      await request(
        "/isandre_orders?on_conflict=stripe_session_id",
        { method: "POST", body: JSON.stringify(toOrderRow(order)) },
        "resolution=merge-duplicates,return=minimal",
      );
    },
    async getOrderByStripeSession(stripeSessionId) {
      const rows = (await request(
        `/isandre_orders?stripe_session_id=eq.${encodeURIComponent(stripeSessionId)}&select=*&limit=1`,
      )) as Array<Record<string, unknown>>;

      return rows[0] ? fromOrderRow(rows[0]) : null;
    },
  };
}

let repository: OrderRepository | null = null;

export function getOrderRepository() {
  if (repository) return repository;

  const supabaseUrl = getServerEnv("SUPABASE_URL");
  const serviceRoleKey = getServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (supabaseUrl && serviceRoleKey) {
    repository = createSupabaseOrderRepository(supabaseUrl, serviceRoleKey);
    return repository;
  }

  if (
    process.env.NODE_ENV === "production" &&
    getServerEnv("ALLOW_VOLATILE_ORDER_STORE") !== "true"
  ) {
    throw new Error("DURABLE_ORDER_STORE_NOT_CONFIGURED");
  }

  repository = createMemoryOrderRepository();
  return repository;
}

export function createOrderAuditEvent(input: {
  stripeEventId: string;
  stripeSessionId: string;
  kind: string;
}): OrderAuditEvent {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    ...input,
    status: "processing",
    errorCode: null,
    createdAt: now,
    updatedAt: now,
  };
}
