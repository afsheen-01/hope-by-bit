// Published stories are files in the repo, served from here and cached at the
// edge — backend.md's costed choice, and why B1 needs no object store and no
// database. The pipeline writes into this directory; the routes read it.

import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { DayFile } from "./types.ts";

export const publishedDir = fileURLToPath(new URL("../published/", import.meta.url));

const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

// UTC, so every reader in the world is asking for the same day's file and the
// cache holds one copy. A person a few hours either side of the boundary sees
// the change early or late by less than a day, which is the right trade for a
// product with one story a day.
export const todayUtc = (now: Date = new Date()) => now.toISOString().slice(0, 10);

export const readDay = (date: string): DayFile | null => {
  if (!isDate(date)) return null;
  try {
    return JSON.parse(readFileSync(`${publishedDir}${date}.json`, "utf8")) as DayFile;
  } catch {
    // Missing day and unreadable day are the same answer to a caller: nothing
    // published for that date. A parse failure is the pipeline's bug to find,
    // and publish.ts validates before writing so it shouldn't reach here.
    return null;
  }
};

// ponytail: reads the directory on every call. Ten people and one file a day
// means this is a few hundred names; cache it behind a mtime check if the
// archive ever gets long enough to notice.
export const publishedDates = (): readonly string[] => {
  try {
    return readdirSync(publishedDir)
      .filter((f) => f.endsWith(".json") && isDate(f.slice(0, -5)))
      .map((f) => f.slice(0, -5))
      .sort()
      .reverse();
  } catch {
    return [];
  }
};
