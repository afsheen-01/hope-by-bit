// P4 and P2, held by a test rather than by discipline.
//
// The API has no field that could hold loop-breaker history, and none that
// could hold a per-day score. This reads the migration SQL as text, because
// the schema *is* that text — a column added later has to get past this file.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const dir = fileURLToPath(new URL("../migrations/", import.meta.url));
const sql = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .map((f) => readFileSync(dir + f, "utf8"))
  .join("\n");

// Identifiers only — the comments in the migrations discuss these on purpose.
const identifiers = sql
  .replace(/--[^\n]*/g, "")
  .match(/^\s*([a-z_]+)\s+(text|timestamptz|integer|boolean|bigint)\b/gim)
  ?.map((l) => l.trim().split(/\s+/)[0]) ?? [];

// Everything below asserts that a list is empty, so an empty list from a
// regex that stopped matching would pass all of them and hold nothing shut.
// This is the test that stops the tests being decorative.
test("the schema is actually being read", () => {
  assert.ok(sql.includes("create table"), "no migrations were read");
  assert.ok(identifiers.length > 10, `only ${identifiers.length} columns parsed — the regex has drifted`);
});

test("no column could hold a loop-breaker run (P4)", () => {
  const forbidden = /runs?|loop|breath|ground|spoken|utterance|history/i;
  const found = identifiers.filter((c) => forbidden.test(c));
  assert.deepEqual(found, [], `these columns would hold what stays on the phone: ${found}`);
});

test("no column could hold a streak or a per-day score (P2)", () => {
  // Anchored on word parts, so `account_id` isn't read as a count of things.
  const forbidden = /streak|score|daily|per_day|(^|_)count(s?)(_|$)/i;
  const found = identifiers.filter((c) => forbidden.test(c));
  assert.deepEqual(found, [], `the wall keeps one cumulative total and nothing else: ${found}`);
});

test("no column could hold a dedication (D5, and the grief gate)", () => {
  const forbidden = /dedicat|carrying|in_memory|memorial/i;
  const found = identifiers.filter((c) => forbidden.test(c));
  assert.deepEqual(found, [], `dedications stay on the device until the counsellor gate clears: ${found}`);
});

test("no circle or messaging table until B5 clears its paperwork", () => {
  const tables = [...sql.matchAll(/create table (\w+)/gi)].map((m) => m[1]);
  for (const t of ["circle", "message"]) {
    assert.equal(tables.includes(t), false, `${t} needs SMS registration filed first (D9)`);
  }
});
