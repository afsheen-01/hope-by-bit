// P1: one story, and the screen ends.

import assert from "node:assert/strict";
import { test } from "node:test";
import { CHANNELS, parseChannels } from "./channels.ts";
import { choose } from "./choose.ts";
import type { Bit, DayFile } from "./types.ts";

const bit = (headline: string): Bit => ({
  date: "2026-08-09",
  headline,
  figure: "13%",
  figureCap: "fewer deaths",
  body: "Something happened.",
  source: "WHO",
  ask: "Now one small thing.",
  movements: ["A glass of water", "Stand up and stretch"],
});

const day: DayFile = {
  date: "2026-08-09",
  bits: { medicine: bit("medicine"), climate: bit("climate"), food: bit("food") },
};

test("one story, not a feed", () => {
  const one = choose("2026-08-09", CHANNELS, day);
  assert.ok(one);
  assert.ok(CHANNELS.some((c) => day.bits[c]?.headline === one.headline));
});

test("the same day gives the same story, however the channels are ordered", () => {
  const a = choose("2026-08-09", ["food", "medicine", "climate"], day);
  const b = choose("2026-08-09", ["climate", "food", "medicine"], day);
  assert.deepEqual(a, b);
  assert.deepEqual(a, choose("2026-08-09", ["food", "medicine", "climate"], day));
});

test("signed out is one edition — the same function with all eight", () => {
  // No branch anywhere decides this; it falls out of `choose` being
  // deterministic, which is how web/ui.md's first open question resolves.
  assert.deepEqual(choose("2026-08-09", parseChannels(undefined), day), choose("2026-08-09", CHANNELS, day));
});

test("a channel with nothing published is skipped, not left blank", () => {
  const one = choose("2026-08-09", ["rights", "medicine"], day);
  assert.equal(one?.headline, "medicine");
});

test("a day with nothing published says so", () => {
  assert.equal(choose("2026-08-09", CHANNELS, null), null);
  assert.equal(choose("2026-08-09", ["rights"], day), null);
});

test("different days do not all land on the same channel", () => {
  const dates = ["2026-08-09", "2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13"];
  const picked = new Set(dates.map((d) => choose(d, CHANNELS, day)?.headline));
  assert.ok(picked.size > 1, "every day chose the same channel");
});
