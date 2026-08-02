import { randomBytes } from "node:crypto";

import {
  createServiceRequestAuditEvent,
  getServiceRequestRepository,
  type ServiceRequestRepository,
} from "@/lib/service-requests/repository";
import { sendServiceRequestEmails } from "@/lib/service-requests/email";
import { serviceRequestInputSchema } from "@/lib/service-requests/schema";
import type {
  ServiceRequestInput,
  ServiceRequestNotificationStatus,
  ServiceRequestRecord,
} from "@/lib/service-requests/types";

type NotificationSender = (
  request: ServiceRequestRecord,
) => Promise<Exclude<ServiceRequestNotificationStatus, "pending">>;

function requestReference(now: Date) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `SR-${date}-${suffix}`;
}

export async function createServiceRequest(
  rawInput: unknown,
  dependencies: {
    repository?: ServiceRequestRepository;
    sendNotifications?: NotificationSender;
    now?: Date;
  } = {},
) {
  const input = serviceRequestInputSchema.parse(rawInput) as ServiceRequestInput;
  const repository =
    dependencies.repository ?? getServiceRequestRepository();
  const sendNotifications =
    dependencies.sendNotifications ?? sendServiceRequestEmails;
  const now = dependencies.now ?? new Date();
  const timestamp = now.toISOString();
  const existing = await repository.getRequest(input.clientRequestId);
  if (existing) return existing;
  const record: ServiceRequestRecord = {
    ...input,
    id: input.clientRequestId,
    reference: requestReference(now),
    status: "new",
    notificationStatus: "pending",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await repository.createRequest(record);
  await repository.appendAudit(
    createServiceRequestAuditEvent(record.id, "created", {
      kind: record.kind,
      source: record.source,
      marketingConsent: record.marketingConsent,
    }),
  );

  try {
    const notificationStatus = await sendNotifications(record);
    await repository.updateNotificationStatus(record.id, notificationStatus);
    await repository.appendAudit(
      createServiceRequestAuditEvent(
        record.id,
        notificationStatus === "sent"
          ? "notification_sent"
          : notificationStatus === "skipped"
            ? "notification_skipped"
            : "notification_failed",
      ),
    );
    return { ...record, notificationStatus };
  } catch (error) {
    await repository.updateNotificationStatus(record.id, "failed");
    await repository.appendAudit(
      createServiceRequestAuditEvent(record.id, "notification_failed", {
        code:
          error instanceof Error
            ? error.message.slice(0, 120)
            : "SERVICE_REQUEST_NOTIFICATION_FAILED",
      }),
    );
    return { ...record, notificationStatus: "failed" as const };
  }
}
