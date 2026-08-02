import { createHash, randomUUID } from "node:crypto";

import {
  generateProjection,
  type GenerateProjectionInput,
  type ProjectionProgressStage,
} from "@/lib/openai-projection";
import type { ProjectionJob, ProjectionJobStatus } from "@/modules/projection/core/types";
import { classifyProjectionError } from "@/modules/projection/jobs/projection-error";

const RETENTION_MS = 24 * 60 * 60 * 1000;
const MAX_LOCAL_JOBS = 40;

type InternalProjectionJob = ProjectionJob & {
  fingerprint: string;
};

type ProjectionJobRegistry = {
  jobs: Map<string, InternalProjectionJob>;
  fingerprints: Map<string, string>;
};

declare global {
  var formeOuverteProjectionJobs: ProjectionJobRegistry | undefined;
}

const registry =
  globalThis.formeOuverteProjectionJobs ??
  (globalThis.formeOuverteProjectionJobs = {
    jobs: new Map<string, InternalProjectionJob>(),
    fingerprints: new Map<string, string>(),
  });

const stageProgress: Record<ProjectionProgressStage, { progress: number; label: string }> = {
  preparing: { progress: 18, label: "Preparing photo and product" },
  generating: { progress: 58, label: "Creating your room view" },
};

function publicJob(job: InternalProjectionJob): ProjectionJob {
  const { fingerprint, ...value } = job;
  void fingerprint;
  return structuredClone(value);
}

function cleanupExpiredJobs() {
  const now = Date.now();

  for (const [id, job] of registry.jobs) {
    if (Date.parse(job.expiresAt) <= now) {
      registry.jobs.delete(id);
      registry.fingerprints.delete(job.fingerprint);
    }
  }

  if (registry.jobs.size <= MAX_LOCAL_JOBS) return;

  const oldest = [...registry.jobs.values()]
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(0, registry.jobs.size - MAX_LOCAL_JOBS);

  for (const job of oldest) {
    registry.jobs.delete(job.id);
    registry.fingerprints.delete(job.fingerprint);
  }
}

async function fingerprintInput(input: GenerateProjectionInput) {
  const roomBytes = Buffer.from(await input.file.arrayBuffer());
  return createHash("sha256")
    .update(roomBytes)
    .update(
      JSON.stringify({
        productId: input.productId,
        finishId: input.finishId,
        placementMode: input.placementMode,
        placementBox: input.placementBox,
        message: input.message,
      }),
    )
    .digest("hex");
}

function updateJob(
  id: string,
  status: ProjectionJobStatus,
  progress: number,
  stageLabel: string,
) {
  const job = registry.jobs.get(id);
  if (!job) return;
  job.status = status;
  job.progress = progress;
  job.stageLabel = stageLabel;
}

async function processJob(id: string, input: GenerateProjectionInput) {
  try {
    const artifact = await generateProjection({
      ...input,
      onProgress(stage) {
        const progress = stageProgress[stage];
        updateJob(id, stage, progress.progress, progress.label);
      },
    });
    const job = registry.jobs.get(id);
    if (!job) return;
    job.artifact = artifact;
    job.transform = {
      ...job.transform,
      box: artifact.placementBox,
      floorAnchor: {
        x: artifact.placementBox.x + artifact.placementBox.width / 2,
        y: artifact.placementBox.y + artifact.placementBox.height,
      },
    };
    updateJob(id, "completed", 100, "Projection ready");
  } catch (error) {
    const job = registry.jobs.get(id);
    if (!job) return;
    const failure = classifyProjectionError(error);
    console.error("Projection job processing failed", {
      jobId: id,
      productId: job.productId,
      finishId: job.finishId,
      stage: job.stageLabel,
      category: failure.category,
      status: failure.status,
      ...failure.diagnostic,
    });
    job.error = {
      code: failure.code,
      message: failure.publicMessage,
    };
    updateJob(id, "failed", 100, "Projection failed");
  }
}

export async function createProjectionJob(input: GenerateProjectionInput) {
  cleanupExpiredJobs();
  const fingerprint = await fingerprintInput(input);
  const existingId = registry.fingerprints.get(fingerprint);
  const existing = existingId ? registry.jobs.get(existingId) : undefined;

  if (
    existing &&
    existing.status !== "failed" &&
    Date.parse(existing.expiresAt) > Date.now()
  ) {
    return publicJob(existing);
  }

  if (existing) {
    registry.jobs.delete(existing.id);
    registry.fingerprints.delete(fingerprint);
  }

  const id = randomUUID();
  const createdAt = new Date();
  const job: InternalProjectionJob = {
    id,
    fingerprint,
    status: "queued",
    progress: 2,
    stageLabel: "Queued",
    productId: input.productId,
    finishId: input.finishId,
    placementMode: input.placementMode,
    transform: {
      box: input.placementBox,
      yawDeg: 0,
      floorAnchor: {
        x: input.placementBox.x + input.placementBox.width / 2,
        y: input.placementBox.y + input.placementBox.height,
      },
    },
    createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + RETENTION_MS).toISOString(),
  };
  registry.jobs.set(id, job);
  registry.fingerprints.set(fingerprint, id);

  setTimeout(() => void processJob(id, input), 0);
  return publicJob(job);
}

export function getProjectionJob(id: string) {
  cleanupExpiredJobs();
  const job = registry.jobs.get(id);
  return job ? publicJob(job) : null;
}

export function deleteProjectionJob(id: string) {
  const job = registry.jobs.get(id);

  if (!job) {
    return false;
  }

  registry.jobs.delete(id);
  registry.fingerprints.delete(job.fingerprint);

  return true;
}
