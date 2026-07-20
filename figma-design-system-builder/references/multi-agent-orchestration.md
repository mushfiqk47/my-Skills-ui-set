# Multi-Agent Design System Orchestration

This guide outlines how a main coordinator agent divides a complex design system project (bidirectional sync, UI translation, audit) into manageable sub-tasks, delegates them to specialized sub-agents, and merges the outputs.

---

## 1. Team Roles and Responsibilities

When analyzing or building a complete design system, divide tasks among four logical agent profiles:

```
                          ┌─────────────────────────┐
                          │   Main Coordinator      │
                          │   (Merges & Validates)  │
                          └────────────┬────────────┘
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│   Token Agent   │           │  Layout Agent   │           │ Component Agent │
│  (Variables)    │           │ (Auto Layout)   │           │   (Variants)    │
└─────────────────┘           └─────────────────┘           └─────────────────┘
```

1. **Main Coordinator (Orchestrator)**:
   - Evaluates user requirements and initializes the files (`tokens.json`, `variables.css`, Figma node scopes).
   - Generates and schedules sub-agent prompts.
   - Merges code configurations and verifies design consistency.
2. **Token Sub-Agent**:
   - Focuses on primitive and semantic token definitions.
   - Manages color spaces, typography ratios, typography scales, spacing units, and modes.
3. **Layout Sub-Agent**:
   - Audits grid setups, margins, container nesting hierarchies, and responsive breakpoints.
   - Translates DOM node paths to Figma frame properties.
4. **Component Sub-Agent**:
   - Focuses on UI component sets (Buttons, Forms, Modals).
   - Maps component variants to TypeScript code interfaces and styles.

---

## 2. Spawn and Delegation Checkpoints

The main agent must run the execution pipeline in order, resolving dependencies before spawning downstream agents.

### Dependency Checkpoints:
1. **Checkpoint 1 (Tokens)**: The Token Sub-Agent must complete standardizing colors, grids, and types *before* layout and component structures are drawn.
2. **Checkpoint 2 (Layouts)**: The Layout Sub-Agent establishes container guidelines and spacing constraints using the approved token mappings.
3. **Checkpoint 3 (Components)**: The Component Sub-Agent binds layouts and tokens together to generate state-aware code elements.

---

## 3. Sub-Agent Prompting Templates

The Coordinator Agent spawns sub-agents by passing specific instruction prompts:

### 3.1. Token Sub-Agent Prompt
```
Execute the following sub-task:
- Skill path: .agents/skills/figma-design-system-builder
- Task: Extract all primitive variables and map them into light/dark semantic alias tokens.
- Scope: Fetch files or execute figma `get_variable_defs`. Output standard DTCG JSON format.
- Save output to: design-system/tokens.json
```

### 3.2. Layout Sub-Agent Prompt
```
Execute the following sub-task:
- Skill path: .agents/skills/figma-design-system-builder
- Task: Translate layout structures of target node frames into Tailwind grid code.
- Inputs: design-system/tokens.json
- Scope: Read layout frames via `get_design_context`. Map padding/margins, snap dimensions, and output layout utility classes.
- Save output to: design-system/layouts.json
```

### 3.3. Component Sub-Agent Prompt
```
Execute the following sub-task:
- Skill path: .agents/skills/figma-design-system-builder
- Task: Build modular components for Button and Input frames.
- Inputs: design-system/tokens.json, design-system/layouts.json
- Scope: Resolve Figma variants to React TypeScript props. Map component states (hover, focus, disabled) to Tailwind class matrices.
- Save outputs to: design-system/components/
```

---

## 4. Merging and Validation Rules

When sub-agents finish, the Coordinator Agent must merge deliverables and perform quality audits:
- **Ref Check**: Verify that all generated CSS properties reference existing CSS variables (no raw, hardcoded hex values or pixel metrics allowed).
- **Prop Alignment**: Verify that the generated React component props match the Figma component set variant tags (e.g. if Figma lists `Disabled=True`, the React code has a `disabled` attribute).
- **Compilation Check**: Verify that the generated component files import the standard layout and utility configurations cleanly, and compile without TypeScript errors.
