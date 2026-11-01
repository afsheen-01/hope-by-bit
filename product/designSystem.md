# Design system

How the surfaces are built. The website's styles in `apps/web/src/styles/` are the working copy of
this file; where the two differ, this one holds.

Colour and type live in the token section of `apps/web/src/styles/global.css` as three levels — global, system, component —
following [Pavel Kiselev's method](https://www.designsystems.com/), where globals are never used
directly by a screen. This file records the third axis: **space**.

## The scale

**A 4-point grid.** Every gap is a multiple of four, so spacing is chosen from a scale rather than
typed. Four is small enough to bind a label to its field and large enough that the steps stay
distinguishable.

| token | value | units | typical job |
|---|---|---|---|
| `--space-1` | 4px | 1 | a label to the control it names |
| `--space-2` | 8px | 2 | items inside one group; chip gaps |
| `--space-3` | 12px | 3 | tight vertical rhythm |
| `--space-4` | 16px | 4 | between fields; a group and its heading |
| `--space-5` | 20px | 5 | inside a card |
| `--space-6` | 24px | 6 | between groups on a screen |
| `--space-8` | 32px | 8 | the container inset (`--gutter`) |
| `--space-10` | 40px | 10 | between sections |
| `--space-12` | 48px | 12 | between sections, generously |

**Not on the grid, and deliberately so:** border radii (14 / 18 / 44px, drawn to the device frame),
type sizes and line-heights, `--tap: 56px` (the 44pt accessibility floor, rounded up), and the
390×844 phone itself. None of these are spacing. Rounding them to fours would change the design to
satisfy a rule that was never about them.

**Below the scale:** a 3px inset appears twice — the gaps between the status bar's signal bars, and
the track a segmented control's pill sits inside. Both are drawn detail at icon scale, where 4px is
already too coarse to read. If a third case appears, it is worth asking whether it is really the
same thing.

## The rule that decides which step

**Proximity.** Things close together are read as belonging together, so the gap is the grouping — it
does more work than any border or background.

- **4–8px** binds. A label and its input are one object; anything larger and they come apart.
- **16–24px** separates groups within a screen. This is the step that carries most of a layout.
- **32–48px** separates sections, and the container inset sits here too.

Two consequences worth stating, because both get missed:

**The gap between groups must beat the gap inside them** — visibly, not marginally. A 16px inner gap
next to a 20px outer one reads as one undifferentiated list. Skip a step.

**A divider doubles the space around it.** If a rule is earning its place, the space already
separates the groups and the line is decoration; if it isn't, the line is doing work the spacing
should have done. Either way, space it as though the divider weren't there and then add it.

## Sources

- [Ultimate spacing guide for UI designers](https://medium.com/@uiuxzee/ultimate-spacing-guide-for-ui-designers-342f4c61bd70) — the 4-point grid, and the case for four over eight: finer adjustment, and a scale that still lands on whole pixels at any density.
- [GoodBarber · spacing](https://www.goodbarber.com/uxdesign/spacing/) — the gutter as the primary responsive unit (16px mobile, 20px above), vertical rhythm in 1G / 2G / 3G steps, fixed px reserved for small components that must stay identical across platforms, and the divider rule above.

The two disagree on the unit: a fixed 4pt grid against a gutter that changes with the viewport. This
product is one narrow column on a phone, so the grid is the working system and the gutter is a token
on it (`--gutter: var(--space-8)`) rather than a separate unit. If a wider surface ever earns
different insets, `--gutter` is the one value that moves.
