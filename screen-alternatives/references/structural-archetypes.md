# Structural Archetypes for Screen Alternatives

This reference catalog provides concrete structural transformation patterns for generating **Alternative A** (Structural Rearrangement) and **Alternative B** (First-Principles Rebuild).

Remember the governing principle:
> **Change the structure, not the skin.**
> The alternatives must explore competing hypotheses about what the screen should lead with. They must NOT simply be color, typography, spacing, or decoration variations.

---

## 1. Alternative A: Structural Rearrangement Archetypes

Alternative A preserves the existing mental model of the product while restructuring information flow, spatial priority, and grouping to directly resolve the top stress-test findings.

### Archetype A1: Action-First Inversion
* **Core Problem**: Primary task or critical decision point is buried beneath secondary context, long lists, or informational banners.
* **Structural Change**: Move the primary conversion mechanism or decision action into a dominant header rail or top-level focal card; push supporting tables, logs, or secondary attributes below the primary action container.
* **Hypothesis Format**: `Alt A — Actions first, supporting telemetry second`
* **Real-World Application**: In an invoice review screen, place "Approve Invoice ($4,500)" and the approval status right at the top header, moving line-item breakdowns and audit history below.

### Archetype A2: Unified Command Rail vs. Scattered Controls
* **Core Problem**: Interactive controls (filters, export, create, bulk edit, search) are scattered across disparate corners of the canvas, causing eye saccades and interaction confusion.
* **Structural Change**: Consolidate disparate controls into a singular, cohesive command bar or sticky tool dock directly above the data container.
* **Hypothesis Format**: `Alt A — Unified command bar with consolidated controls`
* **Real-World Application**: In a data management screen, move search, status filters, date pickers, and bulk actions from multiple headers and floating buttons into a single structured toolbar.

### Archetype A3: Split-View Master-Detail (Two-Column Modularity)
* **Core Problem**: A single vertical stack forces extreme page length, requiring continuous scrolling between object list and object details.
* **Structural Change**: Restructure the screen into a balanced two-column layout: left column displays scannable master items; right column displays deep contextual details and actions for the selected item.
* **Hypothesis Format**: `Alt A — Two-column master-detail with persistent contextual inspector`
* **Real-World Application**: In an email/ticket resolution queue, place the ticket list on the left 40% and full ticket response workspace on the right 60%.

### Archetype A4: Gestalt Containment & Visual Anchor Swapping
* **Core Problem**: Content elements bleed together without clear separation, or minor decorative elements (like colored badges or logos) visually overpower key data.
* **Structural Change**: Group related data points into distinct surface containers (cards) with optical hierarchy; swap visual anchor weight so primary numbers/titles lead and secondary metadata recedes.
* **Hypothesis Format**: `Alt A — Grouped surface hierarchy with elevated primary metrics`
* **Real-World Application**: In an analytics dashboard, cluster related metrics into clearly delineated cards with consistent internal hierarchy, replacing a flat list of text and numbers.

---

## 2. Alternative B: First-Principles Rebuild Archetypes

Alternative B questions the underlying interaction model. It asks: *"If this screen were designed today specifically for the user's ultimate job, what interaction model would make the most sense?"*

```
Original Interaction Model               Alternative B Structural Shift
─────────────────────────────────────    ─────────────────────────────────────────────
Monolithic Multi-Field Form          ─►  Guided Conversational / Progressive Stepper
Passive Data Dashboard               ─►  Action-Oriented Task Queue / Command Center
Massive Raw Data Table               ─►  Visual Insight Cards + Expandable Deep Dives
Dense Control Panel / All-At-Once    ─►  Intent-Driven Progressive Disclosure
Flat Unsorted List                   ─►  Kanban Workflow or Priority-Ranked Buckets
```

### Archetype B1: Monolithic Form → Guided Progressive Stepper
* **Original Model**: 20 form fields displayed simultaneously on a single long scrolling canvas, causing cognitive fatigue and form abandonment.
* **Alternative B Model**: Break the flow into discrete, logical stages (e.g., Step 1: Identity → Step 2: Logistics → Step 3: Confirmation). Present only the current step with clear progress indicators and contextual assistance.
* **Hypothesis Format**: `Alt B — Guided multi-step progressive workflow`
* **Value Proposition**: Reduces cognitive overload, validates input progressively, and lowers completion drop-off.

### Archetype B2: Passive Dashboard → Task-Focused Command Center
* **Original Model**: Passive dashboard presenting dozens of charts and numbers, forcing the user to mentally compute what actions need to be taken.
* **Alternative B Model**: Lead with an prioritized "Action Queue" or "Exceptions Requiring Attention" card, followed by quick-action resolution buttons. The analytics charts are relegated to background supporting context.
* **Hypothesis Format**: `Alt B — Action-oriented exception queue over passive monitoring`
* **Value Proposition**: Shifts user behavior from passive consumption to immediate, high-leverage decision-making.

### Archetype B3: Raw Data Table → Visual Insight Summary + Drawer Detail
* **Original Model**: Massive 12-column table with tiny text, requiring horizontal scrolling and mental arithmetic to spot anomalies.
* **Alternative B Model**: Replace the wall of numbers with top-level distribution cards (visual summary, highest spenders, anomalies), paired with a focused 4-column scannable list that opens an in-depth slide-out drawer on click.
* **Hypothesis Format**: `Alt B — Visual insight distribution cards with progressive detail drawer`
* **Value Proposition**: Allows instant executive scanning while preserving granular data access on demand.

### Archetype B4: Dense Control Panel → Intent-Driven Progressive Disclosure
* **Original Model**: Every setting, slider, and toggle visible at once on screen, overwhelming novice users and cluttering expert workflows.
* **Alternative B Model**: Lead with top-level "Outcome Presets" or high-level goals. Clicking a goal reveals only the advanced parameters relevant to that specific configuration.
* **Hypothesis Format**: `Alt B — Intent-based progressive disclosure with high-level outcome presets`
* **Value Proposition**: Speeds up 80% common use cases while keeping 20% edge configurations cleanly accessible.

### Archetype B5: Flat Feed/List → Grouped Status Workspace
* **Original Model**: Single chronological or arbitrary list of items where pending, completed, and urgent items are mixed together.
* **Alternative B Model**: Reorganize items into status-based workflow columns (Kanban) or accordion clusters categorized by urgency (e.g., "Needs Immediate Review", "In Progress", "Resolved").
* **Hypothesis Format**: `Alt B — Urgency-clustered workspace with status-based categorization`
* **Value Proposition**: Directs immediate attention to urgent blockers without requiring manual scanning and filtering.

---

## 3. Alternative Formulating Matrix

When presenting alternatives in the Final Report, ensure Alt A and Alt B contrast sharply across these dimensions:

| Dimension | Alternative A (Structural Rearrangement) | Alternative B (First-Principles Rebuild) |
|---|---|---|
| **Primary Philosophy** | "Refine the existing mental model" | "Challenge the interaction model" |
| **Leading Visual Anchor** | Reorganized primary CTA or prominent header rail | New interaction construct (queue, stepper, summary card) |
| **User Mental Model** | Evolutionary; familiar layout with friction points removed | Revolutionary; novel workflow tailored strictly to task outcome |
| **Information Density** | Same density, organized with better Gestalt grouping | Dynamic density; progressive disclosure or chunked views |
| **Primary Usability Metric** | Reduces visual search time and eye travel | Reduces cognitive load and task completion steps |
