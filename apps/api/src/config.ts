// B2 · safety config. Fetched on launch and cached, so a wrong number reaches
// every device within the hour instead of waiting on an app store review (P6).

import { Hono } from "hono";
import { CRISIS_LINES, FALLBACK, verified } from "./crisis-lines.ts";

// Shorter than the story cache on purpose: this is the path a correction takes.
const CACHE = "public, max-age=600";

export const config = new Hono().get("/config", (c) => {
  const region = (c.req.query("region") ?? "").toUpperCase();
  const line = verified(region);
  c.header("Cache-Control", CACHE);
  return c.json({
    region: region || null,
    // An unverified region gets the fallback rather than a number nobody has
    // checked. Nine of the ten rows are here today; each one is two fields.
    line: line
      ? { label: line.label, number: line.number, url: line.url }
      : FALLBACK,
    verified: line !== null,
    fallback: FALLBACK,
    // How much of the table stands up, said plainly, so the state is visible
    // from the API rather than only from PROGRESS.md.
    coverage: {
      seeded: CRISIS_LINES.length,
      verified: CRISIS_LINES.filter((l) => l.verifiedBy && l.verifiedAt).length,
    },
  });
});
