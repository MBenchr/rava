import { spawn, spawnSync } from "node:child_process";
import net from "node:net";

function reservePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() =>
        port ? resolve(port) : reject(new Error("Unable to reserve QA port.")),
      );
    });
  });
}

async function waitForServer(url, child) {
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`QA server exited with code ${child.exitCode}.`);
    }

    try {
      const response = await fetch(`${url}/api/health`, { cache: "no-store" });
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("QA server did not become ready.");
}

function npmRun(script, environment) {
  const result = spawnSync("npm", ["run", script], {
    cwd: process.cwd(),
    env: { ...process.env, ...environment },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`${script} failed with code ${result.status ?? 1}.`);
  }
}

const port = await reservePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"],
  {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", (chunk) => process.stdout.write(`[qa-server] ${chunk}`));
server.stderr.on("data", (chunk) => process.stderr.write(`[qa-server] ${chunk}`));

try {
  await waitForServer(baseUrl, server);
  npmRun("performance:verify", { PERFORMANCE_BASE_URL: baseUrl });
  npmRun("test:e2e", { PLAYWRIGHT_BASE_URL: baseUrl });
  npmRun("qa:screenshots", { QA_BASE_URL: baseUrl });
  console.log(`Browser release matrix passed at ${baseUrl}.`);
} finally {
  server.kill("SIGTERM");
}

