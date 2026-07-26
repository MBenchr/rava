import CartPage from "@/components/cart-page";
import { getStripeClient } from "@/lib/stripe";
import type { Locale } from "@/lib/rava-content";

type Props = {
  searchParams?: Promise<{
    checkout?: string;
    session_id?: string;
    locale?: string;
    market?: string;
  }>;
};

export default async function CommanderPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const locale: Locale = params.locale === "fr" ? "fr" : "en";
  let status: "success" | "cancelled" | null =
    params.checkout === "success" || params.checkout === "cancelled"
      ? params.checkout
      : null;
  let paymentVerified = false;
  let paidCurrency: string | null = null;
  let paidAmountCents: number | null = null;

  if ((status === "success" || params.checkout === "return") && params.session_id) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(params.session_id);
      paymentVerified =
        session.payment_status === "paid" || session.payment_status === "no_payment_required";
      paidCurrency = session.currency?.toUpperCase() ?? null;
      paidAmountCents = session.amount_total;
      status = paymentVerified ? "success" : "cancelled";
    } catch {
      paymentVerified = false;
      status = "cancelled";
    }
  }

  return (
    <CartPage
      locale={locale}
      checkoutStatus={status}
      paymentVerified={paymentVerified}
      checkoutSessionId={params.session_id ?? null}
      paidAmountCents={paidAmountCents}
      paidCurrency={paidCurrency}
    />
  );
}
