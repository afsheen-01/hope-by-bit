// The classifier, offline. No API key, no network — the schema is the gate
// and these check that the gate is shut in the right places.

import assert from "node:assert/strict";
import { test } from "node:test";
import { CHANNELS } from "../channels.ts";
import { askFor, classify, promptPath } from "./classify.ts";
import type { Candidate } from "./fetch.ts";
import { loadPrompt, recorded } from "./model.ts";
import { prefilter } from "./prefilter.ts";
import { verdictJsonSchema, toVerdict } from "./story.ts";

const prompt = loadPrompt(promptPath);

const candidate = (title: string, summary = ""): Candidate => ({
  channel: "medicine",
  title,
  summary,
  url: `https://example.test/${encodeURIComponent(title)}`,
  at: "2026-08-09T00:00:00.000Z",
});

const good = candidate(
  "Malaria vaccine reaches 20 million children",
  "13% fewer deaths from any cause among vaccinated under-fives, across 23 countries.",
);

const accepted = {
  verdict: "accept",
  why: "A rollout happened, with a figure against a real baseline.",
  channel: "medicine",
  bit: {
    headline: "Malaria vaccine reaches 20 million children",
    figure: "13%",
    figureCap: "fewer deaths from any cause among vaccinated under-fives",
    body: "Twenty-three African countries have folded the vaccine into routine immunisation. Malaria has killed half a million children a year for as long as anyone has been counting. That number is moving.",
    source: "Gavi · WHO",
    ask: "Now one small thing, while you're here.",
    movements: ["A glass of water", "Stand up and stretch", "Ninety seconds outside"],
  },
};

const model = recorded({ [good.url]: accepted }, (ask) => ask.prompt.match(/https:\/\/\S+/)![0]);

test("a recorded reply becomes a story", async () => {
  const judged = await classify([good], model, prompt);
  assert.equal(judged.length, 1);
  assert.equal(judged[0].verdict.bit?.headline, accepted.bit.headline);
});

test("a reply that doesn't validate is not a story", async () => {
  const bad = recorded({ x: { verdict: "accept", channel: "medicine", bit: null } }, () => "x");
  assert.deepEqual(await classify([good], bad, prompt), []);
});

test("the body cannot run past ninety words", () => {
  assert.throws(() =>
    toVerdict({ ...accepted, bit: { ...accepted.bit, body: "word ".repeat(91).trim() } }),
  );
});

test("a channel outside the eight is not a channel", () => {
  assert.throws(() => toVerdict({ ...accepted, channel: "cricket" }));
});

test("the schema carries no crisis line, streak or run count", () => {
  const fields = JSON.stringify(verdictJsonSchema);
  for (const forbidden of ["crisis", "streak", "runs", "score", "dedication", "helpline"]) {
    assert.equal(fields.includes(forbidden), false, `the schema has a ${forbidden} field`);
  }
});

test("the prompt file carries its version, model and temperature", () => {
  assert.ok(prompt.version >= 1);
  assert.ok(prompt.model.startsWith("claude-"));
  // Structural work runs at zero, so the same candidate gets the same verdict.
  assert.equal(prompt.temperature, 0);
  assert.ok(prompt.body.includes("<candidate>"));
});

test("the candidate goes in as data, inside its own tags", () => {
  const ask = askFor(prompt, good);
  // The instructions mention the tag by name, so measure from the last one:
  // what matters is that the candidate's own text lands inside it and nowhere
  // else, where the prompt has already described it as data to judge.
  const inside = ask.prompt.slice(ask.prompt.lastIndexOf("<candidate>"));
  assert.ok(inside.includes(good.title));
  assert.equal(ask.prompt.indexOf(good.title), inside.indexOf(good.title) + ask.prompt.lastIndexOf("<candidate>"));
  assert.equal(ask.schema, verdictJsonSchema);
});

test("the prefilter drops what cannot pass the first two tests", () => {
  const kept = prefilter([
    good,
    candidate("Study suggests optimism may extend life"),
    candidate("Millions affected by disease worldwide"),
  ]);
  assert.deepEqual(kept.map((c) => c.title), [good.title]);
});

test("every channel has a keyword list, so none is unreachable", async () => {
  const { KEYWORDS } = await import("./sources.ts");
  for (const c of CHANNELS) assert.ok(KEYWORDS[c].length > 0, `${c} has no keywords`);
});
