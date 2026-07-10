import { readFile } from "node:fs/promises";
import { join } from "node:path";

import OpenAI from "openai";
import sharp from "sharp";

import {
  type AmbianceId,
  type FormatId,
  getVariantByFormat,
  type PlacementBox,
  type UsageId,
} from "@/lib/rava-content";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_EDGE = 1600;

type GenerateProjectionInput = {
  file: File;
  format: FormatId;
  usage: UsageId;
  ambiance: AmbianceId;
  message: string;
  placementBox: PlacementBox;
};

type ProjectionResult = {
  projectionImage: string;
  promptDigest: string;
  requestId: string;
  warning?: string;
  resolvedFormat: Exclude<FormatId, "undecided">;
};

type NormalizedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  mime: string;
  warning?: string;
};

function validateInputImage(file: File) {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Formats acceptés : png, jpg, webp.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("L’image est trop lourde. Limite actuelle : 12 Mo.");
  }
}

function clampBox(box: PlacementBox): PlacementBox {
  return {
    x: Math.min(1, Math.max(0, box.x)),
    y: Math.min(1, Math.max(0, box.y)),
    width: Math.min(1, Math.max(0.05, box.width)),
    height: Math.min(1, Math.max(0.05, box.height)),
  };
}

async function normalizeImage(file: File): Promise<NormalizedImage> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Impossible de lire les dimensions de l’image fournie.");
  }

  const resized = image.resize({
    width: metadata.width >= metadata.height ? MAX_EDGE : undefined,
    height: metadata.height > metadata.width ? MAX_EDGE : undefined,
    fit: "inside",
    withoutEnlargement: true,
  });
  const output = await resized.png().toBuffer();
  const outputMetadata = await sharp(output).metadata();

  if (!outputMetadata.width || !outputMetadata.height) {
    throw new Error("Impossible de normaliser l’image fournie.");
  }

  const warning =
    outputMetadata.width !== metadata.width || outputMetadata.height !== metadata.height
      ? "L’image a été réduite automatiquement pour garder une génération stable."
      : undefined;

  return {
    buffer: output,
    width: outputMetadata.width,
    height: outputMetadata.height,
    mime: "image/png",
    warning,
  };
}

function buildMaskBuffer(width: number, height: number, box: PlacementBox) {
  const mask = Buffer.alloc(width * height * 4, 255);
  const safeBox = clampBox(box);
  const startX = Math.round(safeBox.x * width);
  const startY = Math.round(safeBox.y * height);
  const rectWidth = Math.round(safeBox.width * width);
  const rectHeight = Math.round(safeBox.height * height);
  const endX = Math.min(width, startX + rectWidth);
  const endY = Math.min(height, startY + rectHeight);

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * width + x) * 4;
      mask[index] = 255;
      mask[index + 1] = 255;
      mask[index + 2] = 255;
      mask[index + 3] = 0;
    }
  }

  return sharp(mask, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

function resolveProjectionFormat(format: FormatId, box: PlacementBox) {
  if (format !== "undecided") {
    return { format, warning: undefined };
  }

  const inferredFormat: Exclude<FormatId, "undecided"> =
    box.width > box.height ? "horizontal" : "vertical";

  return {
    format: inferredFormat,
    warning:
      "Le format n’était pas défini. La simulation a été préparée automatiquement en version " +
      (inferredFormat === "horizontal" ? "horizontale" : "verticale") +
      ".",
  };
}

function usagePrompt(usage: UsageId) {
  switch (usage) {
    case "against-wall":
      return "Le meuble est prévu contre un mur. Le mur doit rester visible à travers les niches.";
    case "divider":
      return "Le meuble agit comme séparation douce au centre de la pièce. L’espace derrière doit rester visible à travers les niches.";
    case "behind-sofa":
      return "Le meuble doit se lire comme un fond de canapé ou une séparation basse cohérente.";
    case "under-window":
      return "Le meuble doit rester bas, aligné sous une ouverture ou une fenêtre si la photo le permet.";
    case "other":
    default:
      return "Le placement doit rester plausible, sans changer la pièce du client.";
  }
}

function ambiancePrompt(ambiance: AmbianceId) {
  switch (ambiance) {
    case "sage-teal":
      return "Garder une ambiance légèrement plus fraîche et vert grisé, sans recolorer la pièce du client.";
    case "soft-butter":
      return "Garder une ambiance lumineuse et douce, avec une sensation beurre pâle très discrète.";
    case "plaster-rose":
      return "Garder une ambiance chaude et délicate, légèrement rose plâtre, sans effet décoratif forcé.";
    case "neutral":
    default:
      return "Rester très neutre, calme et premium.";
  }
}

function buildProjectionPrompt(
  format: Exclude<FormatId, "undecided">,
  usage: UsageId,
  ambiance: AmbianceId,
  message: string,
) {
  const variant = getVariantByFormat(format);
  const productDescription =
    format === "vertical"
      ? "Version verticale : 102 cm largeur × 184 cm hauteur × 42 cm profondeur, meuble monobloc plus haut que large, 4 niches verticales arrondies à gauche, 1 grande niche en arche dominante en haut à droite, 2 niches horizontales arrondies sous l’arche, 1 grande niche horizontale basse à droite, sans fond, base pleine continue légèrement rentrée."
      : "Version horizontale : 184 cm largeur × 120 cm hauteur × 42 cm profondeur, meuble monobloc bas et large, 3 niches verticales arrondies à gauche, 1 grande niche en arche au centre, 2 niches horizontales arrondies à droite, 2 grandes niches basses horizontales, sans fond, base pleine continue légèrement rentrée.";

  const clientNote = message.trim()
    ? `Tenir compte de cette note client si elle reste compatible avec la photo : ${message.trim()}`
    : "Aucune note client supplémentaire.";

  return [
    "À partir de la photo fournie, intégrer de manière ultra réaliste le meuble RAVA Éditions — Cabinet Mura dans l’espace existant.",
    "Respecter strictement la perspective, l’échelle, la lumière, les ombres, les couleurs et les matériaux de la photo d’origine.",
    "Ne pas modifier la pièce du client. Ne pas changer le sol, les murs, les fenêtres ou les meubles existants. Ajouter seulement le meuble.",
    "Considérer la zone transparente du masque comme une implantation indicative : elle donne le centre et l’emprise approximative, mais l’échelle finale doit être affinée à partir de la perspective, du sol, des murs, des ouvertures et du mobilier visible.",
    `${variant.piece} — ${variant.title}.`,
    productDescription,
    usagePrompt(usage),
    ambiancePrompt(ambiance),
    "Le meuble est à finition ivoire chaud mate texturée, effet minéral doux, avec des niches ouvertes sans fond et une base pleine continue légèrement rentrée.",
    "Le rendu doit être propre, crédible, non contractuel, sans effet IA, sans rendu 3D, sans texture plastique, sans proportions fausses.",
    clientNote,
  ].join(" ");
}

async function loadReferenceFiles(format: Exclude<FormatId, "undecided">) {
  const variant = getVariantByFormat(format);

  return Promise.all(
    variant.projectionReferences.map(async (relativePath, index) => {
      const absolutePath = join(process.cwd(), "public", relativePath.replace(/^\//, ""));
      const buffer = await readFile(absolutePath);
      return new File([new Uint8Array(buffer)], `reference-${index + 1}.png`, {
        type: "image/png",
      });
    }),
  );
}

export async function generateProjection(
  input: GenerateProjectionInput,
): Promise<ProjectionResult> {
  validateInputImage(input.file);

  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY manquant. Configure la clé pour activer la projection instantanée.",
    );
  }

  const requestId = crypto.randomUUID();
  const normalized = await normalizeImage(input.file);
  const resolution = resolveProjectionFormat(input.format, input.placementBox);
  const prompt = buildProjectionPrompt(
    resolution.format,
    input.usage,
    input.ambiance,
    input.message,
  );
  const maskBuffer = await buildMaskBuffer(
    normalized.width,
    normalized.height,
    input.placementBox,
  );
  const sourceImage = new File([new Uint8Array(normalized.buffer)], "room.png", {
    type: normalized.mime,
  });
  const maskImage = new File([new Uint8Array(maskBuffer)], "mask.png", {
    type: "image/png",
  });
  const references = await loadReferenceFiles(resolution.format);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const size = resolution.format === "horizontal" ? "1536x1024" : "1024x1536";
  const response = await client.images.edit({
    model: "gpt-image-1.5",
    image: [sourceImage, ...references],
    mask: maskImage,
    prompt,
    size,
    quality: "medium",
    input_fidelity: "high",
    output_format: "webp",
    background: "opaque",
  });

  const edited = response.data?.[0];
  const imageData = edited?.b64_json;

  if (!imageData) {
    throw new Error("La réponse IA ne contenait pas d’image exploitable.");
  }

  const warnings = [normalized.warning, resolution.warning].filter(Boolean);

  return {
    projectionImage: `data:image/webp;base64,${imageData}`,
    promptDigest: `${resolution.format} | ${input.usage} | ${input.ambiance}`,
    requestId,
    warning: warnings.length > 0 ? warnings.join(" ") : undefined,
    resolvedFormat: resolution.format,
  };
}
