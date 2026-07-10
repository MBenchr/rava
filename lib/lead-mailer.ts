import { Resend } from "resend";

import { type EstimateRequestPayload, siteMeta } from "@/lib/rava-content";

type FileAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

type LeadMailerInput = {
  payload: EstimateRequestPayload;
  sourceImage?: FileAttachment;
  projectionImage?: string;
  projectionPromptDigest?: string;
  projectionWarning?: string;
};

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

export async function sendLeadEmail(input: LeadMailerInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY manquant. Configure la clé Resend avant d’activer l’envoi serveur.",
    );
  }

  const resend = new Resend(apiKey);
  const attachments: Array<{
    filename: string;
    content: Buffer;
    content_type: string;
  }> = [];

  if (input.sourceImage) {
    attachments.push({
      filename: input.sourceImage.filename,
      content: input.sourceImage.content,
      content_type: input.sourceImage.contentType,
    });
  }

  if (input.projectionImage) {
    const parsed = parseDataUrl(input.projectionImage);

    if (parsed) {
      attachments.push({
        filename: "projection-rava.webp",
        content: parsed.buffer,
        content_type: parsed.mime,
      });
    }
  }

  const from = process.env.RESEND_FROM ?? "RAVA Éditions <onboarding@resend.dev>";
  const subject = `Nouvelle demande RAVA — ${input.payload.name}`;
  const html = `
    <h1>Nouvelle demande RAVA</h1>
    <p><strong>Nom</strong> : ${input.payload.name}</p>
    <p><strong>Email</strong> : ${input.payload.email}</p>
    <p><strong>Ville / pays</strong> : ${input.payload.location}</p>
    <p><strong>Format</strong> : ${input.payload.format}</p>
    <p><strong>Usage</strong> : ${input.payload.usage}</p>
    <p><strong>Ambiance</strong> : ${input.payload.ambiance}</p>
    <p><strong>Message</strong> : ${input.payload.message || "—"}</p>
    <p><strong>Délai indicatif affiché</strong> : ${siteMeta.fabricationDelay}</p>
    <p><strong>Prompt digest projection</strong> : ${input.projectionPromptDigest || "—"}</p>
    <p><strong>Alerte projection</strong> : ${input.projectionWarning || "—"}</p>
  `;

  const response = await resend.emails.send({
    from,
    to: siteMeta.leadEmail,
    replyTo: input.payload.email,
    subject,
    html,
    text: [
      `Nom : ${input.payload.name}`,
      `Email : ${input.payload.email}`,
      `Ville / pays : ${input.payload.location}`,
      `Format : ${input.payload.format}`,
      `Usage : ${input.payload.usage}`,
      `Ambiance : ${input.payload.ambiance}`,
      `Message : ${input.payload.message || "—"}`,
      `Prompt digest projection : ${input.projectionPromptDigest || "—"}`,
      `Alerte projection : ${input.projectionWarning || "—"}`,
    ].join("\n"),
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return { id: response.data?.id ?? crypto.randomUUID() };
}
