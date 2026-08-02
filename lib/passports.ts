import { getDatabasePool } from "@/lib/database";
import {
  finishIds,
  productIds,
  type FinishId,
  type ProductId,
} from "@/lib/isandre/catalog";

export const passportStatuses = [
  "draft",
  "active",
  "transferred",
  "retired",
] as const;

export type PassportStatus = (typeof passportStatuses)[number];

export type PublicPassport = {
  serial: string;
  productId: ProductId;
  finishId: FinishId;
  status: PassportStatus;
  manufacturedAt: string | null;
  activatedAt: string | null;
  materialBatch: string | null;
  edition: string | null;
  repairs: Array<{
    completedAt: string;
    kind: string;
    summary: string;
  }>;
};

const productSerialCodes: Record<ProductId, string> = {
  "seuil-01": "S01",
  "portee-02": "P02",
  "veille-03": "V03",
};

const serialProducts = Object.fromEntries(
  Object.entries(productSerialCodes).map(([productId, code]) => [code, productId]),
) as Record<string, ProductId>;

function checksum(value: string) {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let accumulator = 17;

  for (const character of value) {
    accumulator = (accumulator * 31 + character.charCodeAt(0)) % alphabet.length;
  }

  return alphabet[accumulator];
}

export function createPassportSerial(
  productId: ProductId,
  year: number,
  sequence: number,
) {
  if (!Number.isInteger(year) || year < 2026 || year > 2099) {
    throw new Error("Passport year is outside the supported range.");
  }
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 999_999) {
    throw new Error("Passport sequence must be between 1 and 999999.");
  }

  const body = `TAQA-${productSerialCodes[productId]}-${year}-${String(sequence).padStart(6, "0")}`;

  return `${body}-${checksum(body)}`;
}

export function parsePassportSerial(value: string) {
  const serial = value.trim().toUpperCase();
  const match = serial.match(
    /^TAQA-(S01|P02|V03)-(20(?:2[6-9]|[3-9]\d))-(\d{6})-([0-9A-Z])$/,
  );

  if (!match) return null;
  const body = serial.slice(0, -2);
  if (checksum(body) !== match[4]) return null;

  return {
    serial,
    productId: serialProducts[match[1]],
    year: Number(match[2]),
    sequence: Number(match[3]),
  };
}

function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && productIds.includes(value as ProductId);
}

function isFinishId(value: unknown): value is FinishId {
  return typeof value === "string" && finishIds.includes(value as FinishId);
}

function isPassportStatus(value: unknown): value is PassportStatus {
  return (
    typeof value === "string" &&
    passportStatuses.includes(value as PassportStatus)
  );
}

function databaseDate(value: unknown, dateOnly = false) {
  if (value instanceof Date) {
    const iso = value.toISOString();
    return dateOnly ? iso.slice(0, 10) : iso;
  }
  return typeof value === "string" ? value : null;
}

export async function getPublicPassport(
  serialValue: string,
): Promise<PublicPassport | null> {
  const parsed = parsePassportSerial(serialValue);
  if (!parsed) return null;

  const pool = getDatabasePool();
  if (!pool) return null;

  const passportResult = await pool.query<Record<string, unknown>>(
    `select serial, product_id, finish_id, status, manufactured_at,
            activated_at, material_batch, edition
       from public.isandre_passports
      where serial = $1
      limit 1`,
    [parsed.serial],
  );
  const row = passportResult.rows[0];
  if (
    !row ||
    !isProductId(row.product_id) ||
    !isFinishId(row.finish_id) ||
    !isPassportStatus(row.status) ||
    row.status === "draft"
  ) {
    return null;
  }

  const repairsResult = await pool.query<Record<string, unknown>>(
    `select completed_at, kind, public_summary
       from public.isandre_passport_repairs
      where passport_serial = $1
      order by completed_at desc`,
    [parsed.serial],
  );
  const repairRows = repairsResult.rows;

  return {
    serial: String(row.serial),
    productId: row.product_id,
    finishId: row.finish_id,
    status: row.status,
    manufacturedAt: databaseDate(row.manufactured_at, true),
    activatedAt: databaseDate(row.activated_at),
    materialBatch:
      typeof row.material_batch === "string" ? row.material_batch : null,
    edition: typeof row.edition === "string" ? row.edition : null,
    repairs: repairRows.flatMap((repair) =>
      databaseDate(repair.completed_at) &&
      typeof repair.kind === "string" &&
      typeof repair.public_summary === "string"
        ? [
            {
              completedAt: databaseDate(repair.completed_at)!,
              kind: repair.kind,
              summary: repair.public_summary,
            },
          ]
        : [],
    ),
  };
}
