import { NextResponse } from "next/server";
import { z } from "zod";

import { buildCheckoutSessionParams } from "@/lib/checkout-session";
import { marketCodes } from "@/lib/markets";
import { finishIds, productIds } from "@/lib/rava-content";
import { getStripeClient } from "@/lib/stripe";

const schema = z.object({
  items: z.array(z.object({ productId: z.enum(productIds), finishId: z.enum(finishIds), quantity: z.number().int().min(1).max(12) })).min(1).max(12),
  locale: z.enum(["en", "fr"]).default("en"),
  marketCode: z.enum(marketCodes),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create(
      buildCheckoutSessionParams(request, payload, "hosted"),
    );
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout could not be prepared.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
