// Flat config. `eslint-config-next` carries the React, hooks and Next rules;
// the rest is house style on top (same bar as forebytes-app).
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "node_modules/**", "out/**", "coverage/**", "next-env.d.ts"]),
  {
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // CLI scripts exist to print.
  { files: ["scripts/**"], rules: { "no-console": "off" } },
]);
