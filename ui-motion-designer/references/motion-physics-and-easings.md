# UI Motion Physics, Easing Curves & Timing Specifications

## 1. Timing & Duration Guidelines

Duration must scale dynamically based on the physical distance traveled and visual surface area of the moving element.

| Motion Scale | Duration Bounds | UX Use Case | Ideal Motion Physics / Easing |
| :--- | :--- | :--- | :--- |
| **Micro (Feedback)** | 100ms – 180ms | Toggles, button presses, tooltips, checkboxes, icon morphs | Fast Ease-Out (`cubic-bezier(0, 0, 0.2, 1)`) or Snappy Spring |
| **Standard (Small)** | 200ms – 300ms | Dropdown opens, modal dialogs, tab switches, card expansions | Standard Ease-Out or Smooth Spring |
| **Complex (Large)** | 350ms – 500ms | Full-screen page transitions, multi-step wizards, side drawers | Emphasized Deceleration / Fluid Spring |
| **Continuous (System)** | 800ms – 1400ms | Infinite spinners, skeleton pulse loaders | Linear (`cubic-bezier(0, 0, 1, 1)`) / Sine |

---

## 2. Easing Curves & Cubic-Bezier Math

Easing determines how velocity changes over time. Always prefer deceleration for user-triggered entries.

### Standard Industry Curve Definitions

```css
/* Standard Ease-Out (Decelerate): Entry of elements */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1.0);

/* Standard Ease-In (Accelerate): Permanent exit of elements */
--ease-in: cubic-bezier(0.4, 0.0, 1.0, 1.0);

/* Standard Ease-In-Out: On-screen point A to point B movement */
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1.0);

/* Material Design 3 Emphasized Decelerate */
--md3-emphasized-out: cubic-bezier(0.05, 0.7, 0.1, 1.0);

/* Apple HIG Fluid Transition */
--apple-fluid-out: cubic-bezier(0.16, 1.0, 0.3, 1.0);
```

---

## 3. Spring Physics Mathematical Model & Parameters

Spring physics models real-world spring mechanics using the second-order differential equation:

$$m \frac{d^2 x}{dt^2} + c \frac{dx}{dt} + k x = 0$$

Where:
- **$m$ (Mass):** Weight of the UI element. Higher mass increases inertia and prolongs acceleration/deceleration.
- **$k$ (Stiffness):** Rigidity of the spring force. Higher stiffness increases responsiveness and speed.
- **$c$ (Damping):** Resistance force dissipating energy. Controls how fast oscillations settle.

### Damping Ratio ($\zeta$) & Behavioral Classification

$$\zeta = \frac{c}{2 \sqrt{k \cdot m}}$$

1. **Underdamped ($\zeta < 1.0$):** Element overshoots the target and bounces back before coming to rest. Ideal for playful micro-interactions.
2. **Critically Damped ($\zeta = 1.0$):** Element reaches the target as quickly as physically possible without any overshoot. Ideal for precise productivity UI.
3. **Overdamped ($\zeta > 1.0$):** Element slowly approaches target without bouncing, feeling viscous or heavy.

### Standard UI Spring Presets

| Preset | Stiffness ($k$) | Damping ($c$) | Mass ($m$) | Damping Ratio ($\zeta$) | Bounce | Typical Application |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Snappy Touch** | `400` | `30` | `1.0` | `0.75` | Low (`0.1`) | Buttons, Toggles, Active Press |
| **Smooth UI** | `300` | `25` | `1.0` | `0.72` | Minimal (`0.05`) | Modals, Dropdowns, Card Expand |
| **Gentle Fluid** | `180` | `20` | `1.0` | `0.74` | None (`0.0`) | Page transitions, drawers |
| **Bouncy Expressive** | `500` | `18` | `1.0` | `0.40` | High (`0.35`) | Success badges, playful notifications |

---

## 4. Pure CSS Spring Approximation with `linear()`

Modern CSS supports physics-based spring curves directly in standard CSS using the `linear()` timing function:

```css
:root {
  /* Snappy Spring Approximation in CSS linear() */
  --css-spring-snappy: linear(
    0, 0.009, 0.035, 0.078, 0.136, 0.207, 0.29, 0.381, 0.478, 0.578, 
    0.678, 0.774, 0.862, 0.938, 1, 1.042, 1.066, 1.074, 1.069, 1.054, 
    1.033, 1.011, 0.994, 0.984, 0.98, 0.982, 0.988, 0.995, 1
  );
}

.button-press {
  transition: transform 350ms var(--css-spring-snappy);
}
```

---

## 5. Graph Editor Easing Curve Curve Specs

When tuning curves in design tools (Figma, After Effects, Rive):
- **X-axis:** Normalized Time ($0.0 \to 1.0$).
- **Y-axis:** Normalized Position ($0.0 \to 1.0$).
- **Steep initial slope ($dy/dx > 3.0$):** Provides instant response to user click/tap.
- **Prolonged tail ($dy/dx \to 0$ over final 40% of time):** Ensures smooth, elegant settlement without abrupt stops.
