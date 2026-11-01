# Hope By Bit

**One good thing. One small thing. Every day.**

A daily ritual. One piece of genuinely good news matched to what you care about, one small thing you
can do about it, and a growing record that the world — and you — are still moving.

Free forever.

---

**`product/`** — what this is, and the rules it holds to.

 [features.md](product/features.md) 
 [principles.md](product/principles.md)
 [designSystem.md](product/designSystem.md)

**Root** — binding everywhere, or about working here.

[SAFETY.md](SAFETY.md)
`apps/web/` | The website: Astro pages, Svelte components in `src/components/`, logic in `src/lib/` (imported as `#/…`), tests in `tests/`. Run `pnpm install && pnpm dev`. `dev` and `build` run `pnpm verify` first (Prettier, ESLint, type checks); `pnpm format` fixes formatting; `pnpm test` runs the tests. |

## What we're building

**The website** — *built, in progress.* Static Astro with Svelte components, in `apps/web/`. It has a
landing page at `/`, today's story at `/today` (placeholder content for now), and onboarding at
`/start`.

**The PWA** — *not started.* The website, installable on a phone's home screen. It adds the daily
reminder, works offline, and holds the loop breaker and voice. There are no native iOS or Android
apps.

**The backend** — *not started.* One TypeScript service behind the website and PWA. It serves the
stories, holds accounts, syncs your wall between devices, sends the daily reminder and circle
messages, and pushes crisis-line updates to every device within the hour.

**The agent** — *not started.* You describe someone in a sentence, and it builds a copy of Hope By
Bit just for them. For example: *"For my grandmother. She loves gardening and birds, reads on a tablet, needs big text, and doesn't
want donation links."* The code here is the starting point it changes.

## Conventions

Functional and plain — values in, values out, effects at the edges, everyday TypeScript. Modular, so
each part is a thin shell around shared logic. Simple on purpose: a contributor should be able to
read a change with the vocabulary they already have.

Documents here stay under 200 lines. A document growing past that is two documents.

## License

Proposed: copyleft for the website, PWA and backend; permissive for the core and the agent's
templates. Still open, and the hardest decision here to revisit later.
