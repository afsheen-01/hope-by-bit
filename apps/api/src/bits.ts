// B1 · the story routes. Anonymous, no database, no session — identical for
// everyone asking for the same channels, which is what lets the CDN hold them.

import { Hono } from "hono";
import { parseChannels } from "./channels.ts";
import { choose } from "./choose.ts";
import { publishedDates, readDay, todayUtc } from "./published.ts";

// Five minutes: long enough that the edge carries the load, short enough that
// a correction to a published story reaches readers the same morning. The
// website fetches on load and swaps only on a change, so a stale copy costs a
// reader nothing but a few minutes.
const CACHE = "public, max-age=300";

export const bits = new Hono()
  .get("/bits/today", (c) => {
    // Today's file, else the newest before it — the same fallback the website
    // builds with (apps/web/src/lib/today.ts), so a night the pipeline didn't
    // publish shows the last real story instead of a 404.
    const today = todayUtc();
    const date = publishedDates().find((d) => d <= today);
    const bit = date ? choose(date, parseChannels(c.req.query("channels")), readDay(date)) : null;
    if (!bit) return c.json({ error: "no story today" }, 404);
    c.header("Cache-Control", CACHE);
    return c.json(bit);
  })

  // The archive: every story published, permanently, individually linkable so
  // one can be sent to someone who reads it and nothing else (web/ui.md).
  .get("/bits/:date", (c) => {
    const day = readDay(c.req.param("date"));
    if (!day) return c.json({ error: "nothing published for that date" }, 404);
    c.header("Cache-Control", CACHE);
    return c.json(day);
  })

  .get("/archive", (c) => {
    const limit = Math.min(Number(c.req.query("limit")) || 30, 365);
    c.header("Cache-Control", CACHE);
    return c.json({ dates: publishedDates().slice(0, limit) });
  });
