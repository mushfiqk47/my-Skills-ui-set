# use_figma Scripts for Screen Alternatives (Figma MCP + figma-use)

All scripts run inside `use_figma` with `skillNames: "figma-use"` (`resource:figma-use` if via MCP resource). Load `figma-use` skill first every time. One script per `use_figma` call. Top-level await, `return {...}`, never `figma.closePlugin()`. Colors 0-1. JSON only — never `get_screenshot` / `node.screenshot()`. Validate each step with `get_metadata` + `get_design_context` JSON diff.

MCP read order before any write: `get_metadata` → `get_design_context(fileKey, nodeId)` per section → `get_variable_defs` / `search_design_system`.

---

## 1. Selection & Scope Validation (read-only use_figma)

Ensure exactly 1 to 5 frames are selected before executing any layout manipulation:

```javascript
// use_figma script: scope check. skillNames: "figma-use"
// Top-level await allowed, no IIFE wrapper.
const selection = figma.currentPage.selection;

if (selection.length === 0) {
  return { error: "ZERO_SELECTION", message: "Select 1-5 frames or pass Figma URL with node-id." };
}
if (selection.length > 5) {
  return { error: "TOO_MANY", count: selection.length, message: "Narrow to 5 or fewer." };
}
const originalFrames = selection.filter(n => n.type === 'FRAME' || n.type === 'COMPONENT');
if (!originalFrames.length) {
  return { error: "NO_FRAMES", message: "Selection must contain Frame/Component." };
}
const o = originalFrames[0];
return { ok: true, id: o.id, name: o.name, x: o.x, y: o.y, width: o.width, height: o.height, count: originalFrames.length };
```

---

## 2. Idempotent Cleanup of Previous Generations (separate use_figma call)

```javascript
// use_figma script: cleanup priors. Pass originalId from Step 1.
const orig = figma.getNodeById(originalId);
const parent = orig?.parent ?? figma.currentPage;
const keep = new Set([orig?.id]);
const removed = [];
for (const child of [...parent.children]) {
  if (keep.has(child.id)) continue;
  if (child.type === 'FRAME' && (child.name.startsWith('Alt A - ') || child.name.startsWith('Alt B - '))) {
    removed.push(child.name); child.remove(); continue;
  }
  if (child.type === 'TEXT' && (child.name.startsWith('Caption: Alt A') || child.name.startsWith('Caption: Alt B') || child.name.startsWith('Alt A —') || child.name.startsWith('Alt B —'))) {
    removed.push(child.name); child.remove();
  }
}
return { ok: true, removed };
```

---

## 3. Positioning Calculations & Frame Duplication (separate use_figma calls)

Clone original untouched, position Alt A/B with 200px gap. Captions 48px above.

```javascript
// use_figma script: clone + position. Inputs: originalId, hypothesisA, hypothesisB
const GAP = 200;
const orig = figma.getNodeById(originalId);
const altA = orig.clone();
altA.name = `Alt A - ${hypothesisA}`;
altA.x = orig.x + orig.width + GAP;
altA.y = orig.y;
const altB = orig.clone();
altB.name = `Alt B - ${hypothesisB}`;
altB.x = altA.x + orig.width + GAP;
altB.y = orig.y;
return { ok: true, altAId: altA.id, altBId: altB.id, altAX: altA.x, altAY: altA.y, altBX: altB.x, altBY: altB.y, w: orig.width, h: orig.height };
```

```javascript
// use_figma script: caption. Inputs: x, y, textContent. Colors 0-1, font first.
const fn = { family: "Inter", style: "Medium" };
try { await figma.loadFontAsync(fn); }
catch(e) { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); }
const t = figma.createText();
t.fontName = fn;
t.characters = textContent; // set after loadFontAsync
t.fontSize = 14;
t.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.45, b: 0.5 } }];
t.x = x; t.y = y;
t.name = `Caption: ${textContent}`;
figma.currentPage.appendChild(t);
return { ok: true, captionId: t.id };
```
// Call caption twice: `(altAX, altAY-48, Alt A — ...)` then `(altBX, altBY-48, Alt B — ...)`. Then `get_metadata` + `get_design_context` JSON validate.

---

## 4. Content Census Counter (read-only use_figma, returns data)

```javascript
// use_figma script: census. Input: frameId. Use to enforce content parity.
const frame = figma.getNodeById(frameId);
const census = { buttons:0, textNodes:0, images:0, inputs:0, vectors:0, frames:0, total:0, snippets:[] };
(function walk(n){
  census.total++;
  if (n.type==='TEXT'){ census.textNodes++; const s=(n.characters||'').trim(); if(s && census.snippets.length<25) census.snippets.push(s.slice(0,120)); }
  else if (n.type==='VECTOR') census.vectors++;
  else if (n.type==='FRAME'||n.type==='GROUP'||n.type==='COMPONENT'||n.type==='INSTANCE'){ census.frames++; const nm=(n.name||'').toLowerCase(); if(nm.includes('btn')||nm.includes('button')) census.buttons++; if(nm.includes('input')||nm.includes('field')||nm.includes('search')) census.inputs++; }
  else if (n.type==='RECTANGLE' && n.fills?.some(f=>f.type==='IMAGE')) census.images++;
  if ('children' in n) for (const c of n.children) walk(c);
})(frame);
return { ok:true, census };
```

---

## 5. Technical Auto-Layout Manipulation Rules (figma-use gotchas)

```javascript
// use_figma script pattern: safe auto-layout. RULE: layoutMode first, append before HUG/FILL, resize before HUG.
frame.layoutMode = 'VERTICAL';
frame.itemSpacing = 16;
frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 16;
frame.primaryAxisAlignItems = 'MIN';
frame.counterAxisAlignItems = 'MIN';
frame.appendChild(child); // first
child.layoutSizingHorizontal = 'FILL'; // after append
child.layoutSizingVertical = 'HUG';
// For HUG container: frame.resize(w,h) before setting primaryAxisSizingMode='HUG'
// Concentric radius: R_outer = R_inner + Padding
// Batch props: node.set({ ... }); Search: figma.currentPage.query('.btn-primary')
// Page switch only: await figma.setCurrentPageAsync(page)
return { ok: true };
```

---

## 6. Pre-Completion Sanity Audit (read-only use_figma + MCP JSON)

```javascript
// use_figma script: audit. Inputs: originalId, altId.
const orig = figma.getNodeById(originalId);
const alt = figma.getNodeById(altId);
const issues = [];
if (alt.height / orig.height < 0.6 || alt.height / orig.height > 1.4)
  issues.push(`height drift orig=${orig.height} alt=${alt.height}`);
if (!alt.children?.length) issues.push("zero children");
(function chk(n){
  if (n.type==='TEXT' && n.width===0) issues.push(`0px text "${(n.characters||'').slice(0,15)}"`);
  if ((n.type==='FRAME'||n.type==='COMPONENT') && n.visible && n.height===0 && n.layoutMode!=='NONE') issues.push(`collapsed "${n.name}"`);
  if ('children' in n) for (const c of n.children) chk(c);
})(alt);
return { ok: issues.length===0, issues };
```
// Then run MCP `get_metadata` + `get_design_context` JSON diff on altId to confirm structure. Fix via new use_figma call — prior failed script atomic, no partial state.
