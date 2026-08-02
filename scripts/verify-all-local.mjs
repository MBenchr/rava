import { spawnSync } from "node:child_process";

const checks = [
  "brand:verify",
  "content:verify",
  "industrial:verify",
  "media:pilots:verify",
  "media:verify",
  "geometry:import:verify",
  "projection:verify",
  "projection:contract:verify",
  "projection:errors:verify",
  "markets:verify",
  "checkout:verify",
  "orders:verify",
  "service-requests:verify",
  "passports:verify",
  "measurement:verify",
  "seo:verify",
  "launch:verify",
  "accessibility:verify",
  "deployment:verify",
  "security:verify",
  "completion:verify",
  "test:unit",
  "typecheck",
  "lint",
  "build",
  "browser:verify",
];

for (const check of checks) {
  console.log(`\n=== ${check} ===`);
  const result = spawnSync("npm", ["run", check], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\nLocal release matrix stopped at ${check}.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nLocal release matrix passed: ${checks.length}/${checks.length}.`);
