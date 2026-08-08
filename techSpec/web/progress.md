# Progress · The website

Spec: [ui.md](ui.md) · Cross-track view: [PROGRESS.md](../../PROGRESS.md)

`☐` not started · `◐` in progress · `☑` done · `⊘` waiting, on what's named

**Status: W1 in progress** — `apps/web`. Shell, tokens, both themes and `/` are up on a placeholder
story; everything below W1 is still specification.

| | | |
|---|---|---|
| ◐ | **W1** | Shell, tokens, both themes, `/` — budgets green, reads with JavaScript off |
| ☐ | **W2** | `/today` live from the backend |
| ☐ | **W3** | `/loop`, with the no-tracking check passing and crisis lines from config |
| ☐ | **W4** | `/standard` and the archive, with the first 30 stories and the rejection log |
| ☐ | **W5** | `/why/*` generated from the principles, drift test passing |
| ☐ | **W6** | Docs, where a stranger can bring up the backend and pipeline from them alone |
| ☐ | **W7** | `/account` — sign-in, sync, export, delete |

Onboarding on the website is **O7**, tracked in [techSpec/progress.md](../progress.md) with the
rest of the O milestones, since it spans this surface and the app.

## Budgets

Enforced in the build and checked at each milestone: at most 12KB of JavaScript on the main pages
and 8KB on the loop breaker, 120KB total per page, largest paint under 1.5 seconds on a mid-range
Android over 3G, at most two self-hosted fonts, zero third-party requests.

Current: `/today` ships **4.78KB gzip** initially, with `time-field.js` a **16.36KB gzip** chunk
fetched only at the onboarding step that needs it.
