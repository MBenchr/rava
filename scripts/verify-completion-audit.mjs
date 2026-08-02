import { readFileSync } from "node:fs";

const audit = readFileSync(
  "docs/execution/completion-audit-a0-a18.md",
  "utf8",
);
const blockers = readFileSync("docs/execution/blockers.md", "utf8");

const blockerIds = [...blockers.matchAll(/\| (H-\d{3}) \|/g)].map(
  (match) => match[1],
);
const expectedBlockers = Array.from(
  { length: 21 },
  (_, index) => `H-${String(index + 1).padStart(3, "0")}`,
);

if (blockerIds.join("|") !== expectedBlockers.join("|")) {
  throw new Error("The human blocker registry must contain H-001 through H-021 exactly once.");
}

const rows = [...audit.matchAll(/^\| A(\d{1,2}) \| ([A-Z-]+) \| ([^|]+) \| ([^|]+) \|$/gm)]
  .map((match) => ({
    wave: Number(match[1]),
    status: match[2],
    proof: match[3].trim(),
    gate: match[4].trim(),
  }))
  .sort((left, right) => left.wave - right.wave);

if (
  rows.length !== 19 ||
  rows.some((row, index) => row.wave !== index)
) {
  throw new Error("The completion audit must contain exactly A0 through A18.");
}

for (const row of rows) {
  if (row.status === "GAP") {
    throw new Error(`Automatable gap remains in A${row.wave}.`);
  }
  if (row.status !== "PROVED" && row.status !== "HUMAN-GATED") {
    throw new Error(`Unsupported status ${row.status} in A${row.wave}.`);
  }
  if (!row.proof || !row.gate) {
    throw new Error(`Missing proof or gate in A${row.wave}.`);
  }
  if (row.status === "HUMAN-GATED") {
    const references = [...row.gate.matchAll(/H-\d{3}/g)].map(
      (match) => match[0],
    );
    if (references.length === 0) {
      throw new Error(`A${row.wave} is human-gated without a blocker reference.`);
    }
    for (const reference of references) {
      if (!blockerIds.includes(reference)) {
        throw new Error(`A${row.wave} references unknown blocker ${reference}.`);
      }
    }
  }
}

if (!audit.includes("publication interdite")) {
  throw new Error("The completion audit must keep publication explicitly gated.");
}

console.log(
  `Completion audit verified: ${rows.length} waves, zero automatable gaps, ${blockerIds.length} human blockers.`,
);
