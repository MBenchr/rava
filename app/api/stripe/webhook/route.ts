import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { brandIdentity, siteMeta } from "@/lib/rava-content";
import { getServerEnv } from "@/lib/server-env";
import { getStripeClient } from "@/lib/stripe";

async function sendEmail(eventId: string, suffix: string, payload: Record<string, unknown>) {
  const apiKey = getServerEnv("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY is missing.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `${eventId}-${suffix}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend failed with status ${response.status}.`);
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = getServerEnv("STRIPE_WEBHOOK_SECRET");
  if (!signature || !secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });

  try {
    const stripe = getStripeClient();
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        const customerEmail = session.customer_details?.email;
        const amount = session.amount_total ? new Intl.NumberFormat(session.locale === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency: session.currency?.toUpperCase() ?? "EUR" }).format(session.amount_total / 100) : "—";
        const from = getServerEnv("RESEND_FROM") ?? `${brandIdentity.name} <onboarding@resend.dev>`;
        const owner = getServerEnv("ORDER_NOTIFICATION_EMAIL") ?? siteMeta.leadEmail;
        const isFrench = session.metadata?.locale === "fr";

        if (customerEmail) {
          await sendEmail(event.id, "customer", {
            from,
            to: [customerEmail],
            subject: isFrench ? "Votre commande VIAIRE" : "Your VIAIRE order",
            html: `<h1>${isFrench ? "Commande confirmée" : "Order confirmed"}</h1><p>${isFrench ? "Merci. Votre paiement a été confirmé." : "Thank you. Your payment has been confirmed."}</p><p><strong>${isFrench ? "Référence" : "Reference"}</strong>: ${session.id}</p><p><strong>${isFrench ? "Total" : "Total"}</strong>: ${amount}</p>`,
          });
        }
        await sendEmail(event.id, "owner", {
          from,
          to: [owner],
          subject: `New VIAIRE order — ${session.id}`,
          html: `<h1>Paid order</h1><p><strong>Stripe session</strong>: ${session.id}</p><p><strong>Email</strong>: ${customerEmail ?? "—"}</p><p><strong>Total</strong>: ${amount}</p>`,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed." }, { status: 400 });
  }
}
