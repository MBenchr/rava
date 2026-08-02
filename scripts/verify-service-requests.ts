import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { serviceRequestsToCrmCsv } from "../lib/service-requests/csv";
import { createMemoryServiceRequestRepository } from "../lib/service-requests/repository";
import { serviceRequestInputSchema } from "../lib/service-requests/schema";
import { createServiceRequest } from "../lib/service-requests/service";

async function main() {
  const repository = createMemoryServiceRequestRepository();
  let notifications = 0;
  const clientRequestId = randomUUID();
  const input = {
    clientRequestId,
    kind: "project",
    source: "product-page",
    locale: "en",
    name: "Avery Example",
    email: "avery@example.com",
    organization: "=Untrusted Studio",
    phone: "",
    location: "London, UK",
    productId: "seuil-01",
    finishId: "sage",
    quantity: "2",
    message: "Please confirm access requirements and the delivery sequence.",
    privacyAccepted: true,
    marketingConsent: false,
    website: "",
  } as const;

  const parsed = serviceRequestInputSchema.parse(input);
  assert.equal(parsed.quantity, 2);
  assert.equal(parsed.phone, null);

  const first = await createServiceRequest(input, {
    repository,
    now: new Date("2026-07-29T10:00:00.000Z"),
    sendNotifications: async () => {
      notifications += 1;
      return "sent";
    },
  });
  const duplicate = await createServiceRequest(input, {
    repository,
    sendNotifications: async () => {
      notifications += 1;
      return "sent";
    },
  });

  assert.equal(first.id, clientRequestId);
  assert.equal(first.reference, duplicate.reference);
  assert.equal(notifications, 1, "A retried request must not send a second email.");
  assert.match(first.reference, /^SR-20260729-[0-9A-F]{6}$/);

  for (const kind of ["trade", "press"] as const) {
    await createServiceRequest(
      {
        ...input,
        clientRequestId: randomUUID(),
        kind,
        source: kind === "trade" ? "trade-pack" : "press-kit",
        productId: "",
        finishId: "",
        quantity: "",
      },
      {
        repository,
        sendNotifications: async () => "skipped",
      },
    );
  }

  assert.throws(() =>
    serviceRequestInputSchema.parse({
      ...input,
      clientRequestId: randomUUID(),
      website: "bot.example",
    }),
  );
  assert.throws(() =>
    serviceRequestInputSchema.parse({
      ...input,
      clientRequestId: randomUUID(),
      productId: "",
      finishId: "sage",
    }),
  );

  const requests = await repository.listRequests();
  assert.equal(requests.length, 3);
  const csv = serviceRequestsToCrmCsv(requests);
  assert(csv.includes("\"'=Untrusted Studio\""), "CSV formula injection is not neutralised.");
  assert(csv.includes("\"project\"") && csv.includes("\"trade\"") && csv.includes("\"press\""));

  const root = process.cwd();
  const [migration, route] = await Promise.all([
    readFile(
      path.join(
        root,
        "supabase/migrations/202607290003_isandre_service_requests.sql",
      ),
      "utf8",
    ),
    readFile(path.join(root, "app/api/service-requests/route.ts"), "utf8"),
  ]);
  assert(migration.includes("enable row level security"));
  assert(migration.includes("isandre_service_request_events"));
  assert(route.includes("export async function POST"));
  assert(!route.includes("export async function GET"));

  console.log(
    "Verified project/trade/press requests, retry idempotence, audit storage and safe CRM export.",
  );
}

void main();
