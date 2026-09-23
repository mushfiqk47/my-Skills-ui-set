# Figma Plugin & Scripter Code Patterns

This reference provides production-ready JavaScript/TypeScript code snippets for executing the programmatic canvas operations required by the **Screen Alternatives** skill.

---

## 1. Selection & Scope Validation

Ensure exactly 1 to 5 frames are selected before executing any layout manipulation:

```javascript
// Scope Check
const selection = figma.currentPage.selection;

if (selection.length === 0) {
  figma.notify("⚠️ Please select a Figma frame or flow (up to 5 screens) to analyze.", { error: true });
  throw new Error("Zero frames selected. Skill paused awaiting user selection.");
}

if (selection.length > 5) {
  figma.notify("⚠️ Too many screens selected (" + selection.length + "). Please select 5 or fewer interconnected screens.", { error: true });
  throw new Error("Selection exceeds 5 screens. Scope must be narrowed.");
}

const originalFrames = selection.filter(node => node.type === 'FRAME' || node.type === 'COMPONENT');
if (originalFrames.length === 0) {
  figma.notify("⚠️ Selection must contain valid Frame or Component nodes.", { error: true });
  throw new Error("No frame nodes found in selection.");
}
```

---

## 2. Idempotent Cleanup of Previous Generations

Before creating new alternatives, scan for prior iterations linked to the original frame and cleanly remove them:

```javascript
/**
 * Removes prior Alt A and Alt B frames and their captions associated with an original frame.
 */
function cleanupPriorGenerations(originalFrame) {
  const parent = originalFrame.parent || figma.currentPage;
  const originalName = originalFrame.name;

  // Patterns to clean up
  const framePatterns = [
    `Alt A - `,
    `Alt B - `,
    `Alt A (${originalName})`,
    `Alt B (${originalName})`
  ];

  const captionPatterns = [
    `Alt A — `,
    `Alt B — `,
    `Alt A (${originalName})`,
    `Alt B (${originalName})`
  ];

  const nodesToRemove = [];

  for (const child of parent.children) {
    if (child.id === originalFrame.id) continue;

    // Check frames
    if (child.type === 'FRAME') {
      if (framePatterns.some(pat => child.name.startsWith(pat))) {
        nodesToRemove.push(child);
      }
    }
    // Check caption text nodes
    if (child.type === 'TEXT') {
      if (captionPatterns.some(pat => child.characters.startsWith(pat) || child.name.startsWith(pat))) {
        nodesToRemove.push(child);
      }
    }
  }

  for (const node of nodesToRemove) {
    console.log(`[Cleanup] Removing prior artifact: ${node.name} (${node.id})`);
    node.remove();
  }
}
```

---

## 3. Positioning Calculations & Frame Duplication

Clone the original frame without modifying it, and position Alt A and Alt B with exact 200px horizontal spacing:

```javascript
/**
 * Clones and positions Alternative A and Alternative B side-by-side.
 */
async function createAndPositionAlternatives(originalFrame, hypothesisA, hypothesisB) {
  const GAP = 200;
  const CAPTION_OFFSET_Y = 48; // Distance above the frame for hypothesis caption

  // 1. Calculate positions
  const altAX = originalFrame.x + originalFrame.width + GAP;
  const altAY = originalFrame.y;

  const altBX = altAX + originalFrame.width + GAP;
  const altBY = originalFrame.y;

  // 2. Clone frames (Original remains completely untouched)
  const altAFrame = originalFrame.clone();
  altAFrame.name = `Alt A - ${hypothesisA}`;
  altAFrame.x = altAX;
  altAFrame.y = altAY;

  const altBFrame = originalFrame.clone();
  altBFrame.name = `Alt B - ${hypothesisB}`;
  altBFrame.x = altBX;
  altBFrame.y = altBY;

  // 3. Create captions above frames
  await createCaption(altAX, altAY - CAPTION_OFFSET_Y, `Alt A — ${hypothesisA}`);
  await createCaption(altBX, altBY - CAPTION_OFFSET_Y, `Alt B — ${hypothesisB}`);

  return { altAFrame, altBFrame };
}

/**
 * Creates a clean caption text label above an alternative frame.
 */
async function createCaption(x, y, textContent) {
  const textNode = figma.createText();
  
  // Standard system font fallback
  const fontName = { family: "Inter", style: "Medium" };
  try {
    await figma.loadFontAsync(fontName);
    textNode.fontName = fontName;
  } catch (e) {
    const fallbackFont = { family: "Roboto", style: "Medium" };
    await figma.loadFontAsync(fallbackFont);
    textNode.fontName = fallbackFont;
  }

  textNode.characters = textContent;
  textNode.fontSize = 14;
  textNode.lineHeight = { value: 20, unit: 'PIXELS' };
  textNode.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.45, b: 0.5 } }]; // Muted slate
  textNode.x = x;
  textNode.y = y;
  textNode.name = `Caption: ${textContent}`;

  figma.currentPage.appendChild(textNode);
  return textNode;
}
```

---

## 4. Content Census Counter

Extract an exact content census from the original frame to enforce Content Parity:

```javascript
/**
 * Takes an exact census of nodes inside a frame to verify Content Parity.
 */
function takeContentCensus(frame) {
  const census = {
    buttons: 0,
    textNodes: 0,
    images: 0,
    inputs: 0,
    vectors: 0,
    frames: 0,
    totalNodes: 0,
    textSnippets: []
  };

  function traverse(node) {
    census.totalNodes++;

    if (node.type === 'TEXT') {
      census.textNodes++;
      const txt = node.characters.trim();
      if (txt.length > 0 && census.textSnippets.length < 25) {
        census.textSnippets.push(txt);
      }
    } else if (node.type === 'VECTOR') {
      census.vectors++;
    } else if (node.type === 'FRAME' || node.type === 'GROUP') {
      census.frames++;
      // Check if button-like
      if (node.name.toLowerCase().includes('btn') || node.name.toLowerCase().includes('button')) {
        census.buttons++;
      }
      // Check if input-like
      if (node.name.toLowerCase().includes('input') || node.name.toLowerCase().includes('field') || node.name.toLowerCase().includes('search')) {
        census.inputs++;
      }
    } else if (node.type === 'RECTANGLE' && node.fills && node.fills.some(f => f.type === 'IMAGE')) {
      census.images++;
    }

    if ('children' in node) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(frame);
  return census;
}
```

---

## 5. Technical Auto-Layout Manipulation Rules

When modifying layout structures programmatically, observe these rules to prevent layout collapse:

```javascript
/**
 * Safe auto-layout container setup
 */
function setupAutoLayoutContainer(frame, options = {}) {
  // RULE 1: Set layoutMode first before any sizing modes
  frame.layoutMode = options.direction || 'VERTICAL'; // 'VERTICAL' | 'HORIZONTAL'

  // Spacing & Padding
  frame.itemSpacing = options.itemSpacing !== undefined ? options.itemSpacing : 16;
  frame.paddingTop = options.paddingTop !== undefined ? options.paddingTop : 16;
  frame.paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : 16;
  frame.paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : 16;
  frame.paddingRight = options.paddingRight !== undefined ? options.paddingRight : 16;

  // Alignment
  frame.primaryAxisAlignItems = options.primaryAlign || 'MIN';
  frame.counterAxisAlignItems = options.counterAlign || 'MIN';

  // Sizing: Modern shorthand properties
  // Note: Only set after children have been appended if using 'HUG'
  if (options.sizingHorizontal) {
    frame.layoutSizingHorizontal = options.sizingHorizontal; // 'FIXED' | 'HUG' | 'FILL'
  }
  if (options.sizingVertical) {
    frame.layoutSizingVertical = options.sizingVertical; // 'FIXED' | 'HUG' | 'FILL'
  }
}

/**
 * Concentric Border Radius Helper
 * R_outer = R_inner + Padding
 */
function calculateConcentricRadius(innerRadius, padding) {
  return innerRadius + padding;
}
```

---

## 6. Pre-Completion Sanity Audit

Execute automated checks before completing the skill:

```javascript
/**
 * Audits generated alternative frames for zero-width text, collapsed heights, or missing nodes.
 */
function verifyAlternativeFrame(originalFrame, altFrame) {
  const issues = [];

  // Check 1: Dimensions parity
  const heightRatio = altFrame.height / originalFrame.height;
  if (heightRatio < 0.6 || heightRatio > 1.4) {
    issues.push(`Frame height altered significantly: Original=${originalFrame.height}px, Alt=${altFrame.height}px`);
  }

  // Check 2: Contains children
  if (!altFrame.children || altFrame.children.length === 0) {
    issues.push("Alternative frame contains zero children!");
  }

  // Check 3: Zero-width text and collapsed containers
  function checkNode(node) {
    if (node.type === 'TEXT') {
      if (node.width === 0) {
        issues.push(`Text node "${node.characters.substring(0, 15)}..." has 0px width.`);
      }
    }
    if (node.type === 'FRAME' && node.visible) {
      if (node.height === 0 && node.layoutMode !== 'NONE') {
        issues.push(`Frame container "${node.name}" has collapsed to 0px height.`);
      }
    }
    if ('children' in node) {
      for (const child of node.children) {
        checkNode(child);
      }
    }
  }

  checkNode(altFrame);

  if (issues.length > 0) {
    console.error(`Verification warnings for ${altFrame.name}:`, issues);
    return { passed: false, issues };
  }

  return { passed: true, issues: [] };
}
```
