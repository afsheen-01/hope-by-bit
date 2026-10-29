// The whole API, and no server. `index.ts` is the only file that knows how it
// is being run — so a Cloudflare Worker or a Netlify function later is a
// three-line file that imports this one, and the deploy vendor stays a
// decision we haven't had to make yet.

import { Hono } from "hono";
import { bits } from "./bits.ts";
import { config } from "./config.ts";
import { email } from "./auth/email.ts";
import { google } from "./auth/google.ts";
import { sync } from "./sync/route.ts";

export const app = new Hono()
  // Stories and config work signed out — the app is whole with no account.
  .route("/", bits)
  .route("/", config)
  // Accounts and sync, which add a second device and nothing else.
  .route("/", google)
  .route("/", email)
  .route("/", sync)
  .get("/health", (c) => c.json({ ok: true }))
  .notFound((c) => c.json({ error: "no such route" }, 404));

// No analytics, no crash reporting, no request logging with addresses in it.
// A stack trace carries a screen name, and a screen name near the loop breaker
// is a measurement of somebody's worst hour (SAFETY.md). What is left is the
// status code, which is all an uptime check needs.
app.onError((err, c) => {
  console.error(err.message);
  return c.json({ error: "something went wrong here" }, 500);
});
