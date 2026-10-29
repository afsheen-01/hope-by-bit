// Publish: reviewed stories become one dated file per day, one story per
// channel. The file is the artifact the routes serve and the CDN caches.

import { mkdirSync, writeFileSync } from "node:fs";
import type { Channel } from "../channels.ts";
import { publishedDir } from "../published.ts";
import type { Bit, DayFile } from "../types.ts";
import { bitSchema } from "./story.ts";
import type { Judged } from "./classify.ts";

// One per channel, and the first accepted wins. `classify` preserves the
// prefilter's order, which put the strongest candidates first.
export const dayFile = (date: string, judged: readonly Judged[]): DayFile => {
  const bits: Partial<Record<Channel, Bit>> = {};
  for (const { verdict } of judged) {
    if (verdict.verdict !== "accept" || !verdict.bit || bits[verdict.channel]) continue;
    // Validated again on the way out: publish is the last place a malformed
    // story can be stopped before a browser renders it.
    bits[verdict.channel] = { date, ...bitSchema.parse(verdict.bit) };
  }
  return { date, bits };
};

export const publish = (day: DayFile) => {
  mkdirSync(publishedDir, { recursive: true });
  writeFileSync(`${publishedDir}${day.date}.json`, JSON.stringify(day, null, 2) + "\n");
  console.log(`published ${day.date}: ${Object.keys(day.bits).join(", ") || "nothing"}`);
};
