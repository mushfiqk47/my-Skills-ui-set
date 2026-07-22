# Choreography, Spatial Continuity & Layout Transitions

## 1. Principles of UI Choreography

Choreography dictates how multiple UI elements transition in sync to maintain visual hierarchy and prevent visual overload.

### Core Choreography Rules
1. **Staggering (Cascading Entrance):**
   - Offset entry start times of child list items by `30ms – 50ms`.
   - *Rule of Cap:* Max cumulative stagger delay across an entire container MUST NOT exceed `250ms`. Limit active staggering to the first 6–8 visible items in the viewport.
   - *Direction:* Stagger follows reading order (top-to-bottom, left-to-right) or radiates outward from the interaction focal point.

2. **Parenting & Focal Anchoring:**
   - Container/Parent moves first; child content enters with a minor relative delay.
   - Example: An expanding card container scales to target size first, then text and images fade into place.

3. **Spatial Continuity & Directional Flow:**
   - Drill-down transitions move screens leftwards ($X: 0 \to -30\%$, child enters from $X: 100\% \to 0$).
   - Back navigation moves screens rightwards ($X: 0 \to 100\%$, parent enters from $X: -30\% \to 0$).
   - Modals and Sheets originate from their trigger button or screen bottom ($Y: 100\% \to 0$).

---

## 2. Production FLIP Animation Blueprint (JavaScript)

FLIP (*First, Last, Invert, Play*) converts expensive DOM layout mutations (`width`, `height`, `top`, `left`, grid reordering) into performant GPU `transform` animations.

```javascript
/**
 * Executes a high-performance FLIP animation on a DOM element.
 * @param {HTMLElement} element - Target DOM element moving layout position
 * @param {Function} changeLayoutState - Callback function executing the DOM layout change
 * @param {Object} options - Animation options (duration, easing)
 */
export function animateFLIP(element, changeLayoutState, options = {}) {
  const duration = options.duration || 300;
  const easing = options.easing || 'cubic-bezier(0.0, 0.0, 0.2, 1)';

  // 1. FIRST: Record initial bounding rect
  const first = element.getBoundingClientRect();

  // 2. LAST: Execute DOM mutation and record new bounding rect
  changeLayoutState();
  const last = element.getBoundingClientRect();

  // 3. INVERT: Calculate delta transformation
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;
  const deltaW = first.width / (last.width || 1);
  const deltaH = first.height / (last.height || 1);

  // Apply inverted transform immediately without animation
  element.style.transformOrigin = 'top left';
  element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
  element.style.transition = 'none';

  // Force DOM reflow to apply inverted inline styles
  element.offsetHeight; 

  // 4. PLAY: Remove transform and transition to final state on GPU thread
  element.style.transition = `transform ${duration}ms ${easing}`;
  element.style.transform = 'none';

  // Clean up inline styles after completion
  element.addEventListener('transitionend', function cleanup() {
    element.style.transition = '';
    element.style.transformOrigin = '';
    element.removeEventListener('transitionend', cleanup);
  });
}
```

---

## 3. View Transitions API Integration

Native browser View Transitions API provides seamless cross-document or single-page view transitions.

```javascript
// JavaScript invocation with feature detection fallback
export function navigateWithTransition(updateDOMCallback) {
  if (!document.startViewTransition) {
    updateDOMCallback();
    return;
  }
  document.startViewTransition(() => updateDOMCallback());
}
```

```css
/* View Transitions Styling in CSS */
::view-transition-old(hero-card),
::view-transition-new(hero-card) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

/* Custom view transition name assignment */
.card-thumbnail {
  view-transition-name: hero-card;
}
```

---

## 4. Complete Component Transition Matrix

| Component Type | Entrance Choreography | Exit Choreography | Stagger & Overlap Rules |
| :--- | :--- | :--- | :--- |
| **Modal Dialog** | Scale $0.95 \to 1.0$ + Fade opacity $0 \to 1$ | Fade opacity $1 \to 0$ + Scale $1.0 \to 0.98$ | Backdrop fades in 50ms prior to modal dialog scale |
| **Bottom Sheet** | Slide up $Y: 100\% \to 0$ | Slide down $Y: 0 \to 100\%$ | Exit is 25% faster than entrance duration |
| **List Deletion** | Target fades out + scales $Y: 1 \to 0$ | Surrounding items FLIP up to fill space | FLIP starts simultaneously with fade out |
| **Accordion / Collapsible**| Height expand via FLIP + opacity fade in | Opacity fade out + height collapse | Children fade in after height reaches 50% |
| **Tab Switch Panel** | Active panel fades in + horizontal slide 16px | Previous panel fades out immediately | Cross-fade or non-overlapping panel swap |
