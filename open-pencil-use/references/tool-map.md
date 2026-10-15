# OpenPencil MCP tool map (132 tools)

Grouped inventory of the connected server's tools. Availability can vary by version/mode; the server's own schemas are authoritative. Refresh with `search({ namespace: "openpencil" })` or the OpenPencil CLI (`openpencil tool list`).

## Documents & pages
- `list_documents` — open documents/tabs with IDs, file paths, current pages, pages.
- `get_current_page` — current page name and ID.
- `list_pages` — all pages in the document.
- `switch_page` — switch to a page by name or ID.
- `create_page` — create a new page.
- `open_file` — open a .fig or .pen file inside the configured MCP root.
- `new_document` — create a new empty document with an optional save path.
- `save_file` — save the current document to disk (path must be inside the MCP root).
- `close_file` — close a tab; fails on unsaved changes unless `unsaved: "save" | "discard"`.
- `activate_document` — bring an open tab to the front, optionally switching page.

## Inspection & query
- `get_page_tree` — lightweight page hierarchy (id/type/name/size/text); supports depth/root/node_types.
- `get_node` — detailed node properties by ID (depth-limited recursion).
- `node_tree` — node tree with types and hierarchy.
- `node_children` — direct children of a node.
- `node_ancestors` — ancestor chain to the page root.
- `node_bounds` — absolute bounding box.
- `page_bounds` — bounding box of all objects on the page.
- `find_nodes` — find by name pattern and/or type.
- `query_nodes` — XPath queries (`//FRAME[@width < 300]`, `//TEXT[contains(@text, 'Hello')]`, …).
- `find_variables` — find variables by name pattern.
- `get_selection` — the user's current selection (start here when they point at layers).
- `get_jsx` — JSX representation (same dialect `render` accepts).
- `describe` — semantic description: role, layout, visuals, issues.
- `get_components` — reusable components from document and enabled libraries.
- `list_libraries` — available published component libraries.
- `get_behaviour` — Reka UI behaviour of a component/component set (props, slots, missing parts).
- `get_settings` — editor settings (appearance, snapping, rendering, AI chat, design checks).
- `get_codegen_prompt` — design-to-code guidelines; call before generating frontend code.
- `list_available_fonts` — font families the host can render.
- `list_fonts` — fonts used in the current page.
- `get_font_status` — whether used fonts are faithfully available (substitutions, affected nodes).
- `get_collection` / `get_variable` — variable collection/variable details.
- `list_collections` / `list_variables` — variable collections and design variables.
- `node_bindings` — variable bindings of a node.

## Analysis & audit
- `analyze_colors` — palette frequency, variable bindings, similar-color clustering.
- `analyze_typography` — font families/sizes/weights and frequencies.
- `analyze_spacing` — gaps/padding and grid compliance.
- `analyze_clusters` — repeated patterns (candidate components) by structural signature.
- `analyze_overlaps` — sibling overlaps and parent overflows (note: flags paths inside icon frames too).
- `lint` — accessibility/consistency findings with severities, `fix` and `suggestions`.
- `lint_fix` — apply safe fixes; `suggestions: true` also applies first suggestions (min text size, spacing/radius snapping, hidden-layer cleanup).
- `design_to_component_map` — component decomposition: components, variants, props, screens, dependencies.
- `design_to_tokens` — variables as CSS custom properties (Tailwind v4 `@theme` or DTCG files).
- `calc` — arithmetic evaluator; ALWAYS use instead of mental math (accepts arrays of expressions).

## Creation & authoring
- `render` — render JSX to design nodes (primary creation path); `replace_id` swaps a placeholder preserving position.
- `create_shape` — FRAME / RECTANGLE / ELLIPSE / TEXT / LINE / STAR / POLYGON / SECTION.
- `create_vector` — vector from SVG path data or VectorNetwork.
- `import_svg` — raw SVG markup to editable layers (groups, vectors, text, masks).
- `import_design_tokens` — DTCG/Tokens Studio files to variables and text/effect styles.
- `clone_node` — duplicate a node.
- `node_replace_with` — replace a node with JSX content.
- `group_nodes` / `ungroup_node` — group/ungroup selection.
- `reparent_node` — move node into a different parent.
- `arrange` — tidy top-level nodes into grid/row/column.
- `flatten_nodes` — flatten nodes into one vector.
- `create_slice` — export region.
- `node_to_component` / `create_component` — convert frames/groups into components.
- `combine_as_variants` — build a component set from sibling components.
- `create_instance` — instantiate a component.
- `insert_library_component` — insert a component from an enabled library.
- `expose_instance_swap` — expose a nested instance as a swap slot.
- `create_slot` — make a frame a component slot.
- `set_behaviour` — make a component behave as a Reka UI control (props/slots/states).

## Styling & properties
- `update_node` — position, size, opacity, corner radius, visibility, text, font.
- `batch_update` — many `{id, props}` updates in one layout pass (spacing, padding, sizing, grow, name, visible, corner_radius, auto_resize, direction).
- `set_fill` — solid or linear gradient fill.
- `set_stroke` / `set_stroke_align` — stroke and its alignment.
- `set_effects` — drop shadow, inner shadow, blur(s).
- `set_radius` — corner radius (uniform or per corner).
- `set_opacity` / `set_blend` / `set_rotation` — appearance.
- `set_visible` / `set_locked` — visibility and lock.
- `set_minmax` — min/max width/height constraints.
- `set_constraints` — resize constraints within parent.
- `set_image_fill` — image fill from base64 (PNG/JPEG/WEBP).
- `stock_photo` — search stock photos onto leaf placeholders (needs Pexels/Unsplash key in settings).
- `rename_node` — rename in layers panel.
- `select_nodes` — select nodes by ID.

## Layout
- `set_layout` — auto-layout (flexbox): direction, alignment, spacing, padding.
- `set_layout_child` — child sizing (FIXED/HUG/FILL), grow, align-self, absolute positioning.
- `node_move` / `node_resize` — geometry.

## Text
- `set_text` — text content.
- `set_font` — font properties of a text node.
- `set_font_range` — font properties for a character range.
- `set_text_resize` — auto-resize mode (NONE / WIDTH_AND_HEIGHT / HEIGHT / TRUNCATE).
- `set_text_properties` — alignment, auto-resize, case, decoration, truncation, direction.

## Vectors & boolean
- `path_get` / `path_set` — read/write VectorNetwork JSON.
- `path_move` / `path_scale` / `path_flip` — transform path geometry.
- `boolean_union` / `boolean_subtract` / `boolean_intersect` / `boolean_exclude` — boolean ops.

## Icons
- `search_icons` — search Iconify by keyword (multiple queries parallel).
- `fetch_icons` — pre-fetch/cache icons by `prefix:name` (one request per set).
- `insert_icon` — insert vector icons (instant when cached).

## Variables & tokens
- `create_collection` / `create_variable` — create token structures.
- `set_variable` — set a variable's value for a mode.
- `delete_variable` / `delete_collection` — remove.
- `bind_variable` / `unbind_variable` — attach/detach variables (fills use indexed paths like `fills/0/color`).
- `design_to_tokens` — export variables as CSS/Tailwind/DTCG stylesheets.
- `import_design_tokens` — import DTCG files as variables and styles.

## Comments
- `get_comments` — read canvas comment threads (open by default).
- `add_comment` — leave a Markdown comment pinned to a layer or x/y.
- `reply_to_comment` — answer a thread by ID.
- `resolve_comment` — resolve (or reopen with `resolved: false`).

## Diff
- `diff_create` — patch turning one tree into another (attribute changes, moved/added/removed children).
- `diff_show` — preview attribute patch without applying.
- `diff_apply` — apply a patch; fails on stale values unless forced; supports dry run.
- `diff_jsx` — structural JSX diff between two nodes.
- `diff_visual` — pixel diff (red changed pixels), ratio, changed region.

## Export & files
- `export_image` — PNG/JPG/WEBP (base64); use for visual verification.
- `export_svg` — SVG markup.
- `export_pdf` — vector PDF (selectable text).
- `create_slice` — export region node.

## History & viewport
- `undo` / `redo` — step through automation changes only; refuse when the newest change is the user's.
- `viewport_get` / `viewport_set` / `viewport_zoom_to_fit` — view control; use only when the user asks to be shown something.

## Settings & misc
- `update_settings` — change editor settings (partial object shaped like `get_settings`); never exposes credentials/models/tool access.
