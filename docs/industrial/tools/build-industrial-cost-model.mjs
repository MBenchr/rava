import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const threadId = "019f427a-684e-7a63-acd9-658dde7e6acf";
const outputDir = path.join(root, "outputs", threadId);
const previewDir = path.join(root, "test-results", "a5-industrial-model");
const canonicalPath = path.join(
  root,
  "docs",
  "industrial",
  "isandre-industrial-cost-model.xlsx",
);
const outputPath = path.join(outputDir, "isandre-industrial-cost-model.xlsx");

const C = {
  ink: "#1B1917",
  paper: "#FCFBF7",
  limewash: "#F4EFE6",
  stone: "#C9C0B2",
  umber: "#6D5B4B",
  cobalt: "#274C77",
  input: "#FFF2CC",
  pass: "#DDEAD8",
  warning: "#FCE4C3",
  fail: "#F4CCCC",
  white: "#FFFFFF",
};

const workbook = Workbook.create();
const instructions = workbook.worksheets.add("Instructions");
const summary = workbook.worksheets.add("Summary");
const assumptions = workbook.worksheets.add("Assumptions");
const pricebook = workbook.worksheets.add("Pricebook");
const targets = workbook.worksheets.add("Targets");
const quotes = workbook.worksheets.add("Quotes");
const supplierScore = workbook.worksheets.add("Supplier_Score");
const checks = workbook.worksheets.add("Checks");
const sources = workbook.worksheets.add("Sources");

for (const sheet of [
  instructions,
  summary,
  assumptions,
  pricebook,
  targets,
  quotes,
  supplierScore,
  checks,
  sources,
]) {
  sheet.showGridLines = false;
}

function title(sheet, range, text, subtitle) {
  sheet.getRange(range).merge();
  sheet.getRange(range.split(":")[0]).values = [[text]];
  sheet.getRange(range).format = {
    fill: C.ink,
    font: { bold: true, color: C.paper, size: 18 },
    verticalAlignment: "center",
  };
  const startRow = Number(range.match(/\d+/)?.[0] ?? 1);
  sheet.getRange(`A${startRow + 2}:H${startRow + 2}`).merge();
  sheet.getRange(`A${startRow + 2}`).values = [[subtitle]];
  sheet.getRange(`A${startRow + 2}:H${startRow + 2}`).format = {
    font: { italic: true, color: C.umber, size: 9 },
    wrapText: true,
  };
}

function header(range) {
  range.format = {
    fill: C.cobalt,
    font: { bold: true, color: C.white },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "insideHorizontal", style: "thin", color: C.stone },
  };
}

function section(range) {
  range.format = {
    fill: C.limewash,
    font: { bold: true, color: C.ink },
    borders: { preset: "outside", style: "thin", color: C.stone },
  };
}

title(
  instructions,
  "A1:H2",
  "ISANDRE / ṬĀQA — Industrial model A5",
  "Planning model, supplier RFQ input and decision controls. Yellow cells are editable. Zero does not mean free: it means missing.",
);
instructions.getRange("A5:B14").values = [
  ["Step", "Action"],
  ["1", "Select supplier, product, finish and volume on Summary."],
  ["2", "Update market assumptions; replace planning rates with approved finance inputs."],
  ["3", "Keep public prices in Pricebook aligned with the canonical catalogue."],
  ["4", "Enter supplier quotations in yellow cells only."],
  ["5", "Complete hard gates and evidence-based supplier scores."],
  ["6", "Read Checks before any award or commercial launch."],
  ["7", "Treat VEILLE as blocked until its geometry is approved."],
  ["8", "Never compare ex-works price with landed cost."],
  ["9", "Never call PLANNING values supplier quotes."],
];
header(instructions.getRange("A5:B5"));
instructions.getRange("A6:A14").format = {
  font: { bold: true, color: C.cobalt },
  horizontalAlignment: "center",
};
instructions.getRange("A5:B14").format.wrapText = true;
instructions.getRange("A5:B14").format.rowHeight = 30;
instructions.getRange("A:A").format.columnWidth = 10;
instructions.getRange("B:B").format.columnWidth = 92;

title(
  assumptions,
  "A1:H2",
  "Assumptions",
  "Planning inputs only. Market-specific tax, payment, returns, freight and service data must replace them before launch.",
);
assumptions.getRange("A5:D13").values = [
  ["Driver", "Value", "Unit", "Status"],
  ["VAT", 0.2, "% of gross price", "PLANNING"],
  ["Payment fee", 0.03, "% of gross price", "PLANNING"],
  ["Returns reserve", 0.03, "% of net revenue", "PLANNING"],
  ["Warranty reserve", 0.02, "% of net revenue", "PLANNING"],
  ["Marketing allowance", 0.15, "% of net revenue", "PLANNING"],
  ["Target contribution", 0.25, "% of net revenue", "PLANNING"],
  ["Tool amortisation units", 500, "units", "PLANNING"],
  ["Model currency", "EUR", "ISO 4217", "CANONICAL"],
];
header(assumptions.getRange("A5:D5"));
assumptions.getRange("B6:B13").format.fill = C.input;
assumptions.getRange("B6:B11").format.numberFormat = "0.0%";
assumptions.getRange("B12").format.numberFormat = "0";
assumptions.getRange("A:A").format.columnWidth = 30;
assumptions.getRange("B:B").format.columnWidth = 18;
assumptions.getRange("C:C").format.columnWidth = 26;
assumptions.getRange("D:D").format.columnWidth = 18;
assumptions.freezePanes.freezeRows(5);

const products = [
  ["seuil-01", "SEUIL 01"],
  ["portee-02", "PORTÉE 02"],
  ["veille-03", "VEILLE 03"],
];
const finishes = [
  ["chalk", "Chalk / Craie"],
  ["butter", "Butter / Beurre"],
  ["sage", "Sage / Sauge"],
  ["rose-clay", "Rose Clay / Argile rose"],
];
const priceValues = {
  "seuil-01": [3000, 3200, 3300, 3500],
  "portee-02": [3000, 3200, 3300, 3500],
  "veille-03": [750, 800, 850, 900],
};
const priceRows = [];
for (const [productId, productName] of products) {
  finishes.forEach(([finishId, finishName], index) => {
    priceRows.push([
      productId,
      finishId,
      productName,
      finishName,
      priceValues[productId][index],
      "EUR incl. VAT",
      productId === "veille-03" ? "COMMERCIAL PRICE / INDUSTRIAL BLOCK" : "WORKING PRICE",
    ]);
  });
}

title(
  pricebook,
  "A1:H2",
  "Canonical public pricebook",
  "Browser amounts are never accepted as truth. These prices must remain aligned with lib/isandre/catalog.ts.",
);
pricebook.getRange(`A5:G${5 + priceRows.length}`).values = [
  ["Product ID", "Finish ID", "Product", "Finish", "Gross price", "Currency basis", "Status"],
  ...priceRows,
];
header(pricebook.getRange("A5:G5"));
pricebook.getRange(`E6:E${5 + priceRows.length}`).format.numberFormat = '€#,##0';
pricebook.getRange("A:A").format.columnWidth = 18;
pricebook.getRange("B:B").format.columnWidth = 16;
pricebook.getRange("C:C").format.columnWidth = 18;
pricebook.getRange("D:D").format.columnWidth = 27;
pricebook.getRange("E:E").format.columnWidth = 16;
pricebook.getRange("F:F").format.columnWidth = 18;
pricebook.getRange("G:G").format.columnWidth = 34;
pricebook.freezePanes.freezeRows(5);

title(
  targets,
  "A1:H2",
  "Industrial cost targets",
  "Design budgets from the material studies. They are not supplier quotations.",
);
targets.getRange("A5:H8").values = [
  [
    "Product ID",
    "Product",
    "Factory min",
    "Factory max",
    "Landed min",
    "Landed max",
    "Route",
    "Status",
  ],
  ["seuil-01", "SEUIL 01", 650, 900, 850, 1150, "Rotomoulded LLDPE", "SUPPLIER REQUIRED"],
  ["portee-02", "PORTÉE 02", 700, 950, 900, 1200, "Rotomoulded LLDPE", "SUPPLIER REQUIRED"],
  ["veille-03", "VEILLE 03", 0, 0, 0, 0, "Unvalidated", "BLOCKED"],
];
header(targets.getRange("A5:H5"));
targets.getRange("C6:F8").format.numberFormat = '€#,##0';
targets.getRange("A:A").format.columnWidth = 18;
targets.getRange("B:B").format.columnWidth = 18;
targets.getRange("C:F").format.columnWidth = 15;
targets.getRange("G:G").format.columnWidth = 26;
targets.getRange("H:H").format.columnWidth = 22;

title(
  quotes,
  "A1:T2",
  "Supplier quotation input",
  "Enter complete quote components. Engineering and tooling are amortised over the visible assumption. VEILLE remains blocked.",
);
const suppliers = ["Supplier A", "Supplier B", "Supplier C"];
const volumes = [10, 50, 100, 250, 500];
const quoteRows = [];
for (const supplier of suppliers) {
  for (const [productId] of products) {
    for (const volume of volumes) {
      quoteRows.push([
        supplier,
        productId,
        "rotomoulded-lldpe",
        volume,
        0,
        0,
        null,
        null,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        null,
        null,
      ]);
    }
  }
}
const quoteEnd = 5 + quoteRows.length;
quotes.getRange(`A5:T${quoteEnd}`).values = [
  [
    "Supplier",
    "Product ID",
    "Route",
    "Volume",
    "DFM total",
    "Tooling total",
    "Amort. units",
    "DFM + tool / unit",
    "Factory unit",
    "Packaging",
    "QC",
    "Freight + insurance",
    "Duty",
    "Warehouse",
    "Damage reserve",
    "Repair reserve",
    "Finance",
    "Ballast",
    "Landed cost",
    "Quote status",
  ],
  ...quoteRows,
];
header(quotes.getRange("A5:T5"));
quotes.getRange(`G6:G${quoteEnd}`).formulas = Array.from(
  { length: quoteRows.length },
  () => ["='Assumptions'!$B$12"],
);
for (let row = 6; row <= quoteEnd; row += 1) {
  quotes.getRange(`H${row}`).formulas = [[`=IF(G${row}=0,0,(E${row}+F${row})/G${row})`]];
  quotes.getRange(`S${row}`).formulas = [[`=SUM(H${row}:R${row})`]];
  quotes.getRange(`T${row}`).formulas = [[
    `=IF(B${row}="veille-03","BLOCKED",IF(I${row}=0,"NEEDS QUOTE","COMPLETE"))`,
  ]];
}
quotes.getRange(`E6:F${quoteEnd}`).format.fill = C.input;
quotes.getRange(`I6:R${quoteEnd}`).format.fill = C.input;
quotes.getRange(`E6:S${quoteEnd}`).format.numberFormat = '€#,##0';
quotes.getRange(`D6:D${quoteEnd}`).format.numberFormat = "0";
quotes.getRange("A:A").format.columnWidth = 18;
quotes.getRange("B:B").format.columnWidth = 17;
quotes.getRange("C:C").format.columnWidth = 24;
quotes.getRange("D:D").format.columnWidth = 10;
quotes.getRange("E:S").format.columnWidth = 15;
quotes.getRange("T:T").format.columnWidth = 18;
quotes.freezePanes.freezeRows(5);

title(
  supplierScore,
  "A1:P2",
  "Supplier scorecard",
  "A hard-gate NO-GO overrides every score. Scores require evidence, not supplier claims alone.",
);
const scoreHeaders = [
  "Supplier",
  "Hard gates",
  "DFM / geometry",
  "Surface",
  "Structure",
  "Quality",
  "Capacity",
  "Tooling / IP",
  "Packaging",
  "Landed cost",
  "Service",
  "Compliance",
  "Project comms",
  "Weighted score",
  "Decision",
  "Evidence note",
];
supplierScore.getRange("A5:P9").values = [
  scoreHeaders,
  ["Weight", "", 18, 14, 14, 10, 8, 8, 8, 8, 5, 4, 3, "", "", ""],
  ["Supplier A", "INCOMPLETE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null, ""],
  ["Supplier B", "INCOMPLETE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null, ""],
  ["Supplier C", "INCOMPLETE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null, ""],
];
header(supplierScore.getRange("A5:P5"));
section(supplierScore.getRange("A6:P6"));
for (let row = 7; row <= 9; row += 1) {
  supplierScore.getRange(`N${row}`).formulas = [[
    `=SUMPRODUCT(C${row}:M${row},$C$6:$M$6)/5`,
  ]];
  supplierScore.getRange(`O${row}`).formulas = [[
    `=IF(B${row}="NO-GO","NO-GO",IF(B${row}<>"PASS","INCOMPLETE",IF(N${row}<60,"REJECT",IF(N${row}<70,"BACKUP",IF(N${row}<80,"PROTOTYPE",IF(N${row}<90,"FINALIST","EXCELLENT"))))))`,
  ]];
}
supplierScore.getRange("B7:M9").format.fill = C.input;
supplierScore.getRange("P7:P9").format.fill = C.input;
supplierScore.getRange("B7:B9").dataValidation = {
  rule: { type: "list", values: ["INCOMPLETE", "PASS", "NO-GO"] },
};
supplierScore.getRange("C7:M9").dataValidation = {
  rule: { type: "whole", operator: "between", formula1: 0, formula2: 5 },
};
supplierScore.getRange("N7:N9").format.numberFormat = "0.0";
supplierScore.getRange("A:A").format.columnWidth = 18;
supplierScore.getRange("B:B").format.columnWidth = 16;
supplierScore.getRange("C:M").format.columnWidth = 14;
supplierScore.getRange("N:O").format.columnWidth = 17;
supplierScore.getRange("P:P").format.columnWidth = 44;
supplierScore.freezePanes.freezeRows(6);

title(
  summary,
  "A1:H2",
  "Decision summary",
  "Select a scenario. PASS only means the quotation clears the planning contribution and landed-cost gates; physical gates still apply.",
);
summary.getRange("A5:B9").values = [
  ["Scenario input", "Selection"],
  ["Supplier", "Supplier A"],
  ["Product", "seuil-01"],
  ["Finish", "chalk"],
  ["Volume", 100],
];
header(summary.getRange("A5:B5"));
summary.getRange("B6:B9").format.fill = C.input;
summary.getRange("B6").dataValidation = {
  rule: { type: "list", values: suppliers },
};
summary.getRange("B7").dataValidation = {
  rule: { type: "list", values: products.map(([id]) => id) },
};
summary.getRange("B8").dataValidation = {
  rule: { type: "list", values: finishes.map(([id]) => id) },
};
summary.getRange("B9").dataValidation = {
  rule: { type: "list", values: volumes.map(String) },
};

summary.getRange("D5:F5").merge();
summary.getRange("D5").values = [["Commercial and industrial output"]];
header(summary.getRange("D5:F5"));
summary.getRange("D6:E15").values = [
  ["Gross public price", null],
  ["Net revenue ex VAT", null],
  ["Payment fee", null],
  ["Returns reserve", null],
  ["Warranty reserve", null],
  ["Marketing allowance", null],
  ["Target contribution", null],
  ["Maximum allowable landed cost", null],
  ["Quoted landed cost", null],
  ["Decision", null],
];
summary.getRange("E6").formulas = [[
  '=SUMIFS(\'Pricebook\'!$E$6:$E$17,\'Pricebook\'!$A$6:$A$17,$B$7,\'Pricebook\'!$B$6:$B$17,$B$8)',
]];
summary.getRange("E7").formulas = [["=E6/(1+'Assumptions'!$B$6)"]];
summary.getRange("E8").formulas = [["=E6*'Assumptions'!$B$7"]];
summary.getRange("E9").formulas = [["=E7*'Assumptions'!$B$8"]];
summary.getRange("E10").formulas = [["=E7*'Assumptions'!$B$9"]];
summary.getRange("E11").formulas = [["=E7*'Assumptions'!$B$10"]];
summary.getRange("E12").formulas = [["=E7*'Assumptions'!$B$11"]];
summary.getRange("E13").formulas = [["=E7-SUM(E8:E12)"]];
summary.getRange("E14").formulas = [[
  '=SUMIFS(\'Quotes\'!$S$6:$S$50,\'Quotes\'!$A$6:$A$50,$B$6,\'Quotes\'!$B$6:$B$50,$B$7,\'Quotes\'!$D$6:$D$50,$B$9)',
]];
summary.getRange("E15").formulas = [[
  '=IF(B7="veille-03","BLOCKED",IF(E14=0,"NEEDS QUOTE",IF(E14>E13,"REVIEW MARGIN",IF(E14>SUMIFS(\'Targets\'!$F$6:$F$8,\'Targets\'!$A$6:$A$8,B7),"OVER LANDED TARGET","PASS"))))',
]];
summary.getRange("D6:D15").format = {
  fill: C.limewash,
  font: { color: C.ink },
};
summary.getRange("E6:E14").format.numberFormat = '€#,##0';
summary.getRange("E15").format = {
  fill: C.warning,
  font: { bold: true, color: C.ink, size: 13 },
  horizontalAlignment: "center",
};
summary.getRange("A:A").format.columnWidth = 28;
summary.getRange("B:B").format.columnWidth = 24;
summary.getRange("D:D").format.columnWidth = 34;
summary.getRange("E:E").format.columnWidth = 22;

summary.getRange("A18:F18").merge();
summary.getRange("A18").values = [["Physical release gates"]];
header(summary.getRange("A18:F18"));
summary.getRange("A19:B26").values = [
  ["Gate", "Status"],
  ["Canonical geometry", "DIGITAL PASS"],
  ["VEILLE dimensions", "BLOCKED"],
  ["Material coupons", "OPEN"],
  ["Functional section", "OPEN"],
  ["SEUIL prototype", "OPEN"],
  ["Laboratory tests", "OPEN"],
  ["Packaging qualification", "OPEN"],
];
header(summary.getRange("A19:B19"));
summary.getRange("A20:A26").format.fill = C.limewash;
summary.getRange("B20:B26").format.font = { bold: true };

title(
  checks,
  "A1:H2",
  "Model checks",
  "All checks must pass before the workbook is used for an award recommendation.",
);
checks.getRange("A5:D12").values = [
  ["Check", "Formula result", "Required", "Where to fix"],
  ["Public price coverage", null, 12, "Pricebook"],
  ["Negative quote components", null, 0, "Quotes"],
  ["VEILLE status", null, "BLOCKED", "Targets"],
  ["Target products", null, 3, "Targets"],
  ["Finish count", null, 4, "Pricebook"],
  ["Supplier score weights", null, 100, "Supplier_Score"],
  ["MODEL STATUS", null, "PASS", "Resolve failed checks"],
];
header(checks.getRange("A5:D5"));
checks.getRange("B6").formulas = [["=COUNTA('Pricebook'!$E$6:$E$17)"]];
checks.getRange("B7").formulas = [["=COUNTIF('Quotes'!$E$6:$R$50,\"<0\")"]];
checks.getRange("B8").formulas = [["='Targets'!$H$8"]];
checks.getRange("B9").formulas = [["=COUNTA('Targets'!$A$6:$A$8)"]];
checks.getRange("B10").formulas = [["=COUNTA('Pricebook'!$B$6:$B$9)"]];
checks.getRange("B11").formulas = [["=SUM('Supplier_Score'!$C$6:$M$6)"]];
checks.getRange("B12").formulas = [[
  '=IF(AND(B6=C6,B7=C7,B8=C8,B9=C9,B10=C10,B11=C11),"PASS","FAIL")',
]];
checks.getRange("A6:A12").format.fill = C.limewash;
checks.getRange("B12").format = {
  fill: C.pass,
  font: { bold: true, color: C.ink, size: 14 },
  horizontalAlignment: "center",
};
checks.getRange("A:A").format.columnWidth = 34;
checks.getRange("B:C").format.columnWidth = 18;
checks.getRange("D:D").format.columnWidth = 34;

title(
  sources,
  "A1:H2",
  "Sources and status",
  "Hardcoded planning inputs are traceable. Supplier quotations and laboratory data replace assumptions when received.",
);
sources.getRange("A5:F14").values = [
  ["Item", "Source type", "Reference", "URL / file", "As of", "Status"],
  ["Canonical plan", "Internal", "Master plan", "docs/research/plan-maitre-final-isandre-taqa.md", "2026-07-27", "CANONICAL"],
  ["Geometry", "Internal", "Geometry registry", "lib/isandre/geometry.data.json", "2026-07-27", "CANONICAL"],
  ["Material platform", "Internal", "DA studies 18–20", "/Users/mohyi/CHATGPT/DA Rava 2040", "2026-07-27", "TARGET"],
  ["GPSR", "EU official", "Product safety", "https://commission.europa.eu/business-economy-eu/doing-business-eu/eu-product-safety-and-labelling/product-safety_en", "2026-07-27", "CURRENT"],
  ["PPWR", "EU official", "Regulation (EU) 2025/40", "https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng", "2026-07-27", "APPLIES 2026-08-12"],
  ["Packaging tests", "ISTA", "Test procedures", "https://www.ista.org/test_procedures.php", "2026-07-27", "LAB SELECTION"],
  ["Public prices", "Internal", "Catalogue", "lib/isandre/catalog.ts", "2026-07-27", "WORKING"],
  ["Supplier quotes", "External", "RFQ response", "Not received", "—", "MISSING"],
  ["Golden sample", "Physical", "Signed master", "Not produced", "—", "OPEN"],
];
header(sources.getRange("A5:F5"));
sources.getRange("A:A").format.columnWidth = 24;
sources.getRange("B:B").format.columnWidth = 20;
sources.getRange("C:C").format.columnWidth = 28;
sources.getRange("D:D").format.columnWidth = 78;
sources.getRange("E:E").format.columnWidth = 16;
sources.getRange("F:F").format.columnWidth = 22;
sources.getRange("A5:F14").format.wrapText = true;

for (const sheet of [
  instructions,
  summary,
  assumptions,
  pricebook,
  targets,
  quotes,
  supplierScore,
  checks,
  sources,
]) {
  const used = sheet.getUsedRange();
  used.format.verticalAlignment = "center";
  used.format.rowHeight = 22;
  sheet.getRange("1:2").format.rowHeight = 30;
  sheet.getRange("3:3").format.rowHeight = 34;
}

summary.getRange("A1:H2").format.font = { name: "Georgia", size: 18, bold: true, color: C.paper };
instructions.getRange("A1:H2").format.font = { name: "Georgia", size: 18, bold: true, color: C.paper };

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const inspect = await workbook.inspect({
  kind: "table",
  range: "Summary!A1:F26",
  include: "values,formulas",
  tableMaxRows: 30,
  tableMaxCols: 8,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

for (const sheetName of [
  "Instructions",
  "Summary",
  "Assumptions",
  "Pricebook",
  "Targets",
  "Quotes",
  "Supplier_Score",
  "Checks",
  "Sources",
]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    path.join(previewDir, `${sheetName.toLowerCase()}.png`),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
await fs.copyFile(outputPath, canonicalPath);

console.log(`Generated ${outputPath}`);
console.log(`Versioned ${canonicalPath}`);
