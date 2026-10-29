// One connection, opened the first time something needs it.
//
// Lazily on purpose: stories and config work signed out, so `GET /bits/today`
// and `GET /config` must answer with no DATABASE_URL set at all. A self-hoster
// reading today's story shouldn't have to stand up Postgres first.

import postgres from "postgres";

let client: postgres.Sql | null = null;

export const hasDb = () => Boolean(process.env.DATABASE_URL);

export const db = (): postgres.Sql => {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    // Neon and any managed Postgres want TLS; a local container doesn't have
    // a certificate. `prepare: false` is what lets this run through a pooler.
    client = postgres(url, {
      ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : "require",
      prepare: false,
      onnotice: () => {},
    });
  }
  return client;
};
