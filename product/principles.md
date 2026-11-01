# Principles

Ten rules, each stating what the product does. Every one has a **check**: how a machine or a
reviewer confirms it holds. Code on every surface, generated or not, must satisfy all ten.

---

**P1 · One story, and the screen ends.** Each day brings one story. When you reach the end of it,
the screen ends there.
*Why:* being finite is the product. A session with an ending is the whole difference between this
and a feed.
*Check:* the daily screen renders exactly one story; the catalog offers today's story.

**P2 · The wall keeps totals.** It shows what you've collected — *47 bits since March*. Every day
you show up adds to the total, and the total is the only number the product keeps.
*Why:* a total welcomes you back after a gap. It's the kind of counting that suits people already
carrying enough.
*Check:* the tally returns one cumulative count; copy passes the tone check.

**P3 · One notification a day, at a time you chose.** The PWA sends a single reminder at the hour
you picked.
*Why:* that one arrival is the ritual. The rest of the day stays yours.
*Check:* exactly one push a day per person, at their chosen time, and none for anything else.

**P4 · Loop-breaker runs are counted on the device and stay there.** Open it as often as the day
needs. If you asked it to tell your people on the third run, the device sends a check-in — the
message goes out, and the count stays home.
*Why:* the people who reach for it are the ones most careful about being a burden. Keeping the
history on the device is what lets it stay usable eight times over.
*Check:* run counts live in local state; the API accepts a check-in and has no field that could
hold loop-breaker history.

**P5 · Sending follows a decision you made.** The check-in goes out when you tap send — or on its
own, at the count you set, if you chose that while calm. Either way the decision is yours; what
changes is when you made it.
*Why:* deep in a hard moment, acting can be beyond someone. Choosing in advance is how the product
carries out their wishes rather than forming its own view of them.
*Check:* the send path originates in a tap handler or in the threshold the person switched on, and
reaches only circle members who have agreed to be reachable.

**P6 · The crisis line is on every hard-moment screen.** Quiet, always there, matched to where you
are.
*Why:* this product is for hard moments. When something bigger is happening, the people who can
help should be one tap away.
*Check:* present and unconditional on every hard-moment screen, with no setting that can hide it.
The number is looked up by region (from the device language, changeable in settings), falls back to
findahelpline.com, and is served by remote config so a correction reaches every device within the
hour. Every number is verified by someone with local knowledge before it ships.

**P7 · The action is body-sized.** Two or three small physical things, offered together — a glass of
water, stand up and stretch, ninety seconds outside. Any one of them can be finished now, so there
is always one you can reach, and each records the same wall entry.
*Why:* doing something, however small, turns *the world has good in it* from information into
experience — and a thing the body does returns an answer immediately, which reading cannot.
*Check:* the daily screen offers two or three body-sized actions, none of them requiring money, a
signup, or a future date; wall entries carry one shape regardless of which was taken.

**P8 · Grief is offered by capacity.** Bits arrive sized to what you can manage today, and today is
its own thing — capacity moves in both directions.
*Why:* grief is nonlinear, and a product that assumes otherwise tells someone they're doing it
wrong on the day they can least argue.
*Check:* grief copy passes the capacity check, with counsellor sign-off recorded before release.

**P9 · Your record is yours.** The wall, Keepsakes, your circle, and your settings belong to you:
readable offline, on every device you sign in to, exportable in one tap, and removable in one tap —
from the device and the server together.
*Why:* an account and a circle exist so your record and your people follow you. That only earns its
place if leaving is as easy as arriving.
*Check:* export returns the complete record; delete clears both copies, releases the circle, and
returns a receipt.

**P10 · Cheap enough to stay free.** It starts on free and starter plans, and as a PWA it pays
no app store fees. Stories cost the same at any size, accounts add a little, and messages are the
one line that grows with how hard people's days are — the line worth paying.
*Why:* free is a design constraint, and starting on free tiers keeps the early decisions honest.
Knowing which cost grows first is what tells you where to look later.
*Check:* any change to what it costs to run updates a running-costs table and carries a
maintainer's sign-off. Every paid service in that table has an open alternative.

---

**What this is.** A daily ritual, a record of small things done, and two tools for hard moments.
Everything in this repo serves those three. Anything beyond them belongs in a fork, and the license
makes that easy.
