# Primitives API and scene authoring

Reference for authoring `SCENES.<name>` scenes. Source skill: `isometric-line-art-animation`
(`C:\Users\mushfiq\Documents\animate line art\isometric-line-art-animation v2`) — the engine here is a snapshot of it.

## Projection and mappers

```js
const U = 10, OX = 260, OY = 250, C30 = Math.cos(Math.PI / 6);
const P = (x, y, z = 0) => [OX + (x - y) * C30 * U, OY + (x + y) * .5 * U - z * U];
```

- `x` runs down-right, `y` down-left, `z` up. All geometry is `P` points; a 12-unit plane centered on the origin spans about 208 px wide and 120 px tall.
- Mappers turn local 2D `(u,v)` into 3D: `FL(z)` floor plane, `WL(y)` upright wall facing front-left (u along x, v is height), `WX(x)` upright wall facing front-right.
- `f(n)` formats one decimal; `pt(x,y,z)` returns `"sx sy"`.

## Drawing primitives (globals, all return SVG strings)

- `D3(cls, pts3, close)` — path that draws on (`pathLength="1"`). `S3(cls, pts3, close)` — static path; use for anything dashed or fading.
- `shape(m, pts2, cls, close, x)` / `sshape(...)` — same via a mapper `m`.
- `rect(x0,y0,x1,y1)`, `cham(x0,y0,x1,y1,c)` chamfered rectangle (pills, phones), `circ(cx,cy,r,n)` sampled circle, `poly3(a, close)` raw point list to path data.
- `plane(a, z, cls)` — floor plane with optional thickness in solid style. `block(x0,y0,x1,y1,z0,z1,cls,hs)` — thick box, shaded faces, optional hatch step.
- `node(x,y,z)` diamond marker; `dot(x,y)` screen-space dot; `lbl(x,y,t)` mono label (screen space).
- `tlines(m,u,v,w,n,gap,cls)` text-like lines; `cells(m,u0,v0,cols,rows,sz,seed)` pixel cells (deterministic seed, never `Math.random()`); `hatch(m,u0,v0,u1,v1,step,dir)`.
- Glyphs: `logo(m,cx,cy,s,focal)` pinwheel (solid focal, or faded when `focal=false`), `hexIcon(m,cx,cy,r)`, `codeIcon(m,cx,cy,s)`.

## Classes the engine animates

- Draw-on strokes: `plane`, `face`, `trace`, `ln` (combine as `'s2 ln'`, `'s3 ln'`). Fades: `guide`, `grid`, `cell`, `tex`. Pops: `node`. Appears: `focal`. Annotation group: `ann`.
- Stroke tiers: `plane` structure · `plane hero` top plane · `s2` structure line · `s3` detail line · `trace` hero line.
- Exactly one logical focal element per scene: class `solid focal`.

**Two failure modes to remember:**
- A hand-written `<path class="... ln">` without `pathLength="1"` renders as broken 1 px dashes once the draw-on animation sets `strokeDasharray:1`. `D3`/`shape` add the attribute automatically; raw path strings must include it.
- Upright floating elements (clouds, speech bubbles, icons that must face the viewer) drawn on `FL(z)` come out iso-squashed. Draw them as a screen-space billboard path inside a layer instead — see the cloud in `assets/scenes/infra.js`.

## Scene shape

```js
SCENES.mySubject={
  label:'Short label', title:'Card title',
  alt:'Plain-language description of the drawing.',
  build(){
    const F=FL(0);
    const base=plane(rect(-6,-6,6,6),0)+node(-6,-6,0);
    const top=plane(rect(-4,-4,4,4),6,'plane hero')+logo(FL(6),0,0,.9);
    return {zoom:1.2,center:[260,200],layers:[base,top],dim:[[-6,8,0],[6,8,0]],dimLabel:'12.0 u',ann:''};
  }
};
```

- Cards render as **title + drawing only** — no description paragraph, no tag chips, no figure numbers. `label` feeds `build.py --list`; `title` is the card heading; `alt` is required — the engine sets the svg's accessible name from it (`role="img"` + `<title id>` + `aria-labelledby`).
- Each build emits two artifacts per card, static first: `<stem>.svg` then `<stem>.html`. The static svg is rendered by `assets/render_static.js` (Node) from the **same scene code and `assets/primitives.js`** the engine uses — pure vector, no JS inside, same class tiers and charcoal tokens, charcoal background rect included. One `.svg` per page; with multiple scenes per page they are named `<stem>-<scene>.svg`.
- Projection + primitives live in `assets/primitives.js`, shared by both consumers: `build.py` injects it into the engine at the `//@@PRIMITIVES@@` marker, and `render_static.js` evaluates it directly. Edit primitives there, never in `engine.html`.
- `layers`: array of SVG strings, back to front; each floats on its own (idle float + hover spread). Three to five layers.
- `zoom`, `center`: frame the viewBox (520×300 base) so the drawing fills 70–75 percent. `guides:false` hides iso guides; `dot:false` hides the pointer dot.
- `dim`, `dimLabel`: blueprint dimension line (harmless in non-blueprint looks — the class is hidden). `ann`: extra static annotations drawn flat in screen space.

## Authoring rules

- Draw back to front; opaque fills so lower layers never bleed through upper planes.
- Keep plane contents inside about −5.5 to 5.5 of a 12-unit plane; equal z-spacing; identical thickness on every slab.
- Measure, don't guess: after building, read each layer's `getBBox()` in the browser (`document.querySelector('.layer')...`) and set `zoom`/`center` from the union. The engine's own pointer dot already occupies the upper-left of the frame; keep the top-left corner clear for it.
- Test the scene in both locked looks: solid adds thickness (0.9 unit) and shaded faces; outline does not. In solid, contents must still sit inside their planes once faces extrude downward.
- Texture density stays even; no area noticeably busier than the rest.

## Texture recipes

- Dashed grid: lines every 3 units, class `grid`, dash `2 4` (the class sets it).
- Hatch strip: parallel lines every 0.5 units across a ~2-unit band, class `s3 tex`.
- Pixel cells: `cells` with fill opacities chosen from `[0,.12,.3,.65,0,.2,.45,0,.12,.8]` by the seeded loop.
- Waveform / trace: polyline with flat baseline and one or two spikes, class `trace`, node at its end.
- Focal mark: solid polygon, 4 to 12 vertices, class `solid focal`.
