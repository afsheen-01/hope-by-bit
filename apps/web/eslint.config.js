import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import { configs as astroConfigs } from "eslint-plugin-astro";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { configs as tsConfigs, parser as tsParser } from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".astro/"] },
  js.configs.recommended,
  ...tsConfigs.recommended,
  ...svelte.configs.recommended,
  ...astroConfigs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: { parserOptions: { parser: tsParser, extraFileExtensions: [".svelte"] } },
  },
  {
    settings: { "import-x/resolver-next": [createTypeScriptImportResolver()] },
    rules: {
      // Vite query imports like `icon.svg?raw` resolve at build time, not on disk.
      "import-x/no-unresolved": ["error", { ignore: ["\\?raw$"] }],
      "import-x/no-duplicates": "error",
      "import-x/no-cycle": "error",
    },
  },
  // Last, so Prettier alone decides formatting.
  prettier,
);
