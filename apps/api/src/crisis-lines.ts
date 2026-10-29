// The crisis line table. Ten seeded rows, and the route serves a row only once
// someone with local knowledge has verified it (P6, and the review gate in
// PROGRESS.md — "10 seeded, 0 verified").
//
// A number that is wrong is worse than a number that is missing: the fallback
// sends someone to a directory that will find them a working line, and a dead
// number sends them nowhere at the moment it matters most. So `verifiedBy` and
// `verifiedAt` are not documentation — config.ts filters on them, and
// config.test.ts holds it shut. Verifying a country is filling in two fields
// here, with no code change and no schema change.
//
// ponytail: a TypeScript file, not a database table. Ten rows that change on a
// deploy don't need Postgres; give them a table at B8, when the review tool
// means someone other than the maintainer can edit them.

export type CrisisLine = Readonly<{
  region: string; // ISO 3166-1 alpha-2
  label: string;
  number: string;
  url: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
}>;

// SAFETY.md names this by name, and it is where an unverified region goes.
export const FALLBACK = {
  label: "Find a helpline",
  number: null,
  url: "https://findahelpline.com",
} as const;

export const CRISIS_LINES: readonly CrisisLine[] = [
  // 988 is the one number SAFETY.md quotes in its own copy, so it is the one
  // row that can be filled without asking anyone. CA also dials 988 — and it
  // stays unverified anyway, because the gate asks for local knowledge, not
  // inference from a neighbour.
  { region: "US", label: "988 Suicide & Crisis Lifeline", number: "988", url: "https://988lifeline.org", verifiedBy: null, verifiedAt: null },
  { region: "CA", label: "9-8-8 Suicide Crisis Helpline", number: "988", url: "https://988.ca", verifiedBy: null, verifiedAt: null },
  { region: "GB", label: "Samaritans", number: "116 123", url: "https://samaritans.org", verifiedBy: null, verifiedAt: null },
  { region: "IE", label: "Samaritans", number: "116 123", url: "https://samaritans.org", verifiedBy: null, verifiedAt: null },
  { region: "AU", label: "Lifeline", number: "13 11 14", url: "https://lifeline.org.au", verifiedBy: null, verifiedAt: null },
  { region: "NZ", label: "1737, Need to talk?", number: "1737", url: "https://1737.org.nz", verifiedBy: null, verifiedAt: null },
  { region: "IN", label: "Tele-MANAS", number: "14416", url: "https://telemanas.mohfw.gov.in", verifiedBy: null, verifiedAt: null },
  { region: "DE", label: "Telefonseelsorge", number: "0800 111 0 111", url: "https://telefonseelsorge.de", verifiedBy: null, verifiedAt: null },
  { region: "FR", label: "3114", number: "3114", url: "https://3114.fr", verifiedBy: null, verifiedAt: null },
  { region: "ZA", label: "SADAG", number: "0800 567 567", url: "https://sadag.org", verifiedBy: null, verifiedAt: null },
];

export const verified = (region: string): CrisisLine | null =>
  CRISIS_LINES.find(
    (l) => l.region === region.toUpperCase() && l.verifiedBy !== null && l.verifiedAt !== null,
  ) ?? null;
