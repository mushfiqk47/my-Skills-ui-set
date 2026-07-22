# Figma MCP Prototyping & $2,000 Senior Motion Designer Showcase Automation

## 1. The $2,000 Motion Designer Benchmark

Top-tier Motion Designers (Apple product launches, Linear app UI, Stripe dashboards) achieve hyper-polished showcase videos by adhering to 5 core rules:

1. **Contextual Spatial Continuity:** UI elements never pop into existence arbitrarily; they morph outward from their exact touch point or source anchor.
2. **Camera Panning & Depth Zoom (Simulated 3D):** Scaling background containers ($1.0 \to 1.25$) while translating focal content ($Y: 0 \to -40\text{px}$) to simulate camera dolly moves inside Figma 2D space.
3. **Layer Name Prefix Matching:** 100% layer name parity across all transition frames (`#Hero/Container`, `#Hero/Title`, `#Hero/Badge`).
4. **Spring Physics Calibration:** Custom spring mechanics ($k=300–400$, $c=25–30$, $m=1.0$) providing snappiness without jitter.
5. **Chained Showcase Playback (`AFTER_DELAY` Sequences):** Linking 3–6 keyframe frames using zero-click `AFTER_DELAY` triggers so the prototype plays as an automated, cinematic 3–5 second showcase video inside Figma.

---

## 2. Complete Figma Plugin API Reference (`setReactionsAsync`)

When executing motion via `use_figma`, use `setReactionsAsync()` to programmatically link frames or component variants.

### A. Smart Animate with Custom Spring Physics ($k, c, m$)

```javascript
// Programmatic Smart Animate with Custom Spring Easing
async function linkFrameWithSpring(sourceNode, destinationFrame, triggerType = 'ON_CLICK', delayMs = 0) {
  const reaction = {
    trigger: triggerType === 'AFTER_DELAY' 
      ? { type: 'AFTER_DELAY', timeout: delayMs / 1000 } 
      : { type: triggerType },
    actions: [{
      type: 'NODE',
      destinationId: destinationFrame.id,
      navigation: sourceNode.type === 'COMPONENT' || sourceNode.parent?.type === 'COMPONENT_SET' 
        ? 'CHANGE_TO' 
        : 'NAVIGATE',
      transition: {
        type: 'SMART_ANIMATE',
        duration: 0.4, // Duration in seconds
        easing: {
          type: 'CUSTOM_SPRING',
          easingFunctionSpring: {
            mass: 1.0,
            stiffness: 350.0,
            damping: 26.0,
            initialVelocity: 0.0
          }
        }
      }
    }]
  };

  await sourceNode.setReactionsAsync([reaction]);
}
```

### B. Smart Animate with Custom Cubic Bezier Easing

```javascript
// Programmatic Smart Animate with Custom Cubic Bezier (Material 3 / Apple Emphasized Out)
async function linkFrameWithBezier(sourceNode, destinationFrame, triggerType = 'AFTER_DELAY', delayMs = 800) {
  const reaction = {
    trigger: { 
      type: 'AFTER_DELAY', 
      timeout: delayMs / 1000 // Convert ms to seconds for API
    },
    actions: [{
      type: 'NODE',
      destinationId: destinationFrame.id,
      navigation: 'NAVIGATE',
      transition: {
        type: 'SMART_ANIMATE',
        duration: 0.35,
        easing: {
          type: 'CUSTOM_CUBIC_BEZIER',
          easingFunctionCubicBezier: {
            x1: 0.05, // Emphasized deceleration start
            y1: 0.70,
            x2: 0.10,
            y2: 1.00  // Smooth settlement end
          }
        }
      }
    }]
  };

  await sourceNode.setReactionsAsync([reaction]);
}
```

---

## 3. Automated 4-Frame Cinematic Showcase Script (`use_figma`)

This script can be executed directly by Claude Code using `use_figma` to automate a complete 4-frame cinematic UI showcase sequence in Figma:

```javascript
// Complete automated Figma motion sequence builder executed via use_figma MCP
(async () => {
  const page = figma.currentPage;
  
  // Find keyframes by frame name conventions: #Keyframe/1, #Keyframe/2, #Keyframe/3, #Keyframe/4
  const kf1 = page.findOne(n => n.name === '#Keyframe/1' || n.name === 'Keyframe 1');
  const kf2 = page.findOne(n => n.name === '#Keyframe/2' || n.name === 'Keyframe 2');
  const kf3 = page.findOne(n => n.name === '#Keyframe/3' || n.name === 'Keyframe 3');
  const kf4 = page.findOne(n => n.name === '#Keyframe/4' || n.name === 'Keyframe 4');

  if (!kf1 || !kf2 || !kf3 || !kf4) {
    return "Error: Ensure 4 frames named '#Keyframe/1', '#Keyframe/2', '#Keyframe/3', '#Keyframe/4' exist on the page.";
  }

  // 1. Frame 1 -> Frame 2 (After 600ms Delay: Hero Zoom & Container Expansion via Smooth Spring)
  await kf1.setReactionsAsync([{
    trigger: { type: 'AFTER_DELAY', timeout: 0.6 },
    actions: [{
      type: 'NODE',
      destinationId: kf2.id,
      navigation: 'NAVIGATE',
      transition: {
        type: 'SMART_ANIMATE',
        duration: 0.45,
        easing: {
          type: 'CUSTOM_SPRING',
          easingFunctionSpring: { mass: 1, stiffness: 320, damping: 24, initialVelocity: 0 }
        }
      }
    }]
  }]);

  // 2. Frame 2 -> Frame 3 (After 1200ms Delay: Staggered Content Cascade & Detail Reveal)
  await kf2.setReactionsAsync([{
    trigger: { type: 'AFTER_DELAY', timeout: 1.2 },
    actions: [{
      type: 'NODE',
      destinationId: kf3.id,
      navigation: 'NAVIGATE',
      transition: {
        type: 'SMART_ANIMATE',
        duration: 0.35,
        easing: {
          type: 'CUSTOM_CUBIC_BEZIER',
          easingFunctionCubicBezier: { x1: 0.05, y1: 0.7, x2: 0.1, y2: 1.0 }
        }
      }
    }]
  }]);

  // 3. Frame 3 -> Frame 4 (After 1500ms Delay: Micro-interaction Feedback & Active State Scale)
  await kf3.setReactionsAsync([{
    trigger: { type: 'AFTER_DELAY', timeout: 1.5 },
    actions: [{
      type: 'NODE',
      destinationId: kf4.id,
      navigation: 'NAVIGATE',
      transition: {
        type: 'SMART_ANIMATE',
        duration: 0.25,
        easing: {
          type: 'CUSTOM_SPRING',
          easingFunctionSpring: { mass: 1, stiffness: 450, damping: 28, initialVelocity: 0 }
        }
      }
    }]
  }]);

  // 4. Frame 4 -> Frame 1 (After 2000ms Delay: Loop back to starting frame to create infinite showcase video loop)
  await kf4.setReactionsAsync([{
    trigger: { type: 'AFTER_DELAY', timeout: 2.0 },
    actions: [{
      type: 'NODE',
      destinationId: kf1.id,
      navigation: 'NAVIGATE',
      transition: {
        type: 'SMART_ANIMATE',
        duration: 0.5,
        easing: {
          type: 'CUSTOM_CUBIC_BEZIER',
          easingFunctionCubicBezier: { x1: 0.4, y1: 0, x2: 0.2, y2: 1 }
        }
      }
    }]
  }]);

  return "Success: Automated 4-frame cinematic Figma Smart Animate showcase loop successfully created!";
})();
```

---

## 4. Figma Layer Structure Audit Checklist for Flawless Smart Animate

Before running `setReactionsAsync`, execute this layer audit using `get_metadata` or `use_figma`:

- [ ] **Identical Node Names:** Corresponding vector, text, and container layers MUST have identical names across keyframes (e.g. `Card/Background`, `Card/Title`, `Card/Image`).
- [ ] **Matching Layer Hierarchy:** Tree depth must match. Do not wrap a layer in a new Group on Frame 2 if it was a direct child of Frame 1.
- [ ] **Auto Layout Constraints:** Set Auto Layout fill/hug parameters consistently so Smart Animate interpolates width and height changes fluidly.
- [ ] **Cloned Frames with Property Modifications:** Always generate Keyframe 2, 3, 4 by *duplicating* Keyframe 1 and altering position/scale/opacity/fill properties, preserving internal node IDs.
