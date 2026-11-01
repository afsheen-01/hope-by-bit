import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// Static site: Svelte components are rendered to HTML at build time.
export default defineConfig({
  output: "static",
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()] },
});
