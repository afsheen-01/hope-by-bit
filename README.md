# Hope By Bit

**One good thing. One small thing. Every day.**

A daily ritual. One piece of genuinely good news matched to what you care about, one small thing you
can do about it, and a growing record that the world — and you — are still moving.

Free forever.

---

## What's here

This is the product canon. Everything built under this name — the app, the website, the backend, and
anything the agent generates — comes from these documents. Where the code and the canon disagree,
the canon is right and the code is a bug.

**`product/`** — what this is, and the rules it holds to.

| | |
|---|---|
| [features.md](product/features.md) | The daily unit, Keepsakes, the wall, the two hard-moment buttons, the grief path, the content standard, the tone. |
| [principles.md](product/principles.md) | Ten rules, each written so a machine can confirm it. The agent generates code that satisfies all ten. |
| [designSystem.md](product/designSystem.md) | The spacing scale, the proximity rule, and where colour and type tokens live. |

**Root** — binding everywhere, or about working here.

| | |
|---|---|
| [SAFETY.md](SAFETY.md) | The crisis boundary, the grief review gate, the check-in circle, and how user data is held. |
| `apps/web/` | The website: Astro pages, Svelte components in `src/components/`, logic in `src/lib/` (imported as `#/…`), tests in `tests/`. Run `pnpm install && pnpm dev`. `dev` and `build` run `pnpm verify` first (Prettier, ESLint, type checks); `pnpm format` fixes formatting; `pnpm test` runs the tests. |

## The four surfaces

**The agent** takes a sentence — *"a version for my dad, mum moved into care last spring, cricket
and birdwatching, big text, keep the donation asks out"* — and generates a complete standalone repo
tuned to that person. What ships here is boilerplate, built to be overridden.

**The app** is Expo, on iOS and Android. It owns the ritual: the morning notification, haptics,
voice, and the loop breaker. Local-first, so it works offline for as long as you like.

**The website** is static Astro with Svelte components. It is the front door, the public record of
the editorial standard, the self-hosting docs, and the full product for anyone who reads in a
browser.

**The backend** is one TypeScript service behind the app and the site: the stories, your account,
sync of your wall between devices, and safety config that reaches every device within the hour.

All four use the same core, which is where the thinking lives.

## Conventions

Functional and plain — values in, values out, effects at the edges, everyday TypeScript. Modular, so
each surface is a thin shell around shared logic. Simple on purpose: a contributor should be able to
read a change with the vocabulary they already have.

Documents here stay under 200 lines. A document growing past that is two documents.

## Status

The product documents are complete, and the first code is in: `apps/web`, with a landing page at
`/` and the daily unit at `/today` on a placeholder story, plus first-visit onboarding. The two
things that would move this furthest need no code at all: verified crisis lines per country, and a
qualified grief counsellor willing to review the grief path.

## License

Proposed: copyleft for the app, website and backend; permissive for the core and the agent's
templates. Still open, and the hardest decision here to revisit later.
