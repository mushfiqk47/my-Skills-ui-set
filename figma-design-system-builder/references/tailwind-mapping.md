# Mapping Design Tokens to Tailwind CSS

This guide provides precise mapping specifications to translate standardized W3C design tokens into Tailwind CSS (v3 and v4 compatibility formats) and theme-swappable CSS Custom Properties.

---

## 1. Multi-Theme CSS Variables Architecture

To enable run-time switching of styles (e.g., Light and Dark modes) without rewriting component classes, map semantic tokens to CSS Custom Properties.

Generate a single stylesheet `variables.css` that loads colors and dimensions relative to active themes:

```css
/* variables.css */
@theme {
  /* Tailwind v4 CSS configuration directives will sit here if using v4 */
}

:root {
  /* Primitive Tokens (Shared) */
  --color-primitive-blue-500: #3B82F6;
  --color-primitive-blue-300: #93C5FD;
  --color-primitive-slate-50: #F8FAFC;
  --color-primitive-slate-900: #0F172A;

  /* Typography Scales */
  --font-sans: 'Inter', system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;

  /* Spacing Scale */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;

  /* Radii Scale */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Semantic Default (Light Mode) */
  --color-bg-default: var(--color-primitive-slate-50);
  --color-text-primary: var(--color-primitive-slate-900);
  --color-brand-primary: var(--color-primitive-blue-500);
}

/* Dark Mode Theme Definition */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-default: var(--color-primitive-slate-900);
    --color-text-primary: var(--color-primitive-slate-50);
    --color-brand-primary: var(--color-primitive-blue-300);
  }
}

/* Explicit Dark Mode Trigger override */
[data-theme="dark"] {
  --color-bg-default: var(--color-primitive-slate-900);
  --color-text-primary: var(--color-primitive-slate-50);
  --color-brand-primary: var(--color-primitive-blue-300);
}
```

---

## 2. Generating the Theme Config

### 2.1. Tailwind CSS v3 Config (`tailwind.config.js`)
Map the theme extensions to the compiled CSS variables generated in Step 1. Ensure keys map logically so developers retain standard utility autocomplete.

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          default: 'var(--color-bg-default)',
        },
        text: {
          primary: 'var(--color-text-primary)',
        },
        brand: {
          primary: 'var(--color-brand-primary)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      spacing: {
        '1': 'var(--spacing-1)',
        '2': 'var(--spacing-2)',
        '4': 'var(--spacing-4)',
        '6': 'var(--spacing-6)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      }
    },
  },
  plugins: [],
}
```

### 2.2. Tailwind CSS v4 CSS Configuration
In Tailwind v4, configuration occurs directly inside the main CSS file using the `@theme` directive. Generate the corresponding bindings:

```css
@theme {
  --color-bg-default: var(--color-bg-default);
  --color-text-primary: var(--color-text-primary);
  --color-brand-primary: var(--color-brand-primary);

  --font-sans: var(--font-sans);
  
  --spacing-1: var(--spacing-1);
  --spacing-2: var(--spacing-2);
  --spacing-4: var(--spacing-4);
  --spacing-6: var(--spacing-6);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
}
```

---

## 3. Snapping Loose Grid Values

Designers frequently set dimensions or spacings in Figma that do not align perfectly with standard spacing units (e.g., an internal list margin of `15px` or `7.8px`). To prevent codebases from filling up with custom arbitrary classes like `m-[15px]` or `p-[7.8px]`, the agent must implement **snapping rules**:

1. **Calculate the closest spacing step**: Compare the extracted pixel value to the active spacing system grid (typically 4px increments).
2. **Standardize**:
   - If the difference is $\le 1\text{px}$, snap the value to the nearest step.
     - E.g., `7.8px` $\rightarrow$ `8px` (maps to Tailwind scale `2` or `spacing-2` / `0.5rem`).
     - E.g., `11.9px` $\rightarrow$ `12px` (maps to Tailwind scale `3` or `spacing-3` / `0.75rem`).
   - If the difference is $> 1\text{px}$ but matches a standard Tailwind utility (like `14px` which sits between `12px` and `16px`), write a new design token `spacing-3.5` or prompt the user to confirm whether they prefer strict snapping to `12px` or `16px`.
3. **Document Snaps**: Log all snapped layout properties inside the `DESIGN.md` file to notify both designers and developers of the micro-adjustments.
