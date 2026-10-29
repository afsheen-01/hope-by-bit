// The wire shapes. Plain types, no imports beyond the channel list, because
// the website, the pipeline and the routes all have to agree on them.

import type { Channel } from "./channels.ts";

// `Bit` is the story contract, and apps/web/src/lib/today.ts is where it was
// written first — that file already consumes it, and it is more specific than
// backend.md's prose (the number splits into figure and figureCap). The two
// must stay identical; W2 imports this shape rather than restating it.
export type Bit = Readonly<{
  date: string;
  headline: string;
  figure: string;
  figureCap: string;
  body: string;
  source: string;
  ask: string;
  // Two or three, all body-sized: free, no signup, finishable now (P7).
  movements: readonly string[];
}>;

// One published file per date, holding every channel that got a story that
// day. Files in the repo, served from here — backend.md's costed choice, and
// the reason B1 needs no object store.
export type DayFile = Readonly<{
  date: string;
  bits: Readonly<Partial<Record<Channel, Bit>>>;
}>;

// The sync shapes are declared in sync/merge.ts, which imports nothing at all
// so it can move to @hope/core at C8 unchanged. Re-exported here so callers
// have one place to look.
//
// Notice what has no field there: loop-breaker runs, anything spoken, a
// per-day score, a dedication. There is nowhere to put them (P4, P2, and the
// grief gate), and p4.test.ts holds that shut.
export type { Entry, Keepsake, Setting, SyncState } from "./sync/merge.ts";
export { emptyState } from "./sync/merge.ts";
