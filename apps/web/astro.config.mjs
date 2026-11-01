import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// A fully static site: every page is built to plain HTML ahead of time, so
// there is no server to run. The UI is written as Svelte components, which
// Astro renders to HTML during the build. Tailwind v4 is wired in through its
// own Vite plugin; the older @astrojs/tailwind integration is not used.
export default defineConfig({
  output: "static",
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()] },
});
