import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["node_modules/*", ".next/*", "out/*"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      "simple-import-sort": simpleImportSort,
      "sort-keys-fix": sortKeysFix,
      "sort-destructure-keys": sortDestructureKeys,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-arrow-callback": ["error"],
      // Import sorting is handled by Prettier (@trivago/prettier-plugin-sort-imports)
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",
      "sort-keys-fix/sort-keys-fix": "error",
      "sort-destructure-keys/sort-destructure-keys": "error",
    },
  },
];

export default eslintConfig;
