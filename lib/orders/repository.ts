import { createHash, randomUUID } from "node:crypto";

import type { Pool } from "pg";

import { getDatabasePool } from "@/lib/database";
import { isandreCommerceContract } from "@/lib/isandre/commerce";
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

function toLocalOrderRow(order: OrderRecord) {
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
    customerEmail:
      typeof row.customer_email === "string" ? row.customer_email : null,
    customerName:
      typeof row.customer_name === "string" ? row.customer_name : null,
    customerPhone:
      typeof row.customer_phone === "string" ? row.customer_phone : null,
    shippingAddress:
      row.shipping_address && typeof row.shipping_address === "object"
        ? (row.shipping_address as OrderRecord["shippingAddress"])
        : null,
    lines: Array.isArray(row.lines) ? (row.lines as OrderRecord["lines"]) : [],
    notificationStatus:
      row.notification_status as OrderRecord["notificationStatus"],
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export function createPostgresOrderRepository(pool: Pool): OrderRepository {
  return {
    async claimWebhookEvent(event) {
      const claim = await pool.query(
        `insert into isandre_core.payment_events (
           stripe_event_id, universe_id, event_type, payload_sha256,
           processing_status, attempt_count, last_attempt_at, lease_until
         ) values ($1, 'taqa', $2, $3, 'processing', 1, now(), now() + interval '5 minutes')
         on conflict (stripe_event_id) do update set
           processing_status = 'processing',
           payload_sha256 = excluded.payload_sha256,
           failure_code = null,
           attempt_count = isandre_core.payment_events.attempt_count + 1,
           last_attempt_at = now(),
           lease_until = now() + interval '5 minutes'
         where isandre_core.payment_events.universe_id = 'taqa'
           and (
             isandre_core.payment_events.processing_status in ('received', 'failed')
             or (
               isandre_core.payment_events.processing_status = 'processing'
               and isandre_core.payment_events.lease_until < now()
             )
           )
         returning stripe_event_id`,
        [event.stripeEventId, event.kind, event.payloadSha256],
      );

      if (claim.rowCount === 1) return "claimed";

      const existing = await pool.query<{ processing_status: string }>(
        `select processing_status
           from isandre_core.payment_events
          where stripe_event_id = $1 and universe_id = 'taqa'
          limit 1`,
        [event.stripeEventId],
      );

      return existing.rows[0]?.processing_status === "completed"
        ? "already_completed"
        : "already_processing";
    },
    async completeWebhookEvent(stripeEventId) {
      await pool.query(
        `update isandre_core.payment_events
            set processing_status = 'completed', failure_code = null,
                processed_at = now(), lease_until = null
          where stripe_event_id = $1 and universe_id = 'taqa'`,
        [stripeEventId],
      );
    },
    async failWebhookEvent(stripeEventId, errorCode) {
      await pool.query(
        `update isandre_core.payment_events
            set processing_status = 'failed', failure_code = $2,
                lease_until = null
          where stripe_event_id = $1 and universe_id = 'taqa'`,
        [stripeEventId, errorCode.slice(0, 120)],
      );
    },
    async upsertOrder(order) {
      const client = await pool.connect();

      try {
        await client.query("begin");
        await client.query(
          `insert into isandre_core.orders (
             id, universe_id, order_kind, external_reference,
             stripe_session_id, stripe_payment_intent_id, status,
             market_code, locale, currency, subtotal_minor, shipping_minor,
             tax_minor, total_minor, catalog_version, source_version,
             price_book_version, created_at, updated_at
           ) values (
             $1, 'taqa', 'catalog', $2, $3, $4, $5, $6, $7, $8,
             $9, $10, $11, $12, $13, $14, $15, $16, $17
           )
           on conflict (stripe_session_id) do update set
             stripe_payment_intent_id = excluded.stripe_payment_intent_id,
             status = excluded.status,
             market_code = excluded.market_code,
             locale = excluded.locale,
             currency = excluded.currency,
             subtotal_minor = excluded.subtotal_minor,
             shipping_minor = excluded.shipping_minor,
             tax_minor = excluded.tax_minor,
             total_minor = excluded.total_minor,
             catalog_version = excluded.catalog_version,
             source_version = excluded.source_version,
             price_book_version = excluded.price_book_version,
             updated_at = excluded.updated_at`,
          [
            order.id,
            order.reference,
            order.stripeSessionId,
            order.stripePaymentIntentId,
            order.status,
            order.marketCode,
            order.locale,
            order.currency,
            order.subtotalCents,
            order.shippingCents,
            order.taxCents,
            order.totalCents,
            isandreCommerceContract.catalogVersion,
            isandreCommerceContract.sourceVersion,
            isandreCommerceContract.priceBookVersion,
            order.createdAt,
            order.updatedAt,
          ],
        );

        for (const [lineIndex, line] of order.lines.entries()) {
          await client.query(
            `insert into isandre_core.order_lines (
               order_id, source_line_index, product_id, variant_id, quantity,
               unit_amount_minor, currency, product_snapshot
             ) values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
             on conflict (order_id, source_line_index)
               where source_line_index is not null
             do update set
               product_id = excluded.product_id,
               variant_id = excluded.variant_id,
               quantity = excluded.quantity,
               unit_amount_minor = excluded.unit_amount_minor,
               currency = excluded.currency,
               product_snapshot = excluded.product_snapshot`,
            [
              order.id,
              lineIndex,
              line.productId ?? "unknown",
              line.productId && line.finishId
                ? `${line.productId}-${line.finishId}`
                : null,
              line.quantity,
              line.unitAmountCents ?? 0,
              order.currency,
              JSON.stringify(line),
            ],
          );
        }

        const row = toLocalOrderRow(order);
        await client.query(
          `insert into public.isandre_orders (
             id, stripe_session_id, stripe_payment_intent_id, reference,
             status, locale, market_code, currency, subtotal_cents,
             shipping_cents, tax_cents, total_cents, customer_email,
             customer_name, customer_phone, shipping_address, lines,
             notification_status, created_at, updated_at
           ) values (
             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
             $11, $12, $13, $14, $15, $16::jsonb, $17::jsonb, $18, $19, $20
           )
           on conflict (stripe_session_id) do update set
             stripe_payment_intent_id = excluded.stripe_payment_intent_id,
             status = excluded.status,
             locale = excluded.locale,
             market_code = excluded.market_code,
             currency = excluded.currency,
             subtotal_cents = excluded.subtotal_cents,
             shipping_cents = excluded.shipping_cents,
             tax_cents = excluded.tax_cents,
             total_cents = excluded.total_cents,
             customer_email = excluded.customer_email,
             customer_name = excluded.customer_name,
             customer_phone = excluded.customer_phone,
             shipping_address = excluded.shipping_address,
             lines = excluded.lines,
             notification_status = excluded.notification_status,
             updated_at = excluded.updated_at`,
          [
            row.id,
            row.stripe_session_id,
            row.stripe_payment_intent_id,
            row.reference,
            row.status,
            row.locale,
            row.market_code,
            row.currency,
            row.subtotal_cents,
            row.shipping_cents,
            row.tax_cents,
            row.total_cents,
            row.customer_email,
            row.customer_name,
            row.customer_phone,
            JSON.stringify(row.shipping_address),
            JSON.stringify(row.lines),
            row.notification_status,
            row.created_at,
            row.updated_at,
          ],
        );
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      } finally {
        client.release();
      }
    },
    async getOrderByStripeSession(stripeSessionId) {
      const result = await pool.query<Record<string, unknown>>(
        `select * from public.isandre_orders
          where stripe_session_id = $1
          limit 1`,
        [stripeSessionId],
      );

      return result.rows[0] ? fromOrderRow(result.rows[0]) : null;
    },
  };
}

let repository: OrderRepository | null = null;

export function getOrderRepository() {
  if (repository) return repository;

  const pool = getDatabasePool();

  if (pool) {
    repository = createPostgresOrderRepository(pool);
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
  payloadSha256?: string;
}): OrderAuditEvent {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    ...input,
    payloadSha256:
      input.payloadSha256 ??
      createHash("sha256")
        .update(`${input.stripeEventId}:${input.stripeSessionId}:${input.kind}`)
        .digest("hex"),
    status: "processing",
    errorCode: null,
    createdAt: now,
    updatedAt: now,
  };
}
