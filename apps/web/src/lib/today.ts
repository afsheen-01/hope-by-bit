// Today's story (W2). Two paths, and both have to hold:
//
//   • At build time this reads the published day file and picks the story, so
//     `/today` renders server-side and the page reads with JavaScript off.
//   • In the browser, `/today` fetches `/api/bits/today` and swaps only if the
//     date has moved on — the HTML is from the last nightly build, so a stale
//     tab is showing *yesterday's* story, not a different spelling of today's.
//
// ponytail: imports the API's own `choose` by relative path rather than
// through a package, because there is no workspace here. `choose` is pure and
// dependency-free, so this is a path that changes at C1 rather than a coupling
// that has to be unwound. The day files come in through Vite's build-time
// glob rather than the API's `readDay` — Astro rewrites `import.meta.url`
// while bundling, so a filesystem read resolves somewhere else by the time it
// runs; the glob is resolved by the bundler and needs no filesystem at all.

import { parseChannels } from "../../../api/src/channels.ts";
import { choose } from "../../../api/src/choose.ts";
import type { Bit, DayFile } from "../../../api/src/types.ts";

export type { Bit } from "../../../api/src/types.ts";

const published = Object.values(
  import.meta.glob<DayFile>("../../../api/published/*.json", { eager: true, import: "default" }),
).sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

// UTC, matching the API, so the build and the fetch agree on which day it is.
const todayUtc = () => new Date().toISOString().slice(0, 10);

// Shown when the pipeline has published nothing at all — a first clone, or a
// self-hoster's first night. The page says so rather than pretending.
export const placeholder: Bit = {
  date: "Thursday",
  headline: "Malaria vaccine reaches 20 million children",
  figure: "13%",
  figureCap: "fewer deaths from any cause among vaccinated under-fives",
  body:
    "Twenty-three African countries have folded the vaccine into routine " +
    "immunisation. Malaria has killed half a million children a year for " +
    "as long as anyone has been counting. That number is moving.",
  source: "Gavi · WHO",
  ask: "Now one small thing, while you're here. Whichever is nearest — they all count the same.",
  // Two or three, all body-sized: free, no signup, finishable now (P7).
  movements: ["A glass of water", "Stand up and stretch", "Ninety seconds outside"],
};

export const today = (): Bit => {
  // Today's file if the pipeline has run, else the most recent one — a build
  // that happens before the night's review still shows a real story.
  const date = todayUtc();
  const day = published.find((d) => d.date === date) ?? published[0];
  // Signed out is one edition: all eight channels into the same deterministic
  // `choose` the API uses, so the built page and the fetch agree.
  return (day && choose(day.date, parseChannels(undefined), day)) ?? placeholder;
};
