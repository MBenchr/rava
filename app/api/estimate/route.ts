import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";

import { sendLeadEmail } from "@/lib/lead-mailer";
import { finishIds, placementModeIds, productIds } from "@/lib/rava-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const estimateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  location: z.string().min(2).max(160),
  productId: z.enum(productIds),
  finishId: z.enum(finishIds),
  placementMode: z.enum(placementModeIds),
  message: z.string().max(3000).optional().default(""),
  projectionImage: z.string().optional(),
  projectionPromptDigest: z.string().optional(),
  projectionWarning: z.string().optional(),
});

function optionalString(entry: FormDataEntryValue | null) {
  return typeof entry === "string" && entry.length > 0 ? entry : undefined;
}

async function normaliseAttachment(file: File) {
  const input = Buffer.from(await file.arrayBuffer());
  const output = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 84 })
    .toBuffer();

  return {
    filename: "photo-espace.jpg",
    content: output,
    contentType: "image/jpeg",
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = estimateSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      location: formData.get("location"),
      productId: formData.get("productId"),
      finishId: formData.get("finishId"),
      placementMode: formData.get("placementMode"),
      message: optionalString(formData.get("message")) ?? "",
      projectionImage: optionalString(formData.get("projectionImage")),
      projectionPromptDigest: optionalString(formData.get("projectionPromptDigest")),
      projectionWarning: optionalString(formData.get("projectionWarning")),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Les champs de commande sont incomplets ou invalides." },
        { status: 400 },
      );
    }

    const sourcePhoto = formData.get("spacePhoto");
    const attachment = sourcePhoto instanceof File ? await normaliseAttachment(sourcePhoto) : undefined;
    const response = await sendLeadEmail({
      payload: parsed.data,
      sourceImage: attachment,
      projectionImage: parsed.data.projectionImage,
      projectionPromptDigest: parsed.data.projectionPromptDigest,
      projectionWarning: parsed.data.projectionWarning,
    });

    return NextResponse.json({
      message: "Your request has been sent to VIAIRE.",
      leadId: response.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    return NextResponse.json(
      {
        error: message.includes("RESEND_API_KEY")
          ? "L’envoi direct n’est pas disponible pour le moment. Réessayez un peu plus tard."
          : "L’envoi de la commande n’a pas pu aboutir pour le moment.",
      },
      { status: 500 },
    );
  }
}
