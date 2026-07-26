import type {
  FinishId,
  PlacementBox,
  PlacementMode,
  ProductId,
  ProjectionResponsePayload,
} from "@/lib/rava-content";

export type PlacementTransform = {
  box: PlacementBox;
  yawDeg: number;
  floorAnchor: { x: number; y: number };
  calibrationMmPerPixel?: number;
};

export type CalibrationMeasurement = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  referenceLengthMm: number;
  mmPerPixel: number;
};

export type SceneAnalysis = {
  version: "local-v1";
  image: { width: number; height: number };
  horizonY: number | null;
  floorConfidence: number;
  warning?: string;
};

export type ProjectionArtifact = ProjectionResponsePayload & {
  referenceKitVersion: string;
  promptVersion: string;
  rendererVersion: string;
};

export const projectionJobStatuses = [
  "queued",
  "preparing",
  "generating",
  "completed",
  "failed",
] as const;

export type ProjectionJobStatus = (typeof projectionJobStatuses)[number];

export type ProjectionJob = {
  id: string;
  status: ProjectionJobStatus;
  progress: number;
  stageLabel: string;
  productId: ProductId;
  finishId: FinishId;
  placementMode: PlacementMode;
  transform: PlacementTransform;
  createdAt: string;
  expiresAt: string;
  artifact?: ProjectionArtifact;
  error?: { code: string; message: string };
};
