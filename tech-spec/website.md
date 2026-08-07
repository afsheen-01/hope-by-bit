# Tech spec · The website

**Astro, static, reading from the shared backend. The front door, the public editorial record, and
a way to read today's story with a browser and nothing else.**

Four jobs: explain what this is, honestly; publish today's story, free, in any browser; publish the
editorial standard and the decisions behind it, in the open; and document self-hosting and the
agent, so the project stays runnable by someone other than us.

Status: **specification**. No code written.

## Stack

Astro, because the site is mostly documents and documents should arrive fast. Interactive work
lives in four small pieces of plain TypeScript. Content is typed and checked at build. Styling is
plain CSS with the same design tokens as the app, both themes. Domain logic comes from the shared
core, and stories, config, and sync come from the [backend](backend.md). Hosted static, rebuilt
nightly when the pipeline publishes, with today's story fetched live so a correction lands
immediately.

Pages carry their own content and the site's own styles, which is what keeps them quick and
private.

## Pages

**`/`** — the hero is the actual story of the day, live: today's real headline and number,
rendered the way the product renders them, with the action underneath. Someone lands here and has
used the product before deciding to. Below that, what it is, the two hard-moment buttons explained,
and the shape of the daily ritual. The page earns trust by being the thing rather than describing
it.

**`/today`** — the daily unit in a browser: headline, number, body, source, the ladder, and the
bottom of the session. Signed out, channel choices live in the browser and are picked inline, and
Keepsakes and the wall work there too with one-tap export. **Signing in brings your record from the
phone**, and the same wall, Keepsakes and settings appear here ([P9](../PRINCIPLES.md)). This is
the full product for everyone who reads on a browser — a large group, and the one this matters most
for.

**`/loop`** — the full three-step sequence: breath, one of your own saved stories (or, for a first
visitor, a clearly labelled example), one sensory question.

- The sequence reads as plain text with JavaScript off, so someone on a locked-down machine still
  gets the words.
- Vibration carries the cadence where the browser offers it; sight and sound carry it everywhere.
  Read-aloud runs locally.
- Voice input arrives as browsers gain on-device recognition, and the page says where that stands.
- The crisis line, matched to region, from config.
- **This page ships the sequence and the styles it needs**, which a build check confirms, so the
  session stays with the person ([P4](../PRINCIPLES.md)).

**`/standard`** — the five tests from [the content standard](../PRODUCT.md), with worked examples of
accepting and rejecting, and a rolling log of real rejections with reasons: *"Study suggests
optimism may extend life — rejected, nothing happened."* This page is the credibility of the whole
product: a reader should finish it able to predict our verdicts themselves.

**`/bits/[date]`** — every story published, permanently, with sources, individually linkable so one
can be sent to someone who reads it and nothing else. Browsable by channel and date. A library,
sitting apart from the daily path, where [P1](../PRINCIPLES.md) governs.

**`/why/*`** — short pieces: why one story, why totals, why sending is a tap, why free. Generated
from `PRINCIPLES.md` so they stay true to the rules being enforced. Also the recruiting surface: the
people who'd be good contributors are the ones who read *why totals* and recognise something.

**`/docs/*`** — running the backend and pipeline, self-hosting, using the agent, the variant
options, the core's functions, how to contribute. Generated from the repo so it stays current. Plus
**`/privacy`**, short enough to actually read, and **`/account`** for sign-in, export, and delete.

## The four interactive pieces

Everything else is static HTML. **Read aloud** — local speech synthesis, same segments and pause
around the number as the app. **Loop breaker** — the sequence, its timers, the breathing animation
(respecting reduced motion), vibration where available, reading saved stories locally; it loads
immediately. **Handoff** — the share sheet with the pre-written message, falling back to a message
link and then to copying it, on a tap. **Account** — passkey or emailed link, then sync, on the
pages that use it.

## Performance and privacy

Enforced in the build: at most 12KB of JavaScript on the main pages and 8KB on the loop breaker,
120KB total per page, largest paint under 1.5 seconds on a mid-range Android over 3G, at most two
self-hosted fonts. Rebuilt nightly, only the affected pages. Both themes, following the system with
a manual toggle. The reading experience holds up with JavaScript off.

Requests go to our own backend and the CDN, which a strict content policy and a build check both
confirm. Signed out, what you keep lives in the browser, exportable from the page that uses it.
Signed in, it lives with your account under [SAFETY.md](../SAFETY.md), and delete clears both in one
call. Traffic numbers, where wanted, come from server logs with addresses discarded on arrival and
the loop breaker left out.

## Milestones

**W1** shell, tokens, both themes and `/` — budgets green, reads with JavaScript off. **W2**
`/today` live from the backend. **W3** `/loop`, with the no-tracking check passing and crisis lines
from config. **W4** `/standard` and the archive, with the first 30 stories and the rejection log.
**W5** `/why/*` generated from the principles, drift test passing. **W6** docs, where a stranger can
bring up the backend and pipeline from them alone. **W7** `/account` — sign-in, sync, export,
delete.

## Open questions

1. **Does `/today` need per-person channels signed out?** One well-chosen story for everyone is
   simpler and arguably better journalism, with personalization arriving when you sign in. Leaning
   toward the single edition for signed-out visitors.
2. **The archive and the daily path.** A library is right; keeping it clearly a library, one that
   invites a visit rather than a session, needs a design pass of its own.
3. **Where the prototype lives.** Useful for contributors, so probably `/prototype`, clearly
   labelled as a sketch, linked from the docs.
