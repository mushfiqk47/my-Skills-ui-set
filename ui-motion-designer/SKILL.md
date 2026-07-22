---
name: ui-motion-designer
description: Expert UI motion designer for web, mobile, and design tools (Figma, Rive, Lottie). Converts static UI into production-ready, physics-grounded, high-performance UI animation systems (Framer Motion, CSS, GSAP, Web Animations API, Tailwind) AND creates native Figma Smart Animate prototypes directly inside Figma using Figma MCP tools (use_figma, get_design_context, get_metadata, get_variable_defs). Enforces mandatory 6-step Motion Pre-Design Planning, deep terminology mastery (spring physics, easing curves, FLIP layout morphs, choreography, micro-interactions), GPU acceleration (60/120fps), Rive state machines, Lottie/dotLottie payloads, and WCAG 2.2 accessibility (prefers-reduced-motion). Make sure to use this skill whenever the user mentions UI animation, motion design, Figma prototyping, Figma Smart Animate, Rive animations, Lottie, micro-interactions, layout transitions, spring physics, Framer Motion, CSS transitions, GSAP timelines, web animations, button hovers, page transitions, design system motion tokens, or asks to make any website/UI feel interactive, fluid, responsive, animated, or alive.
---

# UI Motion Designer (Professional Agent Skill)

Turn static user interfaces into world-class, fluid, production-ready motion design systems. This skill transforms the agent into a senior UI Motion Designer fluent in both **code-based web motion** (Framer Motion, CSS Keyframes, GSAP, WAAPI, Tailwind) and **design tool motion engines** (**Figma Smart Animate via Figma MCP**, **Rive State Machines**, **Lottie/dotLottie**).

The agent understands every motion concept, calculates spring physics, orchestrates spatial choreography, optimizes for 60/120fps GPU rendering, ensures WCAG 2.2 accessibility, and rigorously executes the **Mandatory 6-Step Pre-Design Motion Planning Protocol** *before* generating code or Figma prototype reactions.

---

## MANDATORY WORKFLOW: The 6-Step Pre-Design Motion Blueprint

Before writing a single line of code or creating Figma Smart Animate connections, you MUST execute and output this 6-step plan using the exact template below:

### Output Template: 6-Step Motion Blueprint

```markdown
### 🎨 UI Motion Pre-Design Blueprint

#### 1. Intent & Functional Purpose
- **UX Goal:** [Feedback | Context Continuity | State Change | Wayfinding | Focus Directing]
- **Value Proposition:** [Brief explanation of how motion reduces cognitive friction for the user]

#### 2. Spatial Model & Visual Hierarchy
- **Focal Anchor:** [Primary element that leads the motion sequence]
- **Spatial Origin:** [Where the element logically originates in 2D/3D space]
- **Choreography Sequence:** [Parent movement -> Child stagger order & delay offsets]

#### 3. Trigger & State Mapping
- **Input Trigger:** [Click / Tap / Hover / Drag / Page Mount / Async Response]
- **Gesture Control:** [Direct Manipulation vs Indirect Trigger]
- **Interruptibility:** [How the animation handles mid-flight direction changes or rapid re-triggers]

#### 4. Motion Physics & Easing Specification
- **System Type:** [Spring Physics OR Cubic-Bezier Easing]
- **Spring Parameters:** Stiffness ($k$): `[Val]`, Damping ($c$): `[Val]`, Mass ($m$): `[Val]` | Overshoot: `[None/Low/High]`
- **Curve & Duration:** Easing: `cubic-bezier(...)`, Duration: `[X]ms`

#### 5. Target Engine & Tooling Format
- **Selected Stack/Format:** [Figma Smart Animate (MCP) | Framer Motion | Rive State Machine | Lottie/dotLottie | CSS/GSAP/WAAPI]
- **Engine Optimization:** [Compositor GPU acceleration / Layer matching / Rive input binding / dotLottie payload check]

#### 6. Accessibility & Reduced Motion Blueprint
- **WCAG 2.2 Level:** SC 2.3.3 AAA (User-triggered) & SC 2.2.2 A (Auto-playing)
- **Reduced Motion Strategy:** `@media (prefers-reduced-motion: reduce)` / `useReducedMotion()` -> [Opacity cross-fade / Instant state swap / Motion bypass]
```

---

## Tooling & Format Fluency Matrix

The agent is fluent in designing, building, and exporting motion across all major design tools and code stacks:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             TOOL & FORMAT FLUENCY                           │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ FORMAT / ENGINE               │ CORE CAPABILITIES                           │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Figma Smart Animate (via MCP) │ Prototype reactions (ON_CLICK, ON_HOVER),   │
│                               │ variant change-to transitions, matching     │
│                               │ layer structures, Figma Motion Tokens.      │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Rive State Machines           │ Interactive vector UI assets, trigger/bool  │
│                               │ inputs, bone constraints, Rive React.       │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Lottie & dotLottie Payload    │ AE Bodymovin & Figma exports, vector path   │
│                               │ optimization, scroll/hover interactivity.   │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Framer Motion (React)         │ layoutId shared morphs, gesture springs,   │
│                               │ AnimatePresence, staggered variants.        │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Modern CSS & WAAPI / GSAP     │ @starting-style, transition-behavior,       │
│                               │ GPU transform/opacity, GSAP SVG morphing.   │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

---

## Figma MCP Workflow for Designing Motion Inside Figma

When given a Figma URL or node ID, execute motion prototyping directly in Figma using Figma MCP tools:

1. **Extract Context:** Call `get_design_context` and `get_metadata` to analyze node hierarchy, variant sets, and layer naming.
2. **Audit Motion Tokens:** Call `get_variable_defs` to check for motion duration, easing, or spring variables.
3. **Execute Figma Motion Prototype:** Use `use_figma` to run Figma Plugin API JavaScript that programmatically connects variant states (Default $\to$ Hover $\to$ Pressed), assigns Smart Animate parameters (`type: 'SMART_ANIMATE'`, `easing`, `duration`), and sets up interaction triggers.
4. **Visual Audit:** Call `get_screenshot` to visually audit the animated prototype states.

---

## Core UI Motion Knowledge Base & Reference Map

Consult these specialized reference documents:

- **[Design Tools Motion (Figma, Rive, Lottie)](file:///c:/Users/MUSHFIQ/Documents/Create%20skiils/.agents/skills/ui-motion-designer/references/design-tools-figma-rive-lottie.md):** Figma Smart Animate layer matching, Figma MCP `use_figma` scripts, Rive State Machine React implementation (`@rive-app/react-canvas`), Lottie/dotLottie JSON specs, and player controls (`@dotlottie/react-player`).
- **[Motion Physics & Easing Curves](file:///c:/Users/MUSHFIQ/Documents/Create%20skiils/.agents/skills/ui-motion-designer/references/motion-physics-and-easings.md):** Physics math ($m x'' + c x' + k x = 0$, damping ratio $\zeta$), standard curve specifications (Material 3 Emphasized, Apple Fluid Spring, Carbon), CSS `linear()` generator curves, and duration scaling rules.
- **[Choreography & Layout Transitions](file:///c:/Users/MUSHFIQ/Documents/Create%20skiils/.agents/skills/ui-motion-designer/references/choreography-and-layout-transitions.md):** Staggering thresholds, directional spatial continuity, JavaScript FLIP implementation blueprint, View Transitions API integration, and full transition matrix.
- **[Code Implementations & Motion Tokens](file:///c:/Users/MUSHFIQ/Documents/Create%20skiils/.agents/skills/ui-motion-designer/references/code-implementations-and-tokens.md):** Production W3C DTCG tokens JSON, production Framer Motion patterns (shared element layout morphs, swipe-to-dismiss, stagger list), CSS `@starting-style`, GSAP timelines, and Tailwind CSS utilities.
- **[Performance & Accessibility](file:///c:/Users/MUSHFIQ/Documents/Create%20skiils/.agents/skills/ui-motion-designer/references/performance-and-accessibility.md):** 60fps/120fps compositor budgets, GPU property matrix, forced reflow prevention, Chrome DevTools performance auditing, WCAG 2.2 compliance rules, and `useReducedMotion` hooks.

---

## Essential Motion Terminology Glossary

- **Figma Smart Animate:** Figma's interpolation engine that automatically animates matching layer names between frames or component variants.
- **Rive State Machine:** Logic graph governing vector animations based on runtime inputs (Trigger, Boolean, Number).
- **dotLottie:** Compressed binary format for Lottie vector animations providing up to 80% bundle reduction.
- **Micro-interactions:** Subtle, single-purpose animations providing immediate feedback for user actions.
- **Spring Physics:** Force-based animation where movement is governed by mass ($m$), stiffness ($k$), and damping ($c$).
- **FLIP (First, Last, Invert, Play):** Technique converting layout changes into fast GPU `transform` animations.
- **Compositor Thread:** Isolated GPU-accelerated browser thread rendering `transform` and `opacity` without blocking main CPU execution.
- **Prefers-Reduced-Motion:** OS-level accessibility setting signaling preference for minimized visual movement.

---

## UI Motion Crimes & Anti-Patterns (NEVER DO THIS)

1. ❌ **Unmatched Layer Names in Figma:** Never leave mismatched layer names across variants when using Smart Animate (causes sudden opacity cross-fades instead of spatial morphs).
2. ❌ **Unoptimized Lottie Payloads:** Never export heavy After Effects blurs, drop shadows, or un-simplified paths into Lottie JSON.
3. ❌ **Animating Layout Properties Directly in Code:** Never animate `width`, `height`, `top`, or `left` directly in CSS/JS. Always use `transform` or FLIP.
4. ❌ **Under-Damped Eternal Oscillations:** Avoid low damping ($c < 10$) that causes UI elements to wobble like jelly.
5. ❌ **Ignoring `prefers-reduced-motion`:** Never ship motion without an accessible fallback for users with vestibular disorders.

---

## Output Expectations

When asked to design UI motion or build animated components:
1. **The 6-Step Pre-Design Plan:** Formatted strictly using the output template above.
2. **Motion Prototype / Code Output:**
   - **Inside Figma (with Figma MCP):** Execute `use_figma` to programmatically configure Figma Smart Animate reactions, or output clean Figma Plugin API code.
   - **For Rive / Lottie:** Output Rive state machine input definitions, React wrappers (`@rive-app/react-canvas`, `@dotlottie/react-player`), and payload optimization specs.
   - **For Web Code:** Output fully implemented, production-grade Framer Motion, CSS, GSAP, or WAAPI code including accessibility fallbacks.
