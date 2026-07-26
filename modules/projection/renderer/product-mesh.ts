import * as THREE from "three";

import type { ApprovedProductReferenceKit } from "@/modules/projection/core/reference-kits";

function roundedRectCommands(
  target: THREE.Shape | THREE.Path,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  target.moveTo(x + r, y);
  target.lineTo(x + width - r, y);
  target.quadraticCurveTo(x + width, y, x + width, y + r);
  target.lineTo(x + width, y + height - r);
  target.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  target.lineTo(x + r, y + height);
  target.quadraticCurveTo(x, y + height, x, y + height - r);
  target.lineTo(x, y + r);
  target.quadraticCurveTo(x, y, x + r, y);
}

export function createProductGeometry(kit: ApprovedProductReferenceKit) {
  const { width, height, depth } = kit.dimensionsMm;
  const shape = new THREE.Shape();
  roundedRectCommands(shape, 0, 0, width, height, kit.outerRadiusMm);

  for (const opening of kit.openings) {
    const hole = new THREE.Path();
    const y = height - opening.y - opening.height;

    if (opening.kind === "rounded-rect") {
      roundedRectCommands(
        hole,
        opening.x,
        y,
        opening.width,
        opening.height,
        opening.radius,
      );
    } else {
      const x1 = opening.x;
      const x2 = opening.x + opening.width;
      const bottom = y;
      const top = y + opening.height;
      const shoulder = height - (opening.shoulderY ?? opening.y + opening.radius);
      const leftCrownX = x1 + opening.radius;
      const rightCrownX = x2 - opening.radius;

      hole.moveTo(x1, bottom);
      hole.lineTo(x2, bottom);
      hole.lineTo(x2, shoulder);
      hole.bezierCurveTo(x2, top - 94, rightCrownX + 94, top, rightCrownX, top);
      hole.lineTo(leftCrownX, top);
      hole.bezierCurveTo(leftCrownX - 94, top, x1, top - 94, x1, shoulder);
      hole.lineTo(x1, bottom);
    }

    shape.holes.push(hole);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 32,
    steps: 1,
  });
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  const bounds = geometry.boundingBox;
  if (!bounds) throw new Error(`Unable to calculate ${kit.id} geometry bounds.`);

  geometry.translate(
    -(bounds.min.x + bounds.max.x) / 2,
    -(bounds.min.y + bounds.max.y) / 2,
    -(bounds.min.z + bounds.max.z) / 2,
  );

  return geometry;
}

export function readGeometryDimensionsMm(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;

  if (!bounds) throw new Error("Product geometry has no bounding box.");

  return {
    width: bounds.max.x - bounds.min.x,
    height: bounds.max.y - bounds.min.y,
    depth: bounds.max.z - bounds.min.z,
  };
}
