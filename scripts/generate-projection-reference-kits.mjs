import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "lib/isandre/geometry.data.json");
const data = JSON.parse(await readFile(dataPath, "utf8"));
const publicProductNames = {
  "seuil-01": "SEUIL 01",
  "portee-02": "PORTÉE 02",
  "veille-03": "VEILLE 03",
};

class NodeFileReader {
  result = null;
  onload = null;
  onloadend = null;
  onerror = null;

  async readAsArrayBuffer(blob) {
    try {
      this.result = await blob.arrayBuffer();
      this.onload?.({ target: this });
      this.onloadend?.({ target: this });
    } catch (error) {
      this.onerror?.(error);
    }
  }

  async readAsDataURL(blob) {
    try {
      const bytes = Buffer.from(await blob.arrayBuffer());
      this.result = `data:${blob.type};base64,${bytes.toString("base64")}`;
      this.onload?.({ target: this });
      this.onloadend?.({ target: this });
    } catch (error) {
      this.onerror?.(error);
    }
  }
}

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = NodeFileReader;
}

function roundedRectCommands(target, x, y, width, height, radius) {
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

function buildShape(kit) {
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
      const shoulder = height - opening.shoulderY;
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
  const box = geometry.boundingBox;

  if (!box) throw new Error(`Unable to compute geometry bounds for ${kit.id}`);

  geometry.translate(
    -(box.min.x + box.max.x) / 2,
    -(box.min.y + box.max.y) / 2,
    -(box.min.z + box.max.z) / 2,
  );

  return geometry;
}

const viewAngles = {
  front: 0,
  right: -Math.PI / 6,
  rear: (5 * Math.PI) / 6,
};

function rotateAroundY(point, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return {
    x: point.x * cosine + point.z * sine,
    y: point.y,
    z: -point.x * sine + point.z * cosine,
  };
}

function projectedGeometrySvg(kit, view, viewport) {
  const geometry = buildShape(kit);
  const position = geometry.getAttribute("position");
  const angle = viewAngles[view];
  const triangles = [];
  const points = [];

  for (let index = 0; index < position.count; index += 3) {
    const triangle = [0, 1, 2].map((offset) =>
      rotateAroundY(
        {
          x: position.getX(index + offset),
          y: position.getY(index + offset),
          z: position.getZ(index + offset),
        },
        angle,
      ),
    );
    const edgeA = {
      x: triangle[1].x - triangle[0].x,
      y: triangle[1].y - triangle[0].y,
      z: triangle[1].z - triangle[0].z,
    };
    const edgeB = {
      x: triangle[2].x - triangle[0].x,
      y: triangle[2].y - triangle[0].y,
      z: triangle[2].z - triangle[0].z,
    };
    const normal = {
      x: edgeA.y * edgeB.z - edgeA.z * edgeB.y,
      y: edgeA.z * edgeB.x - edgeA.x * edgeB.z,
      z: edgeA.x * edgeB.y - edgeA.y * edgeB.x,
    };
    const normalLength = Math.hypot(normal.x, normal.y, normal.z) || 1;
    points.push(...triangle);
    const facing = normal.z / normalLength;
    if (facing <= 0.0001) continue;

    const averageZ = triangle.reduce((sum, point) => sum + point.z, 0) / 3;
    const luminance = facing >= 0.72 ? 88 : 76;

    triangles.push({ points: triangle, averageZ, luminance });
  }

  const minX = Math.min(...points.map(({ x }) => x));
  const maxX = Math.max(...points.map(({ x }) => x));
  const minY = Math.min(...points.map(({ y }) => y));
  const maxY = Math.max(...points.map(({ y }) => y));
  const scale = Math.min(
    viewport.width / (maxX - minX),
    viewport.height / (maxY - minY),
  );
  const offsetX = viewport.x + (viewport.width - (maxX - minX) * scale) / 2 - minX * scale;
  const offsetY = viewport.y + (viewport.height - (maxY - minY) * scale) / 2 + maxY * scale;

  const polygons = triangles
    .sort((left, right) => left.averageZ - right.averageZ)
    .map(({ points: triangle, luminance }) => {
      const polygon = triangle
        .map(({ x, y }) => `${(offsetX + x * scale).toFixed(2)},${(offsetY - y * scale).toFixed(2)}`)
        .join(" ");
      const colour = `hsl(42 20% ${luminance.toFixed(1)}%)`;
      return `<polygon points="${polygon}" fill="${colour}" stroke="${colour}" stroke-width="1.2" stroke-linejoin="round"/>`;
    })
    .join("\n");

  geometry.dispose();
  return `<g>${polygons}</g>`;
}

function viewSvg(kit, view) {
  const canvasWidth = 1600;
  const canvasHeight = 1600;
  const pad = 180;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
    <rect width="100%" height="100%" fill="#f6f4ef"/>
    ${projectedGeometrySvg(kit, view, {
      x: pad,
      y: pad,
      width: canvasWidth - pad * 2,
      height: canvasHeight - pad * 2,
    })}
  </svg>`;
}

function identityBoardSvg(kit) {
  const { width, height, depth } = kit.dimensionsMm;
  const panelWidth = 710;
  const panelHeight = 1120;
  const boardWidth = 2400;
  const boardHeight = 1500;
  const labels = ["FRONT ORTHOGRAPHIC", "FRONT RIGHT 30°", "REAR LEFT 30°"];
  const viewNames = ["front", "right", "rear"];

  const panels = viewNames.map((view, index) => {
    const panelX = 80 + index * 770;

    return `<g>
      <rect x="${panelX}" y="175" width="${panelWidth}" height="${panelHeight}" rx="26" fill="#fff" stroke="#d8d5ce"/>
      <text x="${panelX + 34}" y="225" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2" fill="#2d2f2a">${labels[index]}</text>
      ${projectedGeometrySvg(kit, view, {
        x: panelX + 54,
        y: 265,
        width: panelWidth - 108,
        height: 950,
      })}
    </g>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${boardWidth}" height="${boardHeight}" viewBox="0 0 ${boardWidth} ${boardHeight}">
    <rect width="100%" height="100%" fill="#f3f1eb"/>
    <text x="80" y="78" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="3" fill="#121311">ISANDRE · ${publicProductNames[kit.id] ?? kit.id.toUpperCase()}</text>
    <text x="80" y="125" font-family="Arial, sans-serif" font-size="22" fill="#5f625c">REFERENCE KIT ${kit.version} · IMMUTABLE GEOMETRY</text>
    ${panels}
    <line x1="80" y1="1360" x2="2320" y2="1360" stroke="#bbb8b1"/>
    <text x="80" y="1418" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#121311">${width} W × ${height} H × ${depth} D MM</text>
    <text x="2320" y="1418" text-anchor="end" font-family="Arial, sans-serif" font-size="22" fill="#5f625c">${kit.openings.length} OPENINGS · OPEN-BACK · DIMENSIONED MASTER</text>
  </svg>`;
}

async function exportMeshes(kit, outputDir) {
  const geometry = buildShape(kit);
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  if (!bounds) throw new Error(`Missing mesh bounds for ${kit.id}`);
  const meshBoundsMm = {
    width: bounds.max.x - bounds.min.x,
    height: bounds.max.y - bounds.min.y,
    depth: bounds.max.z - bounds.min.z,
  };
  for (const dimension of ["width", "height", "depth"]) {
    if (Math.abs(meshBoundsMm[dimension] - kit.dimensionsMm[dimension]) > 1) {
      throw new Error(`${kit.id} ${dimension} is outside the ±1 mm tolerance.`);
    }
  }
  const material = new THREE.MeshStandardMaterial({
    color: 0xe5e0d5,
    roughness: 0.86,
    metalness: 0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = kit.id;
  mesh.userData = {
    kitVersion: kit.version,
    dimensionsMm: kit.dimensionsMm,
    openings: kit.openings.map(({ id }) => id),
  };
  const scene = new THREE.Scene();
  scene.add(mesh);

  const gltf = await new GLTFExporter().parseAsync(scene, {
    binary: true,
    onlyVisible: true,
  });
  await writeFile(join(outputDir, "product.glb"), Buffer.from(gltf));

  const usdz = await new USDZExporter().parseAsync(scene, {
    quickLookCompatible: true,
  });
  await writeFile(join(outputDir, "product.usdz"), Buffer.from(usdz));
  return meshBoundsMm;
}

for (const kit of Object.values(data.kits)) {
  if (kit.status !== "approved") continue;

  const outputDir = join(root, "public", "projection-kits", kit.id, kit.version);
  await mkdir(outputDir, { recursive: true });

  const renders = {
    "front-orthographic.png": viewSvg(kit, "front"),
    "front-right-30.png": viewSvg(kit, "right"),
    "rear-left-30.png": viewSvg(kit, "rear"),
    "identity-board.png": identityBoardSvg(kit),
  };

  for (const [filename, svg] of Object.entries(renders)) {
    await sharp(Buffer.from(svg), { density: 144 }).png().toFile(join(outputDir, filename));
  }

  const meshBoundsMm = await exportMeshes(kit, outputDir);

  const geometryChecksum = createHash("sha256")
    .update(JSON.stringify({
      dimensionsMm: kit.dimensionsMm,
      outerRadiusMm: kit.outerRadiusMm,
      wallThicknessMm: kit.wallThicknessMm,
      plinth: kit.plinth,
      openings: kit.openings,
    }))
    .digest("hex");
  const manifest = {
    ...kit,
    schemaVersion: data.schemaVersion,
    geometryChecksum,
    meshBoundsMm,
    generatedAt: new Date().toISOString(),
    generatedFrom: "lib/isandre/geometry.data.json",
    assets: {
      frontOrthographic: "front-orthographic.png",
      frontRight30: "front-right-30.png",
      rearLeft30: "rear-left-30.png",
      identityBoard: "identity-board.png",
      glb: "product.glb",
      usdz: "product.usdz",
    },
  };
  await writeFile(join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`${kit.id}: ${kit.version} ${geometryChecksum.slice(0, 12)}`);
}
