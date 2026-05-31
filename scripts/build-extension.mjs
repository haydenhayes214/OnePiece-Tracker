import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backend = resolve(root, "backend");
const extensionDir = resolve(backend, "extension");

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

rmSync(extensionDir, { recursive: true, force: true });
mkdirSync(extensionDir, { recursive: true });

console.log("Building side panel UI...");
execSync("npm run build", { cwd: resolve(root, "frontend"), stdio: "inherit" });

cpSync(resolve(backend, "manifest.json"), resolve(extensionDir, "manifest.json"));
cpSync(resolve(backend, "background.js"), resolve(extensionDir, "background.js"));

const env = parseEnvFile(resolve(root, "frontend/.env"));
const manifestPath = resolve(extensionDir, "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (env.VITE_GOOGLE_OAUTH_CLIENT_ID) {
  manifest.oauth2 = manifest.oauth2 ?? {};
  manifest.oauth2.client_id = env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  console.log("Applied Google OAuth client ID from frontend/.env");
} else {
  console.warn(
    "Warning: VITE_GOOGLE_OAUTH_CLIENT_ID not set in frontend/.env — Google sign-in will not work until configured."
  );
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`\nExtension ready at: ${extensionDir}`);
console.log("Load it in Chrome: chrome://extensions → Developer mode → Load unpacked");
