---
name: isometric-line-art-animation
description: Design and build polished, animated isometric line-art illustrations and service cards as one HTML/SVG file with GSAP draw-on animation. Ships a scene library (dashboard, landing-page curved sheet, standing browser windows, exploded UI layers, thick slab with satellites, branding planes, mobile phones, analytics bars, server stack, AI chip), six styles (outline, blueprint, duotone, glass, neon, solid), seven themes plus custom brand themes, four motion vibes, and a build script. Use whenever the user asks for isometric illustrations, line-art animation, schematic, blueprint, neon, glass or technical-drawing visuals, exploded-view layers, animated service-card art, or hero and feature illustrations for a SaaS, agency or product site, or shares a reference image of this style, even if they never say isometric or SVG. Also use it to turn a concept (landing page, app, branding, analytics, devops, AI, fintech) into this kind of art, restyle one, make a matching card set, or polish one.
---

# Isometric Line-Art Animation

Build custom isometric illustrations that look designed, not generated: one exact projection, a strict line-weight hierarchy, one solid focal element, and a calm draw-on animation. Output is one self-contained HTML file with inline SVG and GSAP, usually as a service card (title, illustration, description, tag chips).

A **look** is the combination of three independent choices applied to any **scene**:

| Axis | Decides | Options |
|---|---|---|
| **Scene** | what is drawn | dashboard, landing, windows, uiux, engineering, branding, mobile, analytics, infra, ai, or a new one |
| **Style** | how it is drawn | outline, blueprint, duotone, glass, neon, solid |
| **Theme** | which colors | charcoal, cobalt, paper, neon, aurora, forest, ember, or a custom brand theme |
| **Vibe** | how it moves | calm, precise, energetic, still |

Geometry and choreography are identical across looks, so a set of cards always reads as one system. Quality comes from restraint and consistency, not from detail. If in doubt, remove something.

## Fast path

```bash
python scripts/build.py --list                                   # scene names
python scripts/build.py --scenes landing,windows,engineering \
  --look "Cobalt blueprint" --out /mnt/user-data/outputs/cards.html
python scripts/build.py --all --controls --out gallery.html      # every scene with a live look switcher
python scripts/build.py --cards cards.json --theme-json '{"name":"brand","mode":"dark","bg":"#0b0b12","card":"#15151f","ink":"#f5f5ff","accent":"#ff5a36","accent2":"#ffc247"}' --theme brand --style duotone --out page.html
python scripts/build.py --scenes myScene --extra-scene my_scene.js --out page.html
```

`cards.json` is `[{"scene":"landing","title":"...","desc":"...","tags":["..."]}, ...]`; any field left out uses the scene's default copy. Run the script from the skill folder. `assets/gallery.html` is a prebuilt preview of every scene.

## Workflow

1. **Brief.** Identify the subject, what it should say in one sentence, and the single focal element. Infer these when the user gives enough; ask at most one question if the subject is genuinely missing. Copy the style of a reference image, never its objects.
2. **Choose the scene.** Match the subject to a scene in `references/scenes.md`. If none fits, write a new scene (same file) rather than bending an existing one.
3. **Choose the look.** Pick style, theme and vibe from the audience (table below, details in `references/styles.md`). If the user named a brand color, build a custom theme (`references/themes.md`). If the user wants to compare options, build with `--controls`.
4. **Write the card copy.** Title of one to four words, description of two or three sentences, three to six tags. Do not copy a reference site's wording.
5. **Build.** Run `scripts/build.py`. For a new scene, author it with the primitives API in `references/scenes.md` and pass `--extra-scene`.
6. **Polish.** Run the checklist and inspect the generated page in a real browser. Fix every confirmed visual or runtime failure by editing the scene file or engine, then rebuild.
7. **Deliver.** See Delivery.

## Choosing a look

| Audience or intent | Look (style, theme, vibe) |
|---|---|
| Premium agency, portfolio, service cards | outline, charcoal, calm |
| Dev tools, infra, security, engineering | blueprint, cobalt, precise |
| Fintech, enterprise, consulting, legal | solid, forest, calm or blueprint, paper, precise |
| Healthcare, wellness | blueprint, paper, calm or solid, forest, calm |
| AI product, modern SaaS | glass, aurora, calm |
| Gaming, crypto, nightlife, creative tech | neon, neon, energetic |
| Consumer, edtech, e-commerce, startup energy | duotone, ember, energetic |

Pairing rules: neon style needs a dark theme; glass and duotone need an accent clearly different from ink (avoid charcoal); never mix two styles in one illustration; use one look for a whole set. Full rules in `references/styles.md`.

## Hard rules (all looks and scenes)

Projection
- Compute every shape from the `P(x,y,z)` iso projection (the primitives do this). Never fake isometry with CSS or SVG `skew`/`scale`/`rotate` on a group; it distorts strokes and text.
- True 30 degrees only. Equal z-spacing between layers. Equal thickness on every slab.

Line and fill
- Exactly four stroke tiers: hero 1.5, structure 1, detail 0.75, grid 0.5 dashed. Opacities 100 / 60 / 35 / 12 to 18 percent.
- Every plane and block is filled opaquely with a card-derived color so upper layers hide lines below. No see-through stacks, not even in glass.
- One solid focal element per illustration (a logo made of several blocks counts as one). Everything else is outline or low-opacity fill.
- Color only from the theme's seven roles.
- Gradients, shadows and glow exist only where a style defines them: glass (one gradient hero stroke, one soft shadow) and neon (small, low-opacity glow). Nowhere else.
- Dashed or fading elements use static paths (`S3`, `sshape`), never `pathLength`.

Composition
- The drawing fills about 70 to 75 percent of the card frame (set `zoom` and `center`); leave breathing room around it.
- Three or four layers (a floor counts). More than five is clutter.
- Texture comes from lines: hatch, pixel-cell grids, stacked text lines, dashed grids, never noise or gradients.
- Small technical details: corner node diamonds, a dotted callout, one or two mono labels, faint dashed iso guide lines. The engine adds the pointer dot and figure label.

Motion
- The drawing is noticed before the motion. Draw order tells a story: guides, planes (back to front), textures, lines, nodes, focal element, annotations.
- Each card plays once when it scrolls into view. Hover spreads layers a few px (exploded view); no other hover effects.
- Respect `prefers-reduced-motion`: show the finished drawing (vibe `still`). Details in `references/vibes.md`.

Technical
- GSAP core only (free), pinned `3.12.5` from cdnjs. Hosted pages may load scripts only from cdnjs.cloudflare.com or cdn.jsdelivr.net with an exact pinned version; fonts only from Google Fonts with fallbacks; no remote images.
- All colors are CSS variables set from the theme. `color-mix()` is fine for tints. `color-scheme` matches the theme.
- Initial animation states are set from JS, never CSS, so a failed script load still shows the finished drawing.
- Production pages omit `--controls`. Keep a single card under about 25 KB.

## Polish checklist

All looks:
- [ ] All angles exactly 30 degrees; nothing off-grid
- [ ] Z-spacing identical; slab thickness identical
- [ ] At most four stroke weights and four opacities
- [ ] Panels occlude correctly; no lines bleed through
- [ ] One solid focal element
- [ ] Nodes sit exactly on corners or joints
- [ ] Even texture density; no area noticeably busier
- [ ] Drawing fills about 70 to 75 percent of the frame, nothing cropped
- [ ] Intro between 2 and 5 s; idle float subtle and out of sync (or none in precise)
- [ ] `still` path shows a complete static drawing
- [ ] Ink on card contrast at least 7:1, muted text at least 4.5:1
- [ ] Card copy is original, concise and in the brand's voice

Per style:
- [ ] blueprint: grid barely visible, connectors straight, labels mono, dimension label rotated to the edge
- [ ] duotone: accent clearly distinct from ink, used on hero stroke, cells and focal only
- [ ] glass: one gradient, one shadow, panels still opaque
- [ ] neon: one dominant neon element, glow small and low, readable with glow removed
- [ ] solid: left face lighter than right face, thickness 0.6 to 1.2 units

## Delivery

### Preview generated HTML in a browser

Treat the build output as a web page. Open it in a browser (in Codex, use `open_in_codex` with the HTML file or choose **Open in external browser**) and confirm the card is visible there. Do not use a generic file or visualization pane as the HTML preview: some hosts try to parse an HTML page as a visualization and show “An error occurred inside the visualization” even when the page runs correctly. That message alone is not evidence of a page bug. Check the page in the browser and inspect its console if it still fails; fix an error only when the browser confirms it. Keep the GSAP page generated by `scripts/build.py` unless the user specifically asks for a static export.

- If an Artifact tool is available and the user wants a viewable page: write the HTML to the outputs folder and publish it; do not also present the file.
- Otherwise write the file to `/mnt/user-data/outputs/` and present it.
- Reply in two or three sentences: the scenes and look used (style, theme, vibe), what to tune, and one or two next steps (another look, a brand theme, a new scene).

## Series work

For several cards keep identical: style, theme, vibe, stroke tiers, opacities, zoom discipline (all about 70 to 75 percent), easing, stagger, float. Vary only the scene and the focal element. Use one look per page.

## Iterating

One change at a time, described visually.

| Symptom | Fix |
|---|---|
| Looks flat or template-like | Add occlusion (opaque card fills), widen the stroke-opacity hierarchy, one hero plane |
| Cluttered | Remove a layer, halve texture density, drop a label |
| Lines show through upper planes | Opaque fill; check draw order |
| Drawing too small or cropped | Re-measure its bounding box, adjust `zoom` and `center` in the scene |
| Strokes look fuzzy | Align to the pixel grid, avoid fractional units, check device pixel ratio |
| Animation feels busy | Fewer simultaneous tweens, longer stagger, smaller float, or switch vibe to precise |
| Focal element does not stand out | Lower every other opacity; keep it the only solid shape |
| Neon looks cheap | Remove glow until it reads without it, then add back 3 px; one dominant neon element |
| Blueprint feels busy | Lower the `grid` alpha, drop the crosshairs, keep one dimension line |
| Glass looks muddy | Lighten the plane fill, drop shadow opacity, keep a single gradient |
| Brand color looks off | Check accent contrast on card; adjust per `references/themes.md` |
| Two cards in a set look unrelated | Same look, same zoom discipline, same layer count |

## Resources

- `scripts/build.py`: assembles engine, chosen scenes, cards, look and optional custom theme into one HTML file. `--help` lists every option.
- `assets/engine.html`: the shared engine (projection, primitives, styles, themes, vibes, card grid, controls). Edit it only to add a style, theme or vibe.
- `assets/scenes/*.js`: one file per scene. Copy the closest one when authoring a new scene.
- `assets/gallery.html`: prebuilt page with all ten scenes and the live look switcher, for previews.
- `references/scenes.md`: scene catalog, reference composition patterns, card anatomy, primitives API, how to write a scene, scene ideas. Read at steps 2 and 5.
- `references/styles.md`: what each style changes, when to use it, pairing rules. Read at step 3.
- `references/themes.md`: theme roles, preset palettes, custom theme recipe, contrast rules. Read at step 3 when a brand color is involved.
- `references/vibes.md`: motion parameters, choosing a vibe, per-style motion extras, accessibility.
- `references/design-spec.md`: tokens, projection math, base choreography, texture recipes, concept ideas by industry.
