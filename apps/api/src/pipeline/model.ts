// The model call sits behind this, so tests run offline against recorded
// replies and a change of provider is one file. Same shape as
// tools/agent/src/model.ts — deliberately, because there should be one way to
// call a model in this repo, not two.

import { readFileSync } from "node:fs";

export type Ask = Readonly<{
  prompt: string; // the prompt file's body, holes filled
  schema: unknown; // JSON schema the reply must match
}>;

export type Model = (ask: Ask) => Promise<unknown>;

// Missing key throws rather than falling back, so a test that has drifted off
// its fixture fails loudly instead of quietly passing on a default.
export const recorded =
  (replies: Readonly<Record<string, unknown>>, key: (ask: Ask) => string): Model =>
  async (ask) => {
    const k = key(ask);
    if (!(k in replies)) throw new Error(`no recorded reply for: ${k}`);
    return replies[k];
  };

// Prompts are files, versioned and reviewed like code (CONTRIBUTING.md). The
// front matter carries the version, the model id and the temperature, so a
// change to any of them shows up in a diff.
export type Prompt = Readonly<{ version: number; model: string; temperature: number; body: string }>;

export const loadPrompt = (path: string): Prompt => {
  const text = readFileSync(path, "utf8");
  const [, front = "", body = ""] = text.split(/^---\s*$/m);
  const field = (k: string) => front.match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1]?.trim();
  const version = Number(field("version"));
  const model = field("model");
  if (!Number.isFinite(version) || !model) throw new Error(`${path}: front matter is incomplete`);
  return { version, model, temperature: Number(field("temperature") ?? 0), body: body.trim() };
};

export const fill = (prompt: Prompt, text: string) => prompt.body.replace("{{CANDIDATE}}", text);

// The real model: one fetch. No SDK — the interface above is already a
// one-function contract and the tests run against `recorded`, so a dependency
// would buy retries we don't need at fifty calls a night.
// ponytail: no retry, no backoff. A failed candidate is skipped and the log
// records it; add retries when a night's run actually loses stories to it.
export const anthropic =
  (prompt: Prompt): Model =>
  async (ask) => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: prompt.model,
        max_tokens: 2048,
        // Temperature 0: this is structural work, and the same candidate
        // should get the same verdict twice (CONTRIBUTING.md).
        temperature: prompt.temperature,
        output_config: { format: { type: "json_schema", schema: ask.schema } },
        messages: [{ role: "user", content: ask.prompt }],
      }),
    });
    if (!r.ok) throw new Error(`anthropic: ${r.status} ${await r.text()}`);
    const reply = (await r.json()) as { content?: { type: string; text?: string }[] };
    const text = reply.content?.find((b) => b.type === "text")?.text;
    if (!text) throw new Error("anthropic: no text in reply");
    return JSON.parse(text);
  };
