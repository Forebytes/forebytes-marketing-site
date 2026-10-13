#!/usr/bin/env node
/**
 * Fail the build if a secret could reach the browser, or if a real key has been committed.
 *
 * Anything behind NEXT_PUBLIC_ is inlined into the client bundle at build time, so that prefix is
 * a publishing decision, not a naming convention. The Supabase service role key bypasses RLS
 * entirely and must never appear in the repo.
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const SCANNED = /\.(ts|tsx|js|jsx|mjs|cjs|json|sql|ya?ml|md|html?)$/;
const SKIP = /^(node_modules|\.next|coverage|out)\//;

const RULES = [
  {
    id: "next-public-secret",
    pattern: /NEXT_PUBLIC_[A-Z0-9_]*(SERVICE_ROLE|SECRET|PRIVATE_KEY|_AUTH_TOKEN|PASSWORD)/,
    message: "NEXT_PUBLIC_ inlines this into the client bundle. Drop the prefix.",
  },
  {
    id: "service-role-key",
    pattern: /service_role/i,
    message: "The service role key bypasses RLS and must never be in the repo.",
    // Docs discuss it by name; only flag assignments.
    requires: /service_role\s*[:=]\s*['"`]/i,
  },
  {
    id: "supabase-jwt",
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
    message: "That looks like a real JWT. Keys belong in .env.local or Vercel, never in git.",
  },
  {
    id: "private-key-block",
    pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    message: "A private key is committed.",
  },
];

const files = execSync("git ls-files", { encoding: "utf8" })
  .split("\n")
  .filter((f) => f && SCANNED.test(f) && !SKIP.test(f) && f !== "scripts/check-secrets.mjs");

const findings = [];
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue; // deleted in the working tree but still indexed
  }
  text.split("\n").forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.pattern.test(line) && (!rule.requires || rule.requires.test(line))) {
        findings.push({ file, line: i + 1, rule, text: line.trim().slice(0, 100) });
      }
    }
  });

  // A client component can only ever see NEXT_PUBLIC_ variables. Reading any other one there is
  // either a bug (undefined in the browser) or a sign a secret is about to be moved client-side.
  if (/^\s*["']use client["']/m.test(text)) {
    text.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
        if (!m[1].startsWith("NEXT_PUBLIC_") && m[1] !== "NODE_ENV") {
          findings.push({
            file,
            line: i + 1,
            rule: { id: "client-reads-server-env", message: `Client component reads ${m[1]}, which is server-only.` },
            text: line.trim().slice(0, 100),
          });
        }
      }
    });
  }
}

if (findings.length) {
  console.error(`\ncheck-secrets: ${findings.length} problem(s)\n`);
  for (const f of findings) console.error(`  ${f.file}:${f.line}  [${f.rule.id}]  ${f.rule.message}\n    ${f.text}`);
  process.exit(1);
}
console.log(`check-secrets: ok (${files.length} files scanned)`);
