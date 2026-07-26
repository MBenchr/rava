import { NextResponse } from "next/server";

import { generateProjection } from "@/lib/openai-projection";
import {
  parseProjectionForm,
  ProjectionRequestError,
} from "@/modules/projection/jobs/parse-projection-form";

export const runtime = "nodejs";

function projectionErrorLabel(message: string, code?: string) {
  if (
    message.includes("OPENAI_API_KEY") ||
    code === "billing_hard_limit_reached" ||
    code === "insufficient_quota" ||
    code === "invalid_api_key"
  ) {
    return "Room projection is temporarily unavailable. Your product selection remains in the bag.";
  }

  return "The projection could not be prepared right now.";
}

// Compatibility endpoint. New clients use /api/projection/jobs.
export async function POST(request: Request) {
  try {
    const input = await parseProjectionForm(request);
    return NextResponse.json(await generateProjection(input));
  } catch (error) {
    if (error instanceof ProjectionRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "";
    const code =
      typeof error === "object" && error && "code" in error && typeof error.code === "string"
        ? error.code
        : undefined;

    console.error("Projection API error", {
      name: error instanceof Error ? error.name : "UnknownError",
      code,
      message,
    });
    return NextResponse.json(
      {
        error: projectionErrorLabel(message, code),
        ...(process.env.NODE_ENV !== "production" ? { debug: `${code ?? "unknown"}: ${message}` } : {}),
      },
      { status: 500 },
    );
  }
}
