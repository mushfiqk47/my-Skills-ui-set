# Vibes (how it moves)

Contents: How vibes work, Vibe catalog, Choosing a vibe, Style-specific motion extras, Custom vibes

## How vibes work

All vibes play the same choreography (guides, planes back to front, textures, lines, ECG-type trace, nodes, focal element, annotations) so illustrations in a set stay recognisably one system. A vibe only changes four things:

| Parameter | Meaning |
|---|---|
| `speed` | multiplier applied to the whole timeline (`tl.timeScale`) |
| `ease` | default ease for most tweens |
| `pop` | ease used for node pop-ins |
| `float` and `fd` | idle float amplitude in px (0 = none) and base duration in seconds |

The base timeline runs about 4 s at speed 1. Total intro should land between 2 and 5 s after the multiplier.

## Vibe catalog

### calm (default)
- speed 1, ease `power2.out`, pop `back.out(2.5)`, float 3.5 px over 5 s plus 0.8 s per layer.
- Slow, soft, premium. The drawing is noticed before the motion.
- Use for: agency and portfolio work, healthcare, finance, anything that should feel trustworthy.

### precise
- speed 1.8, ease `power3.out`, pop `power4.out`, no idle float.
- Lines draw and snap in 150 to 300 ms steps, nothing drifts afterwards. Technical documents do not breathe.
- Use for: blueprint style, engineering, security, analytics, dev tools. Hover spread still works.

### energetic
- speed 1.3, ease `back.out(1.4)`, pop `back.out(3)`, float 5 px over 3 s plus 0.8 s per layer.
- Quick with a little overshoot, livelier idle drift.
- Use for: neon, duotone, consumer and startup pages. In neon style a short flicker plays on the focal element after the intro.

### still
- No tweens at all. The finished drawing is shown instantly and the replay button is hidden.
- Use for: reduced-motion users, print, social poster frames, and any context where animation is not allowed.
- The engine switches to this behavior automatically when `prefers-reduced-motion: reduce` is set.

## Choosing a vibe

| If the look is | Use |
|---|---|
| outline, solid, glass | calm |
| blueprint | precise |
| neon, duotone | energetic |
| any, for reduced motion or print | still |

Mismatches to avoid: energetic on blueprint (a technical drawing should not bounce), precise on glass (the soft look loses its softness).

## Style-specific motion extras

- **blueprint:** crosshair marks and the dimension line fade in with the annotation group; if the page has other blueprint UI, let the background grid shift a few px with scroll (parallax) but never animate it on its own.
- **neon:** focal flicker `[1, .25, 1, .5, 1]` over 0.5 s at the end of the intro; keep glow constant, never pulse the glow radius.
- **solid:** faces draw slightly faster than the top plane (stagger 0.07) so each slab feels like it extrudes.
- **glass:** consider a slow gradient angle drift on the hero stroke (60 s loop). Optional, and only when the vibe is calm.

## Hover and interaction

- Hover on the card spreads the layers upward by `index * 5` px over 0.7 s with `power3.out` (exploded view), then returns on leave.
- Two nested groups per layer (outer for hover, inner for float) keep the two transforms from fighting.
- No other hover effects. No click effects except the replay button.

## Accessibility

- Honor `prefers-reduced-motion`: use `still`.
- If the illustration is above the fold and repeats on revisit, play the intro once per page load only.
- Pause idle float when the card is off-screen (IntersectionObserver) on long pages.
- Replay controls must be real buttons with visible focus.

## Custom vibes

Add an entry to `VIBES` with the four parameters. Keep these constraints:
- Intro total between 2 and 5 s after the multiplier.
- Float amplitude at most 6 px, duration at least 3 s.
- No elastic or bounce eases; `back.out` with an overshoot of 3 or less is the limit.
- Never animate stroke width, blur radius or filters on idle.
