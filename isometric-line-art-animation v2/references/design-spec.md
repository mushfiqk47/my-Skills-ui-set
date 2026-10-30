# Design spec: isometric line art

This file holds the geometry, composition and base choreography shared by every look. Values quoted as colors or timings are the defaults for the outline style, charcoal theme and calm vibe. Other looks only remap tokens: see `styles.md` (how it is drawn), `themes.md` (colors) and `vibes.md` (motion).

Contents: Tokens, Projection, Composition patterns, Layer recipes, Textures, Annotations, Animation, Concept ideas, Accessibility and performance

## Tokens

| Token | Default |
|---|---|
| Canvas (viewBox) | 520 x 300 to 360 |
| Unit `U` | 10 px |
| Plane size | 12 x 12 units (centered, so -6 to 6) |
| Z-spacing | 4.5 units (45 px) between layers |
| Card color (charcoal theme) | `#232323` on page `#161616` |
| Ink (charcoal theme) | `#ffffff` |
| Card color (paper theme) | `#faf8f5` on page `#ece9e2` |
| Ink (paper theme) | `#334155` |
| Stroke tiers | hero 1.5, structure 1, detail 0.75, grid 0.5 dashed `2 4` |
| Stroke opacity | 1, 0.6, 0.35, 0.12 to 0.18 |
| Node marker | diamond, 3.2 px half-size, card-colored fill, ink stroke 1 |
| Label | monospace 9 px, ink at 55 percent opacity, lowercase |
| Heading | 18 px, weight 600, tight tracking |
| Body | 14 px, line-height 1.55, muted ink, max 46ch |

Fonts: Space Grotesk (UI) and JetBrains Mono (labels) from Google Fonts, with `system-ui` and `ui-monospace` fallbacks. Swap for the brand fonts when the user has them.

## Projection

```js
const U = 10, C30 = Math.cos(Math.PI / 6), OX = 260, OY = 250;
const P = (x, y, z = 0) => [
  OX + (x - y) * C30 * U,
  OY + (x + y) * 0.5 * U - z * U
];
```

- x runs down-right, y runs down-left, z runs up.
- A rectangle on a plane at height z is four `P(x, y, z)` points joined into a closed path.
- A plane centered at the origin with half-size 6 spans about 208 px wide and 120 px tall; the top plane at z = 13.5 sits 135 px above the base. Check the stack fits the viewBox with margin.
- Set `pathLength="1"` on every path that will be drawn on, so the animation does not depend on actual length.

## Composition patterns

Pick one per illustration:

1. **Exploded stack.** 3 to 4 equal planes at even z-spacing, each carrying a different texture. Best for layered ideas: process, architecture, dashboards, stacks.
2. **Hero slab plus satellites.** One large plane with a smaller offset plane or icon tile beside it. Best for a product or platform.
3. **Rising tower.** Planes shrink slightly as they rise. Best for growth, funnels, analytics.
4. **Path across planes.** Two or three planes with a dotted route and nodes moving between them. Best for journeys, workflows, data flow.

Whatever the pattern, choose the focal element first (a logo mark, a cross, a bar, an input pill) and place it on the top or most important plane.

## Layer recipes

Every layer: a `plane` path (fill = card color, stroke tier 2, `pathLength="1"`), then textures clipped to its interior by staying within plane coordinates, then corner nodes. The top plane uses the hero stroke.

Keep content inside plane coordinates of about -5.5 to 5.5 so nothing touches the edge.

## Textures

- **Dashed grid.** Lines every 3 units across the plane, grid tier, dash `2 4`.
- **Hatch strip.** Parallel lines every 0.5 units across a rectangle about 2 units deep, detail tier.
- **Pixel-cell grid.** 6 x 6 quads of 1 unit with 0.1 inset; fill ink with opacity chosen from `[0, .12, .3, .65, 0, .2, .45, 0, .12, .8]` using a deterministic seed so renders are repeatable. Never use `Math.random()` for geometry.
- **Text lines.** Two to four short segments with varied length, detail or structure tier.
- **Pill or input.** Outlined rounded-looking rectangle (4 corners are fine at this scale), structure tier.
- **Waveform.** A polyline in plane coordinates with a flat baseline and one or two spikes; hero stroke, round joins, a node at its end.
- **Focal mark.** Solid ink polygon (cross, logo block, bar). Keep it simple: 4 to 12 vertices.

## Annotations

Draw these flat in screen space, outside the floating layers:

- Faint dashed isometric guide lines through the scene (every 6 units, both axes, extending past the card edge; the card hides overflow).
- One dotted measurement line from a top-plane corner extending outward 80 to 90 px, ending in a diamond node, with a short mono label above it.
- One solid dot (r 4) floating away from the object, as in a pointer or marker.
- One tiny label in a bottom corner (for example `fig. 01`).

## Animation

Total intro 3.5 to 5 s. Timeline (seconds):

| Time | What | Notes |
|---|---|---|
| 0.0 | Guide lines fade in | stagger .06 |
| 0.3 | Plane strokes draw | back to front, stagger .15, 1.0 s each |
| 0.7 | Plane fills fade in | stagger .15, 0.4 s |
| 1.1 | Dashed grid fades in | 0.5 s |
| 1.3 | Pixel cells appear | random order, stagger .015 |
| 1.5 | Hatch lines appear | stagger .02 |
| 1.8 | Text lines and pills draw | stagger .06 |
| 1.9 | Waveform draws | 1.3 s, `power1.inOut` |
| 2.3 | Nodes pop | scale 0 to 1, `back.out(2.5)`, stagger .04 |
| 2.9 | Focal element appears | opacity and scale from .8, 0.6 s |
| 3.3 | Annotations fade in | 0.6 s |

Initial states are set from JavaScript (`gsap.set`), not CSS, so a failed load still shows the finished art.

Idle: each layer's inner group floats on y by plus or minus 3.5 px, duration 5 + 0.8 per layer, `sine.inOut`, yoyo, repeat forever, delay 0.4 per layer, alternating direction.

Hover: the outer layer group moves up by `index * 5` px over 0.7 s with `power3.out`, and returns on leave. Use two nested groups (outer for hover, inner for float) so the two transforms never conflict.

Default easing: `power2.out`. Do not use elastic or bounce.

Reduced motion: skip every tween, hide the replay button, show the final state.

## Concept ideas by industry

- **Healthcare:** records grid, live ECG, vitals card, medical cross focal.
- **Fintech:** ledger lines, candlestick or bar plane, transaction path with nodes, coin or bar focal.
- **Analytics:** stacked chart planes, funnel of shrinking slabs, one highlighted bar.
- **Branding:** logo plane over a type-specimen plane and a swatch plane, logo mark focal.
- **Product UI/UX:** exploded wireframe layers, component grid, cursor or input pill focal.
- **Engineering / DevOps:** slab with window chrome, code lines, module tiles with chevrons, pipeline path.
- **E-commerce:** product card plane, cart tile, route to checkout, price tag focal.
- **Education:** document planes, progress bar, path through milestones, book or cap focal.

## Accessibility and performance

- `role="img"` and a descriptive `aria-label` on the SVG; decorative annotation text needs no extra markup.
- Controls (replay) are real buttons with visible focus.
- Contrast: body text at least 4.5:1 in both themes; illustration strokes are decorative but the focal element should be clearly visible.
- Pause or avoid heavy idle animation off-screen when embedding in long pages (IntersectionObserver around the float tweens).
- Keep the SVG under about 30 KB and avoid filters and masks.
