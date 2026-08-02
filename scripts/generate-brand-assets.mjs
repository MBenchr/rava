import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "brand");
const publicRoot = path.join(root, "public", "brand");

const palette = {
  ink: "#1B1917",
  limewash: "#F4EFE6",
  paper: "#FCFBF7",
  stone: "#C9C0B2",
  umber: "#6D5B4B",
  cobalt: "#274C77",
  bronze: "#5C493B",
};

const wordmarkPath = [
  "M32 32H92V44H73V136H92V148H32V136H51V44H32Z",
  "M226 49C210 39 194 35 176 35C149 35 131 48 131 68C131 87 146 98 175 105L188 108C210 113 220 121 220 133C220 146 207 153 186 153C165 153 146 145 130 133L125 146C142 159 162 166 186 166C220 166 240 152 240 131C240 109 224 99 191 91L177 88C158 83 150 77 150 66C150 54 161 47 179 47C195 47 209 52 222 61Z",
  "M270 148L316 32H338L385 148H365L353 116H299L287 148ZM306 99H347L327 49Z",
  "M414 148V32H432L500 117V32H518V148H501L432 61V148Z",
  "M552 32H594C635 32 659 54 659 90C659 126 635 148 594 148H552ZM571 48V132H593C623 132 640 117 640 90C640 63 623 48 593 48Z",
  "M695 148V32H741C773 32 792 48 792 73C792 91 783 104 766 111L803 148H779L745 115H714V148ZM714 48V100H739C761 100 773 91 773 74C773 57 761 48 740 48Z",
  "M835 32H923V48H854V81H914V97H854V132H927V148H835Z",
].join("");

const entaillePath = "M0 0H100V79.1H66V113.1H100V155H0Z";

function svg({ width, height, viewBox, body, title, description, physical = false }) {
  const widthAttribute = physical ? width : String(width);
  const heightAttribute = physical ? height : String(height);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthAttribute}" height="${heightAttribute}" viewBox="${viewBox}" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">${description}</desc>
  ${body}
</svg>
`;
}

function wordmark(fill) {
  return svg({
    width: 1000,
    height: 180,
    viewBox: "0 0 1000 180",
    title: "ISANDRE wordmark",
    description: "Custom capital wordmark for ISANDRE.",
    body: `<path d="${wordmarkPath}" fill="${fill}" fill-rule="evenodd"/>`,
  });
}

function entaille(fill) {
  return svg({
    width: 100,
    height: 155,
    viewBox: "0 0 100 155",
    title: "L'ENTAILLE",
    description: "ISANDRE secondary sign: a dense block with one precise square removed.",
    body: `<path d="${entaillePath}" fill="${fill}"/>`,
  });
}

function lockup(fill) {
  return svg({
    width: 1000,
    height: 300,
    viewBox: "0 0 1000 300",
    title: "ISANDRE and ṬĀQA lockup",
    description: "ISANDRE wordmark with the ṬĀQA collection signature.",
    body: `<path d="${wordmarkPath}" fill="${fill}" fill-rule="evenodd"/>
  <text x="36" y="250" fill="${fill}" font-family="Arial, sans-serif" font-size="42" font-weight="600" letter-spacing="22">ṬĀQA</text>`,
  });
}

function favicon() {
  return svg({
    width: 64,
    height: 64,
    viewBox: "0 0 64 64",
    title: "ISANDRE",
    description: "L'ENTAILLE favicon.",
    body: `<rect width="64" height="64" fill="${palette.limewash}"/>
  <path d="${entaillePath}" transform="translate(18 10) scale(.28)" fill="${palette.ink}"/>`,
  });
}

const sharedTextStyle = `font-family="Arial, Helvetica, sans-serif"`;

function originPlateProof() {
  return svg({
    width: "42.07mm",
    height: "26mm",
    viewBox: "0 0 4207 2600",
    physical: true,
    title: "ISANDRE origin plate proof",
    description: "Prototype proof at the exact intended 42.07 by 26 millimetre size. Not for production.",
    body: `<rect x="10" y="10" width="4187" height="2580" rx="80" fill="${palette.bronze}"/>
  <path d="${entaillePath}" transform="translate(350 555) scale(6.5)" fill="${palette.limewash}"/>
  <path d="${wordmarkPath}" transform="translate(1390 430) scale(2.35)" fill="${palette.limewash}" fill-rule="evenodd"/>
  <g ${sharedTextStyle} fill="${palette.limewash}" letter-spacing="34">
    <text x="1390" y="1450" font-size="180">ṬĀQA · SEUIL 01</text>
    <text x="1390" y="1830" font-size="150">DESIGN · MOHYI BENCHRIH</text>
    <text x="1390" y="2200" font-size="150">NO 000127</text>
  </g>`,
  });
}

function originPlateEngraving() {
  return svg({
    width: "42.07mm",
    height: "26mm",
    viewBox: "0 0 4207 2600",
    physical: true,
    title: "ISANDRE origin plate engraving prototype",
    description: "Monochrome engraving layout. Text must be outlined and tested by the engraver before production.",
    body: `<rect x="10" y="10" width="4187" height="2580" rx="80" fill="none" stroke="#000" stroke-width="12"/>
  <path d="${entaillePath}" transform="translate(350 555) scale(6.5)" fill="#000"/>
  <path d="${wordmarkPath}" transform="translate(1390 430) scale(2.35)" fill="#000" fill-rule="evenodd"/>
  <g ${sharedTextStyle} fill="#000" letter-spacing="34">
    <text x="1390" y="1450" font-size="180">ṬĀQA · SEUIL 01</text>
    <text x="1390" y="1830" font-size="150">DESIGN · MOHYI BENCHRIH</text>
    <text x="1390" y="2200" font-size="150">NO 000127</text>
  </g>`,
  });
}

function originPlateSheet() {
  return svg({
    width: "210mm",
    height: "297mm",
    viewBox: "0 0 210 297",
    physical: true,
    title: "ISANDRE origin plate 1:1 print sheet",
    description: "A4 proof sheet with an exact 42.07 by 26 millimetre plate.",
    body: `<rect width="210" height="297" fill="${palette.paper}"/>
  <text x="20" y="22" ${sharedTextStyle} fill="${palette.ink}" font-size="4" letter-spacing="1">ISANDRE · LA MARQUE D'ORIGINE</text>
  <text x="20" y="31" ${sharedTextStyle} fill="${palette.umber}" font-size="2.6">Print at 100%. Disable page scaling. Measure the control bar before evaluating.</text>
  <g transform="translate(20 52)">
    <rect width="42.07" height="26" rx=".8" fill="${palette.bronze}"/>
    <path d="${entaillePath}" transform="translate(3.5 5.55) scale(.065)" fill="${palette.limewash}"/>
    <text x="13.9" y="10.2" ${sharedTextStyle} fill="${palette.limewash}" font-size="3.7" letter-spacing=".35">ISANDRE</text>
    <text x="13.9" y="15" ${sharedTextStyle} fill="${palette.limewash}" font-size="1.75" letter-spacing=".22">ṬĀQA · SEUIL 01</text>
    <text x="13.9" y="19" ${sharedTextStyle} fill="${palette.limewash}" font-size="1.42" letter-spacing=".12">DESIGN · MOHYI BENCHRIH</text>
    <text x="13.9" y="22.8" ${sharedTextStyle} fill="${palette.limewash}" font-size="1.42" letter-spacing=".2">NO 000127</text>
  </g>
  <g fill="none" stroke="${palette.cobalt}" stroke-width=".25">
    <path d="M20 84V88M62.07 84V88M20 86H62.07"/>
    <path d="M68 52H72M68 78H72M70 52V78"/>
    <path d="M20 115H70"/>
  </g>
  <g ${sharedTextStyle} fill="${palette.cobalt}" font-size="2.5">
    <text x="35" y="91">42.07 MM</text>
    <text x="73.5" y="66" transform="rotate(90 73.5 66)">26.00 MM</text>
    <text x="20" y="121">CONTROL BAR · 50.00 MM</text>
  </g>
  <text x="20" y="145" ${sharedTextStyle} fill="${palette.ink}" font-size="3.2">PROTOTYPE GATES</text>
  <g ${sharedTextStyle} fill="${palette.umber}" font-size="2.7">
    <text x="20" y="154">□ ISANDRE legible at 50 cm</text>
    <text x="20" y="161">□ Mechanical engraving at 0.15 / 0.25 / 0.35 mm</text>
    <text x="20" y="168">□ Flush fit 0 / +0.15 mm</text>
    <text x="20" y="175">□ NFC works on five phones with ferrite layer</text>
    <text x="20" y="182">□ Abrasion, humidity and cleaning products passed</text>
  </g>
  <text x="20" y="276" ${sharedTextStyle} fill="${palette.umber}" font-size="2.3">PROTOTYPE ONLY · NOT FOR PRODUCTION · FRANCE OMITTED UNTIL ORIGIN IS PROVEN</text>`,
  });
}

function authenticityCard(side) {
  const front = side === "front";
  return svg({
    width: "85mm",
    height: "55mm",
    viewBox: "0 0 850 550",
    physical: true,
    title: `ISANDRE authenticity card ${side}`,
    description: `Prototype ${side} of the ISANDRE authenticity card.`,
    body: `<rect width="850" height="550" fill="${front ? palette.ink : palette.limewash}"/>
  ${
    front
      ? `<path d="${entaillePath}" transform="translate(70 86) scale(1.55)" fill="${palette.limewash}"/>
  <path d="${wordmarkPath}" transform="translate(350 125) scale(.44)" fill="${palette.limewash}" fill-rule="evenodd"/>
  <text x="350" y="365" ${sharedTextStyle} fill="${palette.stone}" font-size="22" letter-spacing="7">ORIGINAL · NO 000127</text>`
      : `<text x="65" y="72" ${sharedTextStyle} fill="${palette.umber}" font-size="16" letter-spacing="5">AUTHENTICITY CARD</text>
  <text x="65" y="155" ${sharedTextStyle} fill="${palette.ink}" font-size="30" letter-spacing="4">ṬĀQA · SEUIL 01</text>
  <g ${sharedTextStyle} fill="${palette.ink}" font-size="18">
    <text x="65" y="225">NO 000127</text>
    <text x="65" y="275">FINISH · CHALK</text>
    <text x="65" y="325">DATE · ____ / ____ / ________</text>
    <text x="65" y="375">PRODUCTION SITE · ____________________</text>
  </g>
  <path d="M65 445H785" stroke="${palette.stone}"/>
  <text x="65" y="487" ${sharedTextStyle} fill="${palette.umber}" font-size="15">The persistent product passport is accessed through the concealed NFC plate.</text>`
  }`,
  });
}

function certificate() {
  return svg({
    width: "210mm",
    height: "297mm",
    viewBox: "0 0 210 297",
    physical: true,
    title: "ISANDRE certificate of authenticity",
    description: "A4 certificate prototype.",
    body: `<rect width="210" height="297" fill="${palette.limewash}"/>
  <path d="${entaillePath}" transform="translate(20 21) scale(.12)" fill="${palette.ink}"/>
  <text x="44" y="32" ${sharedTextStyle} fill="${palette.ink}" font-size="5.8" letter-spacing="1.8">ISANDRE</text>
  <path d="M20 48H190" stroke="${palette.stone}" stroke-width=".35"/>
  <text x="20" y="82" font-family="Georgia, serif" fill="${palette.ink}" font-size="15">Certificate of authenticity</text>
  <text x="20" y="101" ${sharedTextStyle} fill="${palette.umber}" font-size="3.2" letter-spacing=".9">ṬĀQA · SEUIL 01 · CHALK</text>
  <text x="20" y="126" ${sharedTextStyle} fill="${palette.ink}" font-size="5">NO 000127</text>
  <g ${sharedTextStyle} fill="${palette.umber}" font-size="3.1">
    <text x="20" y="153">DESIGN · MOHYI BENCHRIH</text>
    <text x="20" y="165">DATE · ____ / ____ / ________</text>
    <text x="20" y="177">BATCH · ______________________________</text>
    <text x="20" y="189">PRODUCTION SITE · ____________________</text>
    <text x="20" y="201">QUALITY CONTROL · ____________________</text>
  </g>
  <path d="M20 225H92M118 225H190" stroke="${palette.stone}" stroke-width=".35"/>
  <text x="20" y="232" ${sharedTextStyle} fill="${palette.umber}" font-size="2.6">ISANDRE quality control</text>
  <text x="118" y="232" ${sharedTextStyle} fill="${palette.umber}" font-size="2.6">Owner</text>
  <text x="20" y="272" ${sharedTextStyle} fill="${palette.umber}" font-size="2.35">Prototype document. Manufacturing origin and production-site data must match the physical piece.</text>`,
  });
}

function packagingLabel() {
  return svg({
    width: "148mm",
    height: "105mm",
    viewBox: "0 0 1480 1050",
    physical: true,
    title: "ISANDRE packaging label",
    description: "A6 shipping and product identity label prototype.",
    body: `<rect width="1480" height="1050" fill="${palette.limewash}"/>
  <path d="${wordmarkPath}" transform="translate(80 65) scale(.56)" fill="${palette.ink}" fill-rule="evenodd"/>
  <rect x="80" y="280" width="1320" height="12" fill="${palette.cobalt}"/>
  <text x="80" y="410" ${sharedTextStyle} fill="${palette.ink}" font-size="68" letter-spacing="10">ṬĀQA · SEUIL 01</text>
  <text x="80" y="510" ${sharedTextStyle} fill="${palette.umber}" font-size="32" letter-spacing="6">CHALK · TQ-S01-CRA</text>
  <g ${sharedTextStyle} fill="${palette.ink}" font-size="28">
    <text x="80" y="660">PACKAGE ____ / ____</text>
    <text x="80" y="730">NO 000127</text>
    <text x="80" y="800">GROSS WEIGHT · __________ KG</text>
  </g>
  <text x="80" y="950" ${sharedTextStyle} fill="${palette.umber}" font-size="24">NO PRODUCT PHOTOGRAPHY ON THE PRIMARY CARTON · KEEP DRY · HANDLE UPRIGHT</text>`,
  });
}

function editorialTemplate(kind) {
  const specs = {
    press: [2100, 2970, "PRESS KIT", "A place made in the material."],
    trade: [2100, 2970, "TRADE DOSSIER", "Open forms for architecture and interiors."],
    social: [1080, 1350, "ṬĀQA", "THE ROOM CONTINUES."],
    presentation: [1920, 1080, "ISANDRE / ṬĀQA", "LET LIFE THROUGH"],
  };
  const [width, height, kicker, headline] = specs[kind];
  const landscape = width > height;
  const margin = Math.round(width * 0.06);
  const imageX = landscape ? Math.round(width * 0.48) : margin;
  const imageY = landscape ? margin : Math.round(height * 0.42);
  const imageW = landscape ? width - imageX - margin : width - margin * 2;
  const imageH = landscape ? height - margin * 2 : height - imageY - margin;
  return svg({
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    title: `ISANDRE ${kind} template`,
    description: `Editorial ${kind} template with a single image opening and disciplined margins.`,
    body: `<rect width="${width}" height="${height}" fill="${palette.limewash}"/>
  <path d="${wordmarkPath}" transform="translate(${margin} ${margin}) scale(${width / 5200})" fill="${palette.ink}" fill-rule="evenodd"/>
  <text x="${margin}" y="${Math.round(height * 0.22)}" ${sharedTextStyle} fill="${palette.umber}" font-size="${Math.round(width * 0.018)}" letter-spacing="${Math.round(width * 0.004)}">${kicker}</text>
  <text x="${margin}" y="${Math.round(height * 0.32)}" font-family="Georgia, serif" fill="${palette.ink}" font-size="${Math.round(width * (landscape ? 0.052 : 0.075))}">${headline}</text>
  <rect x="${imageX}" y="${imageY}" width="${imageW}" height="${imageH}" fill="${palette.stone}"/>
  <text x="${imageX + imageW / 2}" y="${imageY + imageH / 2}" ${sharedTextStyle} fill="${palette.umber}" font-size="${Math.round(width * 0.018)}" text-anchor="middle" letter-spacing="${Math.round(width * 0.003)}">APPROVED IMAGE</text>
  <rect x="${margin}" y="${height - margin - Math.round(height * 0.012)}" width="${Math.round(width * 0.12)}" height="${Math.round(height * 0.012)}" fill="${palette.cobalt}"/>`,
  });
}

const outputs = new Map([
  ["masters/isandre-wordmark-positive.svg", wordmark(palette.ink)],
  ["masters/isandre-wordmark-negative.svg", wordmark(palette.limewash)],
  ["masters/isandre-wordmark-monochrome.svg", wordmark("#000000")],
  ["masters/isandre-entaille-positive.svg", entaille(palette.ink)],
  ["masters/isandre-entaille-negative.svg", entaille(palette.limewash)],
  ["masters/isandre-entaille-monochrome.svg", entaille("#000000")],
  ["masters/isandre-taqa-lockup-positive.svg", lockup(palette.ink)],
  ["masters/isandre-taqa-lockup-negative.svg", lockup(palette.limewash)],
  ["masters/isandre-favicon.svg", favicon()],
  ["plate/isandre-origin-plate-proof.svg", originPlateProof()],
  ["plate/isandre-origin-plate-engraving-prototype.svg", originPlateEngraving()],
  ["plate/isandre-origin-plate-1to1-a4.svg", originPlateSheet()],
  ["templates/authenticity-card-front.svg", authenticityCard("front")],
  ["templates/authenticity-card-back.svg", authenticityCard("back")],
  ["templates/certificate-a4.svg", certificate()],
  ["templates/packaging-label-a6.svg", packagingLabel()],
  ["templates/press-cover-a4.svg", editorialTemplate("press")],
  ["templates/trade-cover-a4.svg", editorialTemplate("trade")],
  ["templates/social-portrait-4x5.svg", editorialTemplate("social")],
  ["templates/presentation-cover-16x9.svg", editorialTemplate("presentation")],
]);

await Promise.all([
  mkdir(path.join(sourceRoot, "masters"), { recursive: true }),
  mkdir(path.join(sourceRoot, "plate"), { recursive: true }),
  mkdir(path.join(sourceRoot, "templates"), { recursive: true }),
  mkdir(publicRoot, { recursive: true }),
]);

const manifest = {
  schemaVersion: 1,
  brand: "ISANDRE",
  collection: "ṬĀQA",
  generatedAt: "2026-07-27",
  wordmark: {
    kind: "custom-vector-capitals",
    viewBox: "0 0 1000 180",
    minimumScreenWidthPx: 90,
    minimumPrintWidthMm: 18,
  },
  entaille: {
    viewBox: "0 0 100 155",
    ratio: "1:1.55",
    notch: { width: 34, height: 34, centerY: 96.1 },
  },
  originPlate: {
    widthMm: 42.07,
    heightMm: 26,
    cornerRadiusMm: 0.8,
    status: "prototype-required",
  },
  files: [],
};

for (const [relativePath, content] of outputs) {
  const target = path.join(sourceRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
  manifest.files.push({
    path: relativePath,
    sha256: createHash("sha256").update(content).digest("hex"),
  });

  if (relativePath.startsWith("masters/")) {
    await writeFile(path.join(publicRoot, path.basename(relativePath)), content);
  } else {
    const publicTarget = path.join(publicRoot, relativePath);
    await mkdir(path.dirname(publicTarget), { recursive: true });
    await writeFile(publicTarget, content);
  }
}

for (const [tone, fill] of [
  ["ink", palette.ink],
  ["paper", palette.limewash],
]) {
  const raster = await sharp(Buffer.from(wordmark(fill)))
    .resize({ width: 1400 })
    .png()
    .toBuffer();
  const rasterRelativePath = `raster/isandre-wordmark-${tone}.png`;
  const rasterSource = path.join(sourceRoot, rasterRelativePath);
  const rasterPublic = path.join(publicRoot, rasterRelativePath);
  await Promise.all([
    mkdir(path.dirname(rasterSource), { recursive: true }),
    mkdir(path.dirname(rasterPublic), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(rasterSource, raster),
    writeFile(rasterPublic, raster),
  ]);
  manifest.files.push({
    path: rasterRelativePath,
    sha256: createHash("sha256").update(raster).digest("hex"),
  });
}

await writeFile(
  path.join(sourceRoot, "brand-assets.manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(path.join(root, "app", "icon.svg"), favicon());
await writeFile(path.join(root, "favicon.svg"), favicon());

console.log(`Generated ${manifest.files.length} ISANDRE brand assets.`);
