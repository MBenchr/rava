import { brandIdentity } from "@/lib/isandre/catalog";
import { getServerEnv } from "@/lib/server-env";

export type TransactionalEmail = {
  idempotencyKey: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendTransactionalEmail(message: TransactionalEmail) {
  const apiKey = getServerEnv("RESEND_API_KEY");

  if (!apiKey) {
    return { status: "skipped" as const };
  }

  const from =
    getServerEnv("RESEND_FROM") ??
    `${brandIdentity.name} <onboarding@resend.dev>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
    }),
  });

  if (!response.ok) {
    throw new Error(`RESEND_HTTP_${response.status}`);
  }

  return { status: "sent" as const };
}
