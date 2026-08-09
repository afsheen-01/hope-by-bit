# Tech spec · The app

**Expo, iOS and Android. Local-first, signed in when you want a second device. The surface that
owns the ritual.**

This is where the product lives: the morning notification, the haptics, the voice, and the loop
breaker at 3am with the screen dimmed. The website is the front door; this is the room. What each
screen *does* is in [features.md](../../product/features.md); this covers how it's built.

Status: **specification**. No code written. Milestones in [progress.md](progress.md).

## Stack

Expo with React Native, TypeScript, file-based routing. State is one reducer over the shared core.
Storage is SQLite on the device, which stays the source of truth for writing; the
[backend](../backend.md) syncs it. Voice out uses the built-in speech synthesizer, voice in
on-device recognition. Haptics come from Expo plus a small native piece for the breathing pattern.
Notifications are scheduled and delivered on the phone. Tests: unit for logic, component tests for
screens, automated whole-flow runs.

Expo, because the three things this product needs — real haptics, real local notifications,
on-device speech — are the three it can offer on both platforms from one codebase. Screens render
state and send events; every decision happens in the core. `src/adapters/` holds
every platform API, keeping the rest portable. The override surface is one root config file.

## Screens

**Today's bottom is real.** A test measures content height on a reference device, because
[P1](../../product/principles.md) is held by a hundred small choices. With the network away, the
screen offers the last thing you kept.

**The day's actions** record an identical wall entry whichever is taken, and fire the same `confirm`
haptic. All are body-sized — a glass of water, a stretch, ninety seconds outside — so the daily
screen asks for no money and no future date. Give and join belong to a kept story; where they
surface is still open. **The wall** is the one long list in the product — it's yours, and it runs
backwards.

**The loop breaker** reads and writes local state alone. Runs are counted on the phone over a
rolling 24 hours and stay there ([P4](../../product/principles.md)). When the count reaches the
number set, and the setting is on, the closing screen names who is about to be told and runs a
twenty-second window offering *just me this time*; when it ends, the app calls `POST /checkin` with
reason `threshold`. The backend enforces one threshold message a day, so a fourth or eighth run
costs nothing. A follow-up tap offers *let them know I'm alright*. Crisis line on every step.

**Check in** takes two paths. Signed in, the tap calls `POST /checkin` with reason `tap` and the
screen reports who was reached. Signed out, it hands the message to the share sheet, where iOS
behaves differently across versions for several recipients — so the plan is the native sheet with
the person picking from their own contacts, falling back to one message each, measured on real
devices before M5. Android takes several directly. Either way, `settle` — one slow, heavy thud,
deliberately unlike `confirm`.

## Onboarding

**Five questions, four skippable, and then today's story.** Spans the app, the website and the
backend. In order: interests (**required**), path, circle, notification time (**has a default**),
account — then today's story.

**Value comes before commitment.** Interests first, because picking three chips is the moment the
product explains itself. The account comes last, once there's a record worth keeping. Anyone who
stops after step 1 has a working app. A progress marker reads *1 of 5*, every step is revisitable
from settings, and each stands as answered once given.

**1 · Interests.** Eight channels — medicine, climate, wild places, kindness, science, your city,
rights, food — picked as chips. Three to five, five the ceiling because a sixth dilutes the day
rather than widening it. The counter reads *3 chosen* with *pick at least three* below, so the
requirement arrives when it's relevant. Saved to the variant as `channels`, which is what the daily
fetch asks for.

**2 · Path.** Grief leads, as the deepest path, with illness, burnout, loneliness and worry
alongside. Up to two. Choosing it opens one more field: **who or what you're carrying**, asked once and kept, with the
screen explaining what the name unlocks — actions can be done in its name, and the wall becomes a
record of that ([SAFETY.md](../../SAFETY.md)). Moving straight past is an equally ordinary answer.

**3 · The circle.** Two to four people, chosen through the phone's own contact picker, so the app
receives only the contacts selected. Entering a name and number by hand sits alongside, making the
contacts permission a convenience rather than a gate. **Each person is asked first.** Every number receives one message — *"Hope By Bit: [Name] chose you
as someone to reach out to when things are heavy. Reply YES to be reachable, STOP to decline."* Only
a YES makes someone reachable. The step ends showing each as **pending**, updating to confirmed or
declined as replies arrive, so the person always knows who is actually there.

**Then the message they'd receive**, editable here and after — *"[Name] is having a hard moment and
asked me to let you know. A call or a text would mean a lot right now."* Writing it calm is the
point; the hard moment asks nothing of you.

**Then the setting that matters most on this screen**, off until switched on: *if I open the loop
breaker three times in a day, tell my people.* Turning it on shows the whole consequence at once —
the count (three by default, two to five), who gets told, the wording they receive, which says
plainly that it was automatic, and the twenty-second window. It also says what the rule can't do: a
count is a count, and a hard day that doesn't reach three passes unremarked, which is why the
check-in button and the crisis line stay where they are. Numbers are held on the account,
encrypted, used for this and nothing else, and released when a member is removed or the account
deleted ([P9](../../product/principles.md)). With nobody confirmed the setting stays unavailable and
says why, offering the share-sheet handoff.

**4 · Notification time.** One arrival a day, defaulting to 08:00, set with a time picker. The
screen says the reminder is scheduled on the phone, which is also why it works with the network away
([P3](../../product/principles.md)). Notification permission is requested here; declining leaves the
app opening to the day's story whenever it's opened.

**5 · Account.** An email address is the identity, arriving two ways: **Sign in with Google** — an
email and a stable id, the whole scope — or **an emailed sign-in link**. Both land on the same
account when the email matches and the provider reports it verified; passkeys follow as a third way.
Steps 1–4 upload on first sign-in and merge by the shapes in the [backend spec](../backend.md), so
signing in after a month brings that month with it. **Skipping keeps the app whole** on this device,
the circle held locally and the check-in handed to the share sheet.

**Building it.** The app runs onboarding as five routes under `setup/`, the variant accumulating and
saved after each step so closing mid-way resumes where it stopped. Permissions are requested at the
step that uses them, after a line of explanation. The backend carries `POST /auth/google`,
`/auth/email`, the session exchange, circle storage, and the intro message.

**The website asks a shorter version** — the paths, but **not the name being carried**, which has
no wall to live on there yet; the app asks at M2. The circle is likewise a link to the app, since
the contact picker belongs to the phone.

**Theme.** **Auto** (default), **Light**, **Dark**. Auto follows the clock on the device — light
from 06:00, dark from 18:00 local, both adjustable — switching on foreground and on the hour, so a
session in progress carries on in the palette it started in. Light and Dark hold and travel with the
account. The palette is **Grove** — oat, forest, apricot — both grounds first-class. **First paint
matches**: the app resolves the theme before first render, the website from an inline script.

## State, saving and sync

`reduce(state, event) → [state, effects]`, pure, returning **descriptions** of effects the shell
carries out. Tests read the returned values. SQLite holds the wall and Keepsakes as rows and settings
as one blob, with writes debounced. Schema changes are a version number and a chain of small pure
functions.

**Sync** runs on foreground and after a change: send what's new, take what's new back. Merging needs
no conflict UI because the wall appends, Keepsakes is a set, and settings are per-key
([backend spec](../backend.md)). **The app works fully offline for as long as you like** and
reconciles when the network returns. **Signing in is optional**: with no account everything works on
this device, and signing in brings the record to a second device — that's the whole difference.
Export writes a plain file to the share sheet; delete clears the phone and the server together.

## Voice

On-device both ways; every word stays on the phone — audio, transcript and result alike.

**Reading out.** The core builds the utterance from the story's hints — segments with a rate and a
pause after each — so the number gets a deliberate silence on either side, slightly slower than the
system default. Speech ends on any tap, navigation or backgrounding. The daily story follows the
silent switch; the loop breaker can be set to speak through it, because someone reaching for it at
3am with the phone silenced still needs to hear it — chosen once, at setup.

**Speaking to it.** The core matches what was heard against a fixed short list and returns one of a
handful of intents. Where the phone offers on-device recognition the feature appears; where it
doesn't, the buttons carry the flow. The microphone opens on a tap and closes on a match, six
seconds of quiet, or leaving the screen, with a visible indicator throughout. **Anything outside the
list hands you back to the buttons quietly** — being asked to repeat yourself while spiraling is the
opposite of the point. Permission is asked at first use, after an explanation.

## Haptics

Five meanings, spoken in product terms: `tap`, `confirm`, `settle`, `arrive`, `breathe`. They fire
on those five moments and stay quiet otherwise; a **reduce haptics** setting covers people who find
vibration itself activating.

**The breathing pattern** is the one needing native code. Four seconds in, three held, six out. The
intake ramps up gradually; the **hold is silence** — the absence is the instruction; the release
ramps down more slowly than the intake, so letting go feels longer than taking in. Where the phone
handles continuous patterns the cadence is felt; where it doesn't, sight and sound carry it. The
whole loop breaker works with haptics off, sound off, or the screen off, in any combination.

## Notifications and stories

One notification, scheduled and delivered on the phone at the hour chosen. `hopebybit://loop` opens
the loop breaker directly, which matters: it puts grounding one back-tap away. Stories arrive as
signed static files a week ahead; the app fetches once a day and caches, so today's story, the whole
wall, Keepsakes and the entire loop breaker work offline. Signatures are verified before a story is
stored, with the key built into the app, so what reaches someone at 3am is what the review
published. Crisis lines and copy corrections come from config on launch, so a fix lands within the
hour.

## Accessibility

Dynamic type to the largest size, with the variant's text scale on top. Every control labelled,
including the breathing circle, which announces its phases. 44pt targets, contrast at least 4.5:1 in
both themes. Reduced motion turns the breathing animation into a still circle, cadence carried by
text and haptics. Every flow completable by screen reader alone — the loop breaker and check-in have
their own tests.

## Open questions

1. **Multi-recipient messaging on iOS** needs device testing before M5. If the share sheet costs two
   taps rather than one, revisit — while keeping the numbers in the phone's contacts.
2. **Should the loop breaker speak through the silent switch?** Specced as a setup choice, but a
   household asleep at 3am is on the other side of it.
3. **What a pinned Light theme does at 3am.** Someone who chose Light gets a bright screen at the
   worst moment, and overriding an explicit choice is its own kind of wrong. Either a dim treatment
   for that screen alone, or the choice stands. Decide with the loop breaker's visuals, at M3.
4. **Circles that never confirm.** If nobody replies YES, someone has a circle on screen and no
   safety net behind it. The app says so; how many times to ask before letting it rest is due at O2.
5. **Where the account step sits.** Specced last, so value comes before commitment — but Google
   sign-in first is the convention, and would raise the share of records surviving a lost phone.
6. **A home-screen widget** and **a watch app** each get their own spec once v1 ships.
