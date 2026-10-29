# Progress

**Updated 2026-10-29 · The backend is up. Stories, config, accounts, sync and the nightly pipeline
run; the website reads today's story from them and has been tested end to end against it. The
circle and the check-in wait on paperwork.**

`☐` not started · `◐` in progress · `☑` done · `⊘` waiting, on what's named

**Why a file and not a project board.** It reviews in the same pull request as the work it
describes, so "done" and the code that made it done land together. It works offline. It has no
account, no seat cost, no vendor. And it survives the maintainer — someone cloning this in 2031 gets
the whole state of the project. Once more than three people are working here at once, these rows
become issues (the ids are stable so they import cleanly) and this file keeps the milestones and the
open decisions.

This page holds what spans tracks. Milestones live with the thing being built:

| Track | Milestones | Progress |
|---|---|---|
| Website | W1–W7 | [techSpec/web/progress.md](techSpec/web/progress.md) |
| App | M1–M9 | [techSpec/app/progress.md](techSpec/app/progress.md) |
| Agent | A1–A7 | [techSpec/agent/progress.md](techSpec/agent/progress.md) |
| Core, backend, onboarding | C1–C8, B1–B9, O1–O7 | [techSpec/progress.md](techSpec/progress.md) |

## 1. Now

Onboarding is the first flow being built — the Onboarding section of
[techSpec/app/ui.md](techSpec/app/ui.md).

| | | Why first |
|---|---|---|
| ◐ | **W1 · Website shell** | Astro up, tokens and both themes, `/` rendering the daily unit. W2 is done: `/today` is live from the backend. |
| ◐ | **A1 · Brief schema and prompt** | Schema, prompt file and tests in; D2 settled, so it was unblocked. |
| ◐ | **B2 · Crisis lines by region** | The mechanism ships; ten rows are seeded and none verified, so every region gets the fallback. **No code needed to finish it.** |
| ☐ | **C1 · Core types and interfaces** | Everything reaches into it, onboarding included. |
| ☐ | **C2 · Principle tests P1–P10** | Written *before* the surfaces, so the constraints stand while the code is still soft. |
| ☐ | **D9 · Start SMS registration** | B5 and B6 are written down and unbuildable until it clears. Days of filing, and nothing else moves it. |
| ☐ | **O1 · The five onboarding steps** | The first flow, and it settles the variant's shape. |
| ☐ | **D1 · License split** | Easiest to settle before contributors arrive. |

## 2. Review gates

Work that ships once these clear. Record sign-off here with a name and date.

| Gate | Covers | |
|---|---|---|
| **Grief counsellor sign-off** on all grief copy and interactions | M9, A7 | ☐ None identified. **Longest-lead item in the project — start before any code.** |
| **Crisis lines verified** per country by someone with local knowledge | C6, B2, W3, any release outside the US | ☐ 10 seeded, 0 verified |
| **Editorial dry run** — 30 real days reviewed before launch | W4, launch | ☐ |

## 3. Help wanted

1. **Crisis line rows.** One verified line per country. No code needed, and the highest-value thing
   available right now.
2. **Editorial judgement.** Forty real stories labelled accept or reject against
   [the bar](product/features.md). Needs judgement, not TypeScript.
3. **A qualified grief counsellor** willing to review the grief path — or an introduction to one.
4. **Multi-recipient messaging tested on real iPhones** ([why](techSpec/app/ui.md)).
5. **The breathing haptic pattern** — the one genuinely fiddly piece of native code here.

## 4. Open decisions

**D1 · License split.** Proposed: copyleft on the app, website and backend, so the product stays
open wherever it travels; permissive on the core and the agent's templates, so someone generating a
version for their dad keeps a free hand with a personal app. The tension: that makes a generated app
a mix of both, and the app template descends from the copyleft app. Either the templates get
dual-licensed deliberately, or everything goes permissive. **Settle before the first outside
contributor**, since revisiting it later needs everyone's consent.

**D2 · Custom channels — settled 2026-08-08, fixed for v1.** The eight stand. An interest outside
them maps to the nearest channel and the brief records the pair, so the agent tells the person what
cricket became. Open-ended channels would ask the pipeline to classify arbitrary topics and would
rethink "one reviewed story per channel per day", which is too much to carry before there is a
pipeline. Reversible: `mapped` in the schema records every substitution, so if this looks wrong in a
year, that list is the evidence for what the ninth channel should be. Still the most likely of these
to look wrong in a year.

**D3 · Where generated repos get their stories.** *Shapes A6.* The public feed by default (zero
setup, and a standing dependency on infrastructure this project funds) or their own backend
(self-contained, longer first run). Leaning public, recorded in the manifest, with `hope doctor`
reporting on it.

**D4 · What this project is.** *Shapes D1.* A personal project, a nonprofit under a fiscal sponsor,
or plain open source with a run-your-own path. Open source fits *I just want this to exist* best,
because it survives the maintainer stopping. Needs settling before anyone sends money for the
backend.

**D5 · End-to-end encryption of wall entries — dissolved 2026-08-09, not decided.** The question
was always about dedications: a recovery phrase the person keeps, with its own risk of a lost
record, against server-side encryption at rest. **The field came out of the backend instead.** With
no name someone is carrying in the schema there is nothing end-to-end encryption was protecting,
and the grief path has not cleared its counsellor gate — so a dedication column would have been
that path shipping ahead of its sign-off, which is the thing the gate exists to prevent. Same
reasoning as removing the "carrying" field from the website's onboarding on 2026-08-08: it
collected something with nowhere to go.

An entry is now a movement label and a date, which TLS and encryption at rest cover honestly.
**Dedications stay on the device that made them and sync nowhere**, which is a real cost — it is
[P9](product/principles.md) narrowed, and it returns with the gate. `setting.value` is the
remaining candidate for a column cipher, since it holds the chosen paths and the check-in message
in someone's own words; it goes in with B5, when the circle's numbers force a key-management story
anyway. Circle numbers were never in scope either way — the server sends the messages.

**D6 · Whether the twenty-second window stays.** *Shapes O5.* Automatic sending was chosen so that
someone past acting still gets help. The window keeps that — doing nothing sends — while giving a
misread count somewhere to go. It also means the closing screen names the circle at a moment when
attention is thin. Worth watching in the first real use, and cheap to remove.

**D7 · Messaging cost as a signal.** SMS is the one line that grows with distress rather than with
size, and the only one with no open substitute
([backend](techSpec/backend.md#what-it-costs)). A jump in it means either growth or a worse month
for a lot of people. Deciding how to tell those apart, without measuring individuals, is worth
thinking about before B6 rather than after.

**D8 · Whether the app ships before the website.** At ten people, Apple's $99/yr developer fee is
more than every other cost combined. Website first is about $7 a month and defers it; app first is
where the ritual actually works, since notifications, haptics and on-device voice all live there.
Leaning website first, with the app once there's someone waiting for it.

**D9 · Start SMS registration now.** 10DLC in the US, DLT in India, something else elsewhere — each
is days of paperwork rather than money, and each gates B5. Whichever country comes first, the
registration should be filed well before the code that needs it.

## 5. Log

- **2026-10-29 · Ran the website end to end against the live API.** `/bits/today` now falls back
  to the newest story on or before today — the same fallback the website builds with — instead of
  answering 404 on a night the pipeline didn't publish (`src/bits.test.ts` holds it).
  `docker-compose.yml` takes `DB_PORT` from `.env`, for a machine already running Postgres on 5432.
  A headless-Chrome pass at 390px and 1280px passed all 32 checks: onboarding through to the story,
  `/today` from the API same-origin, the swap when the API has a newer day, a 404 or a dead API
  leaving the built story readable, the dark theme, JavaScript off, and zero third-party requests.
  **Two things found, not yet fixed:** the fixed theme switch covers story text when scrolling on a
  phone (`apps/web/src/styles/theme-switch.css`), and there is no favicon, so every page logs a
  `/favicon.ico` 404.
- **2026-08-09 · The backend exists.** `apps/api` is a Hono service: stories and safety config
  (B1, B2), accounts by Google and emailed link (B3), sync (B4), and the nightly pipeline —
  fetch, keyword prefilter, Haiku classification against the five tests, a terminal review, and
  publish. **Stories and config answer with nothing configured at all**, so a fresh clone can
  `curl localhost:8787/bits/today` before it has a database, a key, or an account; `npm run dev`
  brings up Postgres and migrates for the rest. Written against Web-standard requests with the
  server in one file, so the deploy vendor stays undecided. Four dependencies — Hono, its Node
  server, `postgres`, and the `zod` already here. **B5 and B6 are deliberately absent**: their
  tables would be surface with no code behind them while D9 is unfiled, and a test fails if one
  appears. **B7 is absent too, so P9 is a promise the code does not keep yet** — said out loud in
  `SAFETY.md`, `backend.md` and `techSpec/progress.md` rather than left to read as shipped.
- **2026-08-09 · D5 dissolved: `entry` has no dedication.** See D5 above. Two canon corrections
  came with it. `architecture.md` claimed the backend already ran the shared core for merging; it
  doesn't — `@hope/core` isn't written, so the merge lives in `apps/api/src/sync/merge.ts` as a
  module importing nothing at all, which makes C8 a rename. And `backend.md`'s `keepsake` had no
  removal field while the paragraph above it said add and remove each carry a time; `removedAt` is
  in, because without it a device that never saw a removal resurrects the row on the next merge.
- **2026-08-09 · W2: `/today` is live from the backend.** The published day file renders at build
  time so the page still reads with JavaScript off, then a fetch of `/api/bits/today` swaps only
  when the date has moved — the HTML is from the last nightly build, so a tab left open overnight
  is showing *yesterday's* story rather than a different spelling of today's. **The API has to be
  same-origin at `/api/*`** — the zero-third-party-request rule requires it and no spec had
  recorded it — so development proxies it in `astro.config.mjs`, and the deploy rule waits until
  there is a deployed API rather than pointing at an address that would 502 while the page went on
  rendering. `/today` now ships about 6.6KB gzip against a 12KB budget. **Settled web/ui.md's
  first open question by not branching**: choosing today's story is one deterministic function of
  the date and a channel list, handed all eight signed out and three to five signed in, so the
  single edition falls out instead of being a special case.
- **2026-08-08** — Removed the "who or what you're carrying" name field from the website's
  onboarding step 2, along with its `state.carrying` and the summary suffix that showed it. Same
  reasoning as the auto check-in toggle: the name exists to be dedicated to, and the website has no
  wall and no dedications yet, so it collected something with nowhere to go. The paths themselves
  stay. **The app spec keeps the
  field** — it asks at M2, when there's a wall to dedicate against; `techSpec/app/ui.md` now records
  the web/app split explicitly so the two don't read as contradicting each other.
- **2026-08-08 · The word is grief, and that's the whole definition.** Every doc that glossed it —
  listing what does and doesn't count as a loss — now just says grief. Whoever taps it knows what
  they're carrying, and a list either misses their case or makes them audition for it. Files
  touched: `SAFETY.md`, `product/features.md`, `techSpec/app/ui.md`; onboarding copy was already
  clean.
- **2026-08-08 · Canon change, two parts.** **Grief is no longer written as bereavement.** The docs
  equated it with a person dying, which left anyone carrying a loss that isn't a death with no room
  in the product. `grief` stays unchanged as a **data value** (the brief schema,
  its tests, `path-grief/` templates, both `PATHS` arrays) — the word was always right; the reading
  was too narrow. The review gate is now **a qualified grief counsellor**, which widens who can sign
  off M9 and A7 without weakening the gate. The flagship agent example moved from *"widowed last
  spring"* to *"mum moved into care last spring"* — a real, non-death loss that still supports a
  dedication. **Deliberately kept:** the vaccine story's *"fewer deaths from any cause among
  vaccinated under-fives"* and its half-a-million baseline. That is the good news, and the content
  standard requires a real number against a baseline; softening it would fail our own test.
- **2026-08-08 · Tone is warm.** `features.md` read *"plain, specific, slightly under-warm — the
  subject supplies the feeling; the copy leaves room for it."* That rationale argued **for**
  coolness, so it went with the rule. Warmth replaces it and the shipped copy followed: *"That's
  today's bit."* → *"That's today's. See you tomorrow."*, *"your own evidence, not ours"* → *"proof
  you were here for it, and it belongs to you."* **The honesty guards all stay** — proportional
  praise, no hype or urgency or scarcity, real numbers, second person, present tense. Warm is in the
  welcome, not the volume, and the bad-day test still governs every line: kindness that ignores the
  day is not kindness.
- **2026-08-08** — Docs restructured into `product/` and `techSpec/`. `ARCHITECTURE.md` became
  `techSpec/architecture.md`, sitting with `backend.md` as the two cross-surface technical docs;
  per-surface specs moved into `techSpec/{agent,web,app}/`. `website.md` + `ui.md` merged into
  `web/ui.md`, `app.md` + `onboarding.md` into `app/ui.md`, both brought under the 200-line rule.
  Milestone tables split out of this file into a `progress.md` per track. Two canon/code drifts
  fixed while merging: the landing CTA points at `/today`, not the deleted `/account`, and Auto
  theme is 06:00/18:00 as implemented, not the 07:00/19:00 the spec claimed.
- **2026-08-08** — The onboarding time field is two Zag number-input machines plus an AM/PM toggle,
  replacing `<input type="time">` whose picker is an OS widget CSS can't restyle. Tailwind v4 and
  Phosphor icons added; React and Base UI rejected on budget (~44KB gzip for React alone against
  12KB). Zag is dynamic-imported, so `/today` still ships 4.78KB gzip initially.
- **2026-08-08** — Copy pass on the landing page: one CTA instead of two, dropped the "Free forever,
  no ads" line under the hero button, and evened out the one feature heading that read as a sentence
  fragment. A sitewide footer signature is now in `Base.astro`. **Trade-off worth flagging**:
  removing "Free forever, no ads" drops the page's only explicit no-cost reassurance near the CTA,
  and nothing replaced it.
- **2026-08-08** — Theme switch moved to a fixed top-right icon-only control reusing `.seg`.
  `color-scheme` added to all three theme blocks so native form chrome follows the site's theme.
  Removed the auto check-in toggle from the website's onboarding step 3 — it configures the loop
  breaker, which doesn't exist on the website yet; the app keeps it when O5 is built. **Deleted
  `/account`**: "Get started" goes straight to `/today`, which already runs onboarding on a first
  visit. `/account` returns at W7.
- **2026-08-08** — Restructured `apps/web`: `/` is a marketing landing page, `/today` is the app
  itself, running onboarding on a first visit and the daily unit after. Edited the website spec to
  match — canon has to move with the code or stop being the canon.
- **2026-08-08** — First code. `apps/web` is an Astro static site: shell, tokens carried over
  unchanged, Auto/Light/Dark landing before first paint, `/` rendering the daily unit. Two requests,
  none third-party, reads with JavaScript off. `tools/agent` has the brief schema, prompt file and
  nine tests. **Settled D2** the way this file leaned: eight fixed channels, substitutions recorded
  so the agent can say what it did — which unblocked A1. The schema carries no field for a crisis
  line, a streak, or loop-breaker counts, and a test holds that shut.
- **2026-08-07** — Onboarding specced as the first flow: five steps, interests required and the rest
  skippable, email as the identity. Theme gains Auto-by-clock. **Reversed the earlier split on the
  check-in:** the circle's numbers now live on the account, each member agrees by reply before being
  messaged, and a person can choose at setup — while calm — to have three loop-breaker runs in a day
  message their circle. P4 and P5 rewritten around it; run counts still stay on the phone. Costed
  for ten people at about $15 a month, most of it Apple's developer fee.
- **2026-08-07** — Specifications written: product, principles, architecture, contributing, safety,
  and four tech specs. Decided: the agent generates full codebases; voice runs on the device both
  ways; Expo, Astro, and a shared TypeScript backend on serverless; accounts sync the wall between
  devices while the loop breaker stays on the phone; the check-in hands off to the phone's own share
  sheet.
