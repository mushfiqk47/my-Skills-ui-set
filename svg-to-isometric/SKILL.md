---
name: svg-to-isometric
description: Turn any SVG — icon, logo, illustration, product mark — into an animated isometric line-art service card locked to the charcoal looks (flat Charcoal schematic or extruded Charcoal solid). Use whenever the user shares, names or points to an .svg file and wants it as isometric art, a charcoal/technical schematic, or line-art card, or says things like "convert this logo", "adopt this icon", "make this svg like the others" — even if they never say isometric, SVG or schematic.
---

# SVG → Isometric Charcoal Line Art

Rebuild the **subject** of any SVG as an isometric line-art illustration: one exact 30° projection, four stroke tiers, one solid focal element, calm draw-on animation. Output is two files per subject, in this order: first a **static `.svg`** (the drawing as a standalone vector), then a **self-contained animated HTML card** built from the same geometry (a title and the drawing — nothing else. No description paragraph, no tag chips, no figure numbers).

The SVG is **semantic input**. You extract what it depicts and rebuild it with isometric primitives. Never trace, embed, or skew the original paths; ignore its colors (charcoal is monochrome by design — even a rainbow logo comes out mono).

Two looks only, both charcoal theme, calm vibe:

| Look | Style | Use when |
|---|---|---|
| **Charcoal schematic** | outline | Default. Flat monochrome technical drawing: logos, UI, concepts, abstract marks, anything not physical |
| **Charcoal solid** | solid | The subject is tangible — products, devices, packaging, objects — or the user says solid / 3D / extruded / thick |

Never expose or offer any other style, theme or vibe. One look per page; never mix styles in one illustration.

## Fast path

```bash
# run from this skill's folder
python scripts/build.py --list                                   # pattern-library scenes
python scripts/build.py --scenes mySubject --extra-scene my_subject.js \
  --style outline --theme charcoal --vibe calm --out card.html
python scripts/build.py --scenes mySubject --extra-scene my_subject.js \
  --style solid --theme charcoal --vibe calm --out card.html
```

`assets/scenes/*.js` is the pattern library — open the closest match before authoring. `references/primitives.md` holds the primitives API and scene-authoring rules; read it before writing your first scene (skim it if you have written one recently). Each build writes the static `<stem>.svg` first (rendered by `assets/render_static.js` from the same scene code), then the animated `<stem>.html`.

## Workflow

1. **Read the SVG.** Load the file (ask for its path — at most one question). Parse structure: `viewBox`, groups, ids/classes, fills, distinct sub-shapes. Answer: what does this depict, and what are its 3 to 7 recognizable parts? If it has text or a wordmark, the card title may echo it; do not reproduce the wordmark as text.
2. **Pick the look.** Charcoal schematic unless the subject is physical (see table above). State the choice in one line.
3. **Pick the composition pattern.** Match the subject to a pattern in `assets/scenes/`: exploded stack (`dashboard`, `uiux`), curved sheet (`landing`), standing walls (`windows`, `mobile`), thick slab + satellites (`engineering`, `infra`), layered planes (`branding`), bars on a base (`analytics`), board + traces (`ai`), object study (`mug`). Copy the closest scene file as your starting skeleton.
4. **Author the scene.** Write `my_subject.js` defining `SCENES.<name>` with the primitives API. Derive `title` from the subject (one to four words). Write an `alt` describing the new drawing in one concrete sentence — the engine sets the svg's accessible name from it (`role="img"` + `<title>`), so `alt` is required and must not be filler.
5. **Build.** Run the build with the locked look flags: it renders the static `.svg` first, then the animated HTML card that draws the same geometry on. Use `--controls` while drafting to flip between the two looks; omit it in the delivered page.
6. **Polish.** Run the checklist below in a real browser tab; fix every confirmed failure in the scene file and rebuild.
7. **Deliver.** Reply in two or three sentences: what the SVG depicted, the look used, what to tune, one next step (the other look, or a matching card set).

## Translating SVG parts to primitives

| In the SVG | Becomes |
|---|---|
| Overall silhouette / main shape | A `plane` or `block` composition carrying the drawing; the object rebuilt in iso from `rect`, `cham`, `circ`, `poly3` points |
| Focal mark (logo, glyph, badge) | The one `solid focal` element, built from 4 to 12 vertices, or the engine glyphs `logo`, `hexIcon`, `codeIcon` |
| Arrows, flows, connections | `s2 ln`/`s3 ln` polylines with `node` diamonds at joins; dashed routes use `S3('dots', ...)`, never `pathLength` |
| Text, labels | `tlines` (text-like lines). Real text only via `lbl` mono annotations in `ann` |
| Repeated small shapes (dots, grid, list rows) | `cells`, `hatch`, or a small loop — deterministic, never `Math.random()` |
| Detail texture | `hatch` strips or `grid` dashes, even density |
| Upright floating elements (clouds, bubbles, icons that must face the viewer) | Screen-space billboard path inside a layer — floor-plane shapes get iso-squashed (see `infra.js` cloud) |

**Complexity budget.** An SVG with 200 paths becomes a drawing of roughly 40 to 90 primitives. Reduce to the iconic silhouette plus two or three details; drop anything that does not help recognition. If two parts compete for "the subject", keep the one a viewer would name first.

## Hard rules

- All geometry through the `P(x,y,z)` projection and mappers (`FL`, `WL`, `WX`). No CSS/SVG skew, scale or rotate fakes.
- Exactly four stroke tiers (hero 1.5, structure 1, detail 0.75, grid 0.5 dashed); opacities 1 / .6 / .35 / .12–.18. Use engine classes; do not restyle them.
- One solid focal element. Everything else outline or low-opacity fill.
- Planes and blocks filled opaquely with card-derived colors so upper layers occlude. Three to five layers.
- Hand-written `<path class="... ln">` strings must carry `pathLength="1"` or the draw-on breaks into 1 px dashes. Dashed/fading items use `S3`/`sshape`, never `pathLength`.
- Drawing fills about 70 to 75 percent of the frame (`zoom`, `center`); nothing cropped; contents stay inside the plane.
- Initial animation states come from the engine's JS; never set hidden initial states in CSS.

## Polish checklist

- [ ] Subject recognizable in under 3 seconds as the same thing as the SVG
- [ ] All angles exactly 30°; equal layer spacing; identical slab thickness (solid)
- [ ] At most four stroke weights and four opacities; panels occlude correctly
- [ ] One solid focal element, taken from the SVG's focal mark
- [ ] Drawing fills 70 to 75 percent of the frame, nothing cropped
- [ ] Intro 2 to 5 s; `prefers-reduced-motion` shows the finished drawing (engine handles it)
- [ ] Ink on card contrast at least 7:1 (charcoal defaults do this)
- [ ] Card shows only the title and the drawing; the svg names itself from `alt` via `role="img"` + `<title>` (engine default)
- [ ] Static `.svg` opens standalone with the same geometry, tiers and charcoal tokens as the animated card (build emits it automatically)
- [ ] Solid look: left face lighter than right face, thickness 0.6 to 1.2 units

## Delivery

Deliver both files: the static `.svg` (pure vector, no JS — drops into docs, decks or design tools as-is) and the animated HTML card. Treat the HTML as a web page: open it in a normal browser tab (not a generic preview pane) and confirm the card draws on and rests correctly; check the console if it fails. Do not present a file and a published artifact of the same page.

## Origin and sync

Engine, build script and pattern scenes are copied from the `isometric-line-art-animation` skill (source folder recorded in `references/primitives.md`). This fork adds local changes on top — title-only cards, no figure numbers, shared `assets/primitives.js` and the `assets/render_static.js` static renderer — so when syncing fixes from the origin, re-apply those changes (inject `//@@PRIMITIVES@@`, strip `desc`/`tags` from scenes, keep the static-output step in `build.py`) and re-verify one adopted card in each look.
