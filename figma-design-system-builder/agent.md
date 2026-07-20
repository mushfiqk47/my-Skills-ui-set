# Figma Design System Builder - Agent Specification

This document defines the capabilities, operational models, input/output interfaces, and Figma Model Context Protocol (MCP) integrations for the **Figma Design System Builder** agent skill.

---

## 1. Core Capabilities

The Figma Design System Builder skill enables an AI agent to perform the following operations:

1. **Codebase-to-Figma UI Translation**: Parse structural patterns in codebases (React components, raw CSS, HTML structures, Tailwind configuration objects) and reconstruct them as pixel-perfect Figma UI assets.
2. **Programmatic Figma Generation (via `use_figma`)**: Execute plugin scripts via the Figma Plugin API to dynamically construct frames, variable collections, modes (Light, Dark), native typography styles, and component variant sets.
3. **Figma File Parsing (via MCP)**: Programmatically inspect and traverse Figma canvas hierarchies, reading properties of layers, components, variables, and layout vectors.
4. **Bidirectional Design Token Syncing**: Maintain sync loops between code design tokens (CSS variables, tailwind theme maps) and Figma variables, checking for and resolving reference conflicts.
5. **Auto Layout Mapping**: Translate CSS Flexbox structures (direction, spacing, align-items, justify-content) into Figma Auto Layout settings and vice versa.
6. **Accessibility and Contrast Compliance**: Automate WCAG 2.2 AA contrast calculations (using `use_figma` to inspect node text-fill and background-fill colors) and adjust colors dynamically to pass standards.
7. **Task Decomposition & Orchestration**: Act as a main coordinator agent, delegating specific sub-tasks to focused sub-agents to parallelize design system audits and creations.

---

## 2. Bidirectional Workflows

### Workflow A: Figma-to-Code (Exporting Design Assets)
When exporting visual files to a Tailwind-styled codebase, follow these stages:
1. **Extraction**: Run `get_screenshot` and `get_design_context` to scan visual structures.
2. **Variable Mapping**: Retrieve variable lists via `get_variable_defs` and translate them into a W3C DTCG-compliant `tokens.json`.
3. **Tailwind Config Generation**: Export tokens into CSS variables (`variables.css`) and Tailwind configurations (`tailwind.config.js` or theme declarations).
4. **Component Generation**: Read components (using `get_design_context` data), resolve props/variants, and generate TypeScript React components.

### Workflow B: Code-to-Figma (Recreating UI in Figma)
When importing code systems into Figma, follow these stages:
1. **Parsing codebase styles**: Extract theme tokens from Tailwind config and component structures (e.g., HTML structure, margins, colors, variants).
2. **Variable Collection Building**: Generate and run a JS script using `use_figma` to create variable collections and modes (Light/Dark) in Figma.
3. **Layout & Grid Mapping**: Translate CSS flex layouts into Auto Layout grids, establishing default vertical and horizontal constraints.
4. **Drawing Components**: Dynamically create Figma components, mapping code properties (e.g. `size`, `variant`) to Figma component set properties.

---

## 3. Multi-Agent Coordination Specification

For complex, large-scale design systems, the main agent coordinates sub-agents using strict task scopes:
- **Main Coordinator**: Outlines the design system blueprint, gathers context, structures the workspace, delegates sub-tasks, and merges final layouts and code definitions.
- **Token Sub-Agent**: Manages design variables (defining scales, colors, gradients, font parameters, mapping aliases).
- **Layout Sub-Agent**: Parses container hierarchies (matching CSS Flexbox layouts to Figma Auto Layout metrics, managing margins and padding scales).
- **Component Sub-Agent**: Generates specific UI blocks (Buttons, Inputs, Cards) and links them to variables and variant attributes.

---

## 4. Figma MCP Integration: Writing and Creating Assets

The agent writes to the Figma canvas by executing JavaScript code via the `use_figma` tool.

### 4.1. Creating a Variable Collection and Variable
```javascript
const collection = figma.variables.createVariableCollection("Primitives");
const brandPrimary = figma.variables.createVariable("color/brand/primary", collection, "COLOR");
brandPrimary.setValueForMode(collection.defaultModeId, { r: 0.23, g: 0.51, b: 0.96 }); // Equivalent to #3B82F6
```

### 4.2. Creating an Auto Layout Component Frame
```javascript
const frame = figma.createFrame();
frame.name = "Button";
frame.layoutMode = "HORIZONTAL";
frame.primaryAxisAlignItems = "CENTER";
frame.counterAxisAlignItems = "CENTER";
frame.paddingLeft = 16;
frame.paddingRight = 16;
frame.paddingTop = 8;
frame.paddingBottom = 8;
frame.itemSpacing = 8;
frame.cornerRadius = 6;
```
For deep code translation and API specifications, read: [code-to-figma-translation.md](file:///c:/Users/MUSHFIQ/Documents/Create%20skiils/.agents/skills/figma-design-system-builder/references/code-to-figma-translation.md)
