// The brief — the one thing the model decides about the shape of the
// output, and it decides it inside this schema. A brief that validates is
// a brief that gets used; the schema is the whole gate (CONTRIBUTING.md).
//
// Notice what is *not* here: the crisis line, the wall and its totals, the
// one daily notification, the loop breaker staying on the device, two or
// three body-sized movements, export and delete. Those are unconditional,
// so no prompt can turn them off — that is how the principles hold by
// construction rather than by check.

import { z } from "zod";

// D2, settled the way PROGRESS leaned: eight fixed channels for v1. An
// interest one step outside them (cricket) maps to the nearest and the
// agent says which, recorded in `mapped` below. Open-ended channels would
// ask the pipeline to classify arbitrary topics, and would rethink "one
// reviewed story per channel per day".
export const CHANNELS = [
  "medicine",
  "climate",
  "wild places",
  "kindness",
  "science",
  "your city",
  "rights",
  "food",
] as const;

export const PATHS = ["grief", "illness", "burnout", "lonely"] as const;
export const SURFACES = ["mobile", "web", "api"] as const;

const line = (max: number) => z.string().trim().min(1).max(max);

export const briefSchema = z
  .object({
    name: line(40).describe("What the generated app is called, in their words."),
    who: line(140).describe("One line about who this is for."),

    channels: z.array(z.enum(CHANNELS)).min(1).max(5),
    // What the prompt asked for that is not a channel, and what it became.
    // The agent prints these, so the person hears about the substitution.
    mapped: z
      .array(z.object({ asked: line(40), to: z.enum(CHANNELS) }))
      .max(5)
      .default([]),

    paths: z.array(z.enum(PATHS)).max(2).default([]),

    // Continuing bonds: with a path on, any action can be dedicated.
    dedication: z
      .discriminatedUnion("on", [
        z.object({ on: z.literal(false) }),
        z.object({ on: z.literal(true), to: line(40) }),
      ])
      .default({ on: false }),

    // The day's movements: body-sized, free, finishable in the next
    // minute. Two or three are shown each day, drawn from these (P7).
    movements: z.array(line(60)).min(3).max(12),

    voice: z.boolean().default(true),
    haptics: z.boolean().default(true),
    textScale: z.number().min(1).max(2).default(1),
    highContrast: z.boolean().default(false),
    circle: z.boolean().default(true),

    surfaces: z.array(z.enum(SURFACES)).min(1).default(["mobile"]),
    theme: z.enum(["auto", "light", "dark"]).default("auto"),

    copyNotes: z.array(line(140)).max(5).default([]),
  })
  // A dedication needs a path to live on — grief copy has a review gate,
  // and a dedication outside one has nowhere to appear.
  .refine((b) => !b.dedication.on || b.paths.length > 0, {
    message: "dedication needs at least one path",
    path: ["dedication"],
  });

export type Brief = z.infer<typeof briefSchema>;

// What the model is handed as its output schema. One definition, so the
// thing asked for and the thing validated cannot drift.
export const briefJsonSchema = () => z.toJSONSchema(briefSchema, { io: "input" });
