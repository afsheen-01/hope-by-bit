import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".astro/"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  ...astro.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: { parserOptions: { parser: ts.parser, extraFileExtensions: [".svelte"] } },
  },
);
