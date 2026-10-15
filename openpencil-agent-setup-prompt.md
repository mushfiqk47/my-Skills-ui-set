# Agent task: Set up OpenPencil MCP and use it

You are a coding agent with shell + MCP access. Two jobs: (1) connect the OpenPencil MCP server to this environment, (2) use it correctly for design work.

If your client has a skill named `open-pencil-use`, load it first — it contains the full workflow and JSX reference. Otherwise, follow this prompt.

## 0. Preconditions

- Node.js and npm are available (`node -v`, `npm -v`).
- OpenPencil desktop app (https://openpencil.dev) is installed and RUNNING with a document open. The MCP server lives inside the app; tools do nothing without it.

## 1. Install the MCP server

```bash
npm i -g @open-pencil/mcp
```

If npm fails with EACCES: do NOT use sudo. Run:

```bash
npm config set prefix ~/.npm-global
```

Then tell the user to add the npm global bin directory to PATH (`~/.npm-global/bin` on macOS/Linux; `%USERPROFILE%\.npm-global` on Windows) and retry after they confirm.

Verify:

```bash
openpencil-mcp --version
openpencil-mcp-http --version
```

`openpencil-mcp` is the stdio bridge your client spawns. `openpencil-mcp-http` is only for scripts/CI/browser clients (port 7600, `POST /mcp`, `GET /health`).

## 2. Register with your MCP client (pick the one that applies)

- **Claude Code:** `claude mcp add --scope user open-pencil -- openpencil-mcp`
- **OpenCode:** `opencode mcp add --global openpencil openpencil-mcp`
  (or add to `opencode.json`: `{ "mcp": { "open-pencil": { "type": "local", "command": ["openpencil-mcp"] } } }`)
- **Cursor:** add to `.cursor/mcp.json`. **Windsurf / other JSON clients:** same shape:

```json
{ "mcpServers": { "open-pencil": { "command": "openpencil-mcp" } } }
```

Optional env vars: `OPENPENCIL_MCP_ROOT` (limit file access to a directory), `OPENPENCIL_MCP_SCOPE=selection` (read-only selection), `OPENPENCIL_MCP_AUTH_TOKEN` (HTTP auth), `OPENPENCIL_MCP_EVAL=1` (enable eval).

## 3. Verify the connection

1. Restart the client or reload MCP servers (`opencode mcp list` / `claude mcp list` to check status).
2. Call `list_documents`. Expect the open tabs with IDs.
3. If you get "OpenPencil app is not connected": STOP. Tell the user to start the desktop app and open a document. Do not retry in a loop; never launch the app yourself.
4. Call `get_current_page`, then `get_page_tree`, to confirm read access.

## 4. How to use it — the golden loop

**survey → act → verify visually → lint → save**

1. **Survey.** `list_documents` → `get_current_page` → `get_page_tree` (depth-limited on big pages), `get_selection` when the user points at layers, `query_nodes` (XPath) and `find_nodes` for targeting. On multi-tab setups always pass `document_id`/`page_id` explicitly.
2. **Act.** Use `render` (design JSX) for whole sections/cards; `set_fill`, `set_text`, `update_node` for tweaks; `batch_update` for many edits in one layout pass; `render { replace_id }` or `node_replace_with` to swap a placeholder. Keep the node IDs creation tools return.
3. **Verify.** `export_image` on touched frames and actually look at the result; `analyze_overlaps` for stacking/overflow; `get_font_status` before judging text metrics.
4. **Lint.** `lint` → `lint_fix {suggestions:true}` for mechanical fixes → fix contrast and touch targets manually (they need judgment; colors: ≥4.5:1 small text, ≥3:1 large — `#8A8A8A` fails on light surfaces, use `#6E6E6E` or darker; touch targets ≥24×24) → re-lint until 0 errors / 0 warnings.
5. **Save/show.** `save_file` when persistence is wanted; `activate_document` to bring the tab forward; `viewport_zoom_to_fit` only when asked. `undo`/`redo` touch only your automation changes — if refused, the user edited; never work around it.

### Authoring rules

- Design JSX, NOT HTML/CSS. Elements: `Frame`, `Text`, `Span`, `Paragraph`, `Rectangle`, `Ellipse`, `Line`, `Star`, `Polygon`, `Vector`, `Group`, `Section`, `Component`, `ComponentSet`, `Instance`, `Icon`, plus Reka control names (`Switch.Root`, `Tabs.Trigger`, …).
- Layout: `flex="row"|"col"`, `gap`, `p`/`px`/`py`, `justify`, `items`, `grow`. Sizing: pixels, `"hug"`, `"fill"` — prefer hug/fill over guessed heights.
- Text wraps with `w="fill"` or fixed width + `textAutoResize="height"`; newline via `{"A\nB"}`; `Span` for rich runs; `Paragraph` for lists.
- Repetition inside JSX: `{items.map((x) => <Frame>{x.title}</Frame>)}` — one expression, no statements outside `{}`.
- Icons: `search_icons` → `fetch_icons` → `insert_icon`, or `<Icon name="lucide:…" />`.
- Variables before use: create with `create_variable`, then `designVar('Name')`. Components: `create_component`/`Component`/`Instance` — a JS function is not a component.
- Full authoring detail: call `get_codegen_prompt`, or read `references/jsx-authoring.md` from the `open-pencil-use` skill if available.

### Never

- Never proceed while the app is disconnected; tell the user and stop.
- Never fake completion from node counts — done = inspected `export_image` + `lint` clean.
- Never clip/hide content to hide layout breakage; fix it at the source.
- Never delete the user's work; only remove frames you created.
- Treat icon-internal vector overlaps from `analyze_overlaps` as noise, not bugs.

## 5. Done criteria — report back

- `openpencil-mcp` found on PATH; client lists the server as connected.
- `list_documents` / `get_page_tree` return real data from the running app.
- Report: what you installed, which config file you changed, connection verification output, and any remaining manual PATH step.
