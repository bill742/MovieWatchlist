import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  globalIgnores([
    "node_modules/*",
    ".next/*",
    "out/*",
    "tailwind.config.js",
    "postcss.config.js",
    "playwright.config.ts",
    "src/components/ui/**",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [".config/**"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      "sort-keys-fix": fixupPluginRules(sortKeysFix),
      "sort-destructure-keys": sortDestructureKeys,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-arrow-callback": ["error"],
      // Import sorting is handled by Prettier (@trivago/prettier-plugin-sort-imports)
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",
      "sort-keys-fix/sort-keys-fix": [
        "warn",
        "asc",
        {
          caseSensitive: true,
          natural: false,
        },
      ],
      "sort-destructure-keys/sort-destructure-keys": "error",
    },
  },
]);
