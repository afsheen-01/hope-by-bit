// The "two devices offline both arrive" test.
//
// Merging is the one place a bug loses somebody's record silently, so the
// checks here are properties rather than examples: whatever the inputs, the
// answer must not depend on which device's copy the server saw first.

import assert from "node:assert/strict";
import { test } from "node:test";
import { kept, merge, type SyncState } from "./merge.ts";

const t = (n: number) => new Date(Date.UTC(2026, 7, 9, 0, 0, n)).toISOString();

const phone: SyncState = {
  entries: [
    { id: "a", at: t(1), what: "A glass of water", bitId: null },
    { id: "b", at: t(2), what: "Stand up and stretch", bitId: "bit-1" },
  ],
  keepsakes: [{ bitId: "bit-1", at: t(1), removedAt: null }],
  settings: [{ key: "theme", value: "dark", updatedAt: t(5) }],
};

const laptop: SyncState = {
  entries: [
    { id: "b", at: t(2), what: "Stand up and stretch", bitId: "bit-1" },
    { id: "c", at: t(3), what: "Ninety seconds outside", bitId: null },
  ],
  keepsakes: [{ bitId: "bit-2", at: t(4), removedAt: null }],
  settings: [{ key: "theme", value: "light", updatedAt: t(9) }],
};

test("neither device's copy wins by arriving first", () => {
  assert.deepEqual(merge(phone, laptop), merge(laptop, phone));
});

test("grouping three devices any way gives the same record", () => {
  const tablet: SyncState = {
    entries: [{ id: "d", at: t(6), what: "A glass of water", bitId: null }],
    keepsakes: [{ bitId: "bit-1", at: t(1), removedAt: t(7) }],
    settings: [],
  };
  assert.deepEqual(merge(merge(phone, laptop), tablet), merge(phone, merge(laptop, tablet)));
});

test("the wall appends — nothing is dropped, nothing is doubled", () => {
  const { entries } = merge(phone, laptop);
  assert.deepEqual(entries.map((e) => e.id), ["a", "b", "c"]);
});

test("a removal travels, and does not resurrect on the next merge", () => {
  const removed: SyncState = {
    entries: [],
    keepsakes: [{ bitId: "bit-1", at: t(1), removedAt: t(7) }],
    settings: [],
  };
  // The phone still believes bit-1 is kept; the laptop knows it was removed.
  const both = merge(phone, removed);
  assert.equal(kept(both.keepsakes[0]), false);
  // Syncing again with the stale device must not bring it back.
  assert.equal(kept(merge(both, phone).keepsakes[0]), false);
});

test("re-keeping after a removal works", () => {
  const again: SyncState = {
    entries: [],
    keepsakes: [{ bitId: "bit-1", at: t(9), removedAt: null }],
    settings: [],
  };
  const removed: SyncState = {
    entries: [],
    keepsakes: [{ bitId: "bit-1", at: t(1), removedAt: t(7) }],
    settings: [],
  };
  assert.equal(kept(merge(removed, again).keepsakes[0]), true);
});

test("settings are last write wins, per key", () => {
  assert.equal(merge(phone, laptop).settings[0].value, "light");
});

test("merging with an empty record changes nothing", () => {
  const empty: SyncState = { entries: [], keepsakes: [], settings: [] };
  assert.deepEqual(merge(phone, empty), merge(empty, phone));
  assert.deepEqual(merge(phone, phone), merge(phone, empty));
});
