#!/usr/bin/env node
/**
 * Dependency audit gate.
 *
 * `npm audit --audit-level=high` alone is not usable when the only offered "fix" is a downgrade
 * or a breaking change. Lowering the threshold to hide that would also hide the next real
 * advisory, so each accepted advisory is listed below with a reason and a date it must be looked
 * at again.
 *
 * Fails if:
 *   - a high or critical advisory is not on the ACCEPTED list;
 *   - a listed advisory is past its review date;
 *   - a listed advisory no longer appears, so the entry is stale.
 */
import { execSync } from "node:child_process";

const ACCEPTED = {};

let raw;
try {
  raw = execSync("npm audit --json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
} catch (error) {
  // npm audit exits non-zero when it finds anything, so the output is the signal, not the code.
  raw = error.stdout?.toString() ?? "";
}
let report;
try {
  report = JSON.parse(raw);
} catch {
  console.error("check-audit: could not read `npm audit --json` output (offline?).");
  process.exit(1);
}

// Each advisory appears as an object in some package's `via`; other entries are just propagation.
const advisories = new Map();
for (const vuln of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vuln.via) {
    if (typeof via === "string") continue;
    const id = via.url?.split("/").pop();
    if (id) advisories.set(id, { severity: via.severity, package: via.name, title: via.title });
  }
}

const today = new Date().toISOString().slice(0, 10);
const problems = [];

for (const [id, a] of advisories) {
  if (a.severity !== "high" && a.severity !== "critical") continue;
  const accepted = ACCEPTED[id];
  if (!accepted) problems.push(`${id} (${a.severity}) in ${a.package}: ${a.title}. Fix it, or add it to ACCEPTED with a reason.`);
  else if (accepted.reviewBy < today) problems.push(`${id} was accepted until ${accepted.reviewBy}. Re-review it.`);
}
for (const id of Object.keys(ACCEPTED)) {
  if (!advisories.has(id)) problems.push(`${id} is in ACCEPTED but no longer reported. Remove the entry.`);
}

if (problems.length) {
  console.error("\ncheck-audit: failed\n");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`check-audit: ok (${advisories.size} advisories, ${Object.keys(ACCEPTED).length} accepted)`);
