import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static, no adapter: the site is documents, and W2 fetches today's story
// from the backend in the browser so a correction lands without a rebuild.
// Tailwind runs as a Vite plugin (v4's own integration path) rather than
// the legacy @astrojs/tailwind — see techSpec/web/ui.md for how it's scoped.
export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    // /today fetches today's story from /api/bits/today. Same-origin is not a
    // preference — the site's content policy and its build check both forbid a
    // third-party request — so in development the API is proxied here rather
    // than addressed directly. The deployed equivalent goes in netlify.toml
    // the day there is a deployed API to point it at.
    server: { proxy: { "/api": { target: "http://localhost:8787", rewrite: (p) => p.slice(4) } } },
  },
});
