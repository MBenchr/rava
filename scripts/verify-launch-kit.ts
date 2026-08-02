import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const required = [
  "docs/launch/README.md",
  "docs/launch/press-release-en.md",
  "docs/launch/press-release-fr.md",
  "docs/launch/press-kit-index.md",
  "docs/launch/trade-pack.md",
  "docs/launch/campaign-toolkit.md",
  "docs/launch/launch-calendar.md",
  "docs/launch/media-rights-register.csv",
  "docs/launch/contact-register.csv",
  "docs/launch/campaign-test-register.csv",
];

const requiredPdfs = [
  "output/pdf/isandre-press-kit-working.pdf",
  "output/pdf/isandre-trade-deck-working.pdf",
  "output/pdf/isandre-lookbook-working.pdf",
  "output/pdf/isandre-catalogue-working.pdf",
];

for (const path of required) {
  assert.equal(existsSync(path), true, `Missing launch artifact: ${path}`);
}

for (const path of requiredPdfs) {
  assert.equal(existsSync(path), true, `Missing launch PDF: ${path}`);
  assert.ok(statSync(path).size >= 50_000, `Launch PDF is unexpectedly small: ${path}`);
}

const corpus = required
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");
assert.doesNotMatch(corpus, /\b(?:RAVA|MURA|VIAIRE|FORME OUVERTE)\b/u);
assert.doesNotMatch(
  corpus,
  /\b(?:best[- ]seller|sold out|viral sensation|already a success in France)\b/iu,
);
assert.match(
  corpus,
  /digital campaign images or\s+physical documentary photography/,
);
assert.match(corpus, /CATALOG_RELEASED|H-001/);
assert.match(corpus, /Shot list du film manifeste/);
assert.match(corpus, /Brief créateurs et collaborations/);
assert.match(corpus, /Index B-roll/);
assert.match(corpus, /Demande d’échantillon/);
assert.match(corpus, /INTERNAL PRE-RELEASE/);

const enReleaseWords = readFileSync(
  "docs/launch/press-release-en.md",
  "utf8",
).split(/\s+/u).length;
const frReleaseWords = readFileSync(
  "docs/launch/press-release-fr.md",
  "utf8",
).split(/\s+/u).length;
assert.ok(enReleaseWords >= 500, "English release must contain at least 500 words.");
assert.ok(frReleaseWords >= 500, "French release must contain at least 500 words.");

console.log(
  `Verified ${required.length} launch artifacts, ${requiredPdfs.length} working PDFs and bilingual release depth (${enReleaseWords}/${frReleaseWords} words).`,
);
