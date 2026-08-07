# Tech spec · The app

**Expo, iOS and Android. Local-first, signed in when you want a second device. The surface that
owns the ritual.**

This is where the product lives: the morning notification, the haptics, the voice, and the loop
breaker at 3am with the screen dimmed. The website is the front door; this is the room.

What each screen *does* is in [PRODUCT.md](../PRODUCT.md); this covers how it's built.

Status: **specification**. No code written.

## Stack

Expo with React Native, TypeScript, file-based routing. State is one reducer over the shared core.
Storage is SQLite on the device, which stays the source of truth for writing; the
[backend](backend.md) syncs it. Voice out uses the built-in speech synthesizer, voice in on-device
recognition. Haptics come from Expo plus a small native piece for the breathing pattern.
Notifications are scheduled and delivered on the phone. Tests: unit for logic, component tests for
screens, automated whole-flow runs.

Expo, because the three things this product needs — real haptics, real local notifications,
on-device speech — are the three things it can offer on both platforms from one codebase.

Screens render state and send events; every decision happens in the core. `src/adapters/` holds
every platform API, which keeps the rest of the app portable. The override surface is one config
file at the root.

## Screens — the implementation notes that matter

**Today's bottom is real.** A test measures content height on a reference device, because
[P1](../PRINCIPLES.md) is held by a hundred small choices. With the network away, the screen offers
the last thing you kept.

**The ladder** records an identical wall entry at every rung and fires the same `confirm` haptic.
Give and join open the organisation's own page in a browser, which keeps payments out of the app
entirely.

**The wall** is the one long list in the product, because it's yours and it runs backwards.

**The loop breaker** reads and writes local state alone. Runs are counted on the phone over a
rolling 24 hours and stay there ([P4](../PRINCIPLES.md)). When the count reaches the number the
person set, and they switched the setting on, the closing screen names who is about to be told and
runs a twenty-second window offering *just me this time*; when it ends, the app calls `POST
/checkin` with reason `threshold`. The backend enforces one threshold message a day, so a fourth or
eighth run costs nothing. A follow-up tap offers *let them know I'm alright*. Crisis line on every
step.

**Check in** takes one of two paths. Signed in, the tap calls `POST /checkin` with reason `tap` and
the screen reports who was reached. Signed out, it hands the message to the share sheet, where iOS
behaves differently across versions for several recipients — so the plan is the native sheet with
the person picking from their own contacts, and the fallback is one message each, measured on real
devices before M5. Android takes several recipients directly. Either way, `settle` — one slow, heavy
thud, deliberately unlike `confirm`.

**Setup** is five steps: channels, path, the name if grief, circle and message, notification time.
Channels is the one that needs an answer; the rest can be filled in later from settings.

## State, saving, and sync

`reduce(state, event) → [state, effects]`, pure, returning **descriptions** of effects the shell
carries out. Tests read the returned values.

SQLite holds the wall and Keepsakes as rows and settings as one blob, with writes debounced. Schema
changes are a version number and a chain of small pure functions.

**Sync** runs on foreground and after a change: send what's new, take what's new back. Merging
needs no conflict UI because the wall appends, Keepsakes is a set, and settings are per-key
([backend spec](backend.md)). **The app works fully offline for as long as you like** and
reconciles when the network returns.

**Signing in is optional.** With no account everything works on this device. Signing in — passkey,
or an emailed link — brings the record to a second device, and that's the whole difference. Export
writes a plain file to the share sheet; delete clears the phone and the server together.

## Voice

On-device both ways. Every word stays on the phone.

**Reading out.** The core builds the utterance from the story's hints — segments with a rate and a
pause after each — so the number gets a deliberate silence on either side. Slightly slower than the
system default. Speech ends on any tap, navigation, or backgrounding, and the next one starts fresh.
The daily story follows the silent switch; the loop breaker can be set to speak through it, because
someone reaching for it at 3am with the phone silenced still needs to hear it. That setting is
chosen once, at setup.

**Speaking to it.** The core matches what was heard against a fixed short list and returns one of a
handful of intents.

- **On-device recognition.** Where the phone offers it, the feature appears; where it doesn't, the
  buttons carry the whole flow.
- **The microphone opens on a tap** and closes on a match, six seconds of quiet, or leaving the
  screen, with a visible indicator throughout.
- **Anything outside the list hands you back to the buttons quietly**, because being asked to
  repeat yourself while spiraling is the opposite of the point.
- **Every word stays on the device** — audio, transcript, and result alike.

Microphone permission is asked at first use, after an in-app explanation. Carrying on without it
costs nothing.

## Haptics

Five meanings, spoken in product terms: `tap`, `confirm`, `settle`, `arrive`, `breathe`.

**The breathing pattern** is the one needing native code. Four seconds in, three held, six out. The
intake ramps up gradually; the **hold is silence** — the absence is the instruction; the release
ramps down more slowly than the intake, so letting go feels longer than taking in. Where the phone
handles continuous patterns the cadence is felt; where it doesn't, sight and sound carry it. The
whole loop breaker works with haptics off, sound off, or the screen off, in any combination —
tested on each.

**Restraint.** Haptics fire on the five moments above and stay quiet the rest of the time. A
**reduce haptics** setting covers people who find vibration itself activating.

## Notifications and stories

One notification, scheduled and delivered on the phone at the hour chosen. `hopebybit://loop` opens
the loop breaker directly, which matters: it puts grounding one shortcut or one back-tap away.

Stories arrive as signed static files a week ahead; the app fetches once a day and caches, so
today's story, the whole wall, Keepsakes, and the entire loop breaker work offline. Signatures are
verified before a story is stored, with the key built into the app, so what reaches someone at 3am
is what the review published. A story request carries the date and channel. Crisis lines and copy
corrections come from config on launch, so a fix lands within the hour.

## Accessibility

Dynamic type up to the largest size, with the variant's text scale on top. Every control labelled,
including the breathing circle, which announces its phases. 44pt targets, contrast at least 4.5:1
in both themes. Reduced motion turns the breathing animation into a still circle with the cadence
carried by text and haptics. Every flow completable by screen reader alone — the loop breaker and
check-in have their own automated tests.

## Milestones

**M1** shell and Today, on a device, core fully covered. **M2** ladder, wall, Keepsakes and
storage — survives relaunch, export works. **M3** loop breaker, visual and haptic, completable with
sound off and a screen reader on. **M4** voice out then voice in. **M5** check in and share,
measured on real devices. **M6** notification, deep link, shortcut. **M7** stories, signature
checking, and config — seven days offline intact. **M8** sign-in and sync, verified across two
devices offline at once. **M9** grief path, on [counsellor sign-off](../SAFETY.md).

## Open questions

1. **Should the loop breaker speak through the silent switch?** Specced as a setup choice. Worth a
   real-world check, since a household asleep at 3am is on the other side of it.
2. **Multi-recipient messaging on iOS** needs device testing before M5. If the share sheet costs two
   taps rather than one, revisit — while keeping the numbers in the phone's contacts.
3. **A home-screen widget** showing today's headline fits naturally and would need care to stay one
   headline rather than a list. After M9.
4. **A watch app.** The loop breaker on a wrist, with haptics, is arguably the best version of this
   feature that could exist. Worth its own spec once v1 ships.
