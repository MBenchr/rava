import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const blueprint = readFileSync("render.yaml", "utf8");
const healthRoute = readFileSync("app/api/health/route.ts", "utf8");
const brandContract = readFileSync("lib/isandre/brand.ts", "utf8");

assert.match(blueprint, /name:\s+isandre-storefront/u);
assert.match(blueprint, /autoDeploy:\s+false/u);
assert.match(blueprint, /healthCheckPath:\s+\/api\/health/u);
assert.match(
  blueprint,
  /key:\s+CATALOG_RELEASED\s+value:\s+"false"/su,
);
assert.match(
  blueprint,
  /key:\s+ALLOW_VOLATILE_ORDER_STORE\s+value:\s+"false"/su,
);
assert.match(
  brandContract,
  /brandClearance[\s\S]*brandCleared:\s*false/u,
  "The reviewed brand-clearance gate must remain closed.",
);

for (const key of [
  "NEXT_PUBLIC_SITE_URL",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM",
]) {
  assert.match(blueprint, new RegExp(`key:\\s+${key}`, "u"), `${key} missing`);
}

assert.doesNotMatch(
  healthRoute,
  /OPENAI_API_KEY|RESEND_API_KEY|STRIPE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY/u,
);

for (const file of [
  "supabase/migrations/202607280001_isandre_orders.sql",
  "supabase/migrations/202607280002_isandre_passports.sql",
  "docs/operations/deployment-readiness.md",
  "docs/operations/monitoring-and-recovery.md",
  "docs/execution/rollback.md",
]) {
  assert.ok(existsSync(file), `Missing deployment artifact ${file}`);
}

console.log(
  "Deployment readiness verified: gated Render blueprint, safe health route, migrations and runbooks.",
);
