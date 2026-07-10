import { NextResponse } from "next/server";
import { z } from "zod";

import { generateProjection } from "@/lib/openai-projection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function projectionErrorLabel(message: string, code?: string) {
  if (message.includes("OPENAI_API_KEY")) {
    return "La projection instantanée n’est pas disponible pour le moment. Vous pouvez tout de même nous envoyer votre photo.";
  }

  if (
    code === "billing_hard_limit_reached" ||
    code === "insufficient_quota" ||
    message.includes("Billing hard limit") ||
    message.includes("quota")
  ) {
    return "La clé OpenAI est bien détectée, mais le plafond de facturation du projet a été atteint. Activez la facturation ou utilisez une autre clé API pour relancer la projection.";
  }

  if (code === "invalid_api_key" || message.includes("Incorrect API key")) {
    return "La clé OpenAI configurée n’est pas valide pour cette projection. Vérifiez la clé API active dans l’environnement.";
  }

  return "La projection n’a pas pu être préparée pour le moment.";
}

const payloadSchema = z.object({
  format: z.enum(["vertical", "horizontal", "undecided"]),
  usage: z.enum(["against-wall", "divider", "behind-sofa", "under-window", "other"]),
  ambiance: z.enum(["neutral", "sage-teal", "soft-butter", "plaster-rose"]),
  message: z.string().max(2000).optional().default(""),
  placementBox: z.object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().min(0.05).max(1),
    height: z.number().min(0.05).max(1),
  }),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
    }

    const rawPlacementBox = formData.get("placementBox");

    if (typeof rawPlacementBox !== "string") {
      return NextResponse.json(
        { error: "La zone cible est obligatoire pour lancer la projection." },
        { status: 400 },
      );
    }

    const parsed = payloadSchema.safeParse({
      format: formData.get("format"),
      usage: formData.get("usage"),
      ambiance: formData.get("ambiance"),
      message: formData.get("message"),
      placementBox: JSON.parse(rawPlacementBox),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Les paramètres de projection sont incomplets ou invalides." },
        { status: 400 },
      );
    }

    const result = await generateProjection({
      file: image,
      ...parsed.data,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const debug = error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error";
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined;

    console.error("Projection API error", error);

    return NextResponse.json(
      {
        error: projectionErrorLabel(message, code),
        ...(process.env.NODE_ENV !== "production" ? { debug } : {}),
      },
      { status: 500 },
    );
  }
}
