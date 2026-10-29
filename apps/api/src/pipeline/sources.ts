// Where candidates come from: publisher RSS and GDELT, both open, both free
// (backend.md's cost table). One list per channel, so the prefilter already
// knows roughly what it's looking at before a model sees anything.
//
// ponytail: a hand-kept list. It is the editorial surface of the pipeline and
// wants a person's judgement more than it wants a config format; give it a
// file of its own when someone other than the maintainer edits it (B8).

import type { Channel } from "../channels.ts";

export const SOURCES: Readonly<Record<Channel, readonly string[]>> = {
  medicine: [
    "https://www.who.int/rss-feeds/news-english.xml",
    "https://www.gavi.org/rss.xml",
  ],
  climate: [
    "https://www.iea.org/rss/news",
    "https://ourworldindata.org/atom.xml",
  ],
  "wild places": ["https://www.iucn.org/rss.xml"],
  kindness: [],
  science: ["https://www.nature.com/nature.rss"],
  "your city": [],
  rights: [],
  food: ["https://www.fao.org/newsroom/rss/en/"],
};

// Keywords that suggest a channel, used before any model call. Crude on
// purpose — this only has to cut ~200 candidates to ~50, and a wrong guess
// costs one classification, not a wrong story.
export const KEYWORDS: Readonly<Record<Channel, readonly string[]>> = {
  medicine: ["vaccine", "malaria", "mortality", "treatment", "disease", "immunis", "immuniz"],
  climate: ["emissions", "solar", "wind", "renewable", "coal", "carbon", "grid"],
  "wild places": ["species", "habitat", "forest", "reef", "wetland", "population recovered", "reintroduc"],
  kindness: ["volunteer", "donat", "neighbour", "neighbor", "shelter", "community"],
  science: ["discover", "measured", "detected", "confirmed", "experiment"],
  "your city": ["city", "council", "transit", "housing", "borough", "municipal"],
  rights: ["law", "ruling", "court", "rights", "legalis", "legaliz", "banned"],
  food: ["harvest", "hunger", "crop", "yield", "nutrition", "famine", "food security"],
};
