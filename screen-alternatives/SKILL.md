---
name: screen-alternatives
description: >-
  Critiques a selected Figma screen or short flow (1-5 screens) and generates exactly two structural alternatives placed side-by-side using "Change the structure, not the skin" via Figma MCP use_figma. Evaluates hierarchy, states, logic, and conventions; enforces strict content and style parity; builds Alt A (structural rearrangement) and Alt B (first-principles rebuild) with precise 200px offsets and hypothesis captions; and produces a structured comparison report. Use whenever the user asks to create screen alternatives, redesign a Figma screen, propose layout variations, explore alternative UI structures, review screen hierarchy, or stress-test and restructure an interface without altering its visual identity. Requires Figma MCP server connected; mandates figma-use skill before every canvas write.
---

# Screen Alternatives: Change the Structure, Not the Skin

This skill takes an existing selected Figma screen (or short flow up to 5 screens), critically stress-tests its architecture, identifies its deepest usability bottlenecks, and generates **exactly two genuinely different structural alternatives** placed side-by-side with the original, accompanied by an actionable comparison report.

The governing law of this skill is:
> **Change the structure, not the skin.**

The alternatives explore competing hypotheses about what the screen should lead with and how the user achieves their primary objective. They never settle for cosmetic adjustments (such as color tweaks, typography swaps, arbitrary re-spacing, or stylistic decoration).

---

## 0. Prerequisites: Figma MCP + figma-use

All canvas reads/writes go through Figma MCP. Never use raw Plugin API / Scripter globals directly.

1. **MCP server**: Remote server `https://mcp.figma.com/mcp` required for writes. Desktop server `http://127.0.0.1:3845/mcp` is read-only — `use_figma` and `generate_figma_design` unavailable there. If `use_figma` missing, remove `figma-desktop` entry, restart client.
2. **MANDATORY skill**: Load `figma-use` skill BEFORE every `use_figma` call. Never call `use_figma` without it. Always pass `skillNames: "figma-use"` (prefix `resource:figma-use` if loaded via MCP resource). For deferred tools, batch-load schemas in one call: `ToolSearch query="select:use_figma,get_design_context,get_metadata,get_variable_defs,search_design_system"`.
3. **File context**: Require Figma file URL `https://figma.com/design/:fileKey/:name?node-id=X-Y` to extract `fileKey` + `nodeId`. Or with `figma-desktop` MCP accept current selection with no URL. Design files only (`figma.com/design/...`); `figma.createPage()` throws in FigJam/Slides.
4. **Read before write — JSON only, no screenshots**: Never use `get_screenshot` or `node.screenshot()`. All inspection via MCP JSON: `get_metadata` for node map → `get_design_context(fileKey, nodeId)` per section → `get_variable_defs` / `search_design_system` for tokens/components. If `get_design_context` truncates, fan out per child nodeId.
5. **Write rules (from figma-use)**: JS runs via Plugin API inside `use_figma`. Top-level `await`, no async IIFE wrapper. `return {...}` data, never `figma.closePlugin()`. Colors 0-1 floats. `await figma.loadFontAsync()` before any text change. `appendChild` before setting `HUG`/`FILL`. `resize()` before `primaryAxisSizingMode=HUG`. Page switch only via `await figma.setCurrentPageAsync(page)`, never `figma.currentPage =`. One section per `use_figma` call, validate with `get_metadata` + `get_design_context` JSON diff after each. Failed scripts are atomic — read error, fix, retry.

---

## 1. Scope & Selection Validation

The skill operates on:
* **One selected Figma frame**, OR
* **A selected short flow of up to 5 screens**.

### Scope Guardrails
1. **Zero selection**: If no nodeId/URL and no desktop selection, pause and ask:
   *"Please select the Figma frame or flow (up to 5 screens) or paste Figma file URL with node-id you would like to analyze and generate alternatives for."*
   **Never guess or infer an arbitrary screen.**
2. **Validate via MCP**: Run `get_metadata(fileKey, nodeId)` to get sparse XML node map (ids, names, types, x/y/width/height). Confirm 1-5 FRAME/COMPONENT nodes. If response too large, fetch child nodeIds individually with `get_design_context`.
3. **Excessive selection (>5 screens)**: If more than 5 screens selected, ask user to narrow scope to 5 or fewer interconnected screens.
4. **Multi-screen flows**: When processing flow (2–5 screens), evaluate relationship between screens, identify cross-screen friction, generate Alt A and Alt B sets for entire sequence.

---

## 2. Understand the Screen

Before touching canvas elements or proposing changes, conduct two-level inspection via MCP JSON only. No screenshots, no thumbnails, no pixel review.

### Level 1: Structural Scan (JSON High-Altitude)
Use `get_metadata` sparse XML (ids, names, types, x/y/width/height) + top-level `get_design_context` JSON:
* **First fixation proxy**: Largest + highest-contrast node near top-left (compare width x height, fill opacity, font weight/size). Name nodeId.
* **Eye path proxy**: Sort top-level children by y then x; check read order follows task priority or jumps erratically.
* **First impression proxy**: List top 3 nodes by area; state what job they signal.
* **Value proposition**: Which JSON node carries core promise (primary CTA text, KPI value)? Quote its characters.

### Level 2: Full JSON View (Deep Architecture & Craft Audit)
Inspect via per-section `get_design_context` JSON + `get_variable_defs`:
* **Layout & Geometry**: Grid, columns, alignment lines, auto-layout directions.
* **Component Inventory**: Types of cards, tables, inputs, actions, headers, navigation rails.
* **Typography Hierarchy**: Distinct levels of scale, weight, and contrast.
* **Spacing Scale**: Base increment (e.g., 4px/8px), consistency of padding and margins.
* **Interaction Patterns**: Affordance of interactive vs. static elements, click targets, tap targets.
* **Data Density**: Balance between scannability and information volume.
* **States & Edge Conditions**: Default, filled, truncated, empty, or error signals.

### Formulate the Screen Job
Summarize the screen's core purpose into **exactly one sentence**:
```text
Screen job: "This screen helps <user role> to <primary task / outcome> in order to <core user value>."
```
*Example:*
> "This screen helps fleet managers quickly detect delivery delays across active routes and dispatch re-routing instructions to drivers."

**Every critique, finding, and structural alternative must be measured directly against this single sentence.**

---

## 3. Stress-Test the Existing Screen

Execute four distinct analytical passes. For detailed checklists and domain patterns, consult [references/stress-test-heuristics.md](references/stress-test-heuristics.md).

### Pass A — Hierarchy and Craft
* **Attention Competition**: Do multiple primary visual anchors fight for attention simultaneously?
* **Action Discoverability**: Is the primary call-to-action (CTA) buried beneath secondary metadata or placed below the fold?
* **Visual Reading Order**: Does the eye read items in order of actual task priority (1st, 2nd, 3rd), or is attention hijacked by accents, badges, or heavy containers?
* **Alignment & Rhythm**: Are elements aligned to shared bounding edges, or are there arbitrary micro-offsets?
* **Spacing Relationships**: Does the spacing reflect Gestalt proximity (items within a group closer together than spacing between groups)?

### Pass B — Task and States
* **Task Efficiency**: What is the minimum interaction path to complete the screen job? How many cognitive decisions and clicks/taps are required?
* **Extreme Data Volumes**:
  * *Empty state*: Does the screen provide actionable guidance or a dead end?
  * *One-item state*: Does a single item look broken or sparse?
  * *Large-data state*: Does the layout break with 50+ rows or dense pagination?
  * *Long-text state*: Do multi-line names, German translations, or wrapping labels break container bounds?
* **System States**: How are loading skeletons, validation errors, and first-run onboardings accommodated?

### Pass C — Logic Against Reality
* **Real-World Data Reality**:
  * Real names (e.g., "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff"), long emails, currency symbols, extreme numbers (e.g., "$14,250,910.42" vs "$0.00").
  * Status conflicts (e.g., showing "Active" and "Expired" concurrently).
* **Action Consequence & Feedback**:
  * What immediately happens after the primary CTA is triggered? Is there a clear next state or feedback loop?
  * Do data relationships hold up logically under real production conditions?
* **Anti-Hallucination Guardrail**: Do **not** invent imaginary product capabilities or assume backend features not visible or implied by the original screen.

### Pass D — Convention
Compare the design against established platform (iOS, Android, Web/SaaS) and domain conventions (e.g., E-Commerce Checkout, Analytics Dashboard, SaaS Settings, Project Workspace):
* Never write subjective complaints like *"This feels modern"* or *"This isn't how it's done."*
* Always name the **exact convention**, why it exists, and the **concrete usability cost** of violating it (e.g., *Violates top-left F-pattern orientation; forces user to scan 840px across viewport to locate primary search bar, increasing interaction cost*).

---

## 4. Prioritize Findings

Formulate a prioritized list of **no more than 8 findings**.
* Only include concrete, measurable, and actionable observations.
* Rank findings strictly from strongest (highest usability cost) to weakest.
* Never pad the list to reach 8. If only 4 genuine flaws exist, list 4.

Each finding must follow this precise tripartite format:
1. **Specific Element or State**: Exactly where the issue occurs.
2. **What is Wrong**: Objective architectural or interaction defect.
3. **User Impact / Usability Cost**: Measurable cost (cognitive load, task time, error rate, discovery failure).

*Bad finding:* "The hierarchy feels weak and messy."
*Good finding:* "The primary CTA ('Approve Order') shares identical size, height, and border styling with the secondary 'Download PDF' button, creating split attention and increasing decision latency."

---

## 5. Formulate Exactly Two Alternatives

Generate **exactly two** structural alternatives. Never create three, never create one.
The two alternatives must embody distinct, competing design hypotheses. For deep architectural archetypes, see [references/structural-archetypes.md](references/structural-archetypes.md).

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│          ALTERNATIVE A          │   │          ALTERNATIVE B          │
│     Structural Rearrangement    │   │     First-Principles Rebuild    │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│ • Same mental model             │   │ • Alternative mental model      │
│ • Directly fixes top findings   │   │ • Reimagined user interaction   │
│ • Reorders hierarchy & grouping │   │ • Progressive disclosure/flow   │
│ • Inverts spatial priority      │   │ • Radically shifts screen lead  │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

### Alternative A — Structural Rearrangement
* **Core Philosophy**: Take the existing layout mental model and optimize its structural hierarchy.
* **Mechanism**:
  * Elevates the primary task and critical status data to the top/leading edge.
  * Consolidates scattered controls into a unified command header or action bar.
  * Groups related secondary attributes using strict Gestalt containment.
  * Directly solves Findings #1 and #3.
* *Example Hypothesis*:
  `Alt A - Actions first, supporting telemetry second`

### Alternative B — First-Principles Rebuild
* **Core Philosophy**: Ignore the current layout skeleton. Ask: *"If this screen were engineered from scratch today solely to execute the Screen Job with maximum speed and zero friction, what interaction model would we choose?"*
* **Mechanism**:
  * Transforms the structural archetype (e.g., Static Form → Guided Conversational Flow; Dense Multi-Metric Dashboard → Focused Task Queue; Monolithic Table → Visual Summary Card with Expandable Deep-Dives; Dense Control Panel → Progressive Disclosure Stepper).
  * Has a **fundamentally different value proposition** from Alternative A.
  * Preserves all capabilities without inventing new features.
* *Example Hypothesis*:
  `Alt B - Task-focused workspace with progressive disclosure`

---

## 6. Content Parity & Style Parity Laws

### Content Parity Law (The Census)
Before modifying or drawing frames, take an exact **Content Census**:
1. Count visible data nodes: Cards, rows, tabs, input fields, buttons, badges, list items, icons, navigation elements.
2. **Strict Rule**: If the original contains 4 list items, both Alt A and Alt B must contain exactly 4 list items.
3. **No Placeholders**: Never introduce lorem ipsum, dummy text, invented features, or decorative placeholder cards.
4. **Copy Fidelity**: Reuse the product's actual copy, preserving verb-first CTA labels and exact capitalization conventions.

### Style Parity Law (Zero Skin Changes)
Inspect and lock the visual tokens of the original design:
* **Typography**: Exact font families, sizes, line heights, letter spacings, and font weights.
* **Color System**: Exact fill hex codes, border colors, background surfaces, and semantic colors.
* **Component Instances**: Reuse existing Figma component instances and design tokens wherever present.
* **Border Radii & Shadows**: Exact corner-radius values and elevation shadow styles.
* **Spacing Scale**: Exact spacing multipliers (e.g., 4px, 8px, 16px, 24px, 32px).
* **Strict Prohibition**: Never introduce new fonts, alternate palettes, novelty icons, or decorative flourishes.

---

## 7. Build the Alternatives in Figma via use_figma

All canvas writes use `use_figma` with `figma-use` loaded. Never emit raw Scripter globals without MCP wrapper. Follow incremental workflow: one section per `use_figma` call, `get_metadata` + `get_design_context` JSON validate after each. No screenshots at any step.

### Step 1 — Inspect first (read-only use_figma + MCP reads)
```javascript
// use_figma script 1: locate original, return geometry. skillNames: "figma-use"
const sel = figma.currentPage.selection;
if (!sel.length) return { error: "ZERO_SELECTION" };
const orig = sel[0];
return { id: orig.id, name: orig.name, x: orig.x, y: orig.y, width: orig.width, height: orig.height, children: orig.children?.length ?? 0 };
```
Pair with `get_design_context(fileKey, nodeId)` + `get_variable_defs` + `search_design_system` (queries: button, input, card) to list reusable components/tokens. Prefer importing published components via key over redrawing. No `get_screenshot`.

### Spatial Positioning Math
Leave original frame **completely untouched**. Place alternatives right along X-axis:

```text
Original Frame (x, y)
       │
       ▼ (+200px gap)
Alt A Frame (x = Original.x + Original.width + 200, y = Original.y)
       │
       ▼ (+200px gap)
Alt B Frame (x = Alt_A.x + Alt_A.width + 200, y = Original.y)
```

Both alternatives must have identical outer dimensions (`width`/`height`) to original.

### Step 2 — Idempotent cleanup (separate use_figma call)
Delete prior `Alt A - *` / `Alt B - *` frames + `Alt A — *` captions via `node.query()` / parent scan, then `node.remove()`. Never stack iterations. See [references/figma-plugin-snippets.md](references/figma-plugin-snippets.md).

### Step 3 — Clone + caption (separate use_figma calls)
Clone original twice (`orig.clone()`), set `name = Alt A - <hypothesis>`, set x/y per math. Create caption text 48px above each (`y = Original.y - 48px`): `Alt A — <hypothesis>`. Load font first, fills use 0-1 floats. Return `{ altAId, altBId }`.

### Step 4 — Restructure incrementally
Alt A: reorder hierarchy, unified command bar, Gestalt grouping — one `use_figma` per section. Alt B: rebuild archetype (stepper / queue / summary+drawer) reusing same counts/copy. After each call re-run `get_metadata` + `get_design_context` JSON and diff x/y/w/h, layoutMode, characters, fills against intent. If drift, fix and retry — scripts atomic on failure.

### Caption Labels & Frame Naming
* Captions: `Alt A — <hypothesis>`, `Alt B — <hypothesis>`
* Frames: `Alt A - <hypothesis>`, `Alt B - <hypothesis>`

For complete use_figma-ready scripts, consult [references/figma-plugin-snippets.md](references/figma-plugin-snippets.md) and `figma-use` refs `gotchas.md`, `common-patterns.md`, `validation-and-recovery.md`.

---

## 8. Craft & Auto-Layout Rules (figma-use enforced)

When assembling frames via `use_figma`:

1. **Skill gate**: `figma-use` loaded, `skillNames` includes `figma-use` on every call.
2. **Font loading**: `await figma.loadFontAsync({family, style})` before reading/writing `characters`. Discover via `listAvailableFontsAsync`.
3. **Auto-layout sequence**: Set `layoutMode='VERTICAL'/'HORIZONTAL'` first. `appendChild` before `HUG`/`FILL`. `resize(w,h)` before `primaryAxisSizingMode=HUG`. Set `layoutSizingHorizontal/Vertical` explicit.
4. **Colors/effects**: 0-1 floats e.g. `{r:1,g:0,b:0}` red. Batch via `node.set(props)`. Prefer `figma.createAutoLayout()` helper, `node.query(selector)` for search.
5. **Pages**: `await figma.setCurrentPageAsync(page)` only. Never `figma.currentPage =`. One page switch per call start if multi-page.
6. **Concentric radii**: $$R_{\text{outer}} = R_{\text{inner}} + \text{Padding}$$
7. **Spacing**: Group gap > internal gap (`S_group >= 1.5 x S_internal`). Whitespace over dividers.
8. **Return pattern**: End every script with `return {ids...}`. Never `figma.closePlugin()`. Top-level await only.
9. **Pre-completion audit** via read-only `use_figma` returning JSON + `get_metadata` / `get_design_context` diff (never screenshots):
   - [ ] Each alternative contains all original children counts.
   - [ ] No frame 0px height/width.
   - [ ] No text 0px width / unintended truncation.
   - [ ] All nested elements inside designated auto-layout containers.
   - [ ] Original frame 100% unaltered.

---

## 9. Final Report Format

Upon creating the alternatives, produce a concise, professional markdown report using this exact template. For full examples, see [references/report-template.md](references/report-template.md).

```markdown
Screen job: <One-sentence description formulated in Section 2>
Current screen: <Whether it successfully supports that job, with a concise factual explanation>

### Stress-Test Findings
| # | Element / State | What Is Wrong | What It Costs |
|---|-----------------|---------------|---------------|
| 1 | <Element/state> | <Objective architectural defect> | <Measurable usability cost> |
| 2 | ...             | ...           | ...           |

### Alternatives
| Alternative | Leads With | Structural Change | Findings It Answers |
|-------------|------------|-------------------|----------------------|
| Alt A       | <Anchor>   | <Structural rearrangement> | #1, #3 |
| Alt B       | <Anchor>   | <First-principles interaction shift> | #2, #4, #5 |

### Considered but Rejected
* **<Direction 1>**: <Concrete rationale why rejected (e.g., conflicts with platform convention, requires unsupported backend capability, or introduces skin changes)>.
* **<Direction 2>**: <Concrete rationale>.

### How to Decide
<Exactly one sentence defining the empirical test or data signal to determine the winning structure. E.g., "Conduct an unmoderated 5-user usability test comparing time-to-first-action and error rate between Alt A's command bar and Alt B's progressive flow.">
```

---

## 10. Definition of Done Checklist

Every execution of this skill must satisfy all 18 criteria:
- [ ] 1. Screen job stated in exactly one clear sentence.
- [ ] 2. All 4 stress-test passes (A, B, C, D) conducted.
- [ ] 3. 1 to 8 concrete, ranked findings documented (Element, Wrong, Cost).
- [ ] 4. Exactly two alternatives created (Alt A and Alt B).
- [ ] 5. Alt A and Alt B explore genuinely different structural hypotheses.
- [ ] 6. Content parity strictly preserved (same items, same copy, zero lorem ipsum).
- [ ] 7. Style parity strictly preserved (exact fonts, colors, radii, tokens via get_variable_defs / search_design_system).
- [ ] 8. Original frame completely untouched.
- [ ] 9. Alt A positioned at `x = Original.x + Original.width + 200px`.
- [ ] 10. Alt B positioned at `x = Alt_A.x + Alt_A.width + 200px`.
- [ ] 11. Clear hypothesis captions placed directly above each alternative frame.
- [ ] 12. Both alternative frames match original dimensions and look visually complete.
- [ ] 13. No text node collapsed to 0px width or clipped.
- [ ] 14. No auto-layout frame collapsed to zero height.
- [ ] 15. Comparison table and rejected directions documented.
- [ ] 16. Single-sentence empirical "How to Decide" criterion provided.
- [ ] 17. `figma-use` loaded before every `use_figma`, `skillNames` includes `figma-use`, top-level await + `return {...}` pattern used.
- [ ] 18. Incremental validation done: `get_metadata` + `get_design_context` JSON diff after each section, errors retried atomically. No `get_screenshot` / `node.screenshot()` used anywhere.
