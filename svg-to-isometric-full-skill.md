# svg-to-isometric — full skill in one file
Everything needed to use or reconstruct the skill: docs, build script, shared primitives, static renderer, animated engine and the pattern-scene library. Rebuild the folder layout exactly as structured below (paths relative to the skill root).

```
svg-to-isometric/
├── SKILL.md
├── references/
│   └── primitives.md
├── scripts/
│   └── build.py
└── assets/
    ├── engine.html
    ├── primitives.js
    ├── render_static.js
    └── scenes/            # ai.js … windows.js (12 files)
```

---

# 1. SKILL.md — the skill definition

`SKILL.md`

````markdown
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
````

---

# 2. Primitives API & scene authoring

`references/primitives.md`

````markdown
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
````

---

# 3. Build script

`scripts/build.py`

````python
#!/usr/bin/env python3
"""Assemble a single self-contained isometric line-art HTML page.

Examples
  python scripts/build.py --list
  python scripts/build.py --all --controls --title "Scene library" --out gallery.html
  python scripts/build.py --scenes landing,windows,branding --look "Cobalt blueprint" --out page.html
  python scripts/build.py --cards cards.json --theme-json '{"name":"brand","mode":"dark","bg":"#0b0b12","card":"#15151f","ink":"#f5f5ff","accent":"#ff5a36","accent2":"#ffc247"}' --style duotone --theme brand --out page.html
  python scripts/build.py --scenes dashboard --extra-scene my_scene.js --out page.html
"""
import argparse, json, pathlib, re, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCENE_DIR = ROOT / "assets" / "scenes"
ENGINE = ROOT / "assets" / "engine.html"
REQUIRED_THEME = ("bg", "card", "ink", "accent", "accent2")


def scene_names():
    return sorted(p.stem for p in SCENE_DIR.glob("*.js"))


def scene_label(name):
    m = re.search(r"label:'([^']*)'", (SCENE_DIR / f"{name}.js").read_text())
    return m.group(1) if m else ""


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--list", action="store_true", help="list available scenes and exit")
    ap.add_argument("--scenes", help="comma-separated scene names (one card per scene)")
    ap.add_argument("--all", action="store_true", help="include every scene")
    ap.add_argument("--cards", help="JSON file: [{scene,title,desc,tags,alt}, ...] (overrides --scenes)")
    ap.add_argument("--extra-scene", action="append", default=[], help="path to an extra scene .js file (repeatable)")
    ap.add_argument("--look", help="preset look, e.g. 'Cobalt blueprint'")
    ap.add_argument("--style"); ap.add_argument("--theme"); ap.add_argument("--vibe")
    ap.add_argument("--theme-json", help="JSON object (or file path) defining a custom theme; needs a 'name' key")
    ap.add_argument("--controls", action="store_true", help="show the live Look/Style/Theme/Vibe switcher")
    ap.add_argument("--title", default="", help="optional page heading")
    ap.add_argument("--out", help="output HTML path")
    a = ap.parse_args()

    names = scene_names()
    if a.list:
        for n in names:
            print(f"{n:14s} {scene_label(n)}")
        return

    if not a.out:
        sys.exit("error: --out is required")

    extra_src, extra_names = [], []
    for path in a.extra_scene:
        src = pathlib.Path(path).read_text()
        extra_src.append(src)
        extra_names += re.findall(r"SCENES\.([A-Za-z0-9_]+)\s*=", src)

    if a.cards:
        cards = json.loads(pathlib.Path(a.cards).read_text())
    elif a.all:
        cards = [{"scene": n} for n in names]
    elif a.scenes:
        cards = [{"scene": s.strip()} for s in a.scenes.split(",") if s.strip()]
    else:
        sys.exit("error: give --scenes, --all or --cards")

    known = set(names) | set(extra_names)
    for c in cards:
        if c.get("scene") not in known:
            sys.exit(f"error: unknown scene '{c.get('scene')}'. Available: {', '.join(sorted(known))}")

    used = []
    for c in cards:
        if c["scene"] not in used:
            used.append(c["scene"])
    scenes_js = "\n".join((SCENE_DIR / f"{n}.js").read_text() for n in used if n in names)
    scenes_js += "\n" + "\n".join(extra_src)

    opts = {"controls": bool(a.controls), "title": a.title}
    for k in ("look", "style", "theme", "vibe"):
        if getattr(a, k):
            opts[k] = getattr(a, k)
    if a.theme_json:
        raw = a.theme_json
        theme = json.loads(pathlib.Path(raw).read_text() if pathlib.Path(raw).exists() else raw)
        name = theme.pop("name", None)
        if not name:
            sys.exit("error: --theme-json needs a 'name' key")
        missing = [k for k in REQUIRED_THEME if k not in theme]
        if missing:
            sys.exit(f"error: custom theme is missing {', '.join(missing)}")
        opts["themes"] = {name: theme}

    html = ENGINE.read_text()
    for marker, repl in (
        ("//@@OPTIONS@@", "const OPTS=" + json.dumps(opts) + ";"),
        ("//@@CARDS@@", "const CARDS=" + json.dumps(cards) + ";"),
        ("//@@SCENES@@", scenes_js),
        ("//@@PRIMITIVES@@", (ROOT / "assets" / "primitives.js").read_text()),
    ):
        if marker not in html:
            sys.exit(f"error: marker {marker} missing in engine.html")
        html = html.replace(marker, repl)

    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    # static SVG first: one per card, next to the HTML; the animated page is built from the same scenes
    node = shutil.which("node")
    if node:
        multi = len(used) > 1
        for n in used:
            svg_out = out.with_name(out.stem + ("" if not multi else "-" + n) + ".svg")
            cmd = [node, str(ROOT / "assets" / "render_static.js"), "--scene", n,
                   "--style", a.style or "outline", "--out", str(svg_out)]
            for p in a.extra_scene:
                cmd += ["--extra-scene", str(p)]
            try:
                r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                if r.returncode == 0:
                    print(r.stdout.strip())
                else:
                    tail = r.stderr.strip().splitlines()[-1] if r.stderr.strip() else "unknown error"
                    print(f"warning: static render failed for {n}: {tail}", file=sys.stderr)
            except Exception as e:
                print(f"warning: static render skipped for {n} ({e})", file=sys.stderr)
    else:
        print("note: node not found; skipping static SVG output", file=sys.stderr)

    out.write_text(html)
    kb = len(html.encode()) / 1024
    print(f"wrote {out} ({kb:.1f} KB, {len(cards)} card(s), scenes: {', '.join(used)})")
    if kb > 80:
        print("note: large file; consider fewer scenes", file=sys.stderr)


if __name__ == "__main__":
    main()
````

---

# 4. Shared projection + primitives module

`assets/primitives.js`

````javascript
/* ================= PROJECTION + PRIMITIVES ================= */
const U=10,OX=260,OY=250,C30=Math.cos(Math.PI/6);
const P=(x,y,z=0)=>[OX+(x-y)*C30*U,OY+(x+y)*.5*U-z*U];
const f=n=>n.toFixed(1);
const pt=(x,y,z=0)=>{const p=P(x,y,z);return f(p[0])+' '+f(p[1])};
const poly3=(a,close=true)=>'M'+a.map(([x,y,z=0])=>pt(x,y,z)).join('L')+(close?'Z':'');
// D3 = path that draws on (has pathLength=1). S3 = static path (dashed or fading items; never give these pathLength)
const D3=(c,a,close=true,x='')=>`<path class="${c}" pathLength="1" d="${poly3(a,close)}"${x}/>`;
const S3=(c,a,close=false,x='')=>`<path class="${c}" d="${poly3(a,close)}"${x}/>`;
// mappers turn 2D (u,v) into 3D: FL(z) floor plane, WL(y) upright wall facing front-left, WX(x) upright wall facing front-right
const FL=z=>(u,v)=>[u,v,z],WL=y=>(u,v)=>[u,y,v],WX=x=>(u,v)=>[x,u,v];
const shape=(m,pts,c,close=true,x='')=>D3(c,pts.map(([u,v])=>m(u,v)),close,x);
const sshape=(m,pts,c,close=true,x='')=>S3(c,pts.map(([u,v])=>m(u,v)),close,x);
const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const cham=(x0,y0,x1,y1,c=.3)=>[[x0+c,y0],[x1-c,y0],[x1,y0+c],[x1,y1-c],[x1-c,y1],[x0+c,y1],[x0,y1-c],[x0,y0+c]];
const circ=(cx,cy,r,n=24)=>Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]});
const node=(x,y,z=0)=>{const [px,py]=P(x,y,z);return `<path class="node" d="M${f(px)} ${f(py-3.2)}L${f(px+3.2)} ${f(py)}L${f(px)} ${f(py+3.2)}L${f(px-3.2)} ${f(py)}Z"/>`};
const dot=(x,y)=>`<circle class="solid" cx="${x}" cy="${y}" r="4"/>`;
const lbl=(x,y,t,a='')=>`<text class="lbl" x="${x}" y="${y}"${a}>${t}</text>`;
let TH=0; // plane thickness, solid style only
const plane=(a,z,c='plane')=>{
  let s='';
  if(TH){const x0=a[0][0],y0=a[0][1],x1=a[2][0],y1=a[2][1];
    s+=D3('face face-l',[[x0,y1,z],[x1,y1,z],[x1,y1,z-TH],[x0,y1,z-TH]]);
    s+=D3('face face-r',[[x1,y0,z],[x1,y1,z],[x1,y1,z-TH],[x1,y0,z-TH]]);}
  return s+shape(FL(z),a,c);
};
// block: thick box (all styles). hs = optional hatch step on both visible faces
const block=(x0,y0,x1,y1,z0,z1,c='plane',hs=0)=>{
  let s=D3('face face-l',[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]])+D3('face face-r',[[x1,y0,z1],[x1,y1,z1],[x1,y1,z0],[x1,y0,z0]]);
  if(hs){
    for(let x=x0+hs;x<x1-.01;x+=hs)s+=S3('s3 tex',[[x,y1,z0+.15],[x,y1,z1-.15]]);
    for(let y=y0+hs;y<y1-.01;y+=hs)s+=S3('s3 tex',[[x1,y,z0+.15],[x1,y,z1-.15]]);}
  return s+shape(FL(z1),rect(x0,y0,x1,y1),c);
};
// text-like lines along u, stepping in v
const tlines=(m,u,v,w,n=3,gap=1,c='s3 ln')=>{let s='';for(let i=0;i<n;i++){const k=w*[1,.65,.85,.5,.75][i%5];s+=shape(m,[[u,v+i*gap],[u+k,v+i*gap]],c,false)}return s};
// pixel-cell grid (static, fades in)
const cells=(m,u0,v0,cols,rows,sz,seed=3,c='cell')=>{
  const lv=[0,.12,.3,.65,0,.2,.45,0,.12,.8];let k=seed,s='';
  for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){k=(k*7+5)%97;const u=u0+q*sz,v=v0+r*sz;
    s+=sshape(m,rect(u+sz*.08,v+sz*.08,u+sz*.92,v+sz*.92),c,true,` fill-opacity="${lv[k%lv.length]}"`)}
  return s};
// hatch lines across a rectangle; dir 'v' = lines of constant u, 'h' = lines of constant v
const hatch=(m,u0,v0,u1,v1,step,dir='v')=>{let s='';
  if(dir==='v')for(let u=u0+step;u<u1-.01;u+=step)s+=sshape(m,[[u,v0],[u,v1]],'s3 tex',false);
  else for(let v=v0+step;v<v1-.01;v+=step)s+=sshape(m,[[u0,v],[u1,v]],'s3 tex',false);
  return s};
// glyphs: pinwheel logo, hex (cube) icon, code chevrons
const logo=(m,cx,cy,s=1,focal=true)=>{
  const R=[(x,y)=>[x,y],(x,y)=>[-y,x],(x,y)=>[-x,-y],(x,y)=>[y,-x]];
  return R.map(g=>{const p=cham(.15,-1,1.9,-.1,.28).map(([x,y])=>{const [a,b]=g(x,y);return[cx+a*s,cy+b*s]});
    return focal?shape(m,p,'solid focal'):sshape(m,p,'cell',true,' fill-opacity=".35"')}).join('')};
const hexIcon=(m,cx,cy,r)=>{const h=circ(cx,cy,r,6);
  return shape(m,h,'s2 ln')+[0,2,4].map(i=>shape(m,[[cx,cy],h[i]],'s3 ln',false)).join('')};
const codeIcon=(m,cx,cy,s=1)=>
  shape(m,[[cx-.4*s,cy-.9*s],[cx-1.3*s,cy],[cx-.4*s,cy+.9*s]],'s2 ln',false)+
  shape(m,[[cx+.4*s,cy-.9*s],[cx+1.3*s,cy],[cx+.4*s,cy+.9*s]],'s2 ln',false)+
  shape(m,[[cx+.25*s,cy-1*s],[cx-.25*s,cy+1*s]],'s3 ln',false);
````

---

# 5. Static SVG renderer

`assets/render_static.js`

````javascript
#!/usr/bin/env node
/* Render a scene as a standalone static SVG (no animation, no JS inside the output).
   Used by scripts/build.py, which calls it once per card BEFORE writing the animated HTML.

   Usage:
     node render_static.js --scene mySubject --style outline --out card.svg \
       [--extra-scene path/to/scene.js] ...
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SCENE_DIR = path.join(ROOT, 'assets', 'scenes');

function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return dflt;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}
const sceneName = arg('scene');
const style = arg('style', 'outline');
const out = arg('out');
const extras = [];
for (let i = 0; i < process.argv.length; i++)
  if (process.argv[i] === '--extra-scene') extras.push(process.argv[i + 1]);
if (!sceneName || !out) { console.error('error: --scene and --out are required'); process.exit(1); }

// Load the shared primitives into this context (global lexical scope, like page scripts)
vm.runInThisContext(fs.readFileSync(path.join(ROOT, 'assets', 'primitives.js'), 'utf8'),
  { filename: 'primitives.js' });

// Scene registry + plane thickness, then the scene sources
vm.runInThisContext('globalThis.SCENES={}; TH=' + (style === 'solid' ? 0.9 : 0) + ';',
  { filename: 'init.js' });
for (const p of extras) vm.runInThisContext(fs.readFileSync(p, 'utf8'), { filename: p });
const builtin = path.join(SCENE_DIR, sceneName + '.js');
if (fs.existsSync(builtin)) vm.runInThisContext(fs.readFileSync(builtin, 'utf8'), { filename: builtin });

if (!SCENES[sceneName]) { console.error('error: unknown scene "' + sceneName + '"'); process.exit(1); }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sc = SCENES[sceneName].build({ style });
const zm = sc.zoom || 1;
const [cx, cy] = sc.center || [260, 180];
const vw = 520 / zm, vh = 300 / zm;
const vb = [cx - vw / 2, cy - vh / 2, vw, vh];

// Charcoal token styles: same classes and values the animated engine uses
const CSS = `:root{--ink:#ffffff;--card:#232323;--line:var(--ink);--herol:var(--ink);--focal:var(--ink);--cell:var(--ink)}
svg[data-style=outline]{--pf:var(--card);--fl:var(--pf);--fr:var(--pf)}
svg[data-style=solid]{--pf:color-mix(in srgb,var(--ink) 4%,var(--card));--fl:color-mix(in srgb,var(--ink) 8%,var(--card));--fr:color-mix(in srgb,var(--ink) 15%,var(--card))}
.plane{fill:var(--pf);stroke:var(--line);stroke-width:1;stroke-opacity:.6;stroke-linejoin:round}
.hero{stroke:var(--herol);stroke-width:1.5;stroke-opacity:1}
.face{stroke:var(--line);stroke-width:.75;stroke-opacity:.35;stroke-linejoin:round}
.face-l{fill:var(--fl)}.face-r{fill:var(--fr)}
.s2{fill:none;stroke:var(--line);stroke-width:1;stroke-opacity:.6;stroke-linejoin:round}
.s3{fill:none;stroke:var(--line);stroke-width:.75;stroke-opacity:.35;stroke-linejoin:round}
.grid{fill:none;stroke:var(--line);stroke-width:.5;stroke-opacity:.18;stroke-dasharray:2 4}
.trace{fill:none;stroke:var(--herol);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
.cell{fill:var(--cell);stroke:var(--line);stroke-width:.75;stroke-opacity:.35}
.node{fill:var(--card);stroke:var(--line);stroke-width:1}
.solid{fill:var(--focal)}
.dots{fill:none;stroke:var(--line);stroke-width:1;stroke-opacity:.5;stroke-dasharray:1 4;stroke-linecap:round}
.lbl{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:calc(9px / var(--z,1));fill:var(--ink);fill-opacity:.55}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(f).join(' ')}" data-style="${style}" style="--z:${zm}" role="img" aria-labelledby="isot-static">
<title id="isot-static">${esc(sc.alt || sc.title || sceneName)}</title>
<style>${CSS}</style>
<rect x="${f(vb[0])}" y="${f(vb[1])}" width="${f(vw)}" height="${f(vh)}" fill="var(--card)"/>
${sc.layers.map(l => '<g class="layer">' + l + '</g>').join('\n')}
${sc.ann ? '<g class="ann">' + sc.ann + '</g>' : ''}
</svg>`;

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, svg, 'utf8');
console.log('wrote ' + out + ' (static svg, ' + sc.layers.length + ' layers)');
````

---

# 6. Animated engine (template)

`assets/engine.html`

````html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Isometric line art</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
:root{--bg:#161616;--card:#232323;--ink:#fff;--muted:rgba(255,255,255,.6);--accent:#fff;--accent2:#fff;--grid:transparent;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);color-scheme:dark}
@media (prefers-color-scheme:light){:root{--bg:#ece9e2;--card:#faf8f5;--ink:#334155;--muted:rgba(51,65,85,.7);--accent:#2563eb;--accent2:#f59e0b;color-scheme:light}}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);font-family:"Space Grotesk",system-ui,sans-serif;padding:24px 16px;transition:background .4s}
.top{max-width:1180px;margin:0 auto 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;justify-content:space-between}
.top:empty{display:none}
.top h1{font-size:20px;font-weight:600;margin:0;letter-spacing:-.01em;flex:1 1 100%}
#grid{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),560px));gap:16px;justify-content:center}
.card{background:var(--card);border-radius:20px;padding:24px 24px 26px;overflow:hidden;display:flex;flex-direction:column;transition:background-color .4s}
.card[data-style=blueprint]{background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:24px 24px}
.card[data-style=glass]{background-image:radial-gradient(120% 80% at 15% 0,color-mix(in srgb,var(--accent) 24%,var(--card)),var(--card) 70%)}
h2{font-size:18px;font-weight:600;margin:0;letter-spacing:-.01em}
button,select{font:inherit;font-size:13px;color:var(--ink);background:color-mix(in srgb,var(--ink) 9%,transparent);border:0;border-radius:999px;padding:7px 14px;cursor:pointer}
select{padding:6px 8px;border-radius:8px;max-width:100%;color-scheme:inherit}
select option{color:var(--ink);background-color:var(--card)}
:is(button,select):focus-visible{outline:2px solid var(--ink);outline-offset:2px}
#controls{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end}
#controls label{display:grid;gap:3px;font-size:11px;color:var(--muted)}
svg{display:block;width:100%;height:auto;margin:4px 0 0;overflow:visible;
--line:var(--ink);--herol:var(--ink);--pf:var(--card);--focal:var(--ink);--cell:var(--ink);--fl:var(--pf);--fr:var(--pf)}
/* styles only re-map tokens */
svg[data-style=blueprint]{--line:var(--accent);--pf:color-mix(in srgb,var(--accent) 7%,var(--card));--focal:var(--accent);--cell:var(--accent)}
svg[data-style=duotone]{--herol:var(--accent);--pf:color-mix(in srgb,var(--accent) 10%,var(--card));--focal:var(--accent);--cell:var(--accent)}
svg[data-style=glass]{--pf:color-mix(in srgb,var(--ink) 7%,var(--card));--focal:var(--accent2);--cell:var(--accent)}
svg[data-style=neon]{--line:var(--accent);--herol:var(--accent2);--focal:var(--accent2);--cell:var(--accent)}
svg[data-style=solid]{--pf:color-mix(in srgb,var(--ink) 4%,var(--card));--focal:var(--accent);--cell:var(--accent);--fl:color-mix(in srgb,var(--ink) 8%,var(--card));--fr:color-mix(in srgb,var(--ink) 15%,var(--card))}
svg[data-style=glass] .hero{stroke:url(#hg)}
svg[data-style=glass] .float{filter:drop-shadow(0 10px 14px rgba(0,0,0,.28))}
svg[data-style=neon] .float{filter:drop-shadow(0 0 3px color-mix(in srgb,var(--accent) 55%,transparent))}
.plane{fill:var(--pf);stroke:var(--line);stroke-width:1;stroke-opacity:.6;stroke-linejoin:round}
.hero{stroke:var(--herol);stroke-width:1.5;stroke-opacity:1}
.face{stroke:var(--line);stroke-width:.75;stroke-opacity:.35;stroke-linejoin:round}
.face-l{fill:var(--fl)}.face-r{fill:var(--fr)}
.s2{fill:none;stroke:var(--line);stroke-width:1;stroke-opacity:.6;stroke-linejoin:round}
.s3{fill:none;stroke:var(--line);stroke-width:.75;stroke-opacity:.35;stroke-linejoin:round}
.grid{fill:none;stroke:var(--line);stroke-width:.5;stroke-opacity:.18;stroke-dasharray:2 4}
.guide{fill:none;stroke:var(--line);stroke-width:.5;stroke-opacity:.12;stroke-dasharray:3 5}
.trace{fill:none;stroke:var(--herol);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
.cell{fill:var(--cell);stroke:var(--line);stroke-width:.75;stroke-opacity:.35}
.node{fill:var(--card);stroke:var(--line);stroke-width:1}
.solid{fill:var(--focal)}
.dots{fill:none;stroke:var(--line);stroke-width:1;stroke-opacity:.5;stroke-dasharray:1 4;stroke-linecap:round}
.lbl{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:calc(9px / var(--z,1));fill:var(--ink);fill-opacity:.55}
.bp{display:none}
svg[data-style=blueprint] .bp{display:inline}
.bpl{fill:none;stroke:var(--accent);stroke-width:.75;stroke-opacity:.7}
</style>
</head>
<body>
<main>
  <div class="top" id="top"><div id="controls"></div></div>
  <section id="grid"></section>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>
/* ================= CONFIG ================= */
const CFG={U:10,OX:260,OY:250,spread:5};
const STYLES=['outline','blueprint','duotone','glass','neon','solid'];
const THEMES={
 charcoal:{mode:'dark',bg:'#161616',card:'#232323',ink:'#ffffff',accent:'#ffffff',accent2:'#ffffff',grid:'rgba(255,255,255,.05)'},
 cobalt:{mode:'dark',bg:'#071120',card:'#0d2137',ink:'#e8f6ff',accent:'#00b4d8',accent2:'#00e5ff',grid:'rgba(0,180,216,.12)'},
 paper:{mode:'light',bg:'#ece9e2',card:'#faf8f5',ink:'#334155',accent:'#2563eb',accent2:'#f59e0b',grid:'rgba(51,65,85,.08)'},
 neon:{mode:'dark',bg:'#0a0a0f',card:'#14141f',ink:'#e0e0e8',accent:'#00f0ff',accent2:'#ff0080',grid:'rgba(0,240,255,.07)'},
 aurora:{mode:'dark',bg:'#0f0b1f',card:'#1c1640',ink:'#f1edff',accent:'#8b5cf6',accent2:'#38bdf8',grid:'rgba(139,92,246,.1)'},
 forest:{mode:'light',bg:'#e3e6df',card:'#f7f7f5',ink:'#1a3c2b',accent:'#2e7d55',accent2:'#e0b34a',grid:'rgba(26,60,43,.08)'},
 ember:{mode:'dark',bg:'#161012',card:'#241a1d',ink:'#fff3ee',accent:'#ff6f61',accent2:'#ffd600',grid:'rgba(255,111,97,.08)'}
};
const VIBES={ // speed multiplies the timeline; float = idle px (0 = none)
 calm:{speed:1,ease:'power2.out',pop:'back.out(2.5)',float:3.5,fd:5},
 precise:{speed:1.8,ease:'power3.out',pop:'power4.out',float:0,fd:5},
 energetic:{speed:1.3,ease:'back.out(1.4)',pop:'back.out(3)',float:5,fd:3},
 still:{speed:0}
};
const LOOKS={'Charcoal schematic':['outline','charcoal','calm'],'Cobalt blueprint':['blueprint','cobalt','precise'],'Paper blueprint':['blueprint','paper','precise'],'Neon noir':['neon','neon','energetic'],'Aurora glass':['glass','aurora','calm'],'Forest solid':['solid','forest','calm'],'Ember duotone':['duotone','ember','energetic']};
const SCENES={};
//@@OPTIONS@@
typeof OPTS=='undefined'&&(window.OPTS={controls:true}); // engine.html previewed without build.py
//@@CARDS@@
typeof CARDS=='undefined'&&(window.CARDS=[]);
//@@SCENES@@

/* ================= STATE ================= */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={style:'outline',theme:matchMedia('(prefers-color-scheme: light)').matches?'paper':'charcoal',vibe:'calm'};
Object.assign(THEMES,OPTS.themes||{});
if(OPTS.look&&LOOKS[OPTS.look])[state.style,state.theme,state.vibe]=LOOKS[OPTS.look];
['style','theme','vibe'].forEach(k=>{if(OPTS[k])state[k]=OPTS[k]});

//@@PRIMITIVES@@

/* ================= CARDS ================= */
const grid=document.getElementById('grid');
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){const c=cards.find(x=>x.el===e.target);if(c){c.seen=true;c.tl&&c.tl.play();io.unobserve(e.target)}}}),{threshold:.3}):null;
const cards=CARDS.map((cd,i)=>{
  const sc=SCENES[cd.scene];
  const el=document.createElement('article');el.className='card';
  el.innerHTML='<h2></h2><svg viewBox="0 30 520 300" role="img"></svg>';
  el.querySelector('h2').textContent=cd.title||sc.title||sc.label;
  el.querySelector('svg').setAttribute('aria-label',cd.alt||(sc.alt||'Isometric line illustration'));
  grid.appendChild(el);io&&io.observe(el);
  return {el,idx:i,svg:el.querySelector('svg'),scene:cd.scene,alt:cd.alt||(sc.alt||'Isometric line illustration'),tl:null,tw:[],layers:[],seen:false};
});
const DEFS='<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent2)"/></linearGradient></defs>';
function bpExtras(sc,vb){
  const [a,b]=sc.dim||[[-6,8.2,0],[6,8.2,0]],A=P(...a),B=P(...b),ang=Math.atan2(B[1]-A[1],B[0]-A[0])*180/Math.PI,mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2;
  const ch=(r,s)=>{const x=vb[0]+vb[2]*r,y=vb[1]+vb[3]*s;return `M${f(x-5)} ${f(y)}h10M${f(x)} ${f(y-5)}v10`};
  return `<g class="bp"><path class="bpl" d="M${pt(...a)}L${pt(...b)}M${pt(a[0],a[1]-.6,a[2])}L${pt(a[0],a[1]+.6,a[2])}M${pt(b[0],b[1]-.6,b[2])}L${pt(b[0],b[1]+.6,b[2])}"/>
<text class="lbl" text-anchor="middle" transform="rotate(${f(ang)} ${f(mx)} ${f(my)})" x="${f(mx)}" y="${f(my-5)}">${sc.dimLabel||'12.0 u'}</text>
<path class="bpl" d="${ch(.1,.2)}${ch(.9,.62)}${ch(.18,.88)}"/></g>`;
}
function build(c){
  TH=state.style==='solid'?.9:0;
  const sc=SCENES[c.scene].build({style:state.style});
  const zm=sc.zoom||1,[cx,cy]=sc.center||[260,180],vw=520/zm,vh=300/zm,vb=[cx-vw/2,cy-vh/2,vw,vh];
  c.svg.setAttribute('viewBox',vb.map(f).join(' '));c.svg.style.setProperty('--z',zm);
  c.svg.setAttribute('aria-labelledby','isot'+c.idx);
  let g='<title id="isot'+c.idx+'">'+c.alt.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</title>'+DEFS;
  if(sc.guides!==false)for(const v of(state.style==='blueprint'?[-12,-9,-6,-3,3,6,9,12]:[-9,-3,3,9]))
    g+=S3('guide',[[-16,v],[16,v]])+S3('guide',[[v,-16],[v,16]]);
  sc.layers.forEach(l=>{g+=`<g class="layer"><g class="float">${l}</g></g>`});
  const mark=sc.dot===false?'':dot(f(vb[0]+vb[2]*.14),f(vb[1]+vb[3]*.2));
  g+=`<g class="ann">${sc.ann||''}${mark}${bpExtras(sc,vb)}</g>`;
  c.svg.innerHTML=g;c.svg.dataset.style=state.style;c.el.dataset.style=state.style;
}
function apply(){
  const t=THEMES[state.theme],r=document.documentElement.style;
  const mode=t.mode||((parseInt(t.bg.slice(1,3),16)+parseInt(t.bg.slice(3,5),16)+parseInt(t.bg.slice(5,7),16))/3>128?'light':'dark');
  const v={bg:t.bg,card:t.card,ink:t.ink,accent:t.accent,accent2:t.accent2,
    muted:t.muted||`color-mix(in srgb,${t.ink} 65%,transparent)`,grid:t.grid||`color-mix(in srgb,${t.accent} 10%,transparent)`};
  for(const k in v)r.setProperty('--'+k,v[k]);
  r.colorScheme=mode;
}
function play(c,now){
  c.tl&&c.tl.kill();c.tw.forEach(t=>t.kill());c.tw=[];c.tl=null;
  c.layers=[...c.svg.querySelectorAll('.layer')];
  const v=VIBES[state.vibe];
  if(!(window.gsap&&v.speed&&!reduce))return;
  const q=s=>c.svg.querySelectorAll(s);
  gsap.set(q('.plane,.face,.trace,.ln'),{strokeDasharray:1,strokeDashoffset:1});
  gsap.set(q('.plane,.face'),{fillOpacity:0});
  const tl=c.tl=gsap.timeline({paused:true,defaults:{ease:v.ease}});
  const add=(m,sel,vars,pos)=>{const n=q(sel);if(n.length)tl[m](n,vars,pos)};
  add('from','.guide',{opacity:0,duration:.8,stagger:.06},0);
  add('to','.plane',{strokeDashoffset:0,duration:1,stagger:.15},.3);
  add('to','.face',{strokeDashoffset:0,duration:1,stagger:{amount:.5}},.3);
  add('to','.plane',{fillOpacity:1,duration:.4,stagger:.15},.7);
  add('to','.face',{fillOpacity:1,duration:.4,stagger:{amount:.5}},.7);
  add('from','.grid',{opacity:0,duration:.5},1.1);
  add('from','.cell',{opacity:0,duration:.3,stagger:{amount:.5,from:'random'}},1.3);
  add('from','.tex',{opacity:0,duration:.3,stagger:{amount:.6,from:'random'}},1.5);
  add('to','.ln',{strokeDashoffset:0,duration:.7,stagger:{amount:.6}},1.8);
  add('to','.trace',{strokeDashoffset:0,duration:1.3,ease:'power1.inOut'},1.9);
  add('from','.node',{scale:0,transformOrigin:'50% 50%',duration:.4,ease:v.pop,stagger:{amount:.4}},2.3);
  add('from','.focal',{opacity:0,scale:.8,transformOrigin:'50% 50%',duration:.6},2.9);
  add('from','.ann',{opacity:0,duration:.6},3.3);
  if(state.style==='neon')add('to','.focal',{keyframes:{opacity:[1,.25,1,.5,1]},duration:.5,ease:'none'},3.3);
  tl.timeScale(v.speed);
  if(now||!io||c.seen)tl.play();
  if(v.float)q('.float').forEach((el,i)=>c.tw.push(gsap.to(el,{y:i%2?v.float:-v.float,duration:v.fd+i*.6,yoyo:true,repeat:-1,ease:'sine.inOut',delay:i*.3})));
}
function renderAll(now){apply();cards.forEach(c=>{build(c);play(c,now)});
  const rb=document.getElementById('replay');if(rb)rb.hidden=!cards.some(c=>c.tl)}
cards.forEach(c=>{
  const spread=n=>{if(window.gsap&&!reduce)c.layers.forEach((el,i)=>gsap.to(el,{y:-i*n,duration:.7,ease:'power3.out'}))};
  c.el.addEventListener('mouseenter',()=>spread(CFG.spread));
  c.el.addEventListener('mouseleave',()=>spread(0));
});

/* ================= PREVIEW CONTROLS ================= */
const topBar=document.getElementById('top'),ctl=document.getElementById('controls');
if(OPTS.title){const h=document.createElement('h1');h.textContent=OPTS.title;topBar.prepend(h)}
if(OPTS.controls){
  const mk=(id,label,opts)=>`<label>${label}<select id="${id}">${opts.map(o=>`<option>${o}</option>`).join('')}</select></label>`;
  ctl.innerHTML=mk('look','Look',['Custom',...Object.keys(LOOKS)])+mk('style','Style',STYLES)+mk('theme','Theme',Object.keys(THEMES))+mk('vibe','Vibe',Object.keys(VIBES))+'<button id="replay" type="button">Replay</button>';
  const sel=id=>document.getElementById(id);
  const sync=()=>{['style','theme','vibe'].forEach(k=>sel(k).value=state[k]);
    sel('look').value=Object.keys(LOOKS).find(n=>LOOKS[n].join()===[state.style,state.theme,state.vibe].join())||'Custom'};
  ctl.addEventListener('change',e=>{
    if(e.target.id==='look'){if(LOOKS[e.target.value])[state.style,state.theme,state.vibe]=LOOKS[e.target.value]}
    else state[e.target.id]=e.target.value;
    sync();renderAll(true);
  });
  sel('replay').addEventListener('click',()=>cards.forEach(c=>c.tl&&c.tl.restart()));
  sync();
}else ctl.remove();
renderAll(false);
</script>
</body>
</html>
````

---

# 7. Pattern-scene library (`assets/scenes/`)

## `ai.js`

````javascript
SCENES.ai={label:'AI / chip with circuit traces',title:'AI products',

alt:'Isometric line drawing of a processor chip with pins on all sides and a solid core, connected by right-angle traces to nodes on a dotted circuit board, with a small neural network of nodes and dashed connections floating above on a dotted link.',
build(){
 const F=FL(0),H=8,C=3.8;
 let L0=plane(rect(-H,-H,H,H),0);
 for(let i=-6;i<=6.1;i+=3)L0+=sshape(F,[[-H,i],[H,i]],'grid',false)+sshape(F,[[i,-H],[i,H]],'grid',false);
 [-2.8,0,2.8].forEach((p,k)=>{const w=6+.4*k,d=k%2?1:-1;
  L0+=shape(F,[[C+1.3,p],[w,p],[w,p+d*.9]],'s3 ln',false)+node(w,p+d*.9,0)+shape(F,[[p,C+1.3],[p,w],[p+d*.9,w]],'s3 ln',false)+node(p+d*.9,w,0);});
 let chip='';
 for(let k=0;k<5;k++){const p=-2.8+k*1.4;
  chip+=S3('s3 tex',[[-C-1.3,p,1.1],[-C,p,1.1]])+S3('s3 tex',[[C,p,1.1],[C+1.3,p,1.1]])+S3('s3 tex',[[p,-C-1.3,1.1],[p,-C,1.1]])+S3('s3 tex',[[p,C,1.1],[p,C+1.3,1.1]]);}
 const T=FL(2.2);
 chip+=block(-C,-C,C,C,0,2.2,'plane hero')+shape(T,rect(-2.2,-2.2,2.2,2.2),'s2 ln')+shape(T,cham(-1.1,-1.1,1.1,1.1,.35),'solid focal')+[[-C,-C],[C,-C],[C,C],[-C,C]].map(([x,y])=>node(x,y,2.2)).join('');
 const N=FL(6.4);
 const nn=[-1.3,0,1.3].flatMap(u=>[-.95,0,.95].map(v=>[u,v]));
 let L2=nn.map(([u,v])=>shape(N,circ(u,v,.3,14),'s2 ln')).join('')+shape(N,circ(2.5,0,.38,16),'s2 ln');
 let links='';
 [-.95,0,.95].forEach(v=>{[-.95,0,.95].forEach(w=>links+=S3('grid',[[-1.3,v,6.4],[0,w,6.4]],false))});
 [-.95,0,.95].forEach(v=>links+=S3('s3 ln',[[0,v,6.4],[2.5,0,6.4]],false));
 L2+=links+S3('dots',[[0,0,2.4],[0,0,5.9]])+node(0,0,2.5)+node(0,0,5.8);
 const op=P(2.9,0,6.4);
 return {zoom:1.39,center:[260,250],layers:[L0,chip,L2],dim:[[-H,9,0],[H,9,0]],dimLabel:'16.0 u',
  ann:lbl(f(op[0]+4),f(op[1]+4),'0.3 ms')};
}};
````

## `analytics.js`

````javascript
SCENES.analytics={label:'Analytics / bars and ring chart',title:'Analytics dashboards',

alt:'Isometric line drawing of a base slab with five rising bars joined by a dotted trend line, the tallest solid, a floating chart plane with a ring chart, arc and trend line, and a floating KPI card with a sparkline.',
build(){
 const F=FL(0),Fc=FL(8),Fk=FL(11.5);
 let L0=plane(rect(-6,-6,6,6),0);
 for(let i=-3;i<=3;i+=3)L0+=sshape(F,[[-6,i],[6,i]],'grid',false)+sshape(F,[[i,-6],[i,6]],'grid',false);
 const hs=[2.2,3.6,2.8,6,4.4];
 hs.forEach((h,i)=>{const x0=-4.6+i*2;L0+=block(x0,.8,x0+1.3,2.1,0,h,i===3?'solid focal':'plane')});
 L0+=S3('grid',hs.map((h,i)=>[-4.6+i*2+.65,1.45,h]))+hs.map((h,i)=>node(-4.6+i*2+.65,1.45,h)).join('');
 L0+=tlines(F,-4.6,3.8,8.6,2,.7)+[[-6,-6],[6,-6],[6,6],[-6,6]].map(([x,y])=>node(x,y,0)).join('');
 const arc=Array.from({length:14},(_,i)=>{const t=(-30+i*10)*Math.PI/180;return[1.2+2.2*Math.cos(t),-6+2.2*Math.sin(t)]});
 const L1=plane(rect(-2,-10,6,-2),8)+shape(Fc,circ(1.2,-6,2.2,36),'s2 ln')+shape(Fc,circ(1.2,-6,1.2,28),'s3 ln')+shape(Fc,arc,'trace',false)+tlines(Fc,-1.2,-9.2,3,2,.6)+shape(Fc,[[-1.4,-3],[0,-3.6],[1.4,-3],[2.8,-3.9],[4.2,-3.2],[5.4,-4]],'s2 ln',false)+node(-2,-10,8)+node(6,-2,8);
 const L2=plane(rect(-5.6,-.6,-1.2,2.6),11.5)+tlines(Fk,-5.2,1.9,3.2,1,1,'s2 ln')+shape(Fk,[[-5.2,.4],[-4.5,1.05],[-3.8,.65],[-3.0,1.3],[-2.2,.8],[-1.7,1.45]],'s2 ln',false)+node(-1.7,1.45,11.5)+tlines(Fk,-5.2,-.1,3.8,1,1,'s3 ln');
 const ap=P(1.2,-3.8,8);
 return {zoom:1.08,center:[276,210],layers:[L0,L1,L2],dim:[[-6,8,0],[6,8,0]],
  ann:`<path class="dots" d="M${f(ap[0]+4)} ${f(ap[1]-8)}L${f(ap[0]+38)} ${f(ap[1]-30)}"/>${lbl(f(ap[0]+42),f(ap[1]-33),'+128%')}`};
}};
````

## `branding.js`

````javascript
SCENES.branding={label:'Branding / logo planes and folded page',title:'Branding',

alt:'Isometric line drawing of three stacked planes: a top plane with a solid pinwheel logo on a registration cross and circle, a faded plane with crop marks behind it, and a folded-corner page with hatching, text lines, swatches and a pen-tool curve with anchors below.',
build(){
 const Fb=FL(3),Fp=(u,v)=>[u+1,v+.5,0],Fh=FL(7);
 const cm=(x,y)=>sshape(Fb,[[x-.55,y],[x+.55,y]],'grid',false)+sshape(Fb,[[x,y-.55],[x,y+.55]],'grid',false);
 const LB=plane(rect(-2,-10,8,-2),3)+logo(Fb,3,-6,.55,false)+cm(1.2,-7.4)+cm(4.8,-7.4)+cm(1.2,-4.6)+cm(4.8,-4.6)+sshape(Fb,cham(-1,-3.9,1.4,-3.2,.2),'cell',true,' fill-opacity=".3"')+sshape(Fb,cham(1.8,-3.9,4.2,-3.2,.2),'cell',true,' fill-opacity=".3"')+node(-2,-10,3)+node(8,-2,3);
 const p0=[-5.2,3.6],c1=[-2.6,4.9],c2=[1.4,4.6],p1=[4.6,2.9];
 const bez=[];for(let i=0;i<=16;i++){const t=i/16,it=1-t;
  bez.push([it*it*it*p0[0]+3*it*it*t*c1[0]+3*it*t*t*c2[0]+t*t*t*p1[0],it*it*it*p0[1]+3*it*it*t*c1[1]+3*it*t*t*c2[1]+t*t*t*p1[1]]);}
 const LP=shape(Fp,[[-6,-5],[6,-5],[6,2],[3,5],[-6,5]],'plane')+shape(Fp,[[6,2],[3,5],[3,2]],'s2 ln')+hatch(Fp,-5.5,-4.5,2.5,-1.5,.3,'h')+tlines(Fp,-5.5,.2,5,4,.8)+shape(Fp,rect(3.2,-4.5,4.2,-3.5),'s3 ln')+sshape(Fp,rect(4.4,-4.5,5.4,-3.5),'cell',true,' fill-opacity=".5"')+sshape(Fp,rect(3.2,-3.2,4.2,-2.2),'cell',true,' fill-opacity=".15"')+sshape(Fp,rect(4.4,-3.2,5.4,-2.2),'cell',true,' fill-opacity=".8"')+shape(Fp,bez,'s2 ln',false)+sshape(Fp,[p0,c1],'grid',false)+sshape(Fp,[p1,c2],'grid',false)+node(p0[0]+1,p0[1]+.5,0)+node(p1[0]+1,p1[1]+.5,0)+node(-5,5.5,0)+node(7,-4.5,0);
 const LH=plane(rect(-5,-5,5,5),7,'plane hero')+sshape(Fh,[[-2.3,0],[2.3,0]],'grid',false)+sshape(Fh,[[0,-2.3],[0,2.3]],'grid',false)+sshape(Fh,circ(0,0,2.5,32),'grid',false)+logo(Fh,0,0,1)+[[-5,-5],[5,-5],[5,5],[-5,5]].map(([x,y])=>node(x,y,7)).join('');
 return {zoom:1.2,center:[291,212],layers:[LB,LP,LH],dim:[[-5,8.2,0],[5,8.2,0]],dimLabel:'10.0 u',ann:''};
}};
````

## `dashboard.js`

````javascript
SCENES.dashboard={label:'Dashboard / exploded stack',title:'Healthcare dashboard',

alt:'Isometric line drawing of four floating dashboard layers: a base grid, patient records with a header bar, a live heart-rate trace with a second vitals line, and a vitals card with a medical cross and a capsule pill.',
build(){
 const H=6,sq=rect(-H,-H,H,H),F0=FL(0),F1=FL(4.5),F2=FL(9),F3=FL(13.5),cn=[[-H,-H],[H,-H],[H,H],[-H,H]];
 let L0=plane(sq,0);
 for(let i=-3;i<=3;i+=3)L0+=sshape(F0,[[-H,i],[H,i]],'grid',false)+sshape(F0,[[i,-H],[i,H]],'grid',false);
 L0+=cn.map(([x,y])=>node(x,y,0)).join('');
 let L1=plane(sq,4.5)+shape(F1,cham(-4.6,4.1,4.6,5,.3),'s2 ln')+cells(F1,-3.6,-3.6,6,6,1.2,3);
 [-3.4,-1.6,.2,2].forEach(u=>L1+=shape(F1,[[u,4.3],[u+.9,4.3]],'s3 ln',false));
 for(let i=0;i<3;i++)L1+=shape(F1,[[4.4,-3.4+i*1.2],[5.5-(i%2)*.8,-3.4+i*1.2]],'s3 ln',false);
 L1+=node(H,-H,4.5)+node(-H,H,4.5);
 const ecg=[[-5,0],[-3,0],[-2.6,-.6],[-2.2,0],[-1.2,0],[-.8,1.2],[-.4,-3.2],[0,2],[.4,0],[1.6,0],[2,-.9],[2.6,0],[5,0]].map(([x,y])=>[x,y-.8]);
 const spo=[[-5,2.4],[-2.2,2.4],[-1.6,2.85],[-1,2.4],[2.2,2.4],[2.7,2.7],[3.2,2.4],[5,2.4]];
 const e=P(5,-.8,9),p2=P(5,2.4,9);
 let L2=plane(sq,9)+hatch(F2,-5.5,3,5.5,5.2,.5)+shape(F2,ecg,'trace',false)+shape(F2,spo,'s3 ln',false)+`<circle class="node" cx="${f(e[0])}" cy="${f(e[1])}" r="3.2"/>`+node(-H,-H,9)+node(H,H,9);
 const a=.7,b=1.9,cx=-2.2,cy=-.2;
 const cross=[[-a,-b],[a,-b],[a,-a],[b,-a],[b,a],[a,a],[a,b],[-a,b],[-a,a],[-b,a],[-b,-a],[-a,-a]].map(([x,y])=>[x+cx,y+cy]);
 let L3=plane(sq,13.5,'plane hero')+shape(F3,cross,'solid focal')+shape(F3,cham(1.2,1.1,2.7,1.8,.3),'s2 ln')+shape(F3,[[1.95,1.1],[1.95,1.8]],'s3 ln',false)+shape(F3,[[1.2,-1.8],[4.8,-1.8]],'s2 ln',false)+shape(F3,[[1.2,-.7],[3.6,-.7]],'s3 ln',false)+shape(F3,[[1.2,.4],[4.2,.4]],'s3 ln',false)+shape(F3,rect(1.2,2.2,4.8,3.6),'s2 ln')+cn.map(([x,y])=>node(x,y,13.5)).join('');
 const [tx,ty]=P(H,-H,13.5);
 return {zoom:1.0,center:[260,183],layers:[L0,L1,L2,L3],dim:[[-6,8.2,0],[6,8.2,0]],
  ann:`<path class="dots" d="M${f(tx+8)} ${f(ty)}L${f(tx+86)} ${f(ty)}"/><path class="node" d="M${f(tx+89)} ${f(ty-3.2)}L${f(tx+92.2)} ${f(ty)}L${f(tx+89)} ${f(ty+3.2)}L${f(tx+85.8)} ${f(ty)}Z"/>${lbl(f(tx+30),f(ty-9),'72 bpm')}${lbl(f(p2[0]+6),f(p2[1]-4),'spo2 98')}`};
}};
````

## `engineering.js`

````javascript
SCENES.engineering={label:'Engineering / thick slab with satellites',title:'Full-stack product engineering',

alt:'Isometric line drawing of a thick hatched slab carrying a browser interface, a terminal panel and a git branch, linked by dotted connectors with deploy arrows to two satellite tiles carrying a hexagon icon and a code icon.',
build(){
 const T=FL(1.4),A=FL(-.8);
 const LA=plane(rect(-10,1.5,-6.2,5.3),-.8)+hexIcon(A,-8.1,3.4,1.2)+sshape(A,circ(-8.1,3.4,1.85,28),'grid',false)+node(-10,1.5,-.8)+node(-6.2,5.3,-.8);
 const LB=plane(rect(-1,-10,3,-6),-.8)+codeIcon(A,1,-8,1.1)+sshape(A,circ(1,-8,1.7,28),'grid',false)+node(-1,-10,-.8)+node(3,-6,-.8);
 const LS=block(-5,-3.5,5,3.5,0,1.4,'plane hero',.5)
  +shape(T,cham(-3.6,-1.2,3.6,2.8,.5),'s2 ln')
  +[-3.0,-2.4,-1.8].map(u=>shape(T,circ(u,2.45,.14,8),'s3 ln')).join('')
  +shape(T,[[-3.2,2.05],[3.2,2.05]],'s3 ln',false)
  +tlines(T,-3.0,1.75,4.6,3,.55)
  +shape(T,cham(-2.4,-2.95,2.0,-2.05,.2),'s2 ln')
  +shape(T,[[-2.0,-2.72],[-.9,-2.72]],'s3 ln',false)+shape(T,[[-2.0,-2.42],[-1.3,-2.42]],'s3 ln',false)+shape(T,[[-2.28,-2.72],[-2.08,-2.57],[-2.28,-2.42]],'s3 ln',false)
  +shape(T,circ(3.3,-2.6,.22,12),'s2 ln')+shape(T,circ(4.15,-2.35,.22,12),'s2 ln')
  +shape(T,[[3.3,-2.6],[3.7,-2.47],[4.15,-2.35]],'s3 ln',false)+shape(T,[[3.3,-2.6],[3.3,-2.2]],'s3 ln',false)
  +logo(T,-4,-2.45,.2)
  +node(-5,3.5,1.4)+node(5,3.5,1.4)+node(5,-3.5,1.4)+node(-5,-3.5,1.4);
 const tp=[3,-6,-.8],pv=[5,-3.5,0];
 const dv=tp.map((v,i)=>v-pv[i]),n=Math.hypot(...dv),u=dv.map(v=>v/n),pp=[u[1],-u[0],0],b1=tp.map((v,i)=>v-u[i]*.85);
 const head=S3('s3 ln',[tp,b1.map((v,i)=>v+pp[i]*.32)],false)+S3('s3 ln',[tp,b1.map((v,i)=>v-pp[i]*.32)],false);
 const lp=P(4.2,-4.9,-.3);
 return {zoom:1.5,center:[250,241],layers:[LA,LB,LS],dim:[[-5,6,0],[5,6,0]],dimLabel:'10.0 u',
  ann:S3('dots',[[-5,3.5,0],[-6.2,5.3,-.8]])+S3('dots',[[5,-3.5,0],[3,-6,-.8]])+head+lbl(f(lp[0]+6),f(lp[1]+2),'v2.4.1')};
}};
````

## `infra.js`

````javascript
SCENES.infra={label:'Infrastructure / server stack',title:'Cloud infrastructure',

alt:'Isometric line drawing of four stacked server slabs with slot lines, indicator lights and an uptime bar chart, joined by dotted connectors, the top one carrying a solid power button, with a cloud outline floating above on a dotted link.',
build(){
 const layers=[],y1=2.8,step=3.6;
 for(let i=0;i<4;i++){
  const z0=i*step,z1=z0+1.2,top=i===3;
  let s='';
  if(i>0)s+=S3('dots',[[5,y1,z0],[5,y1,z0-(step-1.2)]])+node(5,y1,z0)+node(5,y1,z0-(step-1.2));
  s+=block(-5,-2.8,5,y1,z0,z1,top?'plane hero':'plane');
  s+=S3('s3 tex',[[-4,y1,z0+.45],[.5,y1,z0+.45]])+S3('s3 tex',[[-4,y1,z0+.8],[-1,y1,z0+.8]])+node(3.6,y1,z0+.6);
  if(top){
   s+=shape(FL(z1),cham(-3.5,-1,.5,1,.4),'solid focal')+shape(FL(z1),[[1.8,-.8],[4,-.8]],'s3 ln',false);
   s+=shape(FL(z1),[[1.8,.35],[4.2,.35]],'s3 ln',false);
   [.35,.55,.45,.7].forEach((k,j)=>s+=S3('s3 ln',[[2.1+j*.5,.35,z1],[2.1+j*.5,.35+k]],false));
  }
  layers.push(s);
 }
 const bp=[[-25,18],[0,25],[25,18]],cb=84,cl=[];
 for(let x=-46;x<=46.01;x+=4){let e=0;bp.forEach(([c,r])=>{const d=r*r-(x-c)*(x-c);if(d>0)e=Math.max(e,Math.sqrt(d))});cl.push(f(260+x)+' '+f(cb-e))}
 const cloud='<path class="s2 ln" pathLength="1" d="M'+cl.join('L')+'Z"/>'
  +'<path class="dots" d="M232 86L232 118"/>'
  +'<path class="node" d="M232 114.8L235.2 118L232 121.2L228.8 118Z"/>';
 layers.push(cloud);
 return {zoom:1.12,center:[260,169],layers,dim:[[-5,4.6,0],[5,4.6,0]],dimLabel:'10.0 u',
  ann:lbl('320','102','99.99%')};
}};
````

## `landing.js`

````javascript
SCENES.landing={label:'Landing page / curved sheet and bars',title:'Landing pages',

alt:'Isometric line drawing of a page sheet that curves upward from a flat base, with three rising bars standing on it, a logo, a call-to-action button with a cursor on the raised end, and a dotted conversion arrow climbing the left edge to the top.',
build(){
 const h=5,XW=4,sm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)},zf=y=>h*sm((-y+1)/5);
 const ys=[];for(let y=8;y>=-8;y-=.5)ys.push(y);
 const Lf=ys.map(y=>[-XW,y,zf(y)]),Rt=ys.map(y=>[XW,y,zf(y)]).reverse();
 let s=D3('plane',[...Lf,...Rt]);
 for(let t=-1;t<=4;t+=.25){const y=-t;s+=S3('s3 tex',[[-XW,y,zf(y)],[XW,y,zf(y)]])}
 s+=tlines(FL(0),.4,4.2,3.4,4,.7);
 const F=FL(h);
 s+=shape(F,rect(-3.2,-7.4,3.2,-6.4),'s2 ln')+logo(F,2.3,-6.9,.26)+tlines(F,-3.2,-5.6,4.2,3,.6);
 s+=shape(F,cham(-3.2,-3.9,-.4,-3.3,.2),'s2 ln')+shape(F,[[-2.7,-3.6],[-1.2,-3.6]],'s3 ln',false)+shape(F,[[-1.5,-3.75],[-1.2,-3.6],[-1.5,-3.45]],'s3 ln',false);
 s+=shape(F,[[.1,-3.2],[.1,-4.35],[.5,-3.95],[.85,-4.02],[.35,-3.5]],'s2 ln');
 const route=[[-3.6,6.5,0],[-3.8,2.5,zf(2.5)],[-3.8,-1.5,zf(-1.5)],[-3.7,-5.2,5]];
 s+=S3('dots',route)+route.slice(0,3).map(p=>node(p[0],p[1],p[2])).join('');
 const tp=[-3.7,-5.2,5],pv=[-3.8,-1.5,zf(-1.5)];
 const dv=tp.map((v,i)=>v-pv[i]),n=Math.hypot(...dv),u=dv.map(v=>v/n),pp=[u[1],-u[0],0],b1=tp.map((v,i)=>v-u[i]*.85);
 s+=S3('s3 ln',[tp,b1.map((v,i)=>v+pp[i]*.32)],false)+S3('s3 ln',[tp,b1.map((v,i)=>v-pp[i]*.32)],false);
 s+=[[-XW,8,0],[XW,8,0],[-XW,-8,h],[XW,-8,h]].map(([x,y,z])=>node(x,y,z)).join('');
 let bars=block(-2.4,1,-1.2,2.2,0,6.5,'plane hero')+block(-2.4,2.8,-1.2,4,0,2.8)+block(-2.4,4.6,-1.2,5.8,0,1.8);
 const gp=P(-3.7,-5.2,5);
 return {zoom:1.26,center:[260,225],layers:[s,bars],dim:[[-4,8.8,0],[4,8.8,0]],dimLabel:'8.0 u',
  ann:lbl(f(gp[0]+8),f(gp[1]+16),'+128%')};
}};
````

## `mobile.js`

````javascript
SCENES.mobile={label:'Mobile apps / standing phones',title:'Mobile apps',

alt:'Isometric line drawing of three upright phone screens staggered diagonally on a dotted floor, the front one with a tab bar and a floating notification tile above them.',
build(){
 const F=FL(0);
 let L0=plane(rect(-8,-8,8,8),0);
 for(let i=-6;i<=6.1;i+=3)L0+=sshape(F,[[-8,i],[8,i]],'grid',false)+sshape(F,[[i,-8],[i,8]],'grid',false);
 L0+=[[-8,-8],[8,-8],[8,8],[-8,8]].map(([x,y])=>node(x,y,0)).join('');
 const ph=(y,uo,front)=>{
  const m=WL(y),a=uo-2.5,b=uo+2.5,c=front?'s2 ln':'s3 ln';
  let s=shape(m,cham(a,1,b,10,1),front?'plane hero':'plane')+shape(m,cham(uo-.9,8.9,uo+.9,9.3,.15),c)+tlines(m,a+.6,7.7,3,1,1,c)+shape(m,cham(a+.6,5,b-.6,7,.35),c)+tlines(m,a+.6,4,3.2,2,.7,c)+[-1,0,1].map(k=>shape(m,circ(uo+k*1.3,2.1,.28,10),c)).join('');
  if(front){
   s+=shape(m,cham(a+.6,2.9,b-.6,3.6,.3),'solid focal');
   s+=sshape(m,rect(a+1.1,1.2,a+1.6,1.65),'cell',true,' fill-opacity=".7"');
   [a+2.2,a+3.1,a+4.0].forEach(u=>s+=shape(m,rect(u,1.2,u+.5,1.65),'s3 ln'));
  }
  if(!front&&y===0)s+=shape(m,cham(-1.9,7.7,1.9,8.5,.25),'s2 ln')+shape(m,circ(-1.45,8.1,.15,8),'cell')+tlines(m,-1.05,7.95,2.3,1,1,'s3 ln');
  return s;};
 const Fn=FL(12.5);
 const badge=plane(rect(-1,-7.5,4,-4),12.5)+shape(Fn,circ(.3,-5.75,.55,12),'s2 ln')+sshape(Fn,circ(3.3,-4.7,.3,10),'cell',true,' fill-opacity=".9"')+tlines(Fn,1.3,-6.4,2.2,2,.9)+node(-1,-7.5,12.5)+node(4,-4,12.5);
 return {zoom:1.0,center:[260,206],layers:[L0,ph(-3.5,3.5,false),ph(0,0,false),ph(3.5,-3.5,true),badge],dim:[[-8,9,0],[8,9,0]],dimLabel:'16.0 u',ann:''};
}};
````

## `mug.js`

````javascript
SCENES.mug={
 label:'Mug / isometric cup with rising steam',
 title:'Design Mug',

 
 alt:'Isometric line drawing of a ceramic mug with a curved handle and a label band on its front, a warm drink inside, sitting on a saucer with a spoon beside it, and three rising steam lines on a small square base.',
build(){
  const floor=plane(rect(-7,-7,7,7),0)+
    sshape(FL(0),[[-7,-4],[7,-4]],'grid',false)+
    sshape(FL(0),[[-4,-7],[-4,7]],'grid',false)+
    shape(FL(0),[[5.75,-3.2],[7.0,-2.05]],'s2 ln',false)+
    shape(FL(0),circ(5.5,-3.5,.45,14),'s2 ln');
  const saucer=block(-4.6,-4.1,4.6,4.1,0,.55,'plane');
  const z0=.55,z1=7.4;
  const body=block(-3.2,-2.7,3.2,2.7,z0,z1,'plane hero')+
    shape(WL(2.7),cham(-1.6,3.1,1.6,4.5,.3),'s3 ln')+
    tlines(WL(2.7),-1.15,3.65,2.3,2,.42);
  const top=plane(rect(-3.2,-2.7,3.2,2.7),z1,'plane hero');
  const rim=shape(FL(z1+.05),circ(0,0,2.15,32),'s2 ln')+
    shape(FL(z1+.1),circ(0,0,1.72,32),'s3 ln')+
    shape(FL(z1+.15),circ(0,0,1.48,32),'solid focal');
  const handle=shape(WX(3.2),[...circ(0,4,1.9,24),[0,5.9]],'s2 ln',false)+
    shape(WX(3.2),[[0,5.9],[0,2.1]],'s2 ln',false);
  const steam= S3('trace',[[-1.2,-.4,10.2],[-1.5,-.4,11.2],[-1.2,-.4,12.0],[-1.4,-.4,13.0]])+
    S3('trace',[[0,-.4,10.8],[.3,-.4,11.8],[0,-.4,12.6],[.2,-.4,13.8]])+
    S3('trace',[[1.2,-.4,10.2],[.9,-.4,11.2],[1.2,-.4,12.0],[1.0,-.4,13.0]]);
  return {zoom:1.08,center:[260,204],layers:[floor,saucer+body,top+rim+handle,steam],dim:[[-7,8,0],[7,8,0]],ann:''};
 }
};
````

## `siteops.js`

````javascript
SCENES.siteops={
 label:'Site operations / browser control',
 title:'Site Operations',

 
 alt:'Isometric browser window with a globe in the page, a settings gear overlapping its lower-right edge, an SSL lock, a pulse line and status cells on the page.',
build(){
  const W=5.5,H=8.5,yBack=-1.4,yFront=-2.1;
  const F=FL(0),back=WL(yBack),front=WL(yFront),gearFace=WL(yFront-.14);
  let floor=plane(rect(-9,-9,9,9),0);
  for(let i=-6;i<=6;i+=3){
   floor+=sshape(F,[[-9,i],[9,i]],'grid',false)+sshape(F,[[i,-9],[i,9]],'grid',false);
  }
  floor+=[[-9,-9],[9,-9],[9,9],[-9,9]].map(([x,y])=>node(x,y,0)).join('');

  let casing=shape(back,cham(-W,0,W,H,.45),'plane');
  casing+=S3('s2 ln',[[-W,yBack,0],[-W,yFront,0]])+
          S3('s2 ln',[[W,yBack,0],[W,yFront,0]])+
          S3('s2 ln',[[-W,yBack,H],[-W,yFront,H]])+
          S3('s2 ln',[[W,yBack,H],[W,yFront,H]]);

  let page=shape(front,cham(-W,0,W,H,.45),'plane hero');
  page+=shape(front,[[-W,7.1],[W,7.1]],'s2 ln',false);
  [-4.65,-4.1,-3.55].forEach(x=>page+=shape(front,circ(x,7.8,.13,10),'s3 ln'));
  page+=shape(front,cham(-2.8,7.55,3.25,8.05,.17),'s2 ln');
  page+=shape(front,[[-2.15,7.8],[2.2,7.8]],'s3 ln',false);
  page+=shape(front,[[3.85,7.35],[4.65,8.15],[4.65,7.45]],'s2 ln',false);
  page+=shape(front,[[3.75,8.15],[4.65,8.15],[4.65,7.25]],'s2 ln',false);
  page+=shape(front,rect(-4.75,6.2,-4.05,6.7),'s3 ln')+sshape(front,circ(-4.4,6.7,.16,12).slice(0,7),'s3 ln',false);
  page+=shape(front,[[-4.6,1.2],[-3.4,1.2],[-3.0,1.9],[-2.6,.5],[-2.2,1.2],[-.8,1.2]],'s3 ln',false);
  page+=tlines(front,2.6,1.55,1.3,1,1,'s3 ln');
  [2.6,3.2,3.8].forEach((x,k)=>page+=sshape(front,rect(x,1.05,x+.4,1.45),'cell',true,` fill-opacity="${[.8,.4,.15][k]}"`));

  const gx=-1.35,gy=4.35,gr=1.68;
  const ellipse=(cx,cy,rx,ry,n=28)=>Array.from({length:n},(_,i)=>{
   const a=i/n*Math.PI*2;return[cx+rx*Math.cos(a),cy+ry*Math.sin(a)];
  });
  page+=shape(front,circ(gx,gy,gr,32),'s2 ln');
  page+=shape(front,ellipse(gx,gy,gr*.48,gr),'s3 ln');
  page+=shape(front,ellipse(gx,gy-.53,gr*.83,.38),'s3 ln');
  page+=shape(front,ellipse(gx,gy+.53,gr*.83,.38),'s3 ln');
  page+=tlines(front,2.45,5.55,1.75,3,.62,'s3 ln');
  page+=tlines(front,2.45,2.0,1.25,2,.62,'s3 ln');

  const cx=1.05,cy=3.12,teeth=8,gear=[];
  for(let i=0;i<teeth*4;i++){
   const a=-Math.PI/2+i/(teeth*4)*Math.PI*2;
   const r=(i%4===1||i%4===2)?1.12:.82;
   gear.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);
  }
  const gearLayer=shape(gearFace,gear,'solid focal')+
                  shape(gearFace,circ(cx,cy,.38,24),'plane')+
                  sshape(gearFace,circ(cx,cy,1.5,24).slice(2,9),'grid',false);
  const dim=[[-9,-10,0],[9,-10,0]],sp=P(5.5,-2.1,8.5);
  return {zoom:1.08,center:[260,230],layers:[floor,casing,page,gearLayer],dim,dimLabel:'18.0 u',
   ann:lbl(f(sp[0]+6),f(sp[1]-6),'200 ok')};
 }
};
````

## `uiux.js`

````javascript
SCENES.uiux={label:'Product UI/UX / exploded vertical layers',title:'Product UI/UX',

alt:'Isometric line drawing of four upright interface layers pulled apart: a back panel with a solid input pill, a cursor and a ring, two pixel-grid panels with a dashed selection marquee, a slider and a toggle, and a front panel with a color-swatch row over hatching.',
build(){
 const u0=-4.5,u1=4.5,v0=1.5,v1=9.5,R=rect(u0,v0,u1,v1);
 let m=WL(-4);
 const W0=shape(m,R,'plane hero')+shape(m,cham(-3.4,7.9,.6,8.7,.25),'solid focal')+shape(m,[[1.0,8.9],[1.0,7.85],[1.45,8.3],[1.8,8.22],[1.3,8.62]],'s2 ln')+shape(m,circ(2,5.4,1.8,28),'s2 ln')+shape(m,circ(2,5.4,.9,20),'s3 ln')+tlines(m,-3.4,6.4,3.4,3,.6)+R.map(([u,v])=>node(u,-4,v)).join('');
 m=WL(-1.5);const W1=shape(m,R,'plane')+cells(m,-3,2.4,5,5,1.2,11)+sshape(m,rect(-1.95,5.85,-.45,7.35),'grid',false)+node(u1,-1.5,v1);
 m=WL(1);const W2=shape(m,R,'plane')+cells(m,-2.4,3,4,4,1.2,41)+shape(m,[[-3.2,8.4],[1.2,8.4]],'s2 ln',false)+shape(m,circ(-1.4,8.4,.28,12),'s2 ln')+shape(m,[[-3.2,8.1],[-3.2,8.7]],'s3 ln',false)+shape(m,[[1.2,8.1],[1.2,8.7]],'s3 ln',false)+shape(m,cham(2.2,8.05,3.9,8.75,.35),'s2 ln')+shape(m,circ(3.35,8.4,.24,10),'s2 ln')+node(u0,1,v1);
 m=WL(3.5);const W3=shape(m,R,'plane')+hatch(m,u0,1.5,u1,6,.28)+[[-3.6],[-2.5],[-1.4]].map(([u],k)=>sshape(m,rect(u,8.3,u+.7,9.0),'cell',true,` fill-opacity="${[.7,.3,.85][k]}"`)).join('')+shape(m,rect(0,8.3,.7,9.0),'s2 ln')+shape(m,rect(1.1,8.3,1.8,9.0),'s2 ln')+sshape(m,rect(-1.55,8.15,-.55,9.15),'grid',false)+node(u0,3.5,v0)+node(u1,3.5,v0);
 const [tx,ty]=P(u1,-4,v1);
 return {zoom:1.25,center:[285,194],layers:[W0,W1,W2,W3],dim:[[-6,8.2,0],[6,8.2,0]],
  ann:`<path class="dots" d="M${f(tx+8)} ${f(ty)}L${f(tx+80)} ${f(ty+34)}"/><path class="node" d="M${f(tx+83)} ${f(ty+31.8)}L${f(tx+86.2)} ${f(ty+35)}L${f(tx+83)} ${f(ty+38.2)}L${f(tx+79.8)} ${f(ty+35)}Z"/>${lbl(f(tx+92),f(ty+44),'px')}<path class="s3 tex" d="M${f(tx+90)} ${f(ty+52)}h18M${f(tx+90)} ${f(ty+57)}h14M${f(tx+90)} ${f(ty+62)}h18"/>`};
}};
````

## `windows.js`

````javascript
SCENES.windows={label:'Websites / standing windows',title:'Full websites',

alt:'Isometric line drawing of five upright browser windows standing in a row on a dotted floor, the front one showing window controls, an address pill, nav links, a hero image placeholder, headline lines and a call-to-action button.',
build(){
 const F=FL(0),H=7,W=5;
 let L0=plane(rect(-H,-H,H,H),0);
 for(let i=-5.25;i<=5.26;i+=1.75)L0+=sshape(F,[[-H,i],[H,i]],'grid',false)+sshape(F,[[i,-H],[i,H]],'grid',false);
 L0+=[[-H,-H],[H,-H],[H,H],[-H,H]].map(([x,y])=>node(x,y,0)).join('');
 const layers=[L0];
 [-5,-2.5,0,2.5,5].forEach((y,i)=>{
  const m=WL(y),front=i===4,c=front?'s2 ln':'s3 ln';
  let s=shape(m,rect(-W,0,W,7),front?'plane hero':'plane');
  if(!front)s+=hatch(m,2.4,0,W,5.6,.4);
  s+=[-4.3,-3.8,-3.3].map(u=>shape(m,circ(u,6.35,.2,10),c)).join('')+shape(m,cham(-2.4,6,2.8,6.7,.25),c);
  if(front)s+=tlines(m,-1.9,6.24,2.4,1,1,'s3 ln');
  [3.5,4.05,4.6].forEach(u=>s+=shape(m,[[u,6.3],[u+.3,6.3]],'s3 ln',false));
  if(i===3||i===2)s+=logo(m,3.8,3.2,.4,false);
  if(front){
   s+=shape(m,rect(-4.3,2.6,-1.5,5.5),'s2 ln');
   s+=shape(m,[[-4.0,2.95],[-3.2,4.1],[-2.6,3.55],[-1.8,4.75]],'s3 ln',false)+shape(m,circ(-1.95,5.05,.22,10),'s3 ln');
   s+=tlines(m,-.9,5.2,4.4,2,.6,'s2 ln');
   s+=tlines(m,-.9,3.7,3.4,2,.5);
   s+=shape(m,cham(-.9,2.5,1.3,3.2,.25),'s2 ln');
   s+=shape(m,[[-.4,2.85],[.5,2.85]],'s3 ln',false)+shape(m,[[.3,2.7],[.5,2.85],[.3,3.0]],'s3 ln',false);
   s+=logo(m,3.3,1.7,.42);
   s+=shape(m,[[-4.3,.6],[4.3,.6]],'s3 ln',false);
   s+=node(-W,y,7)+node(W,y,7);
  }
  layers.push(s);
 });
 return {zoom:1.15,center:[260,227],layers,dim:[[-7,8,0],[7,8,0]],dimLabel:'14.0 u',ann:''};
}};
````
