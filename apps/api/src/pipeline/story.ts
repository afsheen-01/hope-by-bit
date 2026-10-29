// The classifier's output schema — and the whole gate. A reply that doesn't
// validate is not a story, the way tools/agent's brief schema works.
//
// Notice what has no field here: a crisis line, a streak, a loop-breaker
// count, a per-day score. Those are unconditional or forbidden, so no prompt
// can turn them on or off (classify.test.ts holds that shut).

import { z } from "zod";
import { CHANNELS } from "../channels.ts";

const line = (max: number) => z.string().trim().min(1).max(max);

// The `Bit` shape, exactly — apps/web/src/lib/today.ts is where it was
// written first and the website already reads it. The pipeline produces what
// the routes serve and the browser renders, with no translation in between.
export const bitSchema = z.object({
  // The change is in the headline, not held back for the body.
  headline: line(64),
  // A number that moves against a baseline, and what it counts. The content
  // standard's second test is a schema field rather than a hope.
  figure: line(16),
  figureCap: line(90),
  body: z
    .string()
    .trim()
    .refine((b) => b.split(/\s+/).length <= 90, "body runs over 90 words"),
  source: line(60),
  ask: line(140),
  movements: z.array(line(60)).min(2).max(3),
});

export const verdictSchema = z.object({
  verdict: z.enum(["accept", "reject"]),
  // The rejection log on /standard is built from these, so the reason has to
  // be readable by a stranger: "nothing happened", not "failed test 1".
  why: line(140),
  channel: z.enum(CHANNELS),
  bit: bitSchema.nullable(),
});

export type Verdict = z.infer<typeof verdictSchema>;

// The gate. Whatever comes back is a verdict only if it validates.
export const toVerdict = (reply: unknown): Verdict => verdictSchema.parse(reply);

// One schema, two consumers: zod validates the reply, and the model is asked
// for the JSON Schema form of the same thing. They can't drift.
export const verdictJsonSchema = z.toJSONSchema(verdictSchema, { io: "output" });
