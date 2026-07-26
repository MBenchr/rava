import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "modules/projection/core/reference-kits.data.json");
const data = JSON.parse(await readFile(dataPath, "utf8"));
const publicProductNames = {
  "elan-o1": "SEUIL",
  "portee-o2": "PORTÉE",
  "veille-o4": "VEILLE",
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

function openingSvg(opening) {
  if (opening.kind === "rounded-rect") {
    return `<rect x="${opening.x}" y="${opening.y}" width="${opening.width}" height="${opening.height}" rx="${opening.radius}" fill="black"/>`;
  }

  const x1 = opening.x;
  const x2 = opening.x + opening.width;
  const y1 = opening.y;
  const y2 = opening.y + opening.height;
  const shoulder = opening.shoulderY;
  const leftCrownX = x1 + opening.radius;
  const rightCrownX = x2 - opening.radius;

  return `<path d="M${x1} ${y2}V${shoulder}C${x1} ${y1 + 76} ${leftCrownX - 94} ${y1} ${leftCrownX} ${y1}H${rightCrownX}C${rightCrownX + 94} ${y1} ${x2} ${y1 + 76} ${x2} ${shoulder}V${y2}Z" fill="black"/>`;
}

function productGroup(kit, { fill = "#e5e0d5", suffix = "front" } = {}) {
  const { width, height } = kit.dimensionsMm;
  return `<g>
    <defs>
      <filter id="shadow-${suffix}" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#141512" flood-opacity="0.18"/>
      </filter>
      <mask id="shape-${suffix}">
        <rect width="${width}" height="${height}" fill="black"/>
        <rect width="${width}" height="${height}" rx="${kit.outerRadiusMm}" fill="white"/>
        ${kit.openings.map(openingSvg).join("\n")}
      </mask>
      <linearGradient id="face-${suffix}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f7f4ec"/>
        <stop offset="0.48" stop-color="${fill}"/>
        <stop offset="1" stop-color="#cfc8ba"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="${kit.outerRadiusMm}" fill="url(#face-${suffix})" mask="url(#shape-${suffix})" filter="url(#shadow-${suffix})"/>
  </g>`;
}

function viewSvg(kit, view) {
  const { width, height, depth } = kit.dimensionsMm;
  const pad = Math.round(Math.max(width, height) * 0.13);
  const depthX = view === "front" ? 0 : Math.round(depth * 0.5);
  const depthY = view === "front" ? 0 : -Math.round(depth * 0.09);
  const canvasWidth = width + pad * 2 + Math.abs(depthX);
  const canvasHeight = height + pad * 2 + Math.abs(depthY);
  const frontX = pad + (view === "rear" ? Math.abs(depthX) : 0);
  const frontY = pad + Math.abs(depthY);
  const backX = frontX + (view === "right" ? depthX : -depthX);
  const backY = frontY + depthY;
  const sideFill = view === "rear" ? "#b8b0a1" : "#c5bdad";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
    <rect width="100%" height="100%" fill="#f6f4ef"/>
    <g transform="translate(${backX} ${backY})" opacity="0.92">${productGroup(kit, { fill: sideFill, suffix: `${view}-back` })}</g>
    <g transform="translate(${frontX} ${frontY})">${productGroup(kit, { suffix: `${view}-front` })}</g>
  </svg>`;
}

function identityBoardSvg(kit) {
  const { width, height, depth } = kit.dimensionsMm;
  const ratio = width / height;
  const panelWidth = 710;
  const panelHeight = 1120;
  const maxObjectWidth = 540;
  const maxObjectHeight = 820;
  const objectWidth = Math.min(maxObjectWidth, maxObjectHeight * ratio);
  const objectHeight = objectWidth / ratio;
  const scale = objectWidth / width;
  const boardWidth = 2400;
  const boardHeight = 1500;
  const labels = ["FRONT ORTHOGRAPHIC", "FRONT RIGHT 30°", "REAR LEFT 30°"];
  const viewNames = ["front", "right", "rear"];

  const panels = viewNames.map((view, index) => {
    const panelX = 80 + index * 770;
    const objectX = panelX + (panelWidth - objectWidth) / 2;
    const objectY = 245 + (maxObjectHeight - objectHeight) / 2;
    const depthOffset = view === "front" ? 0 : Math.max(16, depth * scale * 0.5);
    const direction = view === "rear" ? -1 : 1;
    const transformed = `translate(${objectX} ${objectY}) scale(${scale})`;
    const backTransform = `translate(${objectX + direction * depthOffset} ${objectY - depthOffset * 0.18}) scale(${scale})`;

    return `<g>
      <rect x="${panelX}" y="175" width="${panelWidth}" height="${panelHeight}" rx="26" fill="#fff" stroke="#d8d5ce"/>
      <text x="${panelX + 34}" y="225" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2" fill="#2d2f2a">${labels[index]}</text>
      ${view === "front" ? "" : `<g transform="${backTransform}" opacity="0.8">${productGroup(kit, { fill: "#bdb5a7", suffix: `board-${view}-back` })}</g>`}
      <g transform="${transformed}">${productGroup(kit, { suffix: `board-${view}-front` })}</g>
    </g>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${boardWidth}" height="${boardHeight}" viewBox="0 0 ${boardWidth} ${boardHeight}">
    <rect width="100%" height="100%" fill="#f3f1eb"/>
    <text x="80" y="78" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="3" fill="#121311">VIAIRE · ${publicProductNames[kit.id] ?? kit.id.toUpperCase()}</text>
    <text x="80" y="125" font-family="Arial, sans-serif" font-size="22" fill="#5f625c">REFERENCE KIT ${kit.version} · IMMUTABLE GEOMETRY</text>
    ${panels}
    <line x1="80" y1="1360" x2="2320" y2="1360" stroke="#bbb8b1"/>
    <text x="80" y="1418" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#121311">${width} W × ${height} H × ${depth} D MM</text>
    <text x="2320" y="1418" text-anchor="end" font-family="Arial, sans-serif" font-size="22" fill="#5f625c">${kit.openings.length} OPENINGS · OPEN-BACK · SCALE 1:${Math.max(1, Math.round(1 / scale))}</text>
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
    generatedFrom: "modules/projection/core/reference-kits.data.json",
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
