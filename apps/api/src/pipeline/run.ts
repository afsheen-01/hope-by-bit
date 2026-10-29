// The nightly run: fetch, prefilter, classify, and stop.
//
// It stops on purpose. Publishing is `npm run review`, because a person reads
// the top of the pile before anything reaches a screen — the review step is
// permanent, and a pipeline that could publish without it would eventually.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { classify, promptPath } from "./classify.ts";
import { fetchCandidates } from "./fetch.ts";
import { anthropic, loadPrompt } from "./model.ts";
import { prefilter } from "./prefilter.ts";
import { todayUtc } from "../published.ts";

export const reviewDir = fileURLToPath(new URL("../../reviewed/", import.meta.url));

const run = async () => {
  const prompt = loadPrompt(promptPath);
  const all = await fetchCandidates();
  const shortlist = prefilter(all);
  console.log(`${all.length} candidates, ${shortlist.length} through the prefilter`);

  const judged = await classify(shortlist, anthropic(prompt), prompt);
  const date = todayUtc();
  mkdirSync(reviewDir, { recursive: true });
  writeFileSync(`${reviewDir}${date}.json`, JSON.stringify(judged, null, 2) + "\n");

  const accepted = judged.filter((j) => j.verdict.verdict === "accept").length;
  console.log(`${accepted} proposed for ${date}. Run \`npm run review\` to read them.`);
};

if (import.meta.filename === process.argv[1]) {
  await run();
  process.exit(0);
}
