---
name: open-pencil-use
description: Use when working with OpenPencil (openpencil.dev) — the desktop design editor and its MCP server tools (openpencil_* / tools.openpencil.*). Triggers: "OpenPencil", "on the canvas", .fig/.pen designs, landing pages/mockups/components built in OpenPencil, "openpencil-mcp", "OpenPencil app is not connected", inspecting or editing the user's current selection, design lint/accessibility checks, exporting PNG/SVG/PDF from a design. Also use when a design task mentions Figma-like layers but the tool available is OpenPencil.
---

# OpenPencil Use

## Overview

OpenPencil is an open-source, AI-native design editor (Figma alternative). Agents drive it through an MCP server exposing 100+ tools. The canvas is **not a browser**: you author with **design JSX** (a Figma-like authoring format), not HTML/CSS.

Core principle: **survey → act → verify visually → lint → save.** Never claim a design is done from node counts alone; look at `export_image` output and run `lint` until 0 errors / 0 warnings.

## Connection and setup

Requirements: OpenPencil **desktop app running with a document open**. The stdio bridge (`openpencil-mcp`) forwards to the app's embedded server; the app owns all document state.

- Install: `npm i -g @open-pencil/mcp` (provides `openpencil-mcp` stdio bridge and `openpencil-mcp-http` HTTP server).
- OpenCode config (`opencode mcp add --global openpencil openpencil-mcp` writes it):
  ```json
  { "mcp": { "openpencil": { "type": "local", "command": ["openpencil-mcp"] } } }
  ```
- HTTP mode (scripts/CI/browser): `openpencil-mcp-http` — port 7600, `/mcp` endpoint, `/health` check; TCP-only on Windows.
- Useful env vars: `OPENPENCIL_MCP_ROOT` (filesystem scope; defaults to home on Windows, cwd elsewhere), `OPENPENCIL_MCP_AUTH_TOKEN`, `OPENPENCIL_MCP_SCOPE=selection` (read-only selection), `OPENPENCIL_MCP_EVAL=1` (enable eval), `OPENPENCIL_MCP_DISABLED_TOOLS`.

**If any tool returns "OpenPencil app is not connected": STOP.** Tell the user to start the desktop app and open a document; do not retry automatically and never try to launch the app yourself.

Multi-tab: pass `document_id` and `page_id` explicitly instead of relying on the active tab. Get them from `list_documents` / `list_pages` / `get_current_page`.

## The golden loop

1. **Discover** — `list_documents` → `get_current_page` → `get_page_tree` (use `depth`/`node_types` to stay small) or `get_selection` when the user says "this layer". Reach for `query_nodes` (XPath) and `find_nodes` on big pages.
2. **Keep IDs** — every creation tool returns node IDs. Reuse them; never re-search the same node repeatedly.
3. **Act** — prefer `render` (one JSX tree) for anything bigger than a tweak; use targeted setters for small changes:
   `update_node`, `batch_update` (many updates, one layout pass), `set_fill`, `set_stroke`, `set_radius`, `set_layout`, `set_layout_child`, `set_text`, `set_font`, `set_effects`, `set_opacity`, `node_move`, `node_resize`, `rename_node`, `reparent_node`, `delete_node`.
4. **Verify visually** — `export_image` on the frame you touched and actually look at it. `analyze_overlaps` for stacking/overflow; `get_font_status` before judging text metrics; `diff_visual` to confirm a targeted edit only changed the intended pixels.
5. **Lint** — `lint` → `lint_fix {suggestions:true}` for mechanical fixes (text size, spacing scale, rounding, bindable colors) → fix contrast/touch-target findings manually (they need color/size judgment) → re-lint to 0 errors / 0 warnings.
6. **Save/show** — `save_file` when persistence is wanted; `activate_document` to bring the tab forward; `viewport_zoom_to_fit` only when the user asks to be shown something.
7. **Undo/redo** touch only your own automation changes; they refuse when the newest change came from the user — never work around that.

## Choosing the right tool

| Need | Use |
|---|---|
| Whole screen/section/card | `render` (one JSX expression) |
| Small property change | `set_fill`, `set_text`, `set_radius`, `update_node` |
| Many updates at once | `batch_update` |
| Replace placeholder, keep position | `render { replace_id }` or `node_replace_with` |
| Shapes/text from scratch | `create_shape`, `create_vector`, `import_svg` |
| Icons | `search_icons` → `fetch_icons` → `insert_icon`, or `<Icon name="lucide:…" />` in JSX |
| Photos | `stock_photo` (needs Pexels/Unsplash key in app settings); otherwise `set_image_fill` with base64, or leave a placeholder and say so |
| Tokens/variables | `create_collection`, `create_variable`, `designVar()` in JSX, `design_to_tokens`, `import_design_tokens` |
| Components | `create_component`, `node_to_component`, `create_instance`, `combine_as_variants`, `get_components`, `insert_library_component` |
| Feedback threads | `get_comments`, `add_comment`, `reply_to_comment`, `resolve_comment` |
| Understand a design | `describe`, `get_jsx`, `analyze_colors/typography/spacing/clusters`, `design_to_component_map`, `get_codegen_prompt` (for codegen) |
| Compare/patch | `diff_create`, `diff_show`, `diff_apply`, `diff_jsx`, `diff_visual` |

Full inventory of all 132 tools by category: `references/tool-map.md`.

## Design JSX essentials

Read `references/jsx-authoring.md` before any non-trivial authoring (variables, components, controls, rich text). The short version:

- Elements: `Frame`, `Text`, `Span`, `Paragraph`, `Rectangle`, `Ellipse`, `Line`, `Star`, `Polygon`, `Vector`, `Group`, `Section`, `Component`, `ComponentSet`, `Instance`, `Icon`, plus Reka control names (`Switch.Root`, `Tabs.Trigger`, …).
- Layout: `flex="row"|"col"`, `gap`, `p`/`px`/`py`, `justify`, `items`, `grow`, `wrap`, `grid`/`columns`. Sizing: `w`/`h` = pixels, `"hug"`, or `"fill"`. **Prefer hug/fill over guessed fixed heights.**
- Text wraps with `w="fill"` (or fixed width + `textAutoResize="height"`). A newline inside a JSX string: `{"Digital\nDesigner"}`.
- Paint: `bg`, `color`, `stroke`, `rounded`, `shadow="0 10 25 #00000010"`, `opacity`, `overflow="hidden"`.
- Text: `size`, `weight`, `font`, `lineHeight`, `letterSpacing`, `color`, `textAlign`. `Span` styles character runs; `Paragraph` makes lists (`list="ordered"`).
- Repetition: `{items.map((x) => <Frame …>{x.title}</Frame>)}` — a JSX string is ONE expression; no statements outside `{}`.
- Variables: create first, then `designVar('Name')` for colors/scalars. `bind` for other scene fields.
- Components: `<Component>`/`<ComponentSet>`/`<Instance of="Name" />` for real editable/reusable identity — a JS function is only shared source, not a component.
- Not supported: HTML tags, `className`, arbitrary CSS. Some CSS-ish aliases exist; do not assume browser behavior.

## Design quality bar

The `lint` rules define the bar — build to it from the start:

- Body text ≥ **12px**; target **4.5:1** contrast for small text, **3:1** for large. On light surfaces, `#8A8A8A` fails (3.05:1) — use `#6E6E6E` or darker.
- Touch targets ≥ **24×24** (pad small nav/footer links).
- Spacing and radius on the 4px scale (6px gaps and 22px padding get flagged — use 8/24).
- Fix overflow/contrast at the source (layout, color choice); never clip to hide breakage.
- Subpixel `.5` positions from centered auto-layout are info-level noise; ignore unless the user asks for pixel-perfect.

## Worked example: reference image → landing page

1. Survey: `list_documents`, `get_page_tree` — note the target page ID and any existing frames.
2. Analyze the reference image (typography scale, sections, palette) and plan sections before writing JSX.
3. Render one tree (delete/replace an old scaffold only if it is clearly yours):
   ```
   render({ jsx: `<Frame name="Landing Page" w={1200} h="hug" flex="col" bg="#F1F1EF" px={56}>
     <Frame name="Nav" w="fill" h={80} flex="row" justify="between" items="center">…</Frame>
     <Frame name="Hero" w="fill" h="hug" flex="col" gap={64} pt={64} pb={96}>
       <Text name="Headline" size={150} lineHeight={148} letterSpacing={-5} weight="bold" color="#111111">{"Digital\nDesigner"}</Text>
     </Frame>
   </Frame>` })
   ```
4. Verify: `export_image` the frame → compare against the reference → fix wrapping/overlap (`analyze_overlaps`); a Hug-width heading that must wrap needs a fixed width (set `textAutoResize` HEIGHT via `set_text_resize`, then `node_resize`).
5. Lint loop until clean, then `save_file` / `activate_document`.

## Common mistakes

- **Authoring while disconnected** — the error literally says STOP; tell the user, don't retry.
- **Writing HTML/CSS** — use design JSX; check `get_jsx` of an existing node to learn the dialect in use.
- **Guessing text dimensions** — set width + resize mode and re-export; verify fonts with `get_font_status`.
- **Treating icon-internal vector overlaps as bugs** — `analyze_overlaps` flags paths inside an icon frame; only real sibling/parent overlaps matter.
- **Deleting the user's work** — only remove frames you created (or clearly labeled scaffolds) without asking.
- **Skipping lint** — contrast/touch/text-size findings are the user-visible quality bar.
- **`stock_photo` without a provider key** — it errors; fall back to a labeled placeholder.
- **Counting tokens instead of pixels** — done means: export inspected, lint clean, overlaps explained.

## Verification checklist

- [ ] App connected; `document_id` / `page_id` recorded
- [ ] Structure inspected (`get_page_tree` / `get_selection`) before edits
- [ ] `export_image` of touched frames inspected visually
- [ ] `lint`: 0 errors, 0 warnings (fixes applied); remaining info notes understood
- [ ] Overflows/overlaps resolved (except icon internals)
- [ ] Fonts load (`get_font_status`)
- [ ] Saved (`save_file`) if persistence requested; tab activated for the user

## References

- `references/jsx-authoring.md` — complete design JSX authoring reference (layout, paint, text, variables, components, controls, full syntax inventory).
- `references/tool-map.md` — all 132 MCP tools grouped by category.
- Official docs: https://openpencil.dev/programmable/mcp-server — CLI, HTTP transport, WebMCP, tool access settings.
