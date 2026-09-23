---
name: screen-alternatives
description: >-
  Critiques a selected Figma screen or short flow (1-5 screens) and generates exactly two structural alternatives placed side-by-side using "Change the structure, not the skin". Evaluates hierarchy, states, logic, and conventions; enforces strict content and style parity; builds Alt A (structural rearrangement) and Alt B (first-principles rebuild) with precise 200px offsets and hypothesis captions; and produces a structured comparison report. Use whenever the user asks to create screen alternatives, redesign a Figma screen, propose layout variations, explore alternative UI structures, review screen hierarchy, or stress-test and restructure an interface without altering its visual identity.
---

# Screen Alternatives: Change the Structure, Not the Skin

This skill takes an existing selected Figma screen (or short flow up to 5 screens), critically stress-tests its architecture, identifies its deepest usability bottlenecks, and generates **exactly two genuinely different structural alternatives** placed side-by-side with the original, accompanied by an actionable comparison report.

The governing law of this skill is:
> **Change the structure, not the skin.**

The alternatives explore competing hypotheses about what the screen should lead with and how the user achieves their primary objective. They never settle for cosmetic adjustments (such as color tweaks, typography swaps, arbitrary re-spacing, or stylistic decoration).

---

## 1. Scope & Selection Validation

The skill operates on:
* **One selected Figma frame**, OR
* **A selected short flow of up to 5 screens**.

### Scope Guardrails
1. **Zero selection**: If nothing is selected in Figma, pause immediately and ask the user:
   *"Please select the Figma frame or flow (up to 5 screens) you would like to analyze and generate alternatives for."*
   **Never guess or infer an arbitrary screen.**
2. **Excessive selection (>5 screens)**: If more than 5 screens are selected, ask the user to narrow the scope to 5 or fewer interconnected screens.
3. **Multi-screen flows**: When processing a flow (2–5 screens), evaluate the relationship between screens, identify cross-screen friction, and generate Alt A and Alt B sets for the entire sequence.

---

## 2. Understand the Screen

Before touching canvas elements or proposing changes, conduct a two-level inspection:

### Level 1: Thumbnail View (High-Altitude Visual Scan)
Step back and analyze the screen at 10–20% zoom or 100px thumbnail size:
* **First fixation point**: What visual element grabs attention first?
* **Eye path**: Where does the visual momentum lead next? Does it follow a natural reading gravity (Z-pattern, F-pattern, Gutenberg diagram) or does it bounce erratically?
* **First impression**: What does the screen appear to be about in the first 500 milliseconds?
* **Value proposition**: What core promise or capability is communicated immediately?

### Level 2: Full-Size View (Deep Architecture & Craft Audit)
Inspect the screen at 100% scale:
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

## 7. Build the Alternatives in Figma

When generating the alternatives in Figma (via Figma Plugin API, MCP tool calls, or Scripter automation), follow these exact geometric and structural specifications:

### Spatial Positioning Math
Leave the original frame **completely untouched**. Place alternatives to the right of the original along the X-axis:

```text
Original Frame (x, y)
       │
       ▼ (+200px gap)
Alt A Frame (x = Original.x + Original.width + 200, y = Original.y)
       │
       ▼ (+200px gap)
Alt B Frame (x = Alt_A.x + Alt_A.width + 200, y = Original.y)
```

Both alternatives must have identical outer dimensions (`width` and `height`) to the original frame.

### Caption Labels & Frame Naming
Directly above each alternative frame (at `y = Original.y - 48px`, `x = Frame.x`), insert a clean caption text node:
* `Alt A — <hypothesis>`
* `Alt B — <hypothesis>`

Rename the frame nodes themselves to match:
* `Alt A - <hypothesis>`
* `Alt B - <hypothesis>`

### Idempotency & Re-running
If this skill is re-run on a screen with prior generations:
1. Locate previous `Alt A - *` and `Alt B - *` frames and their associated caption text nodes.
2. Delete them cleanly before instantiating new alternatives.
3. Never stack multiple iterations or litter the canvas.

For complete, copy-pasteable Figma plugin code, consult [references/figma-plugin-snippets.md](references/figma-plugin-snippets.md).

---

## 8. Craft & Auto-Layout Rules

When assembling frames programmatically or modifying layout trees:

1. **Font Loading Prerequisite**:
   Always execute `await figma.loadFontAsync(textNode.fontName)` before reading or modifying `characters`.
2. **Auto-Layout Sequence**:
   * Set `layoutMode = 'VERTICAL'` or `'HORIZONTAL'` before adjusting sizing constraints.
   * Append child nodes to parent container **before** setting sizing to `'HUG'` or `'FILL'`.
   * Set explicit sizing modes (`layoutSizingHorizontal`, `layoutSizingVertical`).
3. **Concentric Radii Formula**:
   When nesting rounded containers inside padded parent cards, maintain optical harmony:
   $$R_{\text{outer}} = R_{\text{inner}} + \text{Padding}$$
4. **Spacing Semantics**:
   * Group gap > Internal element gap.
   * Eliminate gratuitous divider lines; use whitespace and surface level contrast to delineate hierarchy.
5. **Pre-Completion Sanity Audit**:
   Verify before finishing:
   - [ ] Each alternative contains all original children elements.
   - [ ] No frame has collapsed to 0px height or 0px width.
   - [ ] No text node has collapsed to 0px width or truncated unintentionally.
   - [ ] All nested elements are inside their designated auto-layout containers.
   - [ ] The original frame is 100% unaltered.

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

Every execution of this skill must satisfy all 16 criteria:
- [ ] 1. Screen job stated in exactly one clear sentence.
- [ ] 2. All 4 stress-test passes (A, B, C, D) conducted.
- [ ] 3. 1 to 8 concrete, ranked findings documented (Element, Wrong, Cost).
- [ ] 4. Exactly two alternatives created (Alt A and Alt B).
- [ ] 5. Alt A and Alt B explore genuinely different structural hypotheses.
- [ ] 6. Content parity strictly preserved (same items, same copy, zero lorem ipsum).
- [ ] 7. Style parity strictly preserved (exact fonts, colors, radii, tokens).
- [ ] 8. Original frame completely untouched.
- [ ] 9. Alt A positioned at `x = Original.x + Original.width + 200px`.
- [ ] 10. Alt B positioned at `x = Alt_A.x + Alt_A.width + 200px`.
- [ ] 11. Clear hypothesis captions placed directly above each alternative frame.
- [ ] 12. Both alternative frames match original dimensions and look visually complete.
- [ ] 13. No text node collapsed to 0px width or clipped.
- [ ] 14. No auto-layout frame collapsed to zero height.
- [ ] 15. Comparison table and rejected directions documented.
- [ ] 16. Single-sentence empirical "How to Decide" criterion provided.
