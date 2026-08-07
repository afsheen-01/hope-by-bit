# Tech spec · Onboarding

**Five questions, four of them skippable, and then today's story.**

Onboarding spans the app, the website, and the backend, so it lives in its own spec. Each step
earns its place by changing what the person gets tomorrow, and each one hands back something usable
on its own.

Status: **specification**. No code written.

## The shape

```
1  What do you want proof about?      interests          required
2  Anything you're carrying?          path               skippable
3  Who should we tell, if you ask?    circle             skippable
4  When should it arrive?             notification time  has a default
5  Keep this if you change phones     account            skippable
                                      ↓
                            today's story
```

**Value comes before commitment.** Interests first, because picking three chips is the moment the
product explains itself. The account comes last, once there's a record worth keeping. Anyone who
stops after step 1 has a working app.

A progress marker reads *1 of 5* so the end is visible from the start. Every step can be revisited
from settings, and each one stands as answered once given.

## 1 · Interests

Eight channels — medicine, climate, wild places, kindness, science, your city, rights, food —
picked as chips. Three to five, with five the ceiling because a sixth channel dilutes the day
rather than widening it.

The counter reads *3 chosen*, and *pick at least three* below that, so the requirement arrives when
it's relevant. Reaching for a sixth explains the ceiling in one line and keeps the five.

Saved to the variant as `channels`, and it's what the daily fetch asks for ([backend](backend.md)).

## 2 · Path

*"Anything you're carrying right now?"* Grief leads, as the deepest path, with illness, burnout,
loneliness and worry alongside. Up to two.

Choosing grief opens one more field: **who you're carrying**, a name, asked once and kept. The
screen explains what the name unlocks — actions can be done in their name, and the wall becomes a
record of that — so the choice is made with the consequence in view
([SAFETY.md](../SAFETY.md)).

Moving straight past this step is presented as an equally ordinary answer, and it stays available
in settings for whenever it becomes relevant.

## 3 · The circle

Two to four people, chosen through the phone's own contact picker, so the app receives the contacts
the person selects and nothing else. Entering a name and number by hand sits alongside, so the
contacts permission is a convenience rather than a gate.

**Each person is asked first.** On finishing this step, every number receives one message:

> *Hope By Bit: [Name] chose you as someone to reach out to when things are heavy. Reply YES to be
> reachable, STOP to decline.*

Only a YES makes someone reachable. The step ends showing each person as **pending**, and the
status updates to confirmed or declined as replies arrive, so the person always knows who is
actually there ([SAFETY.md](../SAFETY.md)).

**Then the message they'd receive**, editable here and any time after:

> *[Name] is having a hard moment and asked me to let you know. A call or a text would mean a lot
> right now.*

Writing it here, calm, is the point — the hard moment itself asks nothing of you.

**Then the setting that matters most on this screen**, off until switched on:

> *If I open the loop breaker three times in a day, tell my people.*

Turning it on shows the whole consequence at once: the count (three by default, adjustable from two
to five), who gets told, the wording they receive — which says plainly that it was automatic — and
the twenty-second window offering *just me this time* before it goes. It also says what the rule
can't do: a count is a count, and a hard day that doesn't reach three passes unremarked, which is
why the check-in button and the crisis line stay where they are.

Numbers are held on the account, encrypted, used for this and nothing else, and released when a
member is removed or the account is deleted ([P9](../PRINCIPLES.md)).

Carrying on without a circle leaves every other part intact. With nobody confirmed, the automatic
setting stays unavailable and says why, offering the share-sheet handoff from the person's own
phone in the meantime.

## 4 · Notification time

One arrival a day, defaulting to 08:00, set with a time picker. The screen says the reminder is
scheduled on the phone, which is also why it works with the network away
([P3](../PRINCIPLES.md)). Notification permission is requested here; declining leaves the app
opening to the day's story whenever it's opened.

## 5 · Account

*"Keep this if you change phones."* An email address is the identity, arriving one of two ways:

- **Sign in with Google** — we ask for an email address and a stable id, and that's the whole scope.
- **An emailed sign-in link** — type an address, tap the link.

Both land on the same account when the email matches and the provider reports it verified. Passkeys
follow later as a third way onto the same account.

Everything from steps 1–4 uploads on first sign-in and merges by the shapes in the
[backend spec](backend.md), so signing in after a month of use brings that month with it.

**Skipping keeps the app whole** on this device, with the circle held locally and the check-in
handed to the phone's own share sheet. An account adds a second device and automatic sending, and
the step is offered again from settings.

## Theme

Three settings, reachable from settings and from the last onboarding screen: **Auto** (the default),
**Light**, **Dark**.

**Auto follows the clock**, computed on the device: light from 07:00, dark from 19:00 local, both
hours adjustable. The switch happens on foreground and on the hour, so a session in progress carries
on in the palette it started in.

**Light and Dark hold**, and travel with the account as a synced setting, so a new phone opens the
way the last one looked.

The palette is **Grove** — oat, forest, apricot — and both grounds are designed as first-class, with
every screen checked in each. **First paint matches**, with the app resolving the theme before the
first render and the website setting it from an inline script ahead of paint.

## Building it

**The app** runs onboarding as five routes under `setup/`, with the variant as the accumulating
answer, saved after each step so closing the app mid-way resumes where it stopped. Permissions are
requested at the step that uses them, each after its own line of explanation.

**The website** runs steps 1, 2, 4 and 5, with the circle offered as a link to the app, since the
contact picker belongs to the phone. Signed-out answers live in the browser and upload on sign-in.

**The backend** carries `POST /auth/google`, `POST /auth/email`, the session exchange, circle
storage with consent state, and the intro message ([backend spec](backend.md)).

## Milestones

**O1** the five steps in the app, with the variant accumulating and resuming. **O2** the contact
picker, the intro message, and consent state arriving back. **O3** Google and email sign-in, both
landing on one account by verified email. **O4** first-sign-in upload and merge, verified with a
month of local history. **O5** the automatic check-in setting, with the count, the window, and the
follow-up. **O6** the theme setting, Auto on the clock with a matching first paint on both surfaces.
**O7** onboarding on the website, with sign-in carrying browser answers up.

## Open questions

1. **What a pinned Light theme does at 3am.** Someone who chose Light and opens the loop breaker in
   the dark gets a bright screen at the worst moment. Overriding an explicit choice is its own kind
   of wrong, so the options are a dim treatment for that screen alone, or letting the choice stand.
   Decide alongside the loop breaker's visual design, at M3.
2. **A "follow system" theme option.** Auto follows the clock, which is what this product wants at
   3am; some people would rather their OS setting ruled. Cheap to add, and one more line on a
   settings screen this product keeps short.
3. **Sunrise and sunset instead of fixed hours** would be more accurate and needs a location
   permission the product otherwise has no reason to ask for. Fixed adjustable hours look like the
   better trade.
4. **Where the account step sits.** Specced last, so value comes before commitment. Google sign-in
   first is the convention and would raise the share of people whose records survive a lost phone —
   and, now, the share who have automatic sending available at all. Worth revisiting.
5. **Circles that never confirm.** If nobody replies YES, someone has a circle on screen and no
   safety net behind it. The app says so, and a reminder after a few days is probably right; how
   many times to ask before letting it rest needs a decision at O2.
