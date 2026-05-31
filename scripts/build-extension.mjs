import { cpSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backend = resolve(root, "backend");
const extensionDir = resolve(backend, "extension");

rmSync(extensionDir, { recursive: true, force: true });
mkdirSync(extensionDir, { recursive: true });

console.log("Building side panel UI...");
execSync("npm run build", { cwd: resolve(root, "frontend"), stdio: "inherit" });

cpSync(resolve(backend, "manifest.json"), resolve(extensionDir, "manifest.json"));
cpSync(resolve(backend, "background.js"), resolve(extensionDir, "background.js"));

console.log(`\nExtension ready at: ${extensionDir}`);
console.log("Load it in Chrome: chrome://extensions → Developer mode → Load unpacked");
