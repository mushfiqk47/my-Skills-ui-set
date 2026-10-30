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
