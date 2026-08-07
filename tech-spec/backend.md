# Tech spec · The backend

**One TypeScript service behind the app and the website. Serves the stories, holds the account,
syncs the wall, keeps the circle, sends the check-in, and carries safety config that reaches every
device within the hour.**

A separate spec, because the app and the website share this and describing it twice would let the
two descriptions drift.

Status: **specification**. No code written.

## What it does

**Stories.** Runs the nightly pipeline and serves the result: today's story per channel, the
archive, and the sources. Anonymous, cached at the edge, identical for everyone asking for the same
channel.

**Accounts.** A minimal identity so a record follows its person between phone and browser: an id,
an email, how they signed in, and when it was made.

**Sync.** The wall, Keepsakes, the circle, channel choices, the check-in message, and settings.

**Messages.** The circle's intro and consent replies, and the check-in itself — sent on a tap, or
at the count the person set ([P5](../PRINCIPLES.md)).

**Safety config.** Crisis lines by region and copy corrections, fetched on launch and cached, so a
wrong number reaches every device within the hour instead of waiting on an app store review.

**What the device keeps to itself:** loop-breaker runs and anything spoken. What arrives here is a
request to send a message; the API has no field that could hold the history behind it
([P4](../PRINCIPLES.md)).

## Stack

TypeScript on serverless functions with a CDN in front, so the shared core runs unchanged on the
server and contributors work in one language. Postgres for accounts, sync, and the circle. Object
storage plus CDN for published stories. A messaging provider for SMS. The nightly pipeline is a
scheduled job, and read paths are cached at the edge.

```
apps/api/
  routes/    bits · account · sync · circle · checkin · config
  pipeline/  fetch · classify · review · publish
  messaging/ send · consent-replies · rate-limits
  auth/      google · email links · sessions
  db/        schema · migrations
```

## The API

| | |
|---|---|
| `GET /bits/today?channels=` | today's story per channel. anonymous, edge-cached |
| `GET /bits/:date` · `GET /archive` | the archive |
| `GET /config?region=` | crisis lines and copy corrections |
| `POST /auth/google` · `POST /auth/email` | sign-in; both land on one account by verified email |
| `POST /sync` | send local changes, receive remote ones |
| `POST /circle` · `DELETE /circle/:id` | add a member and send their intro; remove and release |
| `POST /checkin` | message the confirmed circle. rate-limited (below) |
| `POST /webhook/sms` | inbound YES and STOP |
| `GET /export` · `POST /delete` | the whole record as one file; removal with a receipt |

Stories and config work signed out. **The app is whole with no account**, holding the circle locally
and handing the check-in to the phone's own share sheet; an account adds a second device and
automatic sending.

## Sync

Shaped so merging resolves on its own, in any order. **The wall appends** — entries carry a
client-generated id and their own timestamp, so two devices offline both arrive. **Keepsakes are a
set**, add and remove each carrying a time. **Settings and circle rows are last-write-wins per key.**

The device stays the source of truth for writing and works offline for as long as you like — today's
story, the whole wall, Keepsakes, and the entire loop breaker — reconciling when the network returns.

## The check-in

`POST /checkin` messages every circle member whose consent is `confirmed`, and reports back who was
reached.

**Called two ways:** from a tap on the check-in screen, or by the phone when loop-breaker runs reach
the count the person set and switched on. The count itself is computed and kept on the device; the
request carries only the reason — `tap` or `threshold` — which decides the wording.

**Rate limits, enforced here rather than trusted from the client.** One threshold message per
account per 24 hours, and at most three tapped messages a day, so a hard day reads as a hard day
rather than a stream. Requests past the limit return the limit and send nothing.

**The wording is honest about how it was sent.** A tapped message reads as the person reaching out.
A threshold message says what it is: *"[Name] has been using their grounding tool a lot today. They
asked us to tell you when that happens."* Every message opens with the person's name and carries
STOP.

**Delivery is reported, not read receipts** — the account learns a message was accepted for
delivery, which is what the confirmation screen shows.

## Data

```
account    id · email · provider · createdAt
entry      id · accountId · at · what · bitId · dedication
keepsake   accountId · bitId · at
circle     id · accountId · name · e164 · consent · confirmedAt
setting    accountId · key · value · updatedAt
message    id · accountId · circleId · reason · sentAt · status
```

An entry can hold the name of someone who died; a circle row holds a third party's phone number.
Both are treated to the standard in [SAFETY.md](../SAFETY.md): encrypted, purpose-limited, released
on removal or deletion. `message` keeps what was sent and when, for delivery and for the person's
own record, and holds nothing about what preceded it.

**Auth is passwordless:** Google, or an emailed sign-in link, with passkeys following as a third way
onto the same account. Sessions are short-lived tokens with refresh.

## What it costs

Starting size is **ten people**. Every service is on a free or starter plan, chosen so the first
year's decisions are made without a bill shaping them.

| | Starter choice | $/month |
|---|---|---|
| Static hosting and CDN | Cloudflare Pages, free | 0 |
| API functions | Cloudflare Workers, free — 100k requests a day against our ~40 | 0 |
| Postgres | Neon free tier; ten people's records are kilobytes | 0 |
| Published stories | files in the repo, served from the CDN | 0 |
| Sign-in email | Resend free tier, 3,000 a month | 0 |
| Google sign-in | Google OAuth | 0 |
| News sources | publisher RSS and GDELT, both open | 0 |
| Classification | Haiku over ~50 candidates a day after a keyword prefilter | ~3 |
| Domain | a free subdomain to start | 0 |
| Uptime checks | UptimeRobot free tier | 0 |
| Messaging number and registration | a number plus US 10DLC sole-proprietor registration | ~3 |
| Messages | 30 intros once, then a handful | <1 |
| **Apple Developer Program** | required to put anything on an iPhone, $99/yr | **8** |
| Google Play | $25, one time | ~0 |
| **Total** | | **~$15** |

**At this size the largest single line is Apple's**, more than everything else combined. Shipping
the website first and the app second costs about $7 a month and defers that until there's someone
to ship to.

**Open alternatives**, for when a free tier ends or a vendor stops suiting:

| | Instead of | |
|---|---|---|
| Hosting and API | Cloudflare | Hono behind Caddy on a €4 VPS |
| Database | Neon | Postgres on that same VPS |
| Sign-in email | Resend | Amazon SES at $0.10 per thousand, or self-hosted Postal |
| Error reporting | Sentry | GlitchTip, self-hosted |
| Builds | EAS | local builds and fastlane |

**Messaging has no open substitute**, because delivering an SMS means paying a carrier. The
alternatives change the channel rather than the price: a Telegram bot is free and asks the circle to
use Telegram; the share-sheet handoff is free and asks the person to tap. SMS reaches people who
have only a phone number, which is the whole point of the circle, so it's the line worth paying.

**What breaks first as this grows:** messages, which scale with how hard people's days are and have
no free tier. Everything else has room for thousands of people before it costs anything. That makes
the messaging bill the number to watch — a jump in it means either growth or a worse month for a lot
of people, and telling those apart matters ([P10](../PRINCIPLES.md)).

**SMS regulation is the gating item, not the price.** Sending to US numbers needs 10DLC brand and
campaign registration; India needs DLT entity, header and template registration; other countries
differ again. Each takes days and paperwork rather than money, so start it early — before B5, not
during it.

## Operating it

One region to start, reads served globally from the edge. Backups nightly with a thirty-day window.
Migrations run forward through small ordered steps. The pipeline's daily review is a protected route
with its own sign-in. The messaging number is dedicated, registered for the region it sends in, and
handles STOP at the provider as well as in our own records.

**Self-hosting is a first-class path**: one command brings up Postgres and the functions locally,
with the messaging provider swappable, and the docs carry the full sequence.

## Milestones

**B1** stories published and `/bits/today` live. **B2** config: crisis lines by region. **B3**
accounts: Google and email links, sessions. **B4** sync: the merge shapes, verified across two
devices offline at once. **B5** circle: storage, intro messages, YES and STOP arriving back. **B6**
check-in: both reasons, rate limits, honest wording, delivery reported. **B7** export and delete,
delete releasing the circle. **B8** the daily review tool. **B9** self-hosting from the docs alone.

## Open questions

1. **End-to-end encryption of wall entries.** Entries hold dedications, so this deserves a real
   answer. Passwordless sign-in leaves no password to derive a key from, which means a recovery
   phrase the person keeps — with its own risk of a lost record. Server-side encryption at rest is
   what's specced. **Decide before B4**, since it shapes the schema. Note that the circle's numbers
   can't be end-to-end encrypted regardless, because the server sends the messages.
2. **What happens when the threshold fires and nobody is confirmed.** Specced as: the setting can't
   be switched on. Whether a member who later replies STOP should silently disable it, or say so
   first, needs deciding at B5.
3. **Retention after long silence.** An account untouched for years: leaning toward keeping it,
   because a memorial that expires is worse than a small bill. Circle numbers are the exception and
   should probably lapse, since consent given in 2026 shouldn't still be sending messages in 2034.
4. **Region.** One region is simple and cheap; people outside it get slower sync and their data
   sitting somewhere they may not expect. Publish where it lives, and revisit when there's a reason.
