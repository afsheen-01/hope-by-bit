// The daily review: read what the classifier proposed, keep what holds, and
// publish. Twenty minutes, thirty stories, one person.
//
// ponytail: a CLI, not a web route. B8 turns this into a protected route when
// someone other than the maintainer reviews; until then a terminal is the
// whole tool and it needs no sign-in of its own.

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import type { Judged } from "./classify.ts";
import { dayFile, publish } from "./publish.ts";
import { reviewDir } from "./run.ts";
import { todayUtc } from "../published.ts";

const show = (j: Judged) => {
  const b = j.verdict.bit!;
  console.log(`\n── ${j.verdict.channel} ──────────────────────────────`);
  console.log(`${b.headline}\n`);
  console.log(`${b.figure}  ${b.figureCap}\n`);
  console.log(`${b.body}\n`);
  console.log(`source: ${b.source}`);
  console.log(`movements: ${b.movements.join(" · ")}`);
  console.log(`why: ${j.verdict.why}`);
  console.log(`from: ${j.candidate.url}`);
};

const review = async (date: string) => {
  const judged = JSON.parse(readFileSync(`${reviewDir}${date}.json`, "utf8")) as Judged[];
  const proposed = judged.filter((j) => j.verdict.verdict === "accept" && j.verdict.bit);
  if (proposed.length === 0) return console.log(`nothing proposed for ${date}`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const kept: Judged[] = [];
  for (const j of proposed) {
    show(j);
    // Enter is a rejection, not an acceptance. Tiredness at the end of a long
    // list should fail closed — a thin day is better than a story nobody read.
    const answer = (await rl.question("\nkeep it? [y/N] ")).trim().toLowerCase();
    if (answer === "y" || answer === "yes") kept.push(j);
  }
  rl.close();

  console.log(`\nkept ${kept.length} of ${proposed.length}`);
  publish(dayFile(date, kept));
};

if (import.meta.filename === process.argv[1]) {
  await review(process.argv[2] ?? todayUtc());
  process.exit(0);
}
