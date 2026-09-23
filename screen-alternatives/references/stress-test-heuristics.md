# Stress-Test Heuristics & Domain Conventions

This reference provides a rigorous analytical framework for evaluating digital interfaces during the four stress-test passes (Pass A, B, C, D) required by the **Screen Alternatives** skill.

---

## 1. Visual Perception & Cognitive Models

When evaluating screen hierarchy, ground observations in empirical perceptual psychology rather than aesthetic opinion:

### A. Scanning Paths & Visual Gravity
* **Gutenberg Diagram (Terminal Area Law)**: In Western reading patterns, visual momentum naturally travels from Primary Optical Area (top-left) through Weak Fall-Fallow Area (top-right) and Strong Fall-Fallow Area (bottom-left) to the Terminal Area (bottom-right). If a primary call to action (CTA) is placed in a weak fall-fallow zone without sufficient visual weight, discovery latency increases by 30–50%.
* **F-Shaped Pattern (Text-Heavy Interfaces)**: Users read across the top row, drop down, read across a shorter horizontal span, and then scan vertically down the left edge. Secondary attributes placed far right on desktop viewports (>900px offset) suffer severe change blindness.
* **Z-Pattern (Landing & Simple Transaction Screens)**: Alternates between top-left logo, top-right action, diagonal descent through visual showcase, and bottom-right conversion button.

### B. Cognitive Load Laws
* **Hick-Hyman Law**: Time to make a decision increases logarithmically with the number and complexity of choices:
  $$T = b \cdot \log_2(n + 1)$$
  *Audit question*: Does the screen present more than 5 distinct, unranked choices at the same hierarchical tier?
* **Miller's Law (Chunking)**: Short-term memory holds $7 \pm 2$ chunks of information. Screens displaying 15 un-grouped fields or list items create cognitive overload. Grouping into semantic clusters reduces load.
* **Fitts's Law**: Time to acquire a target is a function of distance and target size:
  $$MT = a + b \cdot \log_2\left(1 + \frac{2D}{W}\right)$$
  *Audit question*: Is the primary conversion action positioned far away from the last input field, or is its touch/click target below 44x44pt (mobile) or 32x32px (desktop)?
* **Gestalt Principles of Grouping**:
  * *Proximity*: Items spaced close together are perceived as belonging together. Spacing between distinct groups must be strictly larger than spacing inside a group ($S_{\text{group}} \ge 1.5 \times S_{\text{internal}}$).
  * *Common Region*: Enclosing related data inside a container card creates instantaneous grouping without requiring heavy labels.
  * *Similarity*: Elements sharing shape, color, or typography are perceived as having identical function. When a secondary filter looks identical to a primary submit button, users experience interaction paralysis.

---

## 2. Pass A — Hierarchy and Craft Heuristics

Evaluate the visual hierarchy against these explicit failure modes:

| Failure Mode | Visual Evidence | Usability Consequence |
|---|---|---|
| **Competing Visual Anchors** | Multiple high-contrast elements (e.g., filled black CTA, bold colored banner, bright status chip) fight for primary fixation. | Saccadic bounce; user pauses to determine what requires immediate attention. |
| **Buried Action** | Primary submit or continue CTA placed below secondary metadata, disclaimers, or off-screen. | Increased scrolling cost; potential abandonment. |
| **Inverted Hierarchy** | Metadata (e.g., "Created at 10:42 AM by John") styled larger or bolder than the object title. | Distorts scanning rhythm; forces user to discard noise before finding signal. |
| **Visual Debt / Over-Decoration** | Excessive divider lines, nested borders, heavy drop shadows, or background tinting. | Visual noise; reduces scannability of real content. |
| **Inconsistent Alignment** | Labels, inputs, and buttons don't align to common vertical or horizontal bounding axes. | Eye fatigue; jagged scanning path. |

---

## 3. Pass B — Task and Edge States

An interface must function predictably under non-ideal operating conditions:

```
Default / Pristine State (What designers draw)
       │
       ├── Empty / Zero State (No data yet; first-run)
       ├── Single-Item State (Only 1 item; avoids feeling abandoned)
       ├── High-Density State (100+ items; pagination, infinite scroll)
       ├── Extreme Content State (Super long German names, long URLs)
       ├── Transient / Loading State (Skeletons, spinners, partial renders)
       └── Error / Boundary State (Network drop, validation failure, 404)
```

### Edge State Checklist
1. **Empty State**: Does it provide a dead-end message ("No items found"), or does it provide clear educational onboarding with an inline creation CTA?
2. **One-Item State**: Does a single card or table row look visually broken or excessively stretched across a 1440px viewport?
3. **High-Density State**: Does the layout break down when a user has 50 projects? Does it offer search, filtering, or virtualization?
4. **Long-Text State**:
   * What happens when a user's name is "Alexander Bartholomew-Montgomery Jr."?
   * Does it truncate with ellipsis (`...`)? Does it wrap and push critical action buttons off-canvas?
5. **System Feedback & Loading**: Is there layout shift when data loads? Does the primary action show loading indicators during async operations?

---

## 4. Pass C — Logic Against Reality

Scrutinize business and interaction logic:

1. **Information Symmetry**:
   * If a transaction shows "Total Billed: $500", does the itemized breakdown add up to $500?
   * If a status says "Pending Approval", does the screen also show who needs to approve it and when?
2. **Action-Consequence Logic**:
   * What is the immediate system feedback when the user clicks the primary button?
   * If an item is deleted, does it ask for confirmation or provide an undo toast notification?
   * If an action is irreversible, is the destructive action visually differentiated from routine non-destructive actions?
3. **Data Freshness & Telemetry**:
   * Does the screen indicate when data was last updated?
   * Are timestamps absolute ("Oct 24, 2026 14:20") or relative ("5 minutes ago"), and is that appropriate for the domain?

---

## 5. Pass D — Domain-Specific Conventions

When testing against conventions, evaluate the screen against standard user mental models for its specific domain:

### 1. Authentication / Onboarding
* *Conventions*: Single-column form, top-aligned labels, explicit password visibility toggle, clear switch between Sign In and Sign Up, prominent Single Sign-On (SSO) alternatives placed below or above primary credentials with clear separator.
* *Violation example*: Placing SSO options hidden inside a dropdown; using floating labels that disappear when typing.

### 2. E-Commerce Checkout / Purchase Flows
* *Conventions*: Persistent order summary with subtotal, tax, shipping, and total; linear checkout progression (Shipping → Payment → Review); one-click payment options (Apple Pay, Google Pay) prominently positioned at the start.
* *Violation example*: Hiding the total price until the final confirmation step; scattering coupon input away from the price breakdown.

### 3. Dashboards / Executive Portals
* *Conventions*: Top-level summary metric cards (KPIs) with comparative indicators (+12% vs last month); primary chart occupying central viewport; recent activity list or task queue on right/bottom rail; filter controls sticky or grouped at the top.
* *Violation example*: Placing 8 distinct unprioritized pie charts without aggregate numbers; burying date-range pickers inside a settings modal.

### 4. Feeds / Activity Streams
* *Conventions*: Reverse chronological ordering; consistent card headers (avatar, author name, timestamp, menu); inline engagement actions (comment, share, upvote); infinite scroll with pull-to-refresh on mobile.
* *Violation example*: Mixing chronological and algorithmic sorting without user control; omitting timestamp affordances.

### 5. Settings / Configuration
* *Conventions*: Categorized sidebar navigation (Account, Billing, Security, Notifications); two-column layout on desktop (category description on left, controls on right); explicit auto-save indicator or sticky save bar; danger zone placed at the very bottom with red visual containment.
* *Violation example*: Mixing irreversible workspace deletion buttons directly alongside notification toggles.

### 6. Search / Filtering / Discovery
* *Conventions*: Prominent search input with auto-complete/recent searches; sticky faceted filter sidebar or filter chips with active counters; total result count ("Showing 1–25 of 1,420 results"); clear sorting dropdown ("Relevance", "Newest", "Price: Low to High").
* *Violation example*: Requiring a manual "Apply Filters" button click on every single checkbox toggle without feedback; hiding result count.

### 7. User Profiles / Account Management
* *Conventions*: Avatar display with quick upload trigger; identity header (name, handle/title, status); tabbed content for personal data, activity history, and connected services; inline edit or clear "Edit Profile" modal trigger.
* *Violation example*: Burying email verification or password reset links under unrelated personal bio fields.

### 8. Project Management / Workspaces / Task Tracking
* *Conventions*: Board (Kanban), List, and Calendar view switchers; status column headers with item counts; drag-and-drop handles; quick-add task trigger inline at bottom of column; priority flags (Urgent, High, Medium, Low).
* *Violation example*: Requiring 4 modal steps just to enter a single quick task title; omitting task assignee avatar from card summaries.

### 9. Analytics / Metrics / Reporting
* *Conventions*: Clear time-window selector (Today, 7D, 30D, Custom); sparklines or trend lines paired with headline figures; interactive tooltip on hover/tap showing exact coordinate data; download/export report trigger in top-right header.
* *Violation example*: Displaying raw data tables without visual trend indicators; missing units of measurement (e.g., displaying "240" without indicating ms, MB, or count).
