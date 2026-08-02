import { getContent } from "@/content";
import { sendTransactionalEmail } from "@/lib/email-transport";
import { brandIdentity, siteMeta } from "@/lib/isandre/catalog";
import type { OrderRecord } from "@/lib/orders/types";

export const orderLifecycleStages = [
  "production",
  "shipment",
  "delivery",
  "care",
] as const;

export type OrderLifecycleStage = (typeof orderLifecycleStages)[number];

type LifecycleDetails = {
  trackingUrl?: string;
  note?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildOrderLifecycleEmail(
  order: OrderRecord,
  stage: OrderLifecycleStage,
  details: LifecycleDetails = {},
) {
  const content = getContent(order.locale);
  const copy = {
    production: {
      subject: content.emails.productionUpdateSubject,
      body: content.emails.productionUpdateBody,
    },
    shipment: {
      subject: content.emails.shipmentSubject,
      body: content.emails.shipmentBody,
    },
    delivery: {
      subject: content.emails.deliverySubject,
      body: content.emails.deliveryBody,
    },
    care: {
      subject: content.emails.careSubject,
      body: content.emails.careBody,
    },
  }[stage];
  const tracking =
    stage === "shipment" && details.trackingUrl
      ? `<p style="margin:24px 0"><a href="${escapeHtml(details.trackingUrl)}" style="color:#121311">${order.locale === "fr" ? "Suivre la livraison" : "Track delivery"}</a></p>`
      : "";
  const note = details.note
    ? `<p style="margin:24px 0;color:#4f514d">${escapeHtml(details.note)}</p>`
    : "";

  return {
    subject: `${copy.subject} · ${order.reference}`,
    html: `
      <div style="margin:0;background:#f3f1eb;color:#121311;font-family:Arial,sans-serif">
        <div style="max-width:620px;margin:auto;padding:48px 24px">
          <p style="margin:0 0 40px;font-size:18px;font-weight:700;letter-spacing:.08em">${brandIdentity.name}</p>
          <p style="margin:0 0 12px;color:#696b66;font-size:12px;letter-spacing:.14em;text-transform:uppercase">${order.reference}</p>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:44px;font-weight:400;line-height:1.05">${copy.subject}</h1>
          <p style="margin:24px 0;color:#4f514d;font-size:16px;line-height:1.7">${copy.body}</p>
          ${tracking}${note}
          <p style="margin:40px 0 0;color:#696b66;font-size:13px">${content.emails.supportSignature} · <a href="mailto:${siteMeta.leadEmail}" style="color:#121311">${siteMeta.leadEmail}</a></p>
        </div>
      </div>
    `,
  };
}

export async function sendOrderLifecycleEmail(
  order: OrderRecord,
  stage: OrderLifecycleStage,
  details: LifecycleDetails = {},
) {
  if (!order.customerEmail) {
    return { status: "skipped" as const };
  }

  const email = buildOrderLifecycleEmail(order, stage, details);

  return sendTransactionalEmail({
    idempotencyKey: `order-${order.id}-${stage}`,
    to: order.customerEmail,
    subject: email.subject,
    html: email.html,
  });
}
