# Safety

Binding on every surface, including ones the agent generates.

**What this is:** a daily ritual, a record of small things done, and two tools for hard moments.
For treatment, counselling, or a crisis, the right people are elsewhere, and the product's job is
to point at them clearly and quickly.

## The crisis boundary

Every screen in the hard-moment flow — each loop breaker step, the check-in, the confirmation —
shows the crisis line. Quiet, always there, sized to sit under whatever the screen is for.

> This app is for hard moments. If you're in danger, call or text **988** (US) or your local crisis
> line — that's who to reach right now.

**The line matches where the person is.** A number that works in one country is a dead end
everywhere else, so the core looks it up by region, from the device's language and overridable in
settings, falling back to findahelpline.com so there's always somewhere to go.

The table lives in backend config, fetched on launch and cached, so a correction reaches every
device within the hour rather than waiting on an app store review. Every
row needs someone with local knowledge to verify it:

| | | | |
|---|---|---|---|
| US · 988 | CA · 988 | UK/IE · Samaritans 116 123 | AU · Lifeline 13 11 14 |
| NZ · 1737 | IN · Tele-MANAS 14416 | DE · 0800 111 0 111 | FR · 3114 |
| ZA · 0800 567 567 | | | fallback · findahelpline.com |

**Checked:** present on every hard-moment screen, unconditional, above the fold, and reachable
regardless of settings, variant, or generated configuration — the schema has no field that could
change it.

## The automatic check-in

Someone deep in a hard moment may be past acting, so the product can act on instructions they left
for themselves.

**It runs a rule the person wrote, not a judgement the app formed.** Loop-breaker runs are counted
on the phone. At the count they set, if they switched this on, the phone asks the backend to
message their circle. The app holds no view about how anyone is doing, and it says as much to
everyone involved.

**How it is bounded.**

- **Off until chosen**, in a calm moment at setup, with the consequence shown in full: who gets
  told, what the message says, and at what count.
- **The count is theirs** — three by default, adjustable from two to five.
- **One message a day.** A fourth, fifth or eighth run in the same day passes quietly, so the tool
  stays usable once the day has already been named.
- **Twenty seconds to say otherwise.** The closing screen names who is about to be told and offers
  *just me this time*. Doing nothing sends, so help is what happens by default and stopping it is
  what takes a hand.
- **The message says it was automatic**, so the recipient reads it correctly: *"[Name] has been
  using their grounding tool a lot today. They asked us to tell you when that happens. A call or a
  text would mean a lot."* Presenting a threshold as a personal reach-out would misrepresent both
  people.
- **A way back.** After a send, one tap offers *let them know I'm alright*, for the times the count
  meant less than it looked like.
- **Runs stay on the phone.** What reaches the backend is a request to send a message. The API has
  no field for loop-breaker history, and nobody — not us, not the circle — can see how often the
  tool was opened ([P4](product/principles.md)).

**What this rule cannot do.** A count is a count. Someone in real trouble on their first run of the
day trips nothing, so the crisis line stays on every screen and the check-in button stays one tap
away. The setup screen says this plainly, because a circle that believes silence means safety is
worse off than one that was never asked.

## The circle

Real people are being asked for something emotionally real, and messages now go out under our name
rather than the person's, so both sides get a say.

**Every member agrees first.** At setup each person receives one message — *"Hope By Bit: [Name]
chose you as someone to reach out to when things are heavy. Reply YES to be reachable, STOP to
decline."* — and only a YES makes them reachable. Their status shows in the app as pending,
confirmed, or declined, so nobody is left believing in a safety net that was never fastened.

**STOP works in any message, at any time**, and takes effect immediately.

**With nobody confirmed**, the automatic setting stays unavailable and the app says why, offering
the share-sheet handoff from the person's own phone in the meantime.

**Numbers are held to the standard in [User data](#user-data)**: encrypted, used for this alone,
cleared when a member is removed or the account is deleted.

## The grief gate

Dedicating actions to what someone is carrying is the most powerful thing in this product, which is
exactly why it ships behind a gate. The copy says grief and leaves it there.

**Every part of the grief path carries written sign-off from a qualified grief counsellor** before
release, recorded with a name and date, and renewed whenever the copy changes meaningfully.

What the review confirms: bits are offered by what today can hold ([P8](product/principles.md)),
enforced by the tone check; the wall waits to be visited rather than arriving on dates; the dedication offer
comes after an action, so what is carried stays a dedication; the name is asked once and
stands; turning the path off keeps the wall and the dedications, simply unlabelled; and the record
is held against the person's own history alone.

Onboarding asks once, plainly — *"Anything you're carrying right now?"* — and moving straight past
it is presented as an equally ordinary answer.

## User data

The backend holds the wall, Keepsakes, the circle, and settings so a record and its people follow
their person between devices ([P9](product/principles.md)). A wall entry can hold a name someone is
carrying, and a circle row holds a third party's phone number; both are treated to that standard.

Encrypted in transit and at rest. Used for the purpose they were given for and no other. Access
limited to the maintainers who operate the service, with reads logged. Export returns the whole
record as one plain file in a single call. Delete clears the phone and the server together,
releases every circle member, and returns a receipt.

The loop breaker's history and anything spoken stay on the device, and the API has nowhere to put
them. Measurement stays away from the hard-moment flow entirely, including crash reporting, since a
stack trace carries a screen name.

## Content

The daily story reaches people on their worst days, so the [bad-day test](product/features.md) is a
safety check as much as an editorial one.

Frame numbers on the living — *children reached*, *cases prevented*. Let people appear as they'd
want to be seen. Let the action stand on its own merits, so the choice to act stays free. Speak
about the world rather than about the reader's health. And verify before publishing: a story that
holds up is what earns a cynical reader's attention.

## Reporting a problem

Safety issues go to the maintainers privately. A safety fix takes priority over everything else,
including releases.
