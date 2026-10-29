// B3 · Google sign-in. The browser gets a code, we exchange it here, and the
// account is found by the verified email — the same account an emailed link
// lands on.

import { Hono } from "hono";
import { hasDb } from "../db.ts";
import { accountFor, origin, startSession } from "./session.ts";

type UserInfo = { email?: string; email_verified?: boolean };

export const google = new Hono().post("/auth/google", async (c) => {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret || !hasDb()) return c.json({ error: "sign-in is not configured here" }, 501);

  const { code, redirectUri } = await c.req.json<{ code?: string; redirectUri?: string }>();
  if (!code) return c.json({ error: "code is required" }, 400);

  const token = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: id,
      client_secret: secret,
      redirect_uri: redirectUri ?? `${origin()}/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!token.ok) return c.json({ error: "that sign-in didn't complete" }, 401);
  const { access_token } = (await token.json()) as { access_token?: string };
  if (!access_token) return c.json({ error: "that sign-in didn't complete" }, 401);

  // ponytail: a userinfo round-trip instead of verifying the id_token against
  // Google's JWKS. The token came back over TLS from a channel we just
  // authenticated with our own secret, so the extra hop buys the same answer
  // with no crypto dependency. Swap in JWKS if the latency ever shows up.
  const me = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${access_token}` },
  });
  const info = (await me.json()) as UserInfo;
  // Unverified means Google doesn't vouch for it, and an unvouched email would
  // be a way onto somebody else's account.
  if (!info.email || info.email_verified !== true) {
    return c.json({ error: "that address isn't verified with Google" }, 401);
  }

  const accountId = await accountFor(info.email, "google");
  await startSession(c, accountId);
  return c.json({ ok: true });
});
