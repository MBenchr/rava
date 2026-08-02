import { randomUUID } from "node:crypto";

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

export function createSupabaseServiceRequestRepository(
  supabaseUrl: string,
  serviceRoleKey: string,
): ServiceRequestRepository {
  const baseUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1`;
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  async function request(
    route: string,
    init: RequestInit = {},
    preference?: string,
  ) {
    const response = await fetch(`${baseUrl}${route}`, {
      ...init,
      headers: {
        ...headers,
        ...(preference ? { Prefer: preference } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`SERVICE_REQUEST_STORE_HTTP_${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json() as Promise<unknown>;
  }

  return {
    async createRequest(serviceRequest) {
      await request(
        "/isandre_service_requests",
        { method: "POST", body: JSON.stringify(toRow(serviceRequest)) },
        "return=minimal",
      );
    },
    async getRequest(id) {
      const rows = (await request(
        `/isandre_service_requests?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
      )) as Array<Record<string, unknown>>;
      return rows[0] ? fromRow(rows[0]) : null;
    },
    async updateNotificationStatus(id, status) {
      await request(
        `/isandre_service_requests?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            notification_status: status,
            updated_at: new Date().toISOString(),
          }),
        },
        "return=minimal",
      );
    },
    async appendAudit(event) {
      await request(
        "/isandre_service_request_events",
        {
          method: "POST",
          body: JSON.stringify({
            id: event.id,
            request_id: event.requestId,
            kind: event.kind,
            details: event.details,
            created_at: event.createdAt,
          }),
        },
        "return=minimal",
      );
    },
    async listRequests() {
      const rows = (await request(
        "/isandre_service_requests?select=*&order=created_at.desc",
      )) as Array<Record<string, unknown>>;
      return rows.map(fromRow);
    },
  };
}

let repository: ServiceRequestRepository | null = null;

export function getServiceRequestRepository() {
  if (repository) return repository;

  const supabaseUrl = getServerEnv("SUPABASE_URL");
  const serviceRoleKey = getServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (supabaseUrl && serviceRoleKey) {
    repository = createSupabaseServiceRequestRepository(
      supabaseUrl,
      serviceRoleKey,
    );
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
