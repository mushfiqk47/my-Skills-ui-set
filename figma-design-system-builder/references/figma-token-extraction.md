# Bidirectional Token Sync and Extraction

This guide details how an agent must extract, structure, and sync design tokens (primitives, semantics, typography, spacing, border radii, shadows) between a code repository (Tailwind CSS, CSS Custom Properties, JSON formats) and Figma.

---

## 1. Multi-Tier Token Architecture & Sync Principles

To maintain a robust workflow, we divide design tokens into three layers: Primitives, Semantics, and Component-scoped tokens. When syncing tokens:
1. **Source of Truth**: Determine which side (Figma or Code) is the current source of truth for changes.
2. **Deterministic Mappings**: Map token JSON keys (e.g., `color.semantic.bg.default`) directly to Figma variable names using forward slashes (e.g., `color/semantic/bg/default`).
3. **Reference Integrity**: Ensure that aliases (references to other variables) are preserved in both directions rather than flattened into raw values.

---

## 2. Safety Verification Checks

Before pushing any changes to Figma or exporting them to Code, the agent must perform the following validation tests:

1. **Circular Reference Detection**: Inspect the dependency tree of variable aliases. Ensure no token references itself or forms a loop (e.g., A $\rightarrow$ B $\rightarrow$ A).
2. **Contrast Ratio Auditing**: Programmatically evaluate text-to-background color variable pairs against WCAG 2.2 AA (minimum 4.5:1 for body, 3:1 for display). Flag any failing semantic combinations in the sync log.
3. **Orphan Checking**: Detect if any semantic variable references a primitive ID that has been deleted or renamed.
4. **Figma Canvas Bindings Validation**: Check if variables are scoped correctly. For instance, spacing variables must have float data types scoped strictly to `GAP` and `PADDING` properties inside Figma to prevent developers from assigning them to text font sizes.

---

## 3. Syncing Code Tokens to Figma (Import Pipeline)

To import variables from JSON (e.g., `tokens.json` or theme files) into a Figma file, execute a JavaScript script via `use_figma`.

### 3.1. Creating/Updating Collections and Modes
First, check if the collection exists, otherwise create it. Ensure modes align (e.g., "Light Mode", "Dark Mode").

```javascript
// Example script run inside use_figma to upsert collections asynchronously
async function syncCollections() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let primitiveCollection = collections.find(c => c.name === "Primitives");

  if (!primitiveCollection) {
    primitiveCollection = figma.variables.createVariableCollection("Primitives");
  }
  return primitiveCollection;
}
```

### 3.2. Creating/Updating Color Variables
When creating color variables, resolve references. If a token value is an alias (e.g., `{color.primitive.blue.500}`), map it to the corresponding Figma variable alias.

```javascript
// Example script to create a color variable with an alias reference using async API
async function upsertColorVariable(name, collection, value, modeId) {
  const variables = await figma.variables.getLocalVariablesAsync();
  let variable = variables.find(v => v.name === name && v.variableCollectionId === collection.id);
  
  if (!variable) {
    variable = figma.variables.createVariable(name, collection, "COLOR");
  }
  
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    // Parse the token reference path: "{color.primitive.blue.500}" -> "color/primitive/blue/500"
    const targetName = value.slice(1, -1).replace(/\./g, "/");
    const targetVar = variables.find(v => v.name === targetName);
    if (targetVar) {
      variable.setValueForMode(modeId, {
        type: "VARIABLE_ALIAS",
        id: targetVar.id
      });
    } else {
      console.warn(`Alias target not found: ${targetName}`);
    }
  } else {
    // Write raw color values (e.g., #3B82F6 -> RGBA)
    const rgba = hexToRgba(value);
    variable.setValueForMode(modeId, rgba);
  }
}

function hexToRgba(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}
```

### 3.3. Binding Variables to Canvas Nodes
Use native binding APIs to link created variables directly to layout nodes:

- **For Numeric Properties** (width, height, paddings, border radius, gaps):
  ```javascript
  // Bind standard float variable to node properties
  const radiusVar = (await figma.variables.getLocalVariablesAsync()).find(v => v.name === "radius/md");
  if (radiusVar) {
    node.setBoundVariable('topLeftRadius', radiusVar);
    node.setBoundVariable('topRightRadius', radiusVar);
    node.setBoundVariable('bottomLeftRadius', radiusVar);
    node.setBoundVariable('bottomRightRadius', radiusVar);
  }
  ```

- **For Color Fills and Strokes** (paints):
  ```javascript
  const colorVar = (await figma.variables.getLocalVariablesAsync()).find(v => v.name === "color/brand/primary");
  if (colorVar) {
    const solidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
    node.fills = [
      figma.variables.setBoundVariableForPaint(solidPaint, 'color', colorVar)
    ];
  }
  ```
