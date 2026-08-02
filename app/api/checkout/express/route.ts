import { NextResponse } from "next/server";

import {
  checkoutIdempotencyKey,
  parseCheckoutPayload,
} from "@/lib/checkout-contract";
import { buildCheckoutSessionParams } from "@/lib/checkout-session";
import { getServerEnv } from "@/lib/server-env";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const payload = parseCheckoutPayload(await request.json());
    const publishableKey = getServerEnv("STRIPE_PUBLISHABLE_KEY");

    if (!publishableKey) {
      return NextResponse.json(
        { error: "STRIPE_PUBLISHABLE_KEY is not configured." },
        { status: 503 },
      );
    }

    const session = await getStripeClient().checkout.sessions.create(
      buildCheckoutSessionParams(request, payload, "elements"),
      {
        idempotencyKey: checkoutIdempotencyKey(payload, "express"),
      },
    );

    if (!session.client_secret) {
      throw new Error("Stripe returned no Checkout client secret.");
    }

    return NextResponse.json({
      clientSecret: session.client_secret,
      publishableKey,
      sessionId: session.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Express checkout is unavailable.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
