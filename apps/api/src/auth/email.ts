// B3 · sign-in by emailed link. Passwordless, so there is no password to
// leak, and the link is single-use with a fifteen-minute life.

import { randomBytes } from "node:crypto";
import { Hono } from "hono";
import { db, hasDb } from "../db.ts";
import { accountFor, digest, origin, startSession } from "./session.ts";

const MINUTES = 15;

const send = async (to: string, link: string) => {
  const key = process.env.RESEND_API_KEY;
  // No key, no problem: the link goes to stdout. That is what a self-hoster
  // gets on their first run, and what the docs tell them to expect (B9).
  if (!key) {
    console.log(`sign-in link for ${to}: ${link}`);
    return;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "Hope By Bit <hello@localhost>",
      to,
      subject: "Your sign-in link",
      // Plain, specific, warm — and honest that it expires.
      text: `Here's your link back in. It works once, and for the next ${MINUTES} minutes.\n\n${link}\n\nIf you didn't ask for this, nothing has happened and you can ignore it.`,
    }),
  });
  if (!r.ok) console.error(`resend refused: ${r.status}`);
};

export const email = new Hono()
  .post("/auth/email", async (c) => {
    if (!hasDb()) return c.json({ error: "sign-in is not configured here" }, 501);
    const { email: address } = await c.req.json<{ email?: string }>();
    // Enough of a check to catch a typo; the link itself is the real proof.
    if (!address || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
      return c.json({ error: "that doesn't look like an email address" }, 400);
    }

    const token = randomBytes(32).toString("base64url");
    await db()`insert into sign_in_link (token_hash, email, expires_at)
      values (${digest(token)}, ${address.toLowerCase()}, ${new Date(Date.now() + MINUTES * 60_000)})`;
    await send(address, `${origin()}/api/auth/email/callback?token=${token}`);

    // The same answer whether or not that address has an account here. Telling
    // the two apart is a way to ask this API who has one.
    return c.json({ ok: true });
  })

  .get("/auth/email/callback", async (c) => {
    if (!hasDb()) return c.json({ error: "sign-in is not configured here" }, 501);
    const token = c.req.query("token");
    if (!token) return c.json({ error: "that link is incomplete" }, 400);

    // Single-use: the update is the claim, so two clicks race to one winner.
    const [row] = await db()<{ email: string }[]>`
      update sign_in_link set used_at = now()
      where token_hash = ${digest(token)} and used_at is null and expires_at > now()
      returning email`;
    if (!row) return c.json({ error: "that link has expired or was already used" }, 401);

    await startSession(c, await accountFor(row.email, "email"));
    return c.redirect(`${origin()}/today`);
  });
