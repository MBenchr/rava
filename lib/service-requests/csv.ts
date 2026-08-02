import type { ServiceRequestRecord } from "@/lib/service-requests/types";

const headers = [
  "reference",
  "created_at",
  "kind",
  "source",
  "status",
  "locale",
  "name",
  "email",
  "organization",
  "phone",
  "location",
  "product_id",
  "finish_id",
  "quantity",
  "message",
  "marketing_consent",
  "notification_status",
] as const;

function safeCell(value: string | number | boolean | null) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function serviceRequestsToCrmCsv(
  requests: ServiceRequestRecord[],
) {
  const rows = requests.map((request) =>
    [
      request.reference,
      request.createdAt,
      request.kind,
      request.source,
      request.status,
      request.locale,
      request.name,
      request.email,
      request.organization,
      request.phone,
      request.location,
      request.productId,
      request.finishId,
      request.quantity,
      request.message,
      request.marketingConsent,
      request.notificationStatus,
    ]
      .map(safeCell)
      .join(","),
  );

  return `${headers.map(safeCell).join(",")}\n${rows.join("\n")}${
    rows.length ? "\n" : ""
  }`;
}
