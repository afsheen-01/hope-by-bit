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

| | |
|---|---|
| [PRODUCT.md](PRODUCT.md) | What it is: the daily unit, Keepsakes, the wall, the two hard-moment buttons, the grief path, the content standard, the tone. |
| [PRINCIPLES.md](PRINCIPLES.md) | Ten rules, each written so a machine can confirm it. The agent generates code that satisfies all ten. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | The shared core, what it asks of each platform, and how four surfaces share one brain. |
| [SAFETY.md](SAFETY.md) | The crisis boundary, the grief review gate, the check-in circle, and how user data is held. Binding everywhere. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to write code and prompts here. Read before your first change. |
| [PROGRESS.md](PROGRESS.md) | The tracker — what's next, what's blocked, what's undecided. |
| [tech-spec/](tech-spec/) | [agent](tech-spec/agent.md), [app](tech-spec/app.md), [website](tech-spec/website.md), [backend](tech-spec/backend.md), and [onboarding](tech-spec/onboarding.md), which spans all four. |
| [prototype/](prototype/) | The clickable prototype. Shows the feel; the canon is what holds. |

## The four surfaces

**The agent** takes a sentence — *"a version for my dad, widowed last year, cricket and
birdwatching, big text, keep the donation asks out"* — and generates a complete standalone repo
tuned to that person. What ships here is boilerplate, built to be overridden.

**The app** is Expo, on iOS and Android. It owns the ritual: the morning notification, haptics,
voice, and the loop breaker. Local-first, so it works offline for as long as you like.

**The website** is Astro, static. The front door, the public record of the editorial standard, the
self-hosting docs, and the full product for anyone who reads in a browser.

**The backend** is one TypeScript service behind the app and the site: the stories, your account,
sync of your wall between devices, and safety config that reaches every device within the hour.

All four use the same core, which is where the thinking lives.

## Conventions

Functional and plain — values in, values out, effects at the edges, everyday TypeScript. Modular, so
each surface is a thin shell around shared logic. Simple on purpose: a contributor should be able to
read a change with the vocabulary they already have. Details in
[CONTRIBUTING.md](CONTRIBUTING.md).

Documents here stay under 200 lines. A document growing past that is two documents.

## Status

Specification stage. See [PROGRESS.md](PROGRESS.md) for what's next and where help is wanted. The
two things that would move this furthest need no code at all: verified crisis lines per country, and
a bereavement counsellor willing to review the grief path.

## License

Proposed: copyleft for the app, website and backend; permissive for the core and the agent's
templates. Still open, and the hardest decision here to revisit later — see
[PROGRESS.md](PROGRESS.md#5-open-decisions).
