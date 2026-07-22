# Performance Optimization & Accessibility (WCAG 2.2)

## 1. High Performance 60fps / 120fps Rendering Guidelines

To achieve fluid 60fps (16.6ms per frame budget) or 120fps (8.33ms per frame budget), UI motion must run exclusively on the GPU Compositor Thread.

### GPU-Accelerated vs Main-Thread Triggering Properties

| Property Animated | Triggers Layout? | Triggers Paint? | Composite Only? | Performance Rating |
| :--- | :--- | :--- | :--- | :--- |
| `transform` (`translate`, `scale`, `rotate`) | ❌ No | ❌ No | ✅ YES | 🚀 EXTREMELY FAST (GPU) |
| `opacity` | ❌ No | ❌ No | ✅ YES | 🚀 EXTREMELY FAST (GPU) |
| `width` / `height` | ⚠️ YES | ⚠️ YES | ❌ No | 🐢 SLOW (Forced Reflow) |
| `top` / `left` / `margin` / `padding` | ⚠️ YES | ⚠️ YES | ❌ No | 🐢 SLOW (Forced Reflow) |
| `box-shadow` / `border-radius` | ❌ No | ⚠️ YES | ❌ No | 🐢 SLOW (Frame Repaint) |
| `filter` (`blur`, `drop-shadow`) | ❌ No | ⚠️ YES | ⚠️ Partial | ⚠️ High VRAM GPU Overhead |

---

## 2. Chrome DevTools Performance Audit Blueprint

1. **Detecting Forced Synchronous Layouts (Layout Thrashing):**
   - Open DevTools $\to$ Performance tab $\to$ Record interaction.
   - Look for red triangles on frame bars with warning: *"Forced reflow / Layout thrashing"*.
   - *Fix:* Ensure all DOM measurements (`getBoundingClientRect()`, `offsetHeight`) occur BEFORE any inline style updates (`element.style.transform = ...`).

2. **Managing GPU Layer Promotion (`will-change`):**
   - Apply `will-change: transform, opacity` ONLY during active pointer hover or transition states.
   - Remove `will-change` immediately upon animation completion.
   - Never apply `will-change` globally to container elements (`* { will-change: transform }` causes severe GPU VRAM memory exhaustion).

---

## 3. Accessibility & WCAG 2.2 Compliance

Motion without accessibility controls causes motion sickness, nausea, and disorientation for users with vestibular disorders.

### WCAG 2.2 Success Criteria Breakdown

1. **SC 2.3.3 Animation from Interactions (Level AAA):**
   - User-triggered motion (click, hover, scroll) that is non-essential MUST allow user opt-out or automatically honor OS motion preferences.
2. **SC 2.2.2 Pause, Stop, Hide (Level A):**
   - Automatically playing, looping motion lasting longer than 5 seconds MUST provide an accessible pause/stop mechanism.
3. **SC 2.3.1 Three Flashes or Below Threshold (Level A):**
   - UI motion must never flash more than 3 times per second to prevent photosensitive epileptic seizures.

---

## 4. `prefers-reduced-motion` Implementation Strategies

Always provide a graceful fallback for reduced motion preferences.

### A. CSS Media Query Fallback Pattern

```css
/* Standard Animation */
.card-transition {
  transition: transform 250ms cubic-bezier(0.0, 0.0, 0.2, 1), opacity 250ms ease;
}

/* Reduced Motion Fallback: Replace spatial movement with opacity cross-fade */
@media (prefers-reduced-motion: reduce) {
  .card-transition {
    transition: opacity 150ms linear !important;
    transform: none !important;
    animation: none !important;
  }
}
```

### B. Framer Motion React Accessibility Hook

```jsx
import { useReducedMotion, motion } from 'framer-motion';

export function AccessibleCard({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const animationVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: shouldReduceMotion ? 0.1 : 0.25,
        ease: "easeOut"
      } 
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={animationVariants}>
      {children}
    </motion.div>
  );
}
```

### C. JavaScript Window MatchMedia Check

```javascript
export function getMotionPreference() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches; // returns true if user requested reduced motion
}
```

---

## 5. UI Motion Anti-Patterns Checklist

- ❌ Never animate `width`, `height`, `top`, or `left` during user scroll or hover transitions.
- ❌ Never use linear easing (`cubic-bezier(0, 0, 1, 1)`) for UI component movement (feels robotic).
- ❌ Never set duration $> 400\text{ms}$ for primary micro-interactions (feels laggy).
- ❌ Never ignore keyboard focus rings during animated state transitions.
