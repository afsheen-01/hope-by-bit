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

## The four surfaces

**The website** — *built, in progress.* Static Astro with Svelte components, in `apps/web/`. It has a
landing page at `/`, today's story at `/today` (placeholder content for now), and onboarding on the
first visit.

**The app** — *not started.* An Expo app for iOS and Android. It sends the daily reminder and holds
the loop breaker, voice and haptics. It works offline.

**The backend** — *not started.* One TypeScript service for the app and the website. It serves the
stories, holds accounts, syncs your wall between devices, and sends crisis-line updates to every
device within the hour.

**The agent** — *not started.* You describe someone in a sentence, and it builds a copy of Hope By
Bit just for them. For example: *"For my grandmother. She loves gardening and birds, reads on a tablet, needs big text, and doesn't want donation links."* The code here is the starting point it
changes.

Once there is more than one surface, they will share one core of logic.

## Conventions

Functional and plain — values in, values out, effects at the edges, everyday TypeScript. Modular, so
each surface is a thin shell around shared logic. Simple on purpose: a contributor should be able to
read a change with the vocabulary they already have.

Documents here stay under 200 lines. A document growing past that is two documents.

## License

Proposed: copyleft for the app, website and backend; permissive for the core and the agent's
templates. Still open, and the hardest decision here to revisit later.
