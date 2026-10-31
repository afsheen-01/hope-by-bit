import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static, no adapter: the site is documents, and W2 fetches today's story
// from the backend in the browser so a correction lands without a rebuild.
// Tailwind runs as a Vite plugin (v4's own integration path) rather than
// the legacy @astrojs/tailwind — see techSpec/web/ui.md for how it's scoped.
export default defineConfig({
  output: "static",
  vite: { plugins: [tailwindcss()] },
});
