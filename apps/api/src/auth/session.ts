// Sessions: short-lived tokens, stored hashed.
//
// ponytail: a 30-day cookie is the whole session model — no JWT, no refresh
// rotation, no passkeys. Passkeys are a third way onto the same account when
// someone asks for them; refresh matters when 30 days of re-login annoys
// somebody. Neither is true yet.

import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { db } from "../db.ts";

export const COOKIE = "hope_session";
const DAYS = 30;

// What is stored is the hash. Someone holding a dump of `session` holds no
// working sessions, which is the only reason storing them at all is fine.
const digest = (token: string) => createHash("sha256").update(token).digest("hex");

export const accountFor = async (email: string, provider: "google" | "email") => {
  const sql = db();
  const [row] = await sql<{ id: string }[]>`
    insert into account (id, email, provider) values (${randomUUID()}, ${email.toLowerCase()}, ${provider})
    on conflict (email) do update set email = excluded.email
    returning id`;
  return row.id;
};

export const startSession = async (c: Context, accountId: string) => {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + DAYS * 86_400_000);
  await db()`insert into session (token_hash, account_id, expires_at)
    values (${digest(token)}, ${accountId}, ${expires})`;
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure: new URL(origin()).protocol === "https:",
    sameSite: "Lax",
    path: "/",
    expires,
  });
};

// null rather than a throw: every caller's answer to "not signed in" is a 401
// it writes itself, and stories and config never ask at all.
export const currentAccount = async (c: Context): Promise<string | null> => {
  const token = getCookie(c, COOKIE);
  if (!token) return null;
  const [row] = await db()<{ account_id: string }[]>`
    select account_id from session
    where token_hash = ${digest(token)} and expires_at > now()`;
  return row?.account_id ?? null;
};

export const endSession = async (c: Context) => {
  const token = getCookie(c, COOKIE);
  if (token) await db()`delete from session where token_hash = ${digest(token)}`;
  deleteCookie(c, COOKIE, { path: "/" });
};

export const origin = () => process.env.PUBLIC_ORIGIN ?? "http://localhost:4321";

export { digest };
