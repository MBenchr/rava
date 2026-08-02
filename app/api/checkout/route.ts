import { NextResponse } from "next/server";

import {
  checkoutIdempotencyKey,
  parseCheckoutPayload,
} from "@/lib/checkout-contract";
import { buildCheckoutSessionParams } from "@/lib/checkout-session";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const payload = parseCheckoutPayload(await request.json());
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create(
      buildCheckoutSessionParams(request, payload, "hosted"),
      {
        idempotencyKey: checkoutIdempotencyKey(payload, "hosted"),
      },
    );
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout could not be prepared.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
