import { randomUUID } from "node:crypto";

import type Stripe from "stripe";

import { sendOrderConfirmations } from "@/lib/order-confirmation";
import { isFinishId, isProductId } from "@/lib/isandre/catalog";
import { isMarketCode } from "@/lib/markets";
import {
  createOrderAuditEvent,
  getOrderRepository,
  type OrderRepository,
} from "@/lib/orders/repository";
import type {
  OrderAddress,
  OrderLine,
  OrderRecord,
} from "@/lib/orders/types";

type NotificationSender = typeof sendOrderConfirmations;

function paymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") return session.payment_intent;
  return session.payment_intent?.id ?? null;
}

function shippingAddress(session: Stripe.Checkout.Session): OrderAddress | null {
  const address = session.customer_details?.address;
  if (!address) return null;

  return {
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    postalCode: address.postal_code,
    state: address.state,
    country: address.country,
  };
}

function orderLines(session: Stripe.Checkout.Session): OrderLine[] {
  return (
    session.line_items?.data.map((line) => {
      const stripeProduct =
        line.price?.product && typeof line.price.product === "object"
          ? line.price.product
          : null;
      const metadata =
        stripeProduct && !("deleted" in stripeProduct)
          ? stripeProduct.metadata
          : null;
      const productId = metadata?.productId;
      const finishId = metadata?.finishId;

      return {
        productId:
          typeof productId === "string" && isProductId(productId)
            ? productId
            : null,
        finishId:
          typeof finishId === "string" && isFinishId(finishId)
            ? finishId
            : null,
        name: line.description ?? "ISANDRE",
        quantity: line.quantity ?? 1,
        unitAmountCents: line.price?.unit_amount ?? null,
        totalAmountCents: line.amount_total ?? null,
      };
    }) ?? []
  );
}

export function orderFromStripeSession(
  session: Stripe.Checkout.Session,
  existing?: OrderRecord | null,
): OrderRecord {
  const now = new Date().toISOString();
  const marketValue = session.metadata?.marketCode;

  return {
    id: existing?.id ?? randomUUID(),
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntentId(session),
    reference: session.id.slice(-12).toUpperCase(),
    status: existing?.status ?? "paid",
    locale: session.metadata?.locale === "fr" ? "fr" : "en",
    marketCode: isMarketCode(marketValue) ? marketValue : null,
    currency: session.currency?.toUpperCase() ?? "EUR",
    subtotalCents: session.amount_subtotal ?? 0,
    shippingCents: session.total_details?.amount_shipping ?? 0,
    taxCents: session.total_details?.amount_tax ?? 0,
    totalCents: session.amount_total ?? 0,
    customerEmail: session.customer_details?.email ?? null,
    customerName: session.customer_details?.name ?? null,
    customerPhone: session.customer_details?.phone ?? null,
    shippingAddress: shippingAddress(session),
    lines: orderLines(session),
    notificationStatus: existing?.notificationStatus ?? "pending",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function processPaidCheckoutEvent(
  eventId: string,
  eventType: string,
  session: Stripe.Checkout.Session,
  dependencies: {
    repository?: OrderRepository;
    sendNotifications?: NotificationSender;
  } = {},
) {
  const repository = dependencies.repository ?? getOrderRepository();
  const sendNotifications = dependencies.sendNotifications ?? sendOrderConfirmations;
  const claim = await repository.claimWebhookEvent(
    createOrderAuditEvent({
      stripeEventId: eventId,
      stripeSessionId: session.id,
      kind: eventType,
    }),
  );

  if (claim !== "claimed") {
    return { status: claim, order: await repository.getOrderByStripeSession(session.id) };
  }

  try {
    const existing = await repository.getOrderByStripeSession(session.id);
    let order = orderFromStripeSession(session, existing);
    await repository.upsertOrder(order);

    const notifications = await sendNotifications(eventId, session);
    const sent = notifications.filter((result) => result.status === "sent").length;
    order = {
      ...order,
      notificationStatus:
        sent === notifications.length
          ? "sent"
          : sent > 0
            ? "partially_sent"
            : "pending",
      updatedAt: new Date().toISOString(),
    };
    await repository.upsertOrder(order);
    await repository.completeWebhookEvent(eventId);

    return { status: "processed" as const, order };
  } catch (error) {
    const code = error instanceof Error ? error.message : "ORDER_PROCESSING_FAILED";
    await repository.failWebhookEvent(eventId, code);
    throw error;
  }
}
