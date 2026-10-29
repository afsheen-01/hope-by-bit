// Choosing today's story. One story, and the screen ends (P1).
//
// Deterministic on the date alone: no randomness, no per-person state, no
// clock. That is what makes the signed-out edition a single edition — the
// route hands `choose` all eight channels when nobody is signed in, and three
// to five when someone is, and it is the same function either way. It resolves
// techSpec/web/ui.md's first open question by not having a second code path.

import type { Channel } from "./channels.ts";
import type { Bit, DayFile } from "./types.ts";

// FNV-1a over the date. Any stable hash would do; this one is six lines and
// has no dependency behind it.
const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const choose = (
  date: string,
  channels: readonly Channel[],
  day: DayFile | null,
): Bit | null => {
  if (!day) return null;
  // Sorted, so the answer doesn't depend on the order the caller listed them.
  const available = [...channels].filter((c) => day.bits[c]).sort();
  if (available.length === 0) return null;
  return day.bits[available[hash(date) % available.length]] ?? null;
};
