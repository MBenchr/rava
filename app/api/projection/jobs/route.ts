import { NextResponse } from "next/server";

import { createProjectionJob } from "@/modules/projection/jobs/projection-job-store";
import {
  parseProjectionForm,
  ProjectionRequestError,
} from "@/modules/projection/jobs/parse-projection-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseProjectionForm(request);
    const job = await createProjectionJob(input);
    return NextResponse.json({ job }, { status: 202 });
  } catch (error) {
    if (error instanceof ProjectionRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Projection job creation failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "The projection could not be started right now." },
      { status: 500 },
    );
  }
}
