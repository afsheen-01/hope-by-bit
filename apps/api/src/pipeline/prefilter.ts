// Two hundred candidates down to about fifty, before anything costs money.
// The model is the expensive judge; this is the cheap one, and it is allowed
// to be crude because the only thing it decides is what gets read.

import { KEYWORDS } from "./sources.ts";
import type { Candidate } from "./fetch.ts";

// A number with something after it is the second content test in embryo: no
// figure at all means the candidate can't pass, so it needn't be classified.
const hasFigure = /\b\d[\d,.]*\s*(%|percent|million|billion|thousand|per cent|times|fold)\b/i;

// Words that mark a candidate as an intention rather than an event — the
// first test, applied by string match. Cheap, and it removes a lot.
const NOTHING_HAPPENED =
  /\b(could|may|might|suggests?|plans? to|aims? to|hopes? to|pledges?|promises?|set to|expected to)\b/i;

const score = (c: Candidate): number => {
  const text = `${c.title} ${c.summary}`;
  if (NOTHING_HAPPENED.test(c.title)) return 0;
  // No figure at all means the second test can't be passed, so there is
  // nothing for the model to weigh. "Millions affected" counts a problem, not
  // a change, and never reaches a classification.
  if (!hasFigure.test(text)) return 0;
  let n = 2;
  for (const k of KEYWORDS[c.channel]) if (text.toLowerCase().includes(k)) n += 1;
  return n;
};

export const prefilter = (candidates: readonly Candidate[], keep = 50): Candidate[] => {
  const seen = new Set<string>();
  return candidates
    .map((c) => ({ c, n: score(c) }))
    .filter(({ c, n }) => n > 0 && !seen.has(c.url) && seen.add(c.url))
    .sort((a, b) => b.n - a.n)
    .slice(0, keep)
    .map(({ c }) => c);
};
