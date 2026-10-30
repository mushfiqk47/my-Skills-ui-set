# Themes (what colors it uses)

Contents: Theme roles, Built-in themes, Building a custom theme, Contrast rules, Light and dark

## Theme roles

Every theme defines seven values. Nothing else in the illustration is allowed to introduce a color.

| Role | Job |
|---|---|
| `bg` | page background behind the card |
| `card` | the card and plane base color (planes are filled with it so they occlude) |
| `ink` | strokes, text, the solid focal element in outline style |
| `muted` | body text (ink at about 60 to 70 percent) |
| `accent` | primary signal: structure lines in blueprint and neon, tints and cells in duotone, glass and solid |
| `accent2` | secondary signal: hero stroke or focal in neon and glass |
| `grid` | the card's background grid in blueprint, a very low-opacity tint |

Accent usage is controlled by the style, not by the theme. A theme just supplies the values.

## Built-in themes

| Theme | Mode | bg | card | ink | accent | accent2 | Mood |
|---|---|---|---|---|---|---|---|
| charcoal | dark | #161616 | #232323 | #ffffff | #ffffff | #ffffff | Quiet, premium, monochrome |
| cobalt | dark | #071120 | #0d2137 | #e8f6ff | #00b4d8 | #00e5ff | Engineering drafting, cyan on deep navy |
| paper | light | #ece9e2 | #faf8f5 | #334155 | #2563eb | #f59e0b | Engineering paper, slate ink, blue accent, amber warning |
| neon | dark | #0a0a0f | #14141f | #e0e0e8 | #00f0ff | #ff0080 | Neon-noir: cyan and magenta signals on near-black |
| aurora | dark | #0f0b1f | #1c1640 | #f1edff | #8b5cf6 | #38bdf8 | Violet to sky gradient feel for AI products |
| forest | light | #e3e6df | #f7f7f5 | #1a3c2b | #2e7d55 | #e0b34a | Architectural green on light paper, calm and trustworthy |
| ember | dark | #161012 | #241a1d | #fff3ee | #ff6f61 | #ffd600 | Warm coral and yellow on dark plum |

Reference points behind them: cobalt follows the cyanotype and modern CAD blueprint family (navy grounds, cyan lines, grid lines slightly lighter than the ground); paper follows the off-white blueprint-paper palette with slate text, engineering blue and an amber warning color; neon follows the standard neon-noir role split (near-black ground, slightly lighter surface, cyan and magenta signals) and keeps hazard colors rare; forest follows the forest-green and light-gray paper architectural style.

## Building a custom theme

When the user gives a brand color or a mood, build a theme instead of picking a preset.

1. Decide light or dark from the audience and the style (neon is dark only).
2. `bg`: the page color. `card`: 4 to 7 percent lighter than `bg` on dark themes, or 3 to 4 percent lighter than `bg` on light themes. The card is the base for all plane fills.
3. `ink`: near-white on dark (not pure white unless the brief wants stark), a deep slate or brand-dark on light. Tint it slightly toward the brand hue.
4. `accent`: the brand color, adjusted for contrast on `card` (see below).
5. `accent2`: either a color 30 to 60 degrees away on the hue wheel (analogous, calm) or the complement (high energy). If the brand has only one color, use a lighter or warmer tint of it.
6. `muted`: ink at 60 to 70 percent opacity.
7. `grid`: accent or ink at 5 to 12 percent opacity.
8. Add the theme to `THEMES`, preview it in at least two styles, and run the checklist.

## Contrast rules

- Ink on card: at least 7:1 (the hero stroke and focal element must be unmistakable).
- Muted text on card: at least 4.5:1.
- Accent on card: at least 3:1 for strokes and shapes; if not, lighten it on dark themes or darken it on light themes.
- The structure line tiers (60, 35 and 12 to 18 percent) must still be visible on the card. If the 35 percent tier disappears, raise the ink-to-card contrast.
- Never use pure red and green together as the only difference; add a lightness difference.

## Light and dark

- The dark charcoal look is the signature, but the page must still work in light mode: if no theme is chosen, default to `paper` when `prefers-color-scheme: light` and `charcoal` otherwise (the engine does this).
- When the user wants an illustration that appears on both a dark and a light page, ship two themes with the same accent hue and swap them by `prefers-color-scheme` or a `data-theme` attribute.
- Set `color-scheme` on the root to match the theme mode so native controls (selects, scrollbars) are readable.
