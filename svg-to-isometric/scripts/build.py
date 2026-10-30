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
