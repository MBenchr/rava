import { NextResponse } from "next/server";

import {
  deleteProjectionJob,
  getProjectionJob,
} from "@/modules/projection/jobs/projection-job-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  const job = getProjectionJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Projection job not found or expired." }, { status: 404 });
  }

  return NextResponse.json({ job }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  deleteProjectionJob(jobId);

  return new Response(null, { status: 204 });
}
