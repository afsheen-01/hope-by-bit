// B4 · merging two devices' records.
//
// ponytail: this lives here until C8. Zero imports on purpose — no `node:`, no
// database, no Hono, nothing — so moving it to packages/core/src/merge.ts is a
// `git mv` plus one import path, and the tests come with it. Creating
// @hope/core now would mean a "core" that is only sync, with C1's types
// unwritten, and the real core would then have to reconcile against it.
// architecture.md says the backend runs the same merge the app does; that
// becomes true at C8, and until then it says so.
//
// The shape of the problem: two devices were both offline, both wrote, and
// neither is wrong. So merge takes two states and returns one, and it must not
// matter which order it happens in — `merge(a, b)` and `merge(b, a)` are the
// same value, and grouping three of them any way gives the same answer.
// merge.test.ts checks exactly that, and it is the test behind "two devices
// offline both arrive".
//
// Every tie-break below is arbitrary. That is fine; what matters is that it is
// *deterministic*, because a tie broken by argument order is a tie broken
// differently on each device.

export type Entry = Readonly<{
  id: string; // client-generated, which is why two offline devices don't collide
  at: string; // ISO 8601, from the device that made it
  what: string;
  bitId: string | null;
}>;

export type Keepsake = Readonly<{
  bitId: string;
  at: string;
  removedAt: string | null;
}>;

export type Setting = Readonly<{
  key: string;
  value: string;
  updatedAt: string;
}>;

export type SyncState = Readonly<{
  entries: readonly Entry[];
  keepsakes: readonly Keepsake[];
  settings: readonly Setting[];
}>;

export const emptyState: SyncState = { entries: [], keepsakes: [], settings: [] };

// ISO 8601 in the same offset compares correctly as text, and the API stores
// UTC, so no date parsing is needed to order two timestamps.
const later = (a: string | null, b: string | null): string | null =>
  a === null ? b : b === null ? a : a > b ? a : b;

const by = <T>(key: (t: T) => string) => (x: T, y: T) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0);

// The wall appends. Ids are client-generated, so a collision means the same
// entry arriving twice rather than two different ones; keep the earlier
// timestamp, and let `what` settle a dead heat.
const mergeEntry = (a: Entry, b: Entry): Entry =>
  a.at !== b.at ? (a.at < b.at ? a : b) : a.what <= b.what ? a : b;

// Keepsakes are a set — add and remove, each carrying a time. Taking the later
// of each field independently is what makes this order-independent: a device
// that only ever saw the add still learns the removal on its next merge,
// instead of resurrecting the row. A dead heat resolves to removed, which is
// the quieter of the two mistakes.
const mergeKeepsake = (a: Keepsake, b: Keepsake): Keepsake => ({
  bitId: a.bitId,
  at: later(a.at, b.at) as string,
  removedAt: later(a.removedAt, b.removedAt),
});

export const kept = (k: Keepsake) => k.removedAt === null || k.at > k.removedAt;

// Last write wins, per key.
const mergeSetting = (a: Setting, b: Setting): Setting =>
  a.updatedAt !== b.updatedAt
    ? a.updatedAt > b.updatedAt
      ? a
      : b
    : a.value >= b.value
      ? a
      : b;

const union = <T>(
  a: readonly T[],
  b: readonly T[],
  key: (t: T) => string,
  pick: (x: T, y: T) => T,
): readonly T[] => {
  const out = new Map<string, T>();
  for (const t of [...a, ...b]) {
    const k = key(t);
    const seen = out.get(k);
    out.set(k, seen ? pick(seen, t) : t);
  }
  // Sorted, so merge(a,b) is structurally equal to merge(b,a) rather than
  // merely equivalent — which is the difference between a deepEqual test that
  // proves commutativity and one that proves nothing.
  return [...out.values()].sort(by(key));
};

export const merge = (a: SyncState, b: SyncState): SyncState => ({
  entries: union(a.entries, b.entries, (e) => e.id, mergeEntry),
  keepsakes: union(a.keepsakes, b.keepsakes, (k) => k.bitId, mergeKeepsake),
  settings: union(a.settings, b.settings, (s) => s.key, mergeSetting),
});
