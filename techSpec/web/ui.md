# Tech spec · The website

**Astro, static, reading from the shared backend. The front door, the public editorial record, and
a way to read today's story with a browser and nothing else.**

Four jobs: explain what this is, honestly; publish today's story, free, in any browser; publish the
editorial standard and the decisions behind it, in the open; and document self-hosting and the
agent, so the project stays runnable by someone other than us.

Status: **W1 in progress** — `apps/web`. Shell, tokens, both themes and `/` are up on a placeholder
story. Milestones in [progress.md](progress.md).

## Stack

Astro, because the site is mostly documents and documents should arrive fast. Interactive work
lives in four small pieces of plain TypeScript. Content is typed and checked at build. Styling is
plain CSS with the same design tokens as the app, both themes. Domain logic comes from the shared
core; stories, config and sync come from the [backend](../backend.md). Hosted static, rebuilt
nightly when the pipeline publishes, with today's story fetched live so a correction lands
immediately.

Pages carry their own content and the site's own styles, which is what keeps them quick and
private.

## Pages

**`/`** — a marketing landing page: hero, a features section (the daily unit, keep and the wall,
break the loop, check in), one CTA into the app at `/today`. **Changed 2026-08-08** from the
earlier design, where the hero was the live story itself — that page still exists, moved to
`/today`, which is where someone lands once they're in rather than where they decide whether to be.
Copy holds to [the tone](../../product/features.md#tone) regardless of section.

**`/today`** — the daily unit in a browser: headline, number, body, source, the day's movements and
the bottom of the session. Signed out, channel choices live in the browser and are picked inline,
and Keepsakes and the wall work there too with one-tap export. **Signing in brings your record from
the phone**, and the same wall, Keepsakes and settings appear here
([P9](../../product/principles.md)). This is the full product for everyone who reads on a browser —
a large group, and the one this matters most for. **A first visit runs onboarding first** (O7);
every visit after lands here directly. The story renders server-side either way, so the page reads
with JavaScript off even before onboarding has run.

**`/loop`** — the full three-step sequence: breath, one of your own saved stories (or, for a first
visitor, a clearly labelled example), one sensory question.

- The sequence reads as plain text with JavaScript off, so someone on a locked-down machine still
  gets the words.
- Vibration carries the cadence where the browser offers it; sight and sound carry it everywhere.
  Read-aloud runs locally.
- Voice input arrives as browsers gain on-device recognition, and the page says where that stands.
- The crisis line, matched to region, from config.
- **This page ships the sequence and the styles it needs**, which a build check confirms, so the
  session stays with the person ([P4](../../product/principles.md)).

**`/standard`** — the five tests from [the content standard](../../product/features.md), with worked
examples of accepting and rejecting, and a rolling log of real rejections with reasons: *"Study
suggests optimism may extend life — rejected, nothing happened."* This page is the credibility of
the whole product: a reader should finish it able to predict our verdicts themselves.

**`/bits/[date]`** — every story published, permanently, with sources, individually linkable so one
can be sent to someone who reads it and nothing else. Browsable by channel and date. A library,
sitting apart from the daily path, where [P1](../../product/principles.md) governs.

**`/why/*`** — short pieces: why one story, why totals, why sending is a tap, why free. Generated
from `principles.md` so they stay true to the rules being enforced. Also the recruiting surface: the
people who'd be good contributors are the ones who read *why totals* and recognise something.

**`/docs/*`** — running the backend and pipeline, self-hosting, using the agent, the variant
options, the core's functions, how to contribute. Generated from the repo so it stays current. Plus
**`/privacy`**, short enough to actually read, and **`/account`** for sign-in, export and delete —
which returns at W7; the landing CTA goes straight to `/today` until then.

## The four interactive pieces

Everything else is static HTML. **Read aloud** — local speech synthesis, same segments and pause
around the number as the app. **Loop breaker** — the sequence, its timers, the breathing animation
(respecting reduced motion), vibration where available, reading saved stories locally; it loads
immediately. **Handoff** — the share sheet with the pre-written message, falling back to a message
link and then to copying it, on a tap. **Account** — passkey or emailed link, then sync, on the
pages that use it.

## Building the UI

Governs new interactive markup only; existing screens stay on
`tokens.css`/`site.css`/`screen.css`/`onboarding.css`.

**Tailwind CSS v4** as a Vite plugin (`@tailwindcss/vite`, not the older `@astrojs/tailwind`).
Utilities live in `src/styles/tailwind.css`, imported per-page, so pages that don't use it pay
nothing. Two rules keep it from becoming a second design system:

- **No preflight** — the import list omits `tailwindcss/preflight.css`, so Tailwind's reset never
  fights `site.css`'s own.
- **`@theme inline` maps to existing tokens, not new values.** `bg-fill-2` emits
  `var(--color-fill-2)` → `var(--fill-2)`, the same property `[data-theme]` already flips. One set
  of tokens; Tailwind is just a fast way to spell them.

**Zag.js** (`@zag-js/vanilla` + one package per component) for anything needing real interaction
logic — keyboard handling, clamping, focus, ARIA. Framework-agnostic state machines driving real
DOM nodes, no framework runtime. See `src/scripts/time-field.js` for the mount pattern:
`new VanillaMachine(...)` → `connect(...)` → `spreadProps` in a `render()` that re-runs on
`machine.subscribe`.

**Pass `defaultValue`, not `value`**, unless something outside the machine must force state.
`value` makes the input controlled, so the machine's own increment/decrement become no-ops against
it — no `subscribe` fires, no re-render, and the displayed number never moves with no error to
explain it.

**Phosphor icons** (`@phosphor-icons/core`) instead of hand-drawn SVG paths, imported inline via
Vite's `?raw` suffix: `import sun from "@phosphor-icons/core/assets/regular/sun.svg?raw"`. No React
wrapper needed; the site has no React.

**Prefer native controls first.** Check whether plain HTML plus `color-scheme` does the job before
reaching for a widget library. **React and Base UI were rejected** — Base UI is React-only, and
React + react-dom alone measure ~44KB gzip against a 12KB budget. Zag gives the same headless value
with no runtime.

**Anything Zag-sized gets a dynamic import.** Its number-input machine is 16.36KB gzip built —
larger than the untreeshaken estimate — so `onboarding.js` imports `time-field.js` only at the step
that needs it. Result: `/today` ships 4.78KB gzip initially, with the rest fetched on demand. Any
future Zag-backed control follows the same shape.

**The time field** is two Zag number-input machines plus two plain buttons for AM/PM (a two-way
toggle needs no state machine), reusing `screen.css`'s `.seg`. It replaced `<input type="time">`,
whose picker is an OS widget CSS can't restyle — it rendered light over a dark page. Scoping
`.field input` to `.field > input` matters here: the generic rule was padding the nested inputs
until their values clipped.

## Theme

**Auto follows the local clock**, not `prefers-color-scheme`: light from 06:00, dark from 18:00,
both hours adjustable. Set in two places that must agree — `Base.astro`'s inline pre-paint script
(runs before first paint, so no flash, and can't import) and `theme-switch.js`'s `autoTheme()`,
which a 15-minute interval re-runs so a long-open tab follows the boundary.

`prefers-color-scheme` remains the **no-JavaScript fallback only**: `tokens.css`'s dark block is
gated on it, and with JS off `[data-theme]` is never set, so the OS signal rules instead of the
clock. The fixed window is not real sunrise/sunset — marked `ponytail:` in `theme-switch.js`, with
a geolocation calc as the upgrade path behind the same call site.

## Performance and privacy

Enforced in the build: at most 12KB of JavaScript on the main pages and 8KB on the loop breaker,
120KB total per page, largest paint under 1.5 seconds on a mid-range Android over 3G, at most two
self-hosted fonts. Rebuilt nightly, only the affected pages. The reading experience holds up with
JavaScript off.

Requests go to our own backend and the CDN, which a strict content policy and a build check both
confirm. Signed out, what you keep lives in the browser, exportable from the page that uses it.
Signed in, it lives with your account under [SAFETY.md](../../SAFETY.md), and delete clears both in
one call. Traffic numbers, where wanted, come from server logs with addresses discarded on arrival
and the loop breaker left out.

## Open questions

1. ~~**Does `/today` need per-person channels signed out?**~~ **Settled 2026-08-09 by not
   branching.** Choosing today's story is one pure function of the date and a list of channels,
   deterministic and with no per-person state. Signed out it is handed all eight, signed in the
   three to five they picked — so the single edition falls out rather than being a special case,
   and the page has nothing to switch on.
2. **The archive and the daily path.** A library is right; keeping it clearly a library, one that
   invites a visit rather than a session, needs a design pass of its own.
3. **Where the prototype lives.** Useful for contributors, so probably `/prototype`, clearly
   labelled as a sketch, linked from the docs.
