import type {
  FinishId,
  Locale,
  ProductId,
} from "@/lib/isandre/catalog";

export const serviceRequestKinds = ["project", "trade", "press"] as const;
export type ServiceRequestKind = (typeof serviceRequestKinds)[number];

export const serviceRequestSources = [
  "contact",
  "product-page",
  "projection",
  "trade-pack",
  "press-kit",
] as const;
export type ServiceRequestSource = (typeof serviceRequestSources)[number];

export const serviceRequestStatuses = [
  "new",
  "acknowledged",
  "qualified",
  "closed",
] as const;
export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number];

export type ServiceRequestInput = {
  clientRequestId: string;
  kind: ServiceRequestKind;
  source: ServiceRequestSource;
  locale: Locale;
  name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  location: string | null;
  productId: ProductId | null;
  finishId: FinishId | null;
  quantity: number | null;
  message: string;
  privacyAccepted: true;
  marketingConsent: boolean;
};

export type ServiceRequestNotificationStatus =
  | "pending"
  | "sent"
  | "skipped"
  | "failed";

export type ServiceRequestRecord = ServiceRequestInput & {
  id: string;
  reference: string;
  status: ServiceRequestStatus;
  notificationStatus: ServiceRequestNotificationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ServiceRequestAuditKind =
  | "created"
  | "notification_sent"
  | "notification_skipped"
  | "notification_failed"
  | "status_changed"
  | "exported";

export type ServiceRequestAuditEvent = {
  id: string;
  requestId: string;
  kind: ServiceRequestAuditKind;
  details: Record<string, string | number | boolean | null>;
  createdAt: string;
};
