import assert from "node:assert/strict";
import { test } from "node:test";
import { bits } from "./bits.ts";
import { publishedDates, todayUtc } from "./published.ts";

test("/bits/today falls back to the newest story on or before today", async () => {
  const expected = publishedDates().find((d) => d <= todayUtc());
  const res = await bits.request("/bits/today");
  if (!expected) return assert.equal(res.status, 404);
  assert.equal(res.status, 200);
  assert.ok((await res.json()).headline);
});
