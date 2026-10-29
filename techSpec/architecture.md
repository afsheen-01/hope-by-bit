# Architecture

One rule: **pure core, imperative shell.**

All the thinking lives in `@hope/core` as plain functions over plain data. Everything that touches
the world — storage, network, speech, haptics, notifications, sharing, the clock, randomness — is
an interface the core asks for and each platform provides. The core stands alone with no imports at
all. That's what makes four surfaces from one brain possible, and what makes it testable without a
simulator.

```
                @hope/core          stands alone
     ┌───────────────┼───────────────┐
@hope/variant   @hope/adapters-*   apps/api
overrides       expo · web · node  stories · accounts · sync · config
     └───────┬───────┴───────┬───────┘
       tools/agent    apps/mobile · apps/web
```

Dependencies point inward. The core sits at the centre and everything else reaches in — a lint rule
holds that shape, because it's the one boundary whose loss would quietly undo the design. The
backend runs the same core server-side, which is why it's TypeScript.

## The core

Plain TypeScript, standing alone. Everything exported is a type, a pure function, or an interface.
Types are readonly throughout, with unions carrying the shape:

```ts
type Action =
  | { kind: "move"; ask: string; seconds: number | null }
  | { kind: "send" | "keep"; ask: string }
  | { kind: "give" | "join"; ask: string; url: Url };

type WallEntry = Readonly<{
  id: EntryId; at: Instant; what: string; bit: BitId | null;
}>;
```

A wall entry carries what happened and when, and that's all it carries — which is how
[P7](../product/principles.md) is held by the type rather than by discipline. It carried a
dedication until 2026-08-09; that field now lives only on the device, and comes back when the grief
path clears its review gate ([D5](../PROGRESS.md#4-open-decisions)).

Functions take values and return values: choosing today's story; offering the day's actions; recording one;
keeping one; finding grounding evidence; deciding whether to offer the third-run check-in; matching
what was heard against the voice list; totalling the wall; merging two devices' records.

`dailyActions` always returns two or three, all of them `move` — body-sized, free, and finishable in
the next minute, so one is always reachable. `give` and `join` stay in the union because they still
exist, but they belong to a kept story rather than to the day ([PRODUCT.md](../product/features.md)).

Failure uses two small types, about forty lines: `Option` for a value that may be absent, `Result`
for a failure we expect. Plain TypeScript throughout, so a contributor can read a change with the
vocabulary they already have. Throwing stays for bugs.

**What the core asks the platform for:** the time and a seed; reading and writing a key; fetching
stories, config, and sync; `speak(utterance)` and `listen(lexicon) → intent`; `fire(hapticEvent)`
and `breathe(phase)`; scheduling the one daily reminder; handing a message to the share sheet.

Two details matter. `listen` takes a fixed list and returns one of it, which is how the closed
vocabulary is guaranteed by the shape rather than by intent. And `fire` takes a meaning (`confirm`,
`settle`), so surfaces speak in product terms and the adapter decides what the hardware does.

Testing is fixtures and property tests against in-memory versions of each interface: a frozen
clock, a seeded random, a map-backed store, a haptics recorder. 100% branch coverage here; it's a
few hundred lines of pure functions, so the number is reachable.

## Variant — the override surface

Everything a self-hoster or the agent can change as data: channels, paths, the day's movements,
whether give and join appear on kept stories, voice, haptics, text scale, the circle and its
message, copy, theme.

`resolveVariant(base, overrides)` is one pure function with a schema check, used by the app at
runtime and the agent at generation time — one code path, one set of tests. Every user-visible
string goes through `copy(variant, key, fallback)`, which is what makes overriding the boilerplate
real, and gives translation for free later.

## The backend

One TypeScript service behind the app and the website — stories, accounts, sync of the wall and the
circle, the check-in, and safety config that reaches every device within the hour. Full spec:
[backend.md](backend.md).

It is meant to run the same core, so merging two devices' records uses the same function the app
uses locally. **That is not true yet.** The merge lives in `apps/api/src/sync/merge.ts` as a module
that imports nothing at all — no `node:`, no database, no framework — so moving it to the core at
C8 is a rename plus one import path, and its tests come with it. Creating `@hope/core` now, with C1
unwritten, would mean a core that is only sync, which the real one would then have to reconcile
against.

**What the device keeps to itself:** loop-breaker runs and anything spoken. When the count reaches
the number the person set, the phone asks the backend to send a check-in — a message goes out, and
the count stays home. The API has one field for the reason, `tap` or `threshold`, and none for the
history behind it ([P4](../product/principles.md)).

## Adapters

Thin, carrying no rules of their own.

| | expo | web | node |
|---|---|---|---|
| store | SQLite | browser storage | files |
| net | fetch + background sync | fetch | direct |
| speak | built-in synthesizer | Web Speech | — |
| listen | on-device recognition | on-device where available | — |
| haptics | Expo + native for breathing | vibration where present | — |
| notify | local notifications | — | — |
| share | message link / share intent | share sheet | — |

Each adapter offers what the platform has and stays quiet about the rest, so a phone without
haptics or a locked-down browser gets a product with one fewer channel and everything else intact.

## How data moves

The nightly pipeline classifies stories, a person reviews them, and the result publishes to the
CDN. Surfaces fetch once a day and cache a week ahead, so **everything works offline** — today's
story, the whole wall, Keepsakes, and the entire loop breaker.

The device is the source of truth for writing. Sync sends what's new and takes what's new back,
merging on its own because the wall appends, Keepsakes is a set, and settings are per-key.

## State

One reducer per surface. `reduce(state, event) → [state, effects]` is pure and returns
**descriptions** of effects; the shell carries them out. That's how haptics and speech stay
testable — the reducer returns "fire the confirm haptic" and a test reads the value.

Saving is one snapshot on change, debounced. Schema changes are a version number and a chain of
small pure functions — enough for a local-first app, and readable by anyone.

## Deliberately small

The surface area is four packages and four apps. Adding a dependency, a service, or a layer is a
conversation in an issue first, weighed against [P10](../product/principles.md), because the thing that keeps
this maintainable by one person on an evening is how little there is of it.
