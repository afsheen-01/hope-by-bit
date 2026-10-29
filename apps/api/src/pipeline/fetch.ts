// Pull the night's candidates. Around two hundred in, before the prefilter.

import { SOURCES } from "./sources.ts";
import type { Channel } from "../channels.ts";

export type Candidate = Readonly<{
  channel: Channel; // the feed it came from, not a verdict
  title: string;
  summary: string;
  url: string;
  at: string;
}>;

const strip = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|apos);/g, (_, e) =>
      ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'" })[e as string] ?? "",
    )
    .replace(/\s+/g, " ")
    .trim();

const tag = (item: string, ...names: string[]) => {
  for (const n of names) {
    const m = item.match(new RegExp(`<${n}[^>]*>([\\s\\S]*?)</${n}>`, "i"));
    if (m) return strip(m[1]);
    // Atom links carry the url in an attribute rather than a body.
    const attr = item.match(new RegExp(`<${n}[^>]*href="([^"]+)"`, "i"));
    if (attr) return attr[1];
  }
  return "";
};

// ponytail: regex over the feed body rather than a real XML parse. RSS and
// Atom are close enough to regular here that a parser dependency buys
// correctness on feeds we don't read; reach for one the first time a
// legitimate story is lost to a malformed entry.
const parse = (xml: string, channel: Channel): Candidate[] =>
  [...xml.matchAll(/<(item|entry)[^>]*>([\s\S]*?)<\/\1>/gi)].map(([, , item]) => ({
    channel,
    title: tag(item, "title"),
    summary: tag(item, "description", "summary", "content"),
    url: tag(item, "link", "id"),
    at: tag(item, "pubDate", "updated", "published"),
  }));

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const jobs = Object.entries(SOURCES).flatMap(([channel, urls]) =>
    urls.map(async (url) => {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(15_000) });
        if (!r.ok) return [];
        return parse(await r.text(), channel as Channel);
      } catch {
        // A feed that is down tonight is not a reason to lose the other seven.
        console.error(`fetch failed: ${url}`);
        return [];
      }
    }),
  );
  return (await Promise.all(jobs)).flat().filter((c) => c.title && c.url);
};
