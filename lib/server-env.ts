import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ENV_FILE_CANDIDATES = [
  "/Users/mohyi/api/env/master.env",
  "/Users/mohyi/master.env",
  join(process.cwd(), ".env.local"),
  join(process.cwd(), ".env"),
];

const envCache = new Map<string, Record<string, string>>();

function parseEnvFile(filepath: string) {
  if (envCache.has(filepath)) {
    return envCache.get(filepath)!;
  }

  if (!existsSync(filepath)) {
    envCache.set(filepath, {});

    return {};
  }

  const parsed: Record<string, string> = {};
  const content = readFileSync(filepath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    parsed[key] = value;
  }

  envCache.set(filepath, parsed);

  return parsed;
}

function getLaunchctlEnv(name: string) {
  try {
    const value = execSync(`launchctl getenv ${name}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

export function getServerEnv(name: string) {
  const processValue = process.env[name];

  if (processValue) {
    return processValue;
  }

  const launchctlValue = getLaunchctlEnv(name);

  if (launchctlValue) {
    return launchctlValue;
  }

  for (const filepath of ENV_FILE_CANDIDATES) {
    const fileValue = parseEnvFile(filepath)[name];

    if (fileValue) {
      return fileValue;
    }
  }

  return undefined;
}
