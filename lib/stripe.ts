import Stripe from "stripe";
import { getServerEnv } from "@/lib/server-env";

let client: Stripe | null = null;

export function getStripeClient() {
  if (client) return client;
  const secretKey = getServerEnv("STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is missing.");
  client = new Stripe(secretKey);
  return client;
}
