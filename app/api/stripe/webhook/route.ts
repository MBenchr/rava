import { createHash } from "node:crypto";

import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { isTaqaCheckoutMetadata } from "@/lib/isandre/commerce";
import { processPaidCheckoutEvent } from "@/lib/orders/service";
import { getServerEnv } from "@/lib/server-env";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = getServerEnv("STRIPE_WEBHOOK_SECRET");
  if (!signature || !secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });

  try {
    const stripe = getStripeClient();
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const eventSession = event.data.object as Stripe.Checkout.Session;

      if (!isTaqaCheckoutMetadata(eventSession.metadata)) {
        return NextResponse.json({ received: true, ignored: "foreign_universe" });
      }

      if (
        eventSession.payment_status === "paid" ||
        eventSession.payment_status === "no_payment_required"
      ) {
        const session = await stripe.checkout.sessions.retrieve(eventSession.id, {
          expand: ["line_items.data.price.product"],
        });
        await processPaidCheckoutEvent(event.id, event.type, session, {
          payloadSha256: createHash("sha256").update(rawBody).digest("hex"),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed." }, { status: 400 });
  }
}
