import type Stripe from "stripe";

import { getContent } from "@/content";
import { sendTransactionalEmail } from "@/lib/email-transport";
import { brandIdentity, siteMeta, type Locale } from "@/lib/isandre/catalog";
import { getServerEnv } from "@/lib/server-env";

type ConfirmationLine = {
  name: string;
  quantity: number;
};

type ConfirmationContext = {
  customerEmail: string | null;
  locale: Locale;
  marketCode: string;
  orderReference: string;
  total: string;
  lines: ConfirmationLine[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAmount(session: Stripe.Checkout.Session, locale: Locale) {
  if (!session.amount_total || !session.currency) {
    return "—";
  }

  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: session.currency.toUpperCase(),
  }).format(session.amount_total / 100);
}

function buildContext(session: Stripe.Checkout.Session): ConfirmationContext {
  const locale: Locale = session.metadata?.locale === "fr" ? "fr" : "en";

  return {
    customerEmail: session.customer_details?.email ?? null,
    locale,
    marketCode:
      session.metadata?.market_code ?? session.metadata?.marketCode ?? "—",
    orderReference: session.id.slice(-12).toUpperCase(),
    total: formatAmount(session, locale),
    lines:
      session.line_items?.data.map((line) => ({
        name: line.description ?? brandIdentity.name,
        quantity: line.quantity ?? 1,
      })) ?? [],
  };
}

function customerEmailHtml(context: ConfirmationContext) {
  const content = getContent(context.locale);
  const lineItems = context.lines
    .map(
      (line) =>
        `<li style="padding:10px 0;border-bottom:1px solid #ddd9cf">${escapeHtml(line.name)} × ${line.quantity}</li>`,
    )
    .join("");

  return `
    <div style="margin:0;background:#f3f1eb;color:#121311;font-family:Arial,sans-serif">
      <div style="max-width:620px;margin:auto;padding:48px 24px">
        <p style="margin:0 0 40px;font-size:18px;font-weight:700;letter-spacing:.08em">${brandIdentity.name}</p>
        <p style="margin:0 0 12px;color:#696b66;font-size:12px;letter-spacing:.14em;text-transform:uppercase">
          ${content.commerce.checkoutSuccess}
        </p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:48px;font-weight:400;line-height:1">
          ${content.emails.orderConfirmedHeading}
        </h1>
        <p style="margin:24px 0 32px;color:#4f514d;font-size:16px;line-height:1.6">
          ${content.emails.orderConfirmedBody}
        </p>
        <div style="padding:24px;background:#fcfbf7">
          <p style="margin:0 0 8px;color:#696b66;font-size:12px">${content.common.summary}</p>
          <p style="margin:0 0 20px;font-size:18px;font-weight:700">${context.orderReference}</p>
          <ul style="margin:0;padding:0;list-style:none">${lineItems}</ul>
          <p style="margin:20px 0 0;font-size:18px;font-weight:700">${escapeHtml(context.total)}</p>
        </div>
        <div style="margin-top:32px">
          <p style="margin:0 0 12px;font-weight:700">${content.service.productionTitle}</p>
          <p style="margin:0;color:#4f514d;line-height:1.7">
            ${content.service.productionBody} ${content.service.deliveryBody}
          </p>
        </div>
        <p style="margin:40px 0 0;color:#696b66;font-size:13px;line-height:1.6">
          ${content.emails.supportSignature} ·
          <a href="mailto:${siteMeta.leadEmail}" style="color:#121311">${siteMeta.leadEmail}</a>
        </p>
      </div>
    </div>
  `;
}

export async function sendOrderConfirmations(
  eventId: string,
  session: Stripe.Checkout.Session,
) {
  const context = buildContext(session);
  const owner =
    getServerEnv("ORDER_NOTIFICATION_EMAIL") ?? siteMeta.leadEmail;
  const results: Array<{ status: "sent" | "skipped" }> = [];

  if (context.customerEmail) {
    const content = getContent(context.locale);
    results.push(
      await sendTransactionalEmail({
        idempotencyKey: `${eventId}-customer`,
        to: [context.customerEmail],
        subject: `${content.emails.orderConfirmedSubject} · ${context.orderReference}`,
        html: customerEmailHtml(context),
      }),
    );
  }

  results.push(
    await sendTransactionalEmail({
      idempotencyKey: `${eventId}-owner`,
      to: [owner],
      subject: `New ${brandIdentity.name} order · ${context.orderReference}`,
      html: `
        <h1>Paid order</h1>
        <p><strong>Reference</strong>: ${context.orderReference}</p>
        <p><strong>Stripe session</strong>: ${escapeHtml(session.id)}</p>
        <p><strong>Email</strong>: ${escapeHtml(context.customerEmail ?? "—")}</p>
        <p><strong>Market</strong>: ${escapeHtml(context.marketCode)}</p>
        <p><strong>Total</strong>: ${escapeHtml(context.total)}</p>
      `,
    }),
  );

  return results;
}
