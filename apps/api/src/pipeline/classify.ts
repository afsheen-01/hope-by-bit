// Classify the shortlist against the five tests, and log what happened.
// The model proposes; a person still decides (review.ts). That step is
// permanent — it is what "genuinely good news" means in practice.

import { appendFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Candidate } from "./fetch.ts";
import { fill, loadPrompt, type Model, type Prompt } from "./model.ts";
import { toVerdict, verdictJsonSchema, type Verdict } from "./story.ts";

export const promptPath = fileURLToPath(new URL("../../prompts/classify.md", import.meta.url));
const logDir = fileURLToPath(new URL("../../logs/", import.meta.url));

export type Judged = Readonly<{ candidate: Candidate; verdict: Verdict }>;

export const askFor = (prompt: Prompt, c: Candidate) => ({
  prompt: fill(prompt, `${c.title}\n\n${c.summary}\n\n${c.url}`),
  schema: verdictJsonSchema,
});

export const classify = async (
  candidates: readonly Candidate[],
  model: Model,
  prompt: Prompt = loadPrompt(promptPath),
): Promise<Judged[]> => {
  const judged: Judged[] = [];
  for (const candidate of candidates) {
    try {
      judged.push({ candidate, verdict: toVerdict(await model(askFor(prompt, candidate))) });
    } catch (e) {
      // A reply that doesn't validate is not a story. Losing one candidate is
      // the right outcome; the alternative is a story nobody checked.
      console.error(`skipped ${candidate.url}: ${(e as Error).message}`);
    }
  }
  log(prompt, candidates.length, judged);
  return judged;
};

// One line a night: prompt version, model, and what was accepted or rejected
// (CONTRIBUTING.md). Nothing about people — this is the pipeline's own record,
// and it sits nowhere near the hard-moment flow.
const log = (prompt: Prompt, candidates: number, judged: readonly Judged[]) => {
  mkdirSync(logDir, { recursive: true });
  appendFileSync(
    `${logDir}pipeline.jsonl`,
    JSON.stringify({
      at: new Date().toISOString(),
      promptVersion: prompt.version,
      model: prompt.model,
      candidates,
      accepted: judged.filter((j) => j.verdict.verdict === "accept").length,
      rejected: judged.filter((j) => j.verdict.verdict === "reject").length,
    }) + "\n",
  );
};
