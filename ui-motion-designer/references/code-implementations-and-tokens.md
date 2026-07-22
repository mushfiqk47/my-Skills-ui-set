# Code Implementations & Motion Tokens Architecture

## 1. Design System Motion Tokens Schema (W3C DTCG Standard)

```json
{
  "motion": {
    "duration": {
      "fast": { "$value": "150ms", "$type": "duration", "$description": "Micro-interactions and toggles" },
      "standard": { "$value": "250ms", "$type": "duration", "$description": "Dropdowns, modals, and tab swaps" },
      "expressive": { "$value": "400ms", "$type": "duration", "$description": "Full page transitions and drawers" }
    },
    "easing": {
      "ease-out": { "$value": "cubic-bezier(0.0, 0.0, 0.2, 1)", "$type": "cubicBezier" },
      "ease-in": { "$value": "cubic-bezier(0.4, 0.0, 1, 1)", "$type": "cubicBezier" },
      "emphasized": { "$value": "cubic-bezier(0.05, 0.7, 0.1, 1.0)", "$type": "cubicBezier" }
    },
    "spring": {
      "snappy": {
        "$value": { "stiffness": 400, "damping": 30, "mass": 1.0 },
        "$type": "physics"
      },
      "smooth": {
        "$value": { "stiffness": 300, "damping": 25, "mass": 1.0 },
        "$type": "physics"
      }
    }
  }
}
```

---

## 2. Framer Motion (React / Next.js) Production Blueprint

### A. Shared Element Morph (`layoutId`) & Staggered List

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] }
  }
};

export function InteractiveCardGrid({ items }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-container-${item.id}`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedId(item.id)}
            className="p-4 bg-white rounded-xl shadow-md cursor-pointer"
          >
            <motion.h3 layoutId={`card-title-${item.id}`}>{item.title}</motion.h3>
          </motion.div>
        ))}
      </motion.div>

      {/* Full-Screen Shared Element Modal Morph */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50"
          >
            <motion.div
              layoutId={`card-container-${selectedId}`}
              className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl"
            >
              <motion.h3 layoutId={`card-title-${selectedId}`} className="text-2xl font-bold">
                {items.find(i => i.id === selectedId)?.title}
              </motion.h3>
              <p className="mt-4 text-gray-600">Full detailed modal view expanded smoothly via layoutId shared morph.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## 3. Pure CSS Modern `@starting-style` & Discrete Animations

Animate `display: none` directly in modern CSS without requiring JavaScript mount states:

```css
:root {
  --dur-std: 250ms;
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
}

/* Modal Dialog Entry from display: none */
.dialog-popover {
  display: none;
  opacity: 0;
  transform: scale(0.95) translateY(12px);
  transition: 
    opacity var(--dur-std) var(--ease-out),
    transform var(--dur-std) var(--ease-out),
    display var(--dur-std) allow-discrete;
}

.dialog-popover:popover-open {
  display: block;
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Starting style defines entry baseline before element mounts */
@starting-style {
  .dialog-popover:popover-open {
    opacity: 0;
    transform: scale(0.95) translateY(12px);
  }
}
```

---

## 4. GSAP Timeline & SVG Path Morphing

```javascript
import gsap from 'gsap';

export function animateIconToggle(iconPathRef, isChecked) {
  const checkPath = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
  const crossPath = "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";

  gsap.to(iconPathRef.current, {
    duration: 0.3,
    attr: { d: isChecked ? checkPath : crossPath },
    ease: "power2.out"
  });
}
```

---

## 5. Tailwind CSS Motion Utility System

```html
<!-- Micro-interaction Button with Spring Feeling -->
<button class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md transition-transform duration-200 ease-[cubic-bezier(0,0,0.2,1)] hover:scale-105 active:scale-95 will-change-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
  Confirm Action
</button>
```
