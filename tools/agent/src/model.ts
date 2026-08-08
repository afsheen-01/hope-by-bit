// Both model calls sit behind this, so tests run offline against recorded
// responses and a change of provider is one file.

import { readFileSync } from "node:fs";
import { briefSchema, type Brief } from "./brief.ts";

export type Ask = Readonly<{
  prompt: string; // the prompt file's body, holes filled
  schema: unknown; // JSON schema the reply must match
}>;

export type Model = (ask: Ask) => Promise<unknown>;

// Recorded: a map from request text to the reply that was captured for it.
// Missing key throws rather than falling back, so a test that has drifted
// off its fixture fails loudly instead of quietly passing on a default.
export const recorded =
  (replies: Readonly<Record<string, unknown>>, key: (ask: Ask) => string): Model =>
  async (ask) => {
    const k = key(ask);
    if (!(k in replies)) throw new Error(`no recorded reply for: ${k}`);
    return replies[k];
  };

export const loadPrompt = (path: string, text: string) =>
  readFileSync(path, "utf8").replace("{{USER_TEXT}}", text);

// The gate: whatever comes back is a brief only if it validates.
export const toBrief = (reply: unknown): Brief => briefSchema.parse(reply);
