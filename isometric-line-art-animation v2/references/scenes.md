# Scenes (what is drawn)

Contents: Scene catalog, Reference patterns, Card anatomy, Primitives API, Writing a new scene, Scene ideas

A **scene** is the subject of one illustration: its geometry, layers and default card copy. Styles, themes and vibes apply to every scene unchanged. Scenes live in `assets/scenes/<name>.js`; `scripts/build.py` injects the ones you ask for into `assets/engine.html`.

## Scene catalog

| Scene | Composition | Focal element | Use for |
|---|---|---|---|
| `dashboard` | Exploded horizontal stack of 4 planes: base grid, pixel cells, ECG trace, vitals card | Solid cross | Dashboards, data products, healthcare |
| `landing` | One sheet that rises through an S-curve, hatch density showing the bend, three bars standing on it, logo and text lines on the raised end | Tallest bar top and logo | Landing pages, growth, marketing |
| `windows` | Five upright browser windows in a receding row on a dotted floor, front one with window controls, address pill and logo | Front window logo | Websites, CMS, web builds |
| `uiux` | Four upright layers pulled apart in depth: hatched panel, two pixel-grid panels, back panel with input pill and ring; dotted callout with a `px` label | Solid input pill | Product design, UX, design systems |
| `engineering` | Thick hatched slab with an interface on top, two satellite tiles (hex icon, code icon) joined by dotted connectors | Slab logo | Full-stack, product engineering, platforms |
| `branding` | Large top plane with a pinwheel logo, a faded plane behind, a folded-corner page below with hatch, text lines and swatches | Solid pinwheel logo | Branding, identity, pitch decks |
| `mobile` | Three upright phones staggered diagonally on a dotted floor, floating notification tile | Front phone CTA pill | Mobile apps, app design |
| `analytics` | Base slab with five bars (tallest solid), floating chart plane with ring chart, arc and trend line | Tallest bar | Analytics, reporting, BI |
| `infra` | Four stacked server slabs with slot lines, LEDs and dotted connectors | Top power button | Cloud, DevOps, infrastructure |
| `ai` | Chip with pins and a solid core, right-angle traces to nodes on a dotted board | Solid core | AI products, models, hardware |

`python scripts/build.py --list` prints the current scene names.

## Reference patterns

These are the composition ideas behind the service-card style, so new scenes can reuse them:

1. **Exploded stack** (`dashboard`, `uiux`): equal planes at equal spacing, each carrying a different texture. Horizontal planes stack along z; upright planes (walls) step back along y.
2. **Curved sheet** (`landing`): a sheet is a height field `z = f(y)`. Draw its two edges as polylines sampled along the curve, then cross-section hatch lines whose spacing is dense where the slope is steep, which makes the bend readable.
3. **Standing walls** (`windows`, `mobile`): upright panels at constant y share the same size; the depth step moves each one up-right on screen. Chrome (dots, address pill) goes in a strip near the top so it stays visible on the back walls.
4. **Thick slab with satellites** (`engineering`, `infra`): a block with hatched sides reads as hardware. Small icon tiles sit on a lower z and connect with dotted lines and corner nodes.
5. **Layered brand planes** (`branding`): hero plane on top with the logo, a faded duplicate behind it, a page with a folded corner below. The fold is a cut corner plus a small triangle outlined on the page.
6. **Bars on a base** (`analytics`): blocks of different heights, nearest drawn last, with only the tallest top face solid.

## Card anatomy

The engine renders each scene inside a service card, as in the reference screenshots: title, illustration, short description, row of uppercase tag chips.

- Title: 18 px, weight 600. One to four words.
- Description: 14 px, two or three sentences at most, muted.
- Tags: three to six, uppercase, chip color is the page background mixed into the card.
- Card copy comes from the scene file (`title`, `desc`, `tags`) and can be overridden per card in a `--cards` JSON file.
- A single card renders centered; several cards form a responsive grid.
- Each card plays its intro when about 30 percent visible, once.

## Primitives API (globals available to scenes)

Projection and mappers
- `P(x,y,z)` returns screen `[sx,sy]`. `pt(x,y,z)` returns `"sx sy"`.
- Mappers turn local 2D `(u,v)` into 3D: `FL(z)` floor plane, `WL(y)` upright wall facing front-left (u runs along x, v is height), `WX(x)` upright wall facing front-right.

Drawing (all return SVG strings)
- `shape(m, pts, cls, close=true)` draw-on path from 2D points through mapper `m`. `sshape` is the static version (no draw-on).
- `D3(cls, pts3, close)` and `S3(cls, pts3, close)` for raw 3D points. Use `S3`/`sshape` for anything dashed or fading (`grid`, `dots`, `tex`, `cell`); never give dashed items `pathLength`.
- `plane(rect, z, cls)` floor plane (gets thickness in the solid style). `block(x0,y0,x1,y1,z0,z1,cls,hatchStep)` thick box with shaded faces.
- `node(x,y,z)` diamond marker. `dot(x,y)` solid dot in screen space. `lbl(x,y,text)` mono label.

Shapes and textures
- `rect(x0,y0,x1,y1)`, `cham(x0,y0,x1,y1,c)` chamfered rectangle (pill or phone), `circ(cx,cy,r,n)`.
- `tlines(m,u,v,w,n,gap,cls)` text-like lines, `cells(m,u0,v0,cols,rows,size,seed)` pixel cells, `hatch(m,u0,v0,u1,v1,step,dir)`.
- `logo(m,cx,cy,scale,focal)` pinwheel logo (solid focal, or faded when `focal=false`), `hexIcon(m,cx,cy,r)`, `codeIcon(m,cx,cy,scale)`.

Classes the engine animates
- Draw-on strokes: `plane`, `face`, `trace`, `ln`. Fades: `guide`, `grid`, `cell`, `tex`. Pops: `node`. Appears: `focal`. Annotation group: `ann`.
- Stroke tiers: `plane` (structure), `hero` (add to `plane` for the top plane), `s2` (structure line), `s3` (detail line), `trace` (hero line).
- Exactly one logical focal element per scene: give it `solid focal`.

## Writing a new scene

Create `my_scene.js`:

```js
SCENES.myScene={
  label:'Short label',title:'Card title',desc:'One or two sentences.',tags:['Tag','Tag'],
  alt:'Plain-language description of the drawing for screen readers.',
  build(){
    const F=FL(0);
    const base=plane(rect(-6,-6,6,6),0)+node(-6,-6,0);
    const top=plane(rect(-4,-4,4,4),6,'plane hero')+logo(FL(6),0,0,.9);
    return {zoom:1.2,center:[260,200],layers:[base,top],dim:[[-6,8,0],[6,8,0]],dimLabel:'12.0 u',ann:''};
  }
};
```

Return value: `layers` (array of SVG strings, back to front, each floats on its own), `zoom` and `center` (frame the drawing so it fills about 70 percent of the card), optional `dim` and `dimLabel` (blueprint dimension line), optional `ann` (extra static annotation), optional `guides:false`, optional `dot:false`.

Then build with `python scripts/build.py --scenes myScene --extra-scene my_scene.js --out page.html`.

Authoring checklist
- Draw back to front. Use opaque `plane`/`block`; lines of lower layers must not show through.
- Keep plane contents inside about -5.5 to 5.5 of a 12-unit plane.
- Equal z-spacing; at most four layers (floor plus three is typical).
- Measure the drawing's bounding box (parse the `d` attributes in a headless DOM) and set `zoom` and `center` from it. Aim for 70 to 75 percent of the frame.
- Test in all six styles; the solid style adds thickness, the blueprint style adds a dimension line, the neon style adds glow.

## Scene ideas

Build these with the same primitives when a project needs them:
- **Pipeline:** three planes joined by a dotted route with nodes, a solid packet on the route (use `S3('dots', ...)` and `node`).
- **E-commerce:** product card plane, cart tile, route to a checkout tile, price tag focal.
- **Security:** a plane with a padlock built from a block and a shackle arc (`circ` half-ring), shield outline on a second plane.
- **Data model:** table planes linked by right-angle connectors with nodes at joins.
- **Education:** document planes, a progress bar, milestones along a path, book focal.
- **Docs and content:** stacked pages with folded corners, text lines, one highlighted block.
- **Support and chat:** two offset planes with chat-bubble shapes (`cham`) and typing dots.
- **Maps and logistics:** a floor plane with a dotted route, pin nodes, a box (`block`) as the cargo focal.
