// Workaround for a Flue 1.0.0-beta build-output issue on Cloudflare.
//
// Flue's rolldown runtime emits `createRequire(import.meta.url)` at the top of
// a shared chunk. Flue splits the Worker into many "additional modules", and
// in those chunks `import.meta.url` is undefined on the Cloudflare edge, so the
// Worker throws at startup (Wrangler validation error 10021):
//
//   TypeError: The argument 'path' must be a file URL ... Received 'undefined'
//     at createRequire (node:module)
//
// This script guards that single call with a valid fallback base URL, which
// stops the startup crash without changing Node behavior (where import.meta.url
// is defined). Remove this once Flue ships a fix.
//
// Runs after `flue build` in the npm `build` script.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const WORKER_DIR = "dist/cf_agentic_launchpad";
const NEEDLE = "createRequire(import.meta.url)";
const REPLACEMENT = 'createRequire(import.meta.url ?? "file:///worker.js")';

function walk(dir) {
  let files = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (full.endsWith(".js") || full.endsWith(".mjs")) {
      files.push(full);
    }
  }
  return files;
}

let patched = 0;
for (const file of walk(WORKER_DIR)) {
  const src = readFileSync(file, "utf8");
  if (src.includes(NEEDLE)) {
    writeFileSync(file, src.split(NEEDLE).join(REPLACEMENT));
    patched += 1;
    console.log("patched createRequire guard in", file);
  }
}

console.log(`patch-flue-bundle: guarded ${patched} file(s) in ${WORKER_DIR}`);
