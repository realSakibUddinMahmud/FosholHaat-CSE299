const { spawnSync } = require("node:child_process");
const path = require("node:path");

const scriptPath = path.resolve(__dirname, "restart-dev-stack.ps1");

const result = spawnSync(
  "powershell",
  [
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    scriptPath,
  ],
  {
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
