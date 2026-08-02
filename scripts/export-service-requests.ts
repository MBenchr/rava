import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getServerEnv } from "../lib/server-env";
import {
  createServiceRequestAuditEvent,
  getServiceRequestRepository,
} from "../lib/service-requests/repository";
import { serviceRequestsToCrmCsv } from "../lib/service-requests/csv";

async function main() {
  const outputArgument = process.argv.find((value) =>
    value.startsWith("--output="),
  );
  const outputPath = path.resolve(
    process.cwd(),
    outputArgument?.slice("--output=".length) ??
      "output/operations/service-requests.csv",
  );

  if (
    !getServerEnv("SUPABASE_URL") ||
    !getServerEnv("SUPABASE_SERVICE_ROLE_KEY")
  ) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for a CRM export.",
    );
  }

  const repository = getServiceRequestRepository();
  const requests = await repository.listRequests();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serviceRequestsToCrmCsv(requests), {
    mode: 0o600,
  });

  for (const request of requests) {
    await repository.appendAudit(
      createServiceRequestAuditEvent(request.id, "exported", {
        format: "csv",
        rowCount: requests.length,
      }),
    );
  }

  console.log(`Exported ${requests.length} service requests to ${outputPath}.`);
}

void main();
