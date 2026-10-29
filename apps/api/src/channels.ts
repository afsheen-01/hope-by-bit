// The eight, fixed for v1 (D2, settled 2026-08-08).
//
// ponytail: duplicated from tools/agent/src/brief.ts, held by the deepEqual
// test in channels.test.ts. There is no npm workspace here — apps/package-lock
// .json is an empty stub — and creating one is a bigger change than ten lines
// that fail loudly on drift. This file deletes itself at C1, when @hope/core
// owns CHANNELS and both packages import it.

export const CHANNELS = [
  "medicine",
  "climate",
  "wild places",
  "kindness",
  "science",
  "your city",
  "rights",
  "food",
] as const;

export type Channel = (typeof CHANNELS)[number];

export const isChannel = (s: string): s is Channel =>
  (CHANNELS as readonly string[]).includes(s);

// `?channels=Medicine,food,medicine` is the same request as `?channels=food,
// medicine`. Normalising before the value becomes a cache key is what keeps
// the CDN from holding one copy per permutation of the same set.
//
// A channel outside the eight is dropped, and a request left with none falls
// back to all eight rather than to nothing. That is on purpose: this route is
// anonymous and cached, a stale or misspelled set is the client's bug, and
// [P1] is satisfied either way — one story, and the screen ends. The cost is
// that a signed-in client sending a bad set quietly gets the single edition
// instead of an error, which is the right trade while sync is young and worth
// revisiting if it ever hides a real one.
export const parseChannels = (raw: string | undefined | null): readonly Channel[] => {
  if (!raw) return CHANNELS;
  const picked = [...new Set(raw.split(",").map((c) => c.trim().toLowerCase()))]
    .filter(isChannel)
    .sort();
  return picked.length ? picked : CHANNELS;
};
