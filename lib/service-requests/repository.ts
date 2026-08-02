import { randomUUID } from "node:crypto";

import type { Pool } from "pg";

import { getDatabasePool } from "@/lib/database";
import { getServerEnv } from "@/lib/server-env";
import type {
  ServiceRequestAuditEvent,
  ServiceRequestNotificationStatus,
  ServiceRequestRecord,
} from "@/lib/service-requests/types";

export type ServiceRequestRepository = {
  createRequest(request: ServiceRequestRecord): Promise<void>;
  getRequest(id: string): Promise<ServiceRequestRecord | null>;
  updateNotificationStatus(
    id: string,
    status: ServiceRequestNotificationStatus,
  ): Promise<void>;
  appendAudit(event: ServiceRequestAuditEvent): Promise<void>;
  listRequests(): Promise<ServiceRequestRecord[]>;
};

type MemoryServiceRequestRegistry = {
  requests: Map<string, ServiceRequestRecord>;
  audit: ServiceRequestAuditEvent[];
};

declare global {
  var isandreServiceRequestRegistry:
    | MemoryServiceRequestRegistry
    | undefined;
}

function memoryRegistry(): MemoryServiceRequestRegistry {
  return (
    globalThis.isandreServiceRequestRegistry ??
    (globalThis.isandreServiceRequestRegistry = {
      requests: new Map(),
      audit: [],
    })
  );
}

export function createMemoryServiceRequestRepository(): ServiceRequestRepository {
  const registry = memoryRegistry();

  return {
    async createRequest(request) {
      if (registry.requests.has(request.id)) {
        throw new Error("SERVICE_REQUEST_DUPLICATE_ID");
      }
      registry.requests.set(request.id, structuredClone(request));
    },
    async getRequest(id) {
      const request = registry.requests.get(id);
      return request ? structuredClone(request) : null;
    },
    async updateNotificationStatus(id, status) {
      const request = registry.requests.get(id);
      if (!request) throw new Error("SERVICE_REQUEST_NOT_FOUND");
      request.notificationStatus = status;
      request.updatedAt = new Date().toISOString();
    },
    async appendAudit(event) {
      registry.audit.push(structuredClone(event));
    },
    async listRequests() {
      return [...registry.requests.values()]
        .map((request) => structuredClone(request))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    },
  };
}

function toRow(request: ServiceRequestRecord) {
  return {
    id: request.id,
    reference: request.reference,
    kind: request.kind,
    source: request.source,
    status: request.status,
    locale: request.locale,
    name: request.name,
    email: request.email,
    organization: request.organization,
    phone: request.phone,
    location: request.location,
    product_id: request.productId,
    finish_id: request.finishId,
    quantity: request.quantity,
    message: request.message,
    privacy_accepted: request.privacyAccepted,
    marketing_consent: request.marketingConsent,
    notification_status: request.notificationStatus,
    created_at: request.createdAt,
    updated_at: request.updatedAt,
  };
}

function fromRow(row: Record<string, unknown>): ServiceRequestRecord {
  return {
    id: String(row.id),
    clientRequestId: String(row.id),
    reference: String(row.reference),
    kind: row.kind as ServiceRequestRecord["kind"],
    source: row.source as ServiceRequestRecord["source"],
    status: row.status as ServiceRequestRecord["status"],
    locale: row.locale === "fr" ? "fr" : "en",
    name: String(row.name),
    email: String(row.email),
    organization:
      typeof row.organization === "string" ? row.organization : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    location: typeof row.location === "string" ? row.location : null,
    productId:
      (row.product_id as ServiceRequestRecord["productId"]) ?? null,
    finishId: (row.finish_id as ServiceRequestRecord["finishId"]) ?? null,
    quantity: typeof row.quantity === "number" ? row.quantity : null,
    message: String(row.message),
    privacyAccepted: true,
    marketingConsent: row.marketing_consent === true,
    notificationStatus:
      row.notification_status as ServiceRequestRecord["notificationStatus"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function createPostgresServiceRequestRepository(
  pool: Pool,
): ServiceRequestRepository {
  return {
    async createRequest(serviceRequest) {
      const row = toRow(serviceRequest);
      await pool.query(
        `insert into public.isandre_service_requests (
           id, reference, kind, source, status, locale, name, email,
           organization, phone, location, product_id, finish_id, quantity,
           message, privacy_accepted, marketing_consent, notification_status,
           created_at, updated_at
         ) values (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
           $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
         )`,
        [
          row.id,
          row.reference,
          row.kind,
          row.source,
          row.status,
          row.locale,
          row.name,
          row.email,
          row.organization,
          row.phone,
          row.location,
          row.product_id,
          row.finish_id,
          row.quantity,
          row.message,
          row.privacy_accepted,
          row.marketing_consent,
          row.notification_status,
          row.created_at,
          row.updated_at,
        ],
      );
    },
    async getRequest(id) {
      const result = await pool.query<Record<string, unknown>>(
        `select * from public.isandre_service_requests where id = $1 limit 1`,
        [id],
      );
      return result.rows[0] ? fromRow(result.rows[0]) : null;
    },
    async updateNotificationStatus(id, status) {
      await pool.query(
        `update public.isandre_service_requests
            set notification_status = $2, updated_at = now()
          where id = $1`,
        [id, status],
      );
    },
    async appendAudit(event) {
      await pool.query(
        `insert into public.isandre_service_request_events (
           id, request_id, kind, details, created_at
         ) values ($1, $2, $3, $4::jsonb, $5)`,
        [
          event.id,
          event.requestId,
          event.kind,
          JSON.stringify(event.details),
          event.createdAt,
        ],
      );
    },
    async listRequests() {
      const result = await pool.query<Record<string, unknown>>(
        `select * from public.isandre_service_requests order by created_at desc`,
      );
      return result.rows.map(fromRow);
    },
  };
}

let repository: ServiceRequestRepository | null = null;

export function getServiceRequestRepository() {
  if (repository) return repository;

  const pool = getDatabasePool();

  if (pool) {
    repository = createPostgresServiceRequestRepository(pool);
    return repository;
  }

  if (
    process.env.NODE_ENV === "production" &&
    getServerEnv("ALLOW_VOLATILE_ORDER_STORE") !== "true"
  ) {
    throw new Error("DURABLE_SERVICE_REQUEST_STORE_NOT_CONFIGURED");
  }

  repository = createMemoryServiceRequestRepository();
  return repository;
}

export function createServiceRequestAuditEvent(
  requestId: string,
  kind: ServiceRequestAuditEvent["kind"],
  details: ServiceRequestAuditEvent["details"] = {},
): ServiceRequestAuditEvent {
  return {
    id: randomUUID(),
    requestId,
    kind,
    details,
    createdAt: new Date().toISOString(),
  };
}
