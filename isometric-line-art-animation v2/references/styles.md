# Styles (how it is drawn)

Contents: How styles work, Style catalog, Choosing a look, Pairing rules, Adding a style

## How styles work

A style never changes the geometry. The `iso()` projection, layer structure and animation stay identical. A style only does three things:

1. Remaps CSS tokens on the `<svg>` element via `data-style` (`--line`, `--herol`, `--pf`, `--focal`, `--cell`).
2. Optionally adds a small extra (slab thickness, a background grid, dimension marks, a glow, a gradient).
3. Optionally adjusts the card background.

Token meanings: `--line` structure stroke, `--herol` hero stroke (top plane, ECG-type focal line), `--pf` plane fill, `--focal` the one solid element, `--cell` texture cell fill.

Rules that hold in every style: four stroke tiers, planes filled opaquely so they occlude, one focal element, equal z-spacing, three or four layers, generous empty space.

## Style catalog

### outline (default)
Thin ink strokes on a flat dark or light card. The charcoal "technical schematic" look from the original reference.
- Tokens: line = ink, plane fill = card color, focal = ink.
- Best for: premium agency or SaaS service cards, portfolios, anything that should feel quiet and expensive.
- Pitfall: relies entirely on opacity hierarchy; if everything is the same brightness it looks flat.

### blueprint
Drafting-paper look: tinted planes, accent-colored structure lines, white or ink hero lines, a faint square grid on the card, denser iso guide lines, crosshair marks, a dimension line with an end tick and a rotated mono label.
- Tokens: line = accent, plane fill = accent mixed 7 percent into card, focal = accent, card gets a 24 px grid at very low opacity.
- Best for: engineering, infrastructure, security, analytics, consulting, healthcare tech, anything that should read as precise and measured.
- Rules from the research: keep connectors straight or at 90 degrees, label with monospace, keep the background grid barely visible (a too-strong grid is the most common way to ruin the effect).
- Motion pairs with the `precise` vibe.

### duotone
Outline plus a single accent. Planes carry a light accent tint, cells and the focal element use the accent, the hero stroke uses the accent, everything else stays ink.
- Tokens: hero stroke = accent, plane fill = accent 10 percent into card, focal and cells = accent.
- Best for: brand-led pages where one brand color should appear in every illustration, consumer products, education, e-commerce.
- Pitfall: needs an accent clearly different from ink. With the charcoal theme (accent is white) it collapses back to outline.

### glass
Soft frosted panels: planes lightened slightly from the card, a gradient hero stroke (accent to accent2), a soft drop shadow under each floating layer, a radial accent glow in the card background. Gradients, soft 3D and glass are the dominant 2026 look for AI and modern app visuals.
- Tokens: plane fill = ink 7 percent into card, hero stroke = `url(#hg)` gradient, focal = accent2, cells = accent, shadow filter on `.float`.
- Best for: AI products, modern SaaS, creative tools.
- Implementation note: panels stay opaque (just lightened) so occlusion still works. True transparency makes lower layers show through and looks messy.
- Pitfall: do not add more than one gradient (the hero stroke) and one shadow recipe. Heavy blur is slow on mobile.

### neon
Near-black ground, signal colors, a small glow. Structure lines use the primary neon, the hero line and focal element use the secondary neon.
- Tokens: line = accent, hero = accent2, focal = accent2, cells = accent, `drop-shadow(0 0 3px accent at 55%)` on `.float`, plus a short focal flicker at the end of the intro.
- Best for: gaming, crypto and web3, nightlife, creative tech, developer events.
- Rules from the research: neon is for signals, not walls. One dominant neon element per composition, everything else neutral or desaturated. The palette must work without the glow; if it only looks good glowing, the colors are wrong. Keep glow radius small and opacity low.
- Dark themes only (neon, cobalt, aurora, ember).
- Motion pairs with the `energetic` vibe.

### solid (extruded)
Flat-isometric slabs. Each plane gets thickness; the left and right faces are shaded with two tints of ink, the top face is the plane fill. Cells and the focal element use the accent.
- Tokens: slab thickness 0.9 unit (`TH`), left face = ink 8 percent into card, right face = ink 15 percent, plane fill = ink 4 percent.
- Best for: explainers, onboarding, enterprise and fintech (the corporate-flat feel), product pages that want a friendlier, more tangible look.
- Pitfall: thickness must be identical on every slab. Keep it to 0.6 to 1.2 units; thicker reads as blocks, not panels.

## Choosing a look

Pick by intent and audience, not by trend. Isometric as a whole signals structure and professionalism, which suits B2B, dashboards, workflows and onboarding.

| Audience or intent | Look (style, theme, vibe) |
|---|---|
| Premium agency, portfolio, service cards | outline, charcoal, calm |
| Dev tools, infra, security, engineering | blueprint, cobalt, precise |
| Fintech, enterprise, consulting, legal | solid, forest, calm or blueprint, paper, precise |
| Healthcare, wellness | blueprint, paper, calm or solid, forest, calm |
| AI product, modern SaaS | glass, aurora, calm |
| Gaming, crypto, nightlife, creative tech | neon, neon, energetic |
| Consumer, edtech, e-commerce, startup energy | duotone, ember, energetic |
| Print or light documents | blueprint, paper, precise |

If the user names a brand color, build a custom theme (see `themes.md`) and choose the style by the audience row above.

## Pairing rules

- neon style: dark themes only.
- glass style: themes with a clearly different accent and accent2 (aurora, cobalt, ember, neon). Avoid charcoal.
- duotone style: any theme except charcoal.
- blueprint style: best on cobalt, paper, forest. On charcoal it works but looks like outline plus a grid.
- solid style: works on every theme; best on light themes (forest, paper) and dark themes with a saturated accent.
- Never mix two styles in one illustration. In a set of several illustrations, use one look for all.

## Adding a style

1. Add a `data-style` block that remaps the five tokens.
2. If it needs geometry (like thickness), add it in `plane()` or `build()` in `assets/engine.html`, behind the style name.
3. If it needs extras (marks, labels), put them in a class hidden by default and shown only for that style.
4. Add it to `STYLES`, add at least one entry in `LOOKS`, and test it in all themes.
5. Run the polish checklist.
