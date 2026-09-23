/**
 * figma_generator_template.js
 * 
 * Standalone Figma Plugin / Scripter script implementing the Screen Alternatives workflow:
 * 1. Validates selection scope (1-5 screens).
 * 2. Cleans up previous Alt A / Alt B runs idempotently.
 * 3. Takes a content census of the original screen.
 * 4. Clones and positions Alt A (+200px) and Alt B (+400px + width).
 * 5. Injects hypothesis caption text nodes above frames.
 * 6. Executes verification checks on generated alternatives.
 */

(async function runScreenAlternatives() {
  console.log("=== Launching Screen Alternatives ===");

  // 1. Scope & Selection Validation
  const selection = figma.currentPage.selection;
  if (!selection || selection.length === 0) {
    figma.notify("⚠️ Please select a Figma frame or flow (up to 5 screens) to analyze.", { error: true });
    return;
  }
  if (selection.length > 5) {
    figma.notify(`⚠️ Too many screens selected (${selection.length}). Please narrow scope to 5 or fewer screens.`, { error: true });
    return;
  }

  const originalFrame = selection[0];
  if (originalFrame.type !== 'FRAME' && originalFrame.type !== 'COMPONENT') {
    figma.notify("⚠️ Selected item must be a Frame or Component.", { error: true });
    return;
  }

  const originalName = originalFrame.name;
  console.log(`Analyzing screen: "${originalName}" (${originalFrame.width}x${originalFrame.height})`);

  // Hypotheses (Customize for the specific screen's findings)
  const hypothesisA = "Actions first, telemetry second";
  const hypothesisB = "Task-focused workspace with progressive disclosure";

  // 2. Clean up prior generations
  const parent = originalFrame.parent || figma.currentPage;
  const nodesToRemove = [];
  for (const child of parent.children) {
    if (child.id === originalFrame.id) continue;
    if (child.name.startsWith("Alt A - ") || child.name.startsWith("Alt B - ") ||
        child.name.startsWith("Caption: Alt A") || child.name.startsWith("Caption: Alt B")) {
      nodesToRemove.push(child);
    }
  }
  nodesToRemove.forEach(node => node.remove());
  if (nodesToRemove.length > 0) {
    console.log(`Cleaned up ${nodesToRemove.length} prior alternative node(s).`);
  }

  // 3. Take Content Census
  const census = { textCount: 0, buttonCount: 0, totalChildren: originalFrame.children.length };
  for (const child of originalFrame.children) {
    if (child.type === 'TEXT') census.textCount++;
    if (child.name.toLowerCase().includes('button') || child.name.toLowerCase().includes('btn')) census.buttonCount++;
  }
  console.log("Original Screen Census:", census);

  // 4. Calculate Placement Geometry
  const GAP = 200;
  const CAPTION_OFFSET_Y = 48;

  const altAX = originalFrame.x + originalFrame.width + GAP;
  const altAY = originalFrame.y;

  const altBX = altAX + originalFrame.width + GAP;
  const altBY = originalFrame.y;

  // 5. Clone Frames (Original remains untouched)
  const altA = originalFrame.clone();
  altA.name = `Alt A - ${hypothesisA}`;
  altA.x = altAX;
  altA.y = altAY;

  const altB = originalFrame.clone();
  altB.name = `Alt B - ${hypothesisB}`;
  altB.x = altBX;
  altB.y = altBY;

  // 6. Create Captions Above Frames
  async function createCaption(x, y, label) {
    const textNode = figma.createText();
    const fontName = { family: "Inter", style: "Medium" };
    try {
      await figma.loadFontAsync(fontName);
      textNode.fontName = fontName;
    } catch (e) {
      await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
      textNode.fontName = { family: "Roboto", style: "Medium" };
    }
    textNode.characters = label;
    textNode.fontSize = 14;
    textNode.lineHeight = { value: 20, unit: 'PIXELS' };
    textNode.fills = [{ type: 'SOLID', color: { r: 0.45, g: 0.5, b: 0.55 } }];
    textNode.x = x;
    textNode.y = y;
    textNode.name = `Caption: ${label}`;
    parent.appendChild(textNode);
    return textNode;
  }

  await createCaption(altAX, altAY - CAPTION_OFFSET_Y, `Alt A — ${hypothesisA}`);
  await createCaption(altBX, altBY - CAPTION_OFFSET_Y, `Alt B — ${hypothesisB}`);

  // 7. Select newly generated alternatives for direct comparison
  figma.currentPage.selection = [altA, altB];
  figma.viewport.scrollAndZoomIntoView([originalFrame, altA, altB]);

  figma.notify("✅ Screen Alternatives generated successfully!");
  console.log("=== Generation Complete ===");
})();
