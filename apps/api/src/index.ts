// Running it on Node — locally, and on a €4 VPS if a free tier ever ends.
// The only file in here that imports a runtime.

import { serve } from "@hono/node-server";
import { app } from "./app.ts";

const port = Number(process.env.PORT) || 8787;
serve({ fetch: app.fetch, port });
console.log(`hope api on http://localhost:${port}`);
