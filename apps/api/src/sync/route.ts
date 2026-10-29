// B4 · POST /sync. The device is the source of truth for writing; this holds
// the copy that lets a second device catch up.
//
// Request and response are the same shape, and the response is the merged
// result — so a client that loses the reply can simply send again, and a
// client that has drifted converges by sending what it has.

import { Hono } from "hono";
import { z } from "zod";
import { db, hasDb } from "../db.ts";
import { currentAccount } from "../auth/session.ts";
import { emptyState, merge, type SyncState } from "./merge.ts";

const at = z.iso.datetime({ offset: true });

// The schema is the whole gate, the way tools/agent's brief schema is. It has
// no field for loop-breaker runs, a streak, or anything spoken, so a client
// that tried to send one gets it stripped rather than stored (P4, P2).
const stateSchema = z
  .object({
    entries: z
      .array(
        z.object({
          id: z.string().min(1).max(64),
          at,
          what: z.string().trim().min(1).max(120),
          bitId: z.string().max(64).nullable().default(null),
        }),
      )
      .max(5000)
      .default([]),
    keepsakes: z
      .array(
        z.object({
          bitId: z.string().min(1).max(64),
          at,
          removedAt: at.nullable().default(null),
        }),
      )
      .max(5000)
      .default([]),
    settings: z
      .array(
        z.object({
          key: z.string().min(1).max(64),
          value: z.string().max(2000),
          updatedAt: at,
        }),
      )
      .max(200)
      .default([]),
  })
  .strict();

const read = async (accountId: string): Promise<SyncState> => {
  const sql = db();
  const [entries, keepsakes, settings] = await Promise.all([
    sql`select id, at, what, bit_id from entry where account_id = ${accountId}`,
    sql`select bit_id, at, removed_at from keepsake where account_id = ${accountId}`,
    sql`select key, value, updated_at from setting where account_id = ${accountId}`,
  ]);
  const iso = (d: Date | null) => (d ? d.toISOString() : null);
  return {
    entries: entries.map((r) => ({ id: r.id, at: iso(r.at)!, what: r.what, bitId: r.bit_id })),
    keepsakes: keepsakes.map((r) => ({ bitId: r.bit_id, at: iso(r.at)!, removedAt: iso(r.removed_at) })),
    settings: settings.map((r) => ({ key: r.key, value: r.value, updatedAt: iso(r.updated_at)! })),
  };
};

// Writing the merged state back wholesale rather than diffing it: at ten
// people a wall is kilobytes, and an upsert of everything is provably the same
// value the caller was just handed.
// ponytail: whole-state upsert per sync. Send only what changed since a
// cursor if a wall ever gets long enough for this to matter.
const write = async (accountId: string, s: SyncState) => {
  const sql = db();
  await sql.begin(async (tx) => {
    for (const e of s.entries) {
      await tx`insert into entry (id, account_id, at, what, bit_id)
        values (${e.id}, ${accountId}, ${e.at}, ${e.what}, ${e.bitId})
        on conflict (id) do update set at = excluded.at, what = excluded.what, bit_id = excluded.bit_id`;
    }
    for (const k of s.keepsakes) {
      await tx`insert into keepsake (account_id, bit_id, at, removed_at)
        values (${accountId}, ${k.bitId}, ${k.at}, ${k.removedAt})
        on conflict (account_id, bit_id) do update set at = excluded.at, removed_at = excluded.removed_at`;
    }
    for (const st of s.settings) {
      await tx`insert into setting (account_id, key, value, updated_at)
        values (${accountId}, ${st.key}, ${st.value}, ${st.updatedAt})
        on conflict (account_id, key) do update set value = excluded.value, updated_at = excluded.updated_at`;
    }
  });
};

export const sync = new Hono().post("/sync", async (c) => {
  if (!hasDb()) return c.json({ error: "sync is not configured here" }, 501);
  const accountId = await currentAccount(c);
  // Signed out is not an error anywhere else in this product, but sync is the
  // one thing that needs an account by definition — it is what an account is.
  if (!accountId) return c.json({ error: "sign in to sync" }, 401);

  const body = await c.req.json().catch(() => ({}));
  const parsed = stateSchema.safeParse((body as { state?: unknown }).state ?? emptyState);
  if (!parsed.success) return c.json({ error: "that isn't a record we can merge" }, 400);

  const merged = merge(await read(accountId), parsed.data);
  await write(accountId, merged);
  return c.json({ state: merged });
});
