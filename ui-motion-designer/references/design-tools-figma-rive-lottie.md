# Design Tools Motion: Figma Smart Animate, Rive & Lottie

## 1. Figma Smart Animate & Figma MCP Integration

Figma Smart Animate creates seamless transitions between matching layers across frames or component variants. Using **Figma MCP** (`use_figma`, `get_design_context`, `get_metadata`), the agent can inspect, design, and configure Figma motion directly in Figma.

### A. Smart Animate Layer Matching Rules
Smart Animate morphs elements based on **Layer Name** and **Hierarchy Match**.
- **Prefix Matching:** Maintain identical layer names across frame states (e.g. `Card/Container`, `Card/Title`, `Card/Thumbnail`).
- **Group vs Frame Matching:** Ensure layer types match (Frame to Frame, Group to Group, Vector to Vector).
- **Opacity Fade for Unmatched Layers:** Unmatched layers fade in or out rather than morphing spatially.
- **Shared Element Morphing in Figma:** Keep container dimensions auto-layout responsive so Smart Animate scales bounding boxes smoothly.

### B. Figma MCP Prototyping Script via `use_figma`

Use the `use_figma` MCP tool to programmatically create interactive component variants and prototype connections inside Figma:

```javascript
// Example JavaScript executed inside Figma via use_figma MCP tool
// Sets up Smart Animate prototype reactions on Component Variants
const componentSet = figma.currentPage.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Button');

if (componentSet) {
  const defaultVariant = componentSet.children.find(v => v.name.includes('State=Default'));
  const hoverVariant = componentSet.children.find(v => v.name.includes('State=Hover'));
  const pressedVariant = componentSet.children.find(v => v.name.includes('State=Pressed'));

  if (defaultVariant && hoverVariant) {
    // Add While Hovering reaction -> Smart Animate to Hover Variant
    defaultVariant.reactions = [{
      trigger: { type: 'ON_HOVER' },
      actions: [{
        type: 'NODE',
        destinationId: hoverVariant.id,
        navigation: 'CHANGE_TO',
        transition: {
          type: 'SMART_ANIMATE',
          easing: { type: 'EASE_OUT' }, // Or CUSTOM_CUBIC_BEZIER / SPRING
          duration: 0.2 // 200ms
        }
      }]
    }];
  }

  if (hoverVariant && pressedVariant) {
    // Add While Pressing reaction -> Smart Animate to Pressed Variant
    hoverVariant.reactions = [{
      trigger: { type: 'ON_PRESS' },
      actions: [{
        type: 'NODE',
        destinationId: pressedVariant.id,
        navigation: 'CHANGE_TO',
        transition: {
          type: 'SMART_ANIMATE',
          easing: { type: 'SPRING', stiffness: 400, damping: 25 },
          duration: 0.15
        }
      }]
    }];
  }
}
```

---

## 2. Rive Interactive Motion & State Machines

Rive provides real-time, interactive, vector-based animations governed by State Machines.

### A. Rive State Machine Architecture
- **Inputs:**
  - `Trigger`: One-shot event (e.g. `onSuccess`, `onFire`).
  - `Boolean`: Binary state toggle (e.g. `isHovered`, `isDarkMode`).
  - `Number`: Continuous state value (e.g. `scrollProgress`, `cursorX`).
- **Layers & Bone Constraints:** Use bone chains for fluid character / UI skeletal deformations.

### B. React Rive Implementation Blueprint (`@rive-app/react-canvas`)

```jsx
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export function InteractiveRiveToggle() {
  const STATE_MACHINE_NAME = "Toggle_StateMachine";
  const INPUT_NAME = "isToggled";

  const { rive, RiveComponent } = useRive({
    src: '/assets/animations/toggle.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  const isToggledInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  const handleToggle = () => {
    if (isToggledInput) {
      isToggledInput.value = !isToggledInput.value;
    }
  };

  return (
    <div onClick={handleToggle} className="w-24 h-12 cursor-pointer">
      <RiveComponent />
    </div>
  );
}
```

---

## 3. Lottie & dotLottie Micro-Animation Specs

Lottie parses vector animations exported from After Effects (Bodymovin) or Figma (Lottie plugin) into JSON/dotLottie payloads.

### A. Optimization Standards for Lottie Payload
- **Path Complexity:** Keep vector anchor points below 50 per shape layer.
- **Unsupported Effects:** Avoid AE native drop shadows, blurs, Gaussian filters, or 3D camera layers (use vector shapes or CSS shadows instead).
- **Payload Format:** Prefer `.lottie` (dotLottie compressed binary) over `.json` for up to 80% smaller bundle size.

### B. React `@dotlottie/react-player` & Interactivity Integration

```jsx
import { DotLottiePlayer, Controls } from '@dotlottie/react-player';

export function SuccessCheckmarkAnimation() {
  return (
    <div className="w-32 h-32">
      <DotLottiePlayer
        src="/assets/animations/success_check.lottie"
        autoplay
        loop={false}
        speed={1}
      >
        <Controls />
      </DotLottiePlayer>
    </div>
  );
}
```

### C. Scroll-Synced Lottie Interactivity (`lottie-web`)

```javascript
import lottie from 'lottie-web';

export function initScrollSyncedLottie(containerElement) {
  const anim = lottie.loadAnimation({
    container: containerElement,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/assets/animations/scroll_hero.json'
  });

  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const targetFrame = Math.floor(scrollPercent * anim.totalFrames);
    anim.goToAndStop(targetFrame, true);
  });
}
```

---

## 4. Format Selection Decision Matrix

| Tool / Format | Best Used For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Figma Smart Animate** | Prototyping UI flows, interactive component states, handoff specs | Integrated directly in Figma, zero code needed for design review | Limited to Figma prototype engine |
| **Rive** | Complex interactive micro-interactions, stateful vector UI assets | Ultra lightweight ($< 50\text{KB}$ runtime), 60fps vector physics, interactive state machine | Requires Rive editor knowledge |
| **Lottie / dotLottie**| Brand illustrations, complex vector loading icons, success animations | Direct AE / Figma export, widespread browser and native app support | High frame count JSON can be large if unoptimized |
| **Framer Motion / WAAPI**| Native React/JS web component transitions, FLIP layouts, page routes | Native web DOM integration, accessible `prefers-reduced-motion` | Web specific |
