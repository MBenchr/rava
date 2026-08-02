import { getContent } from "@/content";
import { sendTransactionalEmail } from "@/lib/email-transport";
import {
  getFinishById,
  getProductById,
  siteMeta,
} from "@/lib/isandre/catalog";
import { getServerEnv } from "@/lib/server-env";
import type { ServiceRequestRecord } from "@/lib/service-requests/types";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function kindLabel(request: ServiceRequestRecord) {
  const labels = {
    en: { project: "Project", trade: "Trade", press: "Press" },
    fr: { project: "Projet", trade: "Prescripteur", press: "Presse" },
  } as const;
  return labels[request.locale][request.kind];
}

export async function sendServiceRequestEmails(
  request: ServiceRequestRecord,
) {
  const content = getContent(request.locale);
  const product = request.productId
    ? getProductById(request.productId)
    : null;
  const finish = request.finishId ? getFinishById(request.finishId) : null;
  const target =
    getServerEnv("SERVICE_REQUEST_NOTIFICATION_EMAIL") ??
    getServerEnv("ORDER_NOTIFICATION_EMAIL") ??
    siteMeta.leadEmail;
  const label = kindLabel(request);
  const selection = product
    ? `${product.code}${finish ? ` · ${finish.labels[request.locale]}` : ""}`
    : request.locale === "fr"
      ? "Non précisée"
      : "Not specified";

  const studio = await sendTransactionalEmail({
    idempotencyKey: `service-request-${request.id}-studio`,
    to: target,
    replyTo: request.email,
    subject: `${label} · ${request.reference} · ${request.name}`,
    html: `
      <h1>${escapeHtml(label)} · ${escapeHtml(request.reference)}</h1>
      <p><strong>Name</strong>: ${escapeHtml(request.name)}</p>
      <p><strong>Email</strong>: ${escapeHtml(request.email)}</p>
      <p><strong>Organisation</strong>: ${escapeHtml(request.organization ?? "—")}</p>
      <p><strong>Location</strong>: ${escapeHtml(request.location ?? "—")}</p>
      <p><strong>Selection</strong>: ${escapeHtml(selection)}</p>
      <p><strong>Quantity</strong>: ${request.quantity ?? "—"}</p>
      <p><strong>Message</strong>: ${escapeHtml(request.message)}</p>
      <p><strong>Marketing consent</strong>: ${request.marketingConsent ? "yes" : "no"}</p>
    `,
  });

  const client = await sendTransactionalEmail({
    idempotencyKey: `service-request-${request.id}-client`,
    to: request.email,
    subject:
      request.locale === "fr"
        ? `Votre demande ${request.reference}`
        : `Your request ${request.reference}`,
    html: `
      <div style="margin:0;background:#f3f1eb;color:#121311;font-family:Arial,sans-serif">
        <div style="max-width:620px;margin:auto;padding:48px 24px">
          <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase">${escapeHtml(request.reference)}</p>
          <h1 style="font-family:Georgia,serif;font-size:42px;font-weight:400">${escapeHtml(
            request.locale === "fr"
              ? "Votre demande est bien arrivée."
              : "Your request has arrived.",
          )}</h1>
          <p style="font-size:16px;line-height:1.7">${escapeHtml(
            request.locale === "fr"
              ? "Le studio reviendra vers vous avec les informations utiles à votre projet."
              : "The studio will reply with the information relevant to your project.",
          )}</p>
          <p style="margin-top:40px;color:#696b66">${escapeHtml(content.emails.supportSignature)}</p>
        </div>
      </div>
    `,
  });

  if (studio.status === "sent" && client.status === "sent") return "sent";
  if (studio.status === "skipped" && client.status === "skipped") return "skipped";
  return "failed";
}
