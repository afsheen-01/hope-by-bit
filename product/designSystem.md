# Design system

How the product looks. The tokens live in `apps/web/src/styles/global.css`; where that file and this one disagree, this one wins.

Colour and type tokens come in three levels: global, system and component. This file covers the third part: **space**.

## The scale

Every gap is a multiple of 4px, picked from this scale rather than typed by hand.

| token | value | use |
|---|---|---|
| `--space-1` | 4px | a label and its control |
| `--space-2` | 8px | items in one group; chip gaps |
| `--space-3` | 12px | tight vertical rhythm |
| `--space-4` | 16px | between fields; a group and its heading |
| `--space-5` | 20px | inside a card |
| `--space-6` | 24px | between groups |
| `--space-8` | 32px | page inset (`--gutter`) |
| `--space-10` | 40px | between sections |
| `--space-12` | 48px | between sections, with more room |

Radii (14 and 18px), type sizes, line heights and `--tap: 56px` (the minimum tap size, rounded up) are not spacing, so they don't follow the 4px rule.

## Choosing a step

Things that sit close together look like they belong together. Let the gap do the grouping, not borders or backgrounds.

- **4–8px** joins things, like a label and its input.
- **16–24px** separates groups on a screen. Most layout uses this.
- **32–48px** separates sections.

The gap between groups must be clearly bigger than the gap inside them. 16px inside next to 20px outside looks like one list, so skip a step.

## Sources

- [Ultimate spacing guide for UI designers](https://medium.com/@uiuxzee/ultimate-spacing-guide-for-ui-designers-342f4c61bd70): the 4px grid.
- [GoodBarber · spacing](https://www.goodbarber.com/uxdesign/spacing/): the gutter and the divider rule.

The product is one narrow column, so the 4px grid is the system and the gutter is one token on it.
If a wider layout ever needs different insets, `--gutter` is the value to change.
