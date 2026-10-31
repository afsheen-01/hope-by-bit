import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// Static, no adapter: the site is documents, and W2 fetches today's story
// from the backend in the browser so a correction lands without a rebuild.
// UI is Svelte components; Astro renders them to HTML at build time and only
// the ones marked client:* ship JavaScript. Tailwind runs as a Vite plugin
// (v4's own integration path) rather than the legacy @astrojs/tailwind.
export default defineConfig({
  output: "static",
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()] },
});
