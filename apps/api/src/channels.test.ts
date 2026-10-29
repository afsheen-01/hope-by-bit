// The drift test that pays for the duplicate.
//
// CHANNELS is declared twice — here and in tools/agent/src/brief.ts — because
// there is no workspace to share it through yet. Reading the other file as
// text rather than importing it keeps the packages independent; the moment
// the two lists disagree, this fails. Both this file and the duplicate go away
// at C1, when @hope/core owns the list.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { CHANNELS, parseChannels } from "./channels.ts";

const agentBrief = fileURLToPath(new URL("../../../tools/agent/src/brief.ts", import.meta.url));

test("the agent's channels and the API's are the same eight", () => {
  const source = readFileSync(agentBrief, "utf8");
  const block = source.match(/export const CHANNELS = \[([\s\S]*?)\] as const;/)?.[1];
  assert.ok(block, "tools/agent/src/brief.ts no longer declares CHANNELS the same way");
  const theirs = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...CHANNELS], theirs);
});

test("a request's channels normalise before they become a cache key", () => {
  // Same set, three spellings, one answer — otherwise the CDN holds one copy
  // per permutation of the same request.
  const a = parseChannels("Medicine,food");
  const b = parseChannels("food,medicine");
  const c = parseChannels(" food , MEDICINE , food ");
  assert.deepEqual(a, b);
  assert.deepEqual(a, c);
});

test("nonsense falls back to all eight rather than to nothing", () => {
  assert.deepEqual(parseChannels("cricket"), CHANNELS);
  assert.deepEqual(parseChannels(""), CHANNELS);
  assert.deepEqual(parseChannels(undefined), CHANNELS);
});
