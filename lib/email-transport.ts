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
  const resendApiKey = getServerEnv("RESEND_API_KEY");
  const sendGridApiKey = getServerEnv("SENDGRID_API_KEY");

  if (!resendApiKey && !sendGridApiKey) {
    return { status: "skipped" as const };
  }

  if (resendApiKey) {
    const from =
      getServerEnv("RESEND_FROM") ??
      `${brandIdentity.name} <onboarding@resend.dev>`;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
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

  const from =
    getServerEnv("SENDGRID_FROM_EMAIL") ?? "studio@isandre.com";
  const recipients = Array.isArray(message.to) ? message.to : [message.to];
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendGridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: recipients.map((email) => ({ email })),
          custom_args: { isandre_idempotency_key: message.idempotencyKey },
        },
      ],
      from: { email: from, name: brandIdentity.name },
      reply_to: message.replyTo ? { email: message.replyTo } : undefined,
      subject: message.subject,
      content: [
        ...(message.text
          ? [{ type: "text/plain", value: message.text }]
          : []),
        { type: "text/html", value: message.html },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`SENDGRID_HTTP_${response.status}`);
  }

  return { status: "sent" as const };
}
