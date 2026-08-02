import { getServerEnv } from "@/lib/server-env";
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

export async function getPublicPassport(
  serialValue: string,
): Promise<PublicPassport | null> {
  const parsed = parsePassportSerial(serialValue);
  if (!parsed) return null;

  const supabaseUrl = getServerEnv("SUPABASE_URL");
  const serviceRoleKey = getServerEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return null;

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
  const base = `${supabaseUrl.replace(/\/$/, "")}/rest/v1`;
  const passportResponse = await fetch(
    `${base}/isandre_passports?serial=eq.${encodeURIComponent(parsed.serial)}&select=serial,product_id,finish_id,status,manufactured_at,activated_at,material_batch,edition&limit=1`,
    { headers, cache: "no-store" },
  );

  if (!passportResponse.ok) {
    throw new Error(`PASSPORT_STORE_HTTP_${passportResponse.status}`);
  }

  const rows = (await passportResponse.json()) as Array<Record<string, unknown>>;
  const row = rows[0];
  if (
    !row ||
    !isProductId(row.product_id) ||
    !isFinishId(row.finish_id) ||
    !isPassportStatus(row.status) ||
    row.status === "draft"
  ) {
    return null;
  }

  const repairsResponse = await fetch(
    `${base}/isandre_passport_repairs?passport_serial=eq.${encodeURIComponent(parsed.serial)}&select=completed_at,kind,public_summary&order=completed_at.desc`,
    { headers, cache: "no-store" },
  );
  const repairRows = repairsResponse.ok
    ? ((await repairsResponse.json()) as Array<Record<string, unknown>>)
    : [];

  return {
    serial: String(row.serial),
    productId: row.product_id,
    finishId: row.finish_id,
    status: row.status,
    manufacturedAt:
      typeof row.manufactured_at === "string" ? row.manufactured_at : null,
    activatedAt:
      typeof row.activated_at === "string" ? row.activated_at : null,
    materialBatch:
      typeof row.material_batch === "string" ? row.material_batch : null,
    edition: typeof row.edition === "string" ? row.edition : null,
    repairs: repairRows.flatMap((repair) =>
      typeof repair.completed_at === "string" &&
      typeof repair.kind === "string" &&
      typeof repair.public_summary === "string"
        ? [
            {
              completedAt: repair.completed_at,
              kind: repair.kind,
              summary: repair.public_summary,
            },
          ]
        : [],
    ),
  };
}
