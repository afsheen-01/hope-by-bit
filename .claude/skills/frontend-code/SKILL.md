---
name: frontend-code
description: Practices for frontend code in apps/web (Astro + Svelte 5 + Tailwind v4).
---

- Build UI from small Svelte components; never one large file per screen.
- Ship minimal JS: load Svelte in the browser only where needed, use plain TS modules for small behaviour.
- Keep mock and constant data in `src/data/`, not inside components.
- Name components in PascalCase for what they are, modules in kebab-case, rune modules `.svelte.ts`.
- Follow the official Svelte, Astro and Tailwind naming conventions and best practices (svelte.dev/docs/svelte/best-practices).
- Import through the `#/` alias, never relative `../` paths.
- Use Svelte 5 runes, `{@attach}`, keyed `{#each}` by a real id, and clsx-style class arrays.
- Use Tailwind for tokens only in `global.css`; components style themselves with utilities and variants.
- Prefer named theme tokens over arbitrary values, and remove redundant utilities and unused tokens.
- Put tests in `apps/web/tests/`, mirroring `src/lib/`, importing through `#/`.
- Keep comments concise and meaningful.
- Run `pnpm verify` and `pnpm test` before finishing; refactors must render identically.
