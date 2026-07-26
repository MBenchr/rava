import type { PlacementBox } from "@/lib/rava-content";
import type { ProjectionScores } from "@/modules/projection/core/types";

export class ProjectionQualityError extends Error {
  code = "PROJECTION_QUALITY_REJECTED" as const;
  scores: ProjectionScores;

  constructor(scores: ProjectionScores) {
    super("Projection rejected by the geometry quality gate.");
    this.name = "ProjectionQualityError";
    this.scores = scores;
  }
}

export function evaluateProjectionQuality({
  requestedBox,
  renderedBox,
  geometryLocked,
  geometrySimilarity = geometryLocked ? 1 : 0,
  placementConfidence = 1,
  realismScore = 1,
  roomPreservationScore = 1,
  outsideIntegrationChangeRatio = 0,
}: {
  requestedBox: PlacementBox;
  renderedBox: PlacementBox;
  geometryLocked: boolean;
  geometrySimilarity?: number;
  placementConfidence?: number;
  realismScore?: number;
  roomPreservationScore?: number;
  outsideIntegrationChangeRatio?: number;
}): ProjectionScores {
  const requestedCentre = {
    x: requestedBox.x + requestedBox.width / 2,
    y: requestedBox.y + requestedBox.height / 2,
  };
  const renderedCentre = {
    x: renderedBox.x + renderedBox.width / 2,
    y: renderedBox.y + renderedBox.height / 2,
  };
  const placementDelta = Math.hypot(
    requestedCentre.x - renderedCentre.x,
    requestedCentre.y - renderedCentre.y,
  );
  const scaleDelta = Math.max(
    Math.abs(requestedBox.width - renderedBox.width),
    Math.abs(requestedBox.height - renderedBox.height),
  );
  const floorContactDelta = Math.abs(
    requestedBox.y + requestedBox.height - (renderedBox.y + renderedBox.height),
  );
  const reasons: string[] = [];

  if (!geometryLocked) reasons.push("canonical_geometry_missing");
  if (geometrySimilarity < 0.86) reasons.push("geometry_similarity_below_threshold");
  if (placementConfidence < 0.8) reasons.push("placement_confidence_below_threshold");
  if (realismScore < 0.72) reasons.push("photographic_realism_below_threshold");
  if (roomPreservationScore < 0.88) reasons.push("room_preservation_below_threshold");
  if (placementDelta > 0.06) reasons.push("placement_delta_over_6_percent");
  if (scaleDelta > 0.06) reasons.push("scale_delta_over_6_percent");
  if (floorContactDelta > 0.05) reasons.push("floor_contact_delta_over_5_percent");
  if (outsideIntegrationChangeRatio > 0.01) reasons.push("room_change_outside_mask_over_1_percent");

  return {
    geometryLocked,
    geometrySimilarity,
    placementConfidence,
    realismScore,
    roomPreservationScore,
    placementDelta,
    scaleDelta,
    floorContactDelta,
    outsideIntegrationChangeRatio,
    passed: reasons.length === 0,
    reasons,
  };
}
