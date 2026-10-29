// Migrations run forward through small ordered steps (backend.md).
//
// No library: the whole thing is reading a sorted directory, skipping what has
// already run, and running the rest one transaction each. A migration tool
// would be a dependency to hold the same twenty lines.

import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { db } from "./db.ts";

const dir = fileURLToPath(new URL("../migrations/", import.meta.url));

export const migrate = async () => {
  const sql = db();
  await sql`create table if not exists _migration (
    name text primary key,
    ran_at timestamptz not null default now()
  )`;
  const done = new Set((await sql<{ name: string }[]>`select name from _migration`).map((r) => r.name));

  for (const name of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(name)) continue;
    const body = readFileSync(dir + name, "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into _migration (name) values (${name})`;
    });
    console.log(`migrated ${name}`);
  }
};

if (import.meta.filename === process.argv[1]) {
  await migrate();
  process.exit(0);
}
