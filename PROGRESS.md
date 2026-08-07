# Progress

**Updated 2026-08-07 · Specifications complete, no code written.**

`☐` not started · `◐` in progress · `☑` done · `⊘` waiting, on what's named

**Why a file and not a project board.** It reviews in the same pull request as the work it
describes, so "done" and the code that made it done land together. It works offline. It has no
account, no seat cost, no vendor. And it survives the maintainer — someone cloning this in 2031 gets
the whole state of the project. Once more than three people are working here at once, these rows
become issues (the ids are stable so they import cleanly) and this file keeps the milestones and the
open decisions.

## 1. Now

Onboarding is the first flow being built — [tech-spec/onboarding.md](tech-spec/onboarding.md).

| | | Why first |
|---|---|---|
| ☐ | **C1 · Core types and interfaces** | Everything reaches into it, onboarding included. |
| ☐ | **C2 · Principle tests P1–P10** | Written *before* the surfaces, so the constraints stand while the code is still soft. |
| ☐ | **O1 · The five onboarding steps** | The first flow, and it settles the variant's shape. |
| ☐ | **D2 · Custom channels** | Step 1 asks the question; the answer shapes the agent's schema. |
| ☐ | **D1 · License split** | Easiest to settle before contributors arrive. |

## 2. Milestones

Detail lives in the specs. This is the state.

**Core** — done at full coverage, standing alone, module boundaries clean.

| | | | | | |
|---|---|---|---|---|---|
| ☐ | C1 | Types, `Option`/`Result`, platform interfaces | ☐ | C5 | Voice matching and the word list |
| ☐ | C2 | Principle tests P1–P10 | ☐ | C6 | Crisis lines by region — **help wanted** |
| ☐ | C3 | Choosing, shrinking, recording, keeping, totals | ☐ | C7 | Variant schema, resolving, copy lookup |
| ☐ | C4 | Grounding evidence, the third-run offer | ☐ | C8 | Sync merge + in-memory test interfaces |

**Backend** — [tech-spec/backend.md](tech-spec/backend.md)

| | | | | | |
|---|---|---|---|---|---|
| ☐ | B1 | Pipeline output published, `/bits/today` live | ☐ | B6 | Check-in: both reasons, rate limits, wording |
| ☐ | B2 | Config: crisis lines by region | ☐ | B7 | Export and delete, releasing the circle |
| ☐ | B3 | Accounts: Google and email links | ☐ | B8 | The daily review tool |
| ☐ | B4 | Sync: merge shapes, two devices offline | ☐ | B9 | Self-hosting from the docs alone |
| ☐ | B5 | Circle: storage, intros, YES and STOP | | | |

**Onboarding** — [tech-spec/onboarding.md](tech-spec/onboarding.md)

| | | | | | |
|---|---|---|---|---|---|
| ☐ | O1 | The five steps, accumulating and resuming | ☐ | O5 | The automatic check-in setting |
| ☐ | O2 | Contact picker, intros, consent state | ☐ | O6 | Theme: Auto on the clock, matching first paint |
| ☐ | O3 | Google and email sign-in, one account | ☐ | O7 | Onboarding on the website |
| ☐ | O4 | First-sign-in upload and merge | | | |

**App** — [tech-spec/app.md](tech-spec/app.md)

| | | | | | |
|---|---|---|---|---|---|
| ☐ | M1 | Shell and Today | ☐ | M6 | Notification, deep link, shortcut |
| ☐ | M2 | Ladder, wall, Keepsakes, storage | ☐ | M7 | Stories, signatures, config |
| ☐ | M3 | Loop breaker, visual and haptic | ☐ | M8 | Sign-in and sync |
| ☐ | M4 | Voice out, then voice in | ⊘ | M9 | Grief path — **on** sign-off |
| ☐ | M5 | Check in and share — needs real devices | | | |

**Website** — [tech-spec/website.md](tech-spec/website.md)

| | | | | | |
|---|---|---|---|---|---|
| ☐ | W1 | Shell, tokens, both themes, `/` | ☐ | W5 | `/why/*` generated from the principles |
| ☐ | W2 | `/today` live from the backend | ☐ | W6 | Docs and self-hosting guide |
| ☐ | W3 | `/loop` and the no-tracking check | ☐ | W7 | `/account` — sign-in, sync, export, delete |
| ☐ | W4 | `/standard` and the archive | | | |

**Agent** — [tech-spec/agent.md](tech-spec/agent.md)

| | | | | | |
|---|---|---|---|---|---|
| ⊘ | A1 | Brief, prompt, tests — **on** D2 | ☐ | A5 | Mobile and API templates |
| ☐ | A2 | Plan and render, web template | ☐ | A6 | Manifest, upgrade, doctor |
| ☐ | A3 | Principle checks, all ten | ⊘ | A7 | Path templates — **on** sign-off |
| ☐ | A4 | Copy generation and tone check | | | |

## 3. Review gates

Work that ships once these clear. Record sign-off here with a name and date.

| Gate | Covers | |
|---|---|---|
| **Bereavement counsellor sign-off** on all grief copy and interactions | M9, A7 | ☐ None identified. **Longest-lead item in the project — start before any code.** |
| **Crisis lines verified** per country by someone with local knowledge | C6, B2, W3, any release outside the US | ☐ 10 seeded, 0 verified |
| **Editorial dry run** — 30 real days reviewed before launch | W4, launch | ☐ |

## 4. Help wanted

1. **Crisis line rows.** One verified line per country. No code needed, and the highest-value thing
   available right now.
2. **Editorial judgement.** Forty real stories labelled accept or reject against
   [the bar](PRODUCT.md). Needs judgement, not TypeScript.
3. **A bereavement counsellor** willing to review the grief path — or an introduction to one.
4. **Multi-recipient messaging tested on real iPhones** ([why](tech-spec/app.md)).
5. **The breathing haptic pattern** — the one genuinely fiddly piece of native code here.

## 5. Open decisions

**D1 · License split.** Proposed: copyleft on the app, website and backend, so the product stays
open wherever it travels; permissive on the core and the agent's templates, so someone generating a
version for their dad keeps a free hand with a personal app. The tension: that makes a generated app
a mix of both, and the app template descends from the copyleft app. Either the templates get
dual-licensed deliberately, or everything goes permissive. **Settle before the first outside
contributor**, since revisiting it later needs everyone's consent.

**D2 · Custom channels.** *Shapes A1.* The agent's example prompt asks for cricket, one step outside
the eight. Either unknown interests map to the nearest channel and the agent says so, or channels
become open-ended — which asks the pipeline to classify arbitrary topics and rethinks "one reviewed
story per channel per day". Leaning fixed for v1. Most likely of these to look wrong in a year.

**D3 · Where generated repos get their stories.** *Shapes A6.* The public feed by default (zero
setup, and a standing dependency on infrastructure this project funds) or their own backend
(self-contained, longer first run). Leaning public, recorded in the manifest, with `hope doctor`
reporting on it.

**D4 · What this project is.** *Shapes D1.* A personal project, a nonprofit under a fiscal sponsor,
or plain open source with a run-your-own path. Open source fits *I just want this to exist* best,
because it survives the maintainer stopping. Needs settling before anyone sends money for the
backend.

**D5 · End-to-end encryption of wall entries.** *Shapes B4, so decide before the schema lands.*
Entries hold dedications, which makes this worth a real answer. Passwordless sign-in leaves no
password to derive a key from, so the honest options are a recovery phrase the person keeps — with
its own risk of a lost record — or server-side encryption at rest, which is what's specced today.
Circle numbers sit outside this either way, since the server sends the messages.

**D6 · Whether the twenty-second window stays.** *Shapes O5.* Automatic sending was chosen so that
someone past acting still gets help. The window keeps that — doing nothing sends — while giving a
misread count somewhere to go. It also means the closing screen names the circle at a moment when
attention is thin. Worth watching in the first real use, and cheap to remove.

**D7 · Messaging cost as a signal.** SMS is the one line that grows with distress rather than with
size, and the only one with no open substitute
([backend](tech-spec/backend.md#what-it-costs)). A jump in it means either growth or a worse month
for a lot of people. Deciding how to tell those apart, without measuring individuals, is worth
thinking about before B6 rather than after.

**D8 · Whether the app ships before the website.** At ten people, Apple's $99/yr developer fee is
more than every other cost combined. Website first is about $7 a month and defers it; app first is
where the ritual actually works, since notifications, haptics and on-device voice all live there.
Leaning website first, with the app once there's someone waiting for it.

**D9 · Start SMS registration now.** 10DLC in the US, DLT in India, something else elsewhere — each
is days of paperwork rather than money, and each gates B5. Whichever country comes first, the
registration should be filed well before the code that needs it.

## 6. Log

- **2026-08-07** — Onboarding specced as the first flow: five steps, interests required and the
  rest skippable, with email as the identity and Google sign-in alongside an emailed link. Theme
  gains Auto-by-clock with Light and Dark holding. **Reversed the earlier split on the check-in:**
  the circle's numbers now live on the account, each member agrees by reply before they can be
  messaged, and a person can choose at setup — while calm — to have three loop-breaker runs in a day
  message their circle on their behalf. P4 and P5 rewritten around it; run counts still stay on the
  phone. Costed for the real starting size — ten people on free and starter plans, about $15 a
  month, most of it Apple's developer fee — with an open alternative listed for every paid service.
- **2026-08-07** — Specifications written: product, principles, architecture, contributing, safety,
  and four tech specs. Decided: the agent generates full codebases; voice runs on the device in both
  directions; Expo, Astro, and a shared TypeScript backend on serverless; accounts sync the wall
  between devices while the loop breaker stays on the phone; the check-in hands off to the phone's
  own share sheet. Rewrote every document to state what the product does. Prototype at
  `prototype/hope-by-bit.html`.
