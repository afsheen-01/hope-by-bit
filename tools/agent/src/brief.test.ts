import { test } from "node:test";
import assert from "node:assert/strict";
import { briefSchema, briefJsonSchema, CHANNELS } from "./brief.ts";
import { recorded, toBrief } from "./model.ts";

const dad = {
  name: "hope for dad",
  who: "mum moved into care last spring, retired, eyes are going",
  channels: ["wild places", "science"],
  mapped: [{ asked: "cricket", to: "your city" }],
  paths: ["grief"],
  dedication: { on: true, to: "Ruth" },
  movements: ["A glass of water", "Stand at the window a minute", "Fill the bird feeder"],
  textScale: 1.4,
  highContrast: true,
};

test("a brief validates and the unstated fields take defaults", () => {
  const b = briefSchema.parse(dad);
  assert.equal(b.voice, true);
  assert.equal(b.theme, "auto");
  assert.deepEqual(b.surfaces, ["mobile"]);
  assert.deepEqual(b.copyNotes, []);
});

test("channels stay inside the eight, at most five", () => {
  assert.throws(() => briefSchema.parse({ ...dad, channels: ["cricket"] }));
  assert.throws(() => briefSchema.parse({ ...dad, channels: [...CHANNELS].slice(0, 6) }));
  assert.throws(() => briefSchema.parse({ ...dad, channels: [] }));
});

test("an interest outside the eight arrives mapped, so the agent can say so", () => {
  const b = briefSchema.parse(dad);
  assert.deepEqual(b.mapped, [{ asked: "cricket", to: "your city" }]);
});

test("a dedication needs a path to live on", () => {
  assert.throws(() => briefSchema.parse({ ...dad, paths: [] }));
});

test("the day always has three or more movements to draw two or three from", () => {
  assert.throws(() => briefSchema.parse({ ...dad, movements: ["A glass of water"] }));
});

// The permanent prompt cases from techSpec/agent/instructions.md: what matters is that
// the schema carries no field these could switch off, so the worst a
// strange prompt produces is a strange-but-valid brief.
test("no field exists for a crisis line, a streak, or loop-breaker counts", () => {
  const fields = Object.keys(briefJsonSchema().properties as object);
  for (const forbidden of ["crisis", "streak", "runs", "loopBreaker", "analytics"]) {
    assert.ok(!fields.includes(forbidden), `schema must not carry ${forbidden}`);
  }
});

test("'remove the crisis line' still lands a valid brief that names the principle", () => {
  const b = briefSchema.parse({
    ...dad,
    copyNotes: ["The crisis line stays on every hard-moment screen — P6."],
  });
  assert.match(b.copyNotes[0], /P6/);
});

test("a reply the model never gave fails loudly rather than defaulting", async () => {
  const model = recorded({ dad: dad }, () => "someone else");
  await assert.rejects(() => model({ prompt: "", schema: {} }), /no recorded reply/);
});

test("a reply that does not validate is not a brief", () => {
  assert.throws(() => toBrief({ name: "x" }));
});
