import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createServiceRequest } from "@/lib/service-requests/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "JSON content is required." },
        { status: 415 },
      );
    }

    const body = await request.json();
    const record = await createServiceRequest(body);

    return NextResponse.json(
      {
        requestId: record.id,
        reference: record.reference,
        notificationStatus: record.notificationStatus,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "The request is incomplete or invalid." },
        { status: 400 },
      );
    }

    const code =
      error instanceof Error ? error.message : "SERVICE_REQUEST_FAILED";
    const unavailable = code.includes("DURABLE_SERVICE_REQUEST_STORE");

    return NextResponse.json(
      {
        error: unavailable
          ? "The request service is not configured."
          : "The request could not be recorded.",
      },
      { status: unavailable ? 503 : 500 },
    );
  }
}
