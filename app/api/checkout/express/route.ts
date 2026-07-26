import { NextResponse } from "next/server";
import { z } from "zod";

import { buildCheckoutSessionParams } from "@/lib/checkout-session";
import { marketCodes } from "@/lib/markets";
import { finishIds, productIds } from "@/lib/rava-content";
import { getServerEnv } from "@/lib/server-env";
import { getStripeClient } from "@/lib/stripe";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.enum(productIds),
        finishId: z.enum(finishIds),
        quantity: z.number().int().min(1).max(12),
      }),
    )
    .min(1)
    .max(12),
  locale: z.enum(["en", "fr"]).default("en"),
  marketCode: z.enum(marketCodes),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const publishableKey = getServerEnv("STRIPE_PUBLISHABLE_KEY");

    if (!publishableKey) {
      return NextResponse.json(
        { error: "STRIPE_PUBLISHABLE_KEY is not configured." },
        { status: 503 },
      );
    }

    const session = await getStripeClient().checkout.sessions.create(
      buildCheckoutSessionParams(request, payload, "elements"),
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
