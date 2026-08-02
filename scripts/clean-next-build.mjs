import { rm } from "node:fs/promises";
import path from "node:path";

const allowedDirectories = new Set([".next", ".next-qa"]);
const directory = process.argv[2];

if (!allowedDirectories.has(directory)) {
  throw new Error(
    `Refusing to clean "${directory ?? ""}". Expected .next or .next-qa.`,
  );
}

const root = process.cwd();
const target = path.resolve(root, directory);

if (path.dirname(target) !== root) {
  throw new Error(`Refusing to clean outside the project root: ${target}`);
}

await rm(target, { recursive: true, force: true });
console.log(`Removed stale Next.js build artifacts from ${directory}.`);
