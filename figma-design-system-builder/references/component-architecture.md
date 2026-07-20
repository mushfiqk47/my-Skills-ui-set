# Bidirectional Component Architecture and Layouts

This reference guide details how the agent translates layout structures and interactive components between a codebase (Tailwind, React, CSS Flexbox) and Figma (Auto Layout, Component Sets, Variants) in both directions.

---

## 1. Bidirectional Layout Mapping

Figma's Auto Layout replicates CSS Flexbox model. Map properties using the following conversion tables:

### 1.1. Figma to CSS Flexbox (Exporting)
| Figma Property | Figma Value | CSS / Tailwind Equivalent |
| :--- | :--- | :--- |
| `layoutMode` | `HORIZONTAL` | `flex flex-row` |
| `layoutMode` | `VERTICAL` | `flex flex-col` |
| `itemSpacing` | `8` | `gap: 8px` / `gap-2` (using snapped 4px scale) |
| `paddingTop` | `12` | `padding-top: 12px` / `pt-3` |
| `primaryAxisAlignItems` | `CENTER` | `justify-content: center` / `justify-center` |
| `counterAxisAlignItems` | `MIN` | `align-items: flex-start` / `items-start` |

### 1.2. CSS Flexbox to Figma Auto Layout (Importing)
When reading CSS variables or HTML markup, reconstruct container boundaries inside Figma:
- Read elements with styling properties matching display rules (`flex`, `grid`, `block`).
- Recreate container elements using `figma.createFrame()`.
- Set container Auto Layout values based on parsed flex properties:
  ```javascript
  const container = figma.createFrame();
  container.layoutMode = flexDirection === "column" ? "VERTICAL" : "HORIZONTAL";
  container.itemSpacing = parseSpacing(gapValue);
  container.paddingTop = parseSpacing(paddingTopValue);
  container.paddingBottom = parseSpacing(paddingBottomValue);
  container.paddingLeft = parseSpacing(paddingLeftValue);
  container.paddingRight = parseSpacing(paddingRightValue);
  ```

---

## 2. Recreating Component Sets & Variants inside Figma

To build scalable components in Figma that align with code design systems, the agent must create component variants. Because Figma does not support empty component sets, the agent must create `ComponentNode` shapes first and group them using `figma.combineAsVariants()`.

### 2.1. Grouping Component Variants
First, convert the frames representing distinct states into base components, then group them:

```javascript
// Convert layout frames to components
const frameDefault = figma.createFrame(); // Default state button
const frameHover = figma.createFrame();   // Hover state button

const compDefault = figma.createComponentFromNode(frameDefault);
const compHover = figma.createComponentFromNode(frameHover);

// Combine into a component set (variants). Parent container must be passed.
const buttonSet = figma.combineAsVariants([compDefault, compHover], figma.currentPage);
buttonSet.name = "Button";
```

### 2.2. Setting Variant Properties
Rename each individual component node inside the component set using key-value pair strings matching the properties. Figma automatically syncs these to the component set's variant definitions.

```javascript
// Naming structure: Property1=Value1, Property2=Value2
compDefault.name = "Variant=Primary, Size=Md, State=Default";
compHover.name = "Variant=Primary, Size=Md, State=Hover";
```

Alternatively, add properties directly to the component set using the property API:
```javascript
// Add a variant property to the component set
buttonSet.addComponentProperty("Variant", "VARIANT", "Primary");
buttonSet.addComponentProperty("Size", "VARIANT", "Md");
buttonSet.addComponentProperty("State", "VARIANT", "Default");
```

---

## 3. Reconstructing Layout Hierarchies

When recreating a page layout from a codebase in Figma, translate nesting structures recursively:
- **Leaf Nodes**: Recreate text elements (`figma.createText()`), icons (`figma.createNodeFromSvg()`), and images/shapes.
- **Layout Nodes**: Wrap children in nested Auto Layout frames. Set width and height resizing behaviors programmatically:
  - Flex child with `flex-grow: 1` $\rightarrow$ Set `layoutGrow = 1` in Figma.
  - Full-width block element $\rightarrow$ Set horizontal resizing constraint to `FILL`.
  - Content-sized fitting element $\rightarrow$ Set horizontal/vertical resizing to `HUG`.

---

## 4. Human-Centered Design & Accessibility Standards
1. **Interactive Tap Targets**: Ensure touch targets are programmatically verified to be at least `44x44px` on mobile frames and `32x32px` on desktop layouts.
2. **Text Wraps**: Set text layers to auto-wrap (`textAutoResize = "HEIGHT"`) with defined width constraints, ensuring responsive columns do not cause clipping or overlaps.
