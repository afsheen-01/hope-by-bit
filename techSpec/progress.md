# Progress · Core, backend and onboarding

The three tracks with no surface folder of their own. Per-surface progress lives in
[agent/](agent/progress.md), [web/](web/progress.md) and [app/](app/progress.md); the cross-track
view is [PROGRESS.md](../PROGRESS.md).

`☐` not started · `◐` in progress · `☑` done · `⊘` waiting, on what's named

## Core

Spec: [architecture.md](architecture.md). Done at full coverage, standing alone, module boundaries
clean.

| | | | | | |
|---|---|---|---|---|---|
| ☐ | C1 | Types, `Option`/`Result`, platform interfaces | ☐ | C5 | Voice matching and the word list |
| ☐ | C2 | Principle tests P1–P10 | ☐ | C6 | Crisis lines by region — **help wanted** |
| ☐ | C3 | Choosing, offering actions, recording, keeping, totals | ☐ | C7 | Variant schema, resolving, copy lookup |
| ☐ | C4 | Grounding evidence, the third-run offer | ☐ | C8 | Sync merge + in-memory test interfaces |

**C2 comes early on purpose** — the principle tests are written *before* the surfaces, so the
constraints stand while the code is still soft.

## Backend

Spec: [backend.md](backend.md).

| | | | | | |
|---|---|---|---|---|---|
| ☐ | B1 | Pipeline output published, `/bits/today` live | ☐ | B6 | Check-in: both reasons, rate limits, wording |
| ☐ | B2 | Config: crisis lines by region | ☐ | B7 | Export and delete, releasing the circle |
| ☐ | B3 | Accounts: Google and email links | ☐ | B8 | The daily review tool |
| ☐ | B4 | Sync: merge shapes, two devices offline | ☐ | B9 | Self-hosting from the docs alone |
| ☐ | B5 | Circle: storage, intros, YES and STOP | | | |

**B5 is gated on paperwork, not code** — SMS registration (10DLC in the US, DLT in India) is days
of filing per country and should start well before the code that needs it ([D9](../PROGRESS.md#4-open-decisions)).

## Onboarding

Spec: the Onboarding section of [app/ui.md](app/ui.md). Spans the app, the website and the backend,
so it is tracked here rather than under one surface.

| | | | | | |
|---|---|---|---|---|---|
| ☐ | O1 | The five steps, accumulating and resuming | ☐ | O5 | The automatic check-in setting |
| ☐ | O2 | Contact picker, intros, consent state | ☐ | O6 | Theme: Auto on the clock, matching first paint |
| ☐ | O3 | Google and email sign-in, one account | ◐ | O7 | Onboarding on the website |
| ☐ | O4 | First-sign-in upload and merge | | | |

**O7 is partly built.** The website runs the five questions on a first visit to `/today`. The
automatic check-in setting is deliberately absent there — it configures the loop breaker, which the
website doesn't ship yet; the app keeps it when O5 lands.

**O6 is partly built.** Auto-by-clock and matching first paint work on the website; the app half
waits on M1.
