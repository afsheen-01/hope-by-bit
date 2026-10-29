// P6: the crisis line reaches every device, and only a checked one goes out.

import assert from "node:assert/strict";
import { test } from "node:test";
import { app } from "./app.ts";
import { CRISIS_LINES, verified } from "./crisis-lines.ts";

const get = (path: string) => app.request(`http://localhost${path}`);

test("only a verified row is ever served", async () => {
  for (const row of CRISIS_LINES) {
    const served = verified(row.region);
    if (served === null) continue;
    assert.ok(served.verifiedBy, `${row.region} is served without anyone verifying it`);
    assert.ok(served.verifiedAt, `${row.region} is served without a verification date`);
  }
});

test("an unverified region gets the fallback, not an unchecked number", async () => {
  const body = await (await get("/config?region=ZZ")).json();
  assert.equal(body.verified, false);
  assert.equal(body.line.url, "https://findahelpline.com");
});

test("config answers with no database and no account", async () => {
  const r = await get("/config?region=US");
  assert.equal(r.status, 200);
  const body = await r.json();
  // Whether or not US is verified yet, there is always somewhere to go.
  assert.ok(body.line.number || body.line.url);
});

test("how much of the table stands up is visible from the API", async () => {
  const { coverage } = await (await get("/config")).json();
  assert.equal(coverage.seeded, CRISIS_LINES.length);
  assert.ok(coverage.verified <= coverage.seeded);
});
