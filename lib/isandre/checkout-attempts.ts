import type Stripe from "stripe";

import { getDatabasePool } from "@/lib/database";
import {
  checkoutIdempotencyKey,
  type ValidatedCheckoutPayload,
} from "@/lib/checkout-contract";
import { isandreCommerceContract } from "@/lib/isandre/commerce";

export async function recordCheckoutAttempt(
  payload: ValidatedCheckoutPayload,
  mode: "hosted" | "express",
  session: Stripe.Checkout.Session,
) {
  const pool = getDatabasePool();

  if (!pool) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DURABLE_TAQA_DATABASE_NOT_CONFIGURED");
    }
    return;
  }

  await pool.query(
    `insert into isandre_core.checkout_attempts (
       id, universe_id, order_kind, external_reference, idempotency_key,
       stripe_session_id, status, catalog_version, source_version,
       market_code, locale, price_book_version, updated_at
     ) values ($1, 'taqa', 'catalog', $2, $3, $4, 'stripe_session_created',
       $5, $6, $7, $8, $9, now())
     on conflict (id) do update set
       stripe_session_id = excluded.stripe_session_id,
       status = excluded.status,
       updated_at = now()`,
    [
      payload.checkoutAttemptId,
      `taqa-checkout-${payload.checkoutAttemptId}`,
      checkoutIdempotencyKey(payload, mode),
      session.id,
      isandreCommerceContract.catalogVersion,
      isandreCommerceContract.sourceVersion,
      payload.marketCode,
      payload.locale,
      isandreCommerceContract.priceBookVersion,
    ],
  );
}
