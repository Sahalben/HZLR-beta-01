# HZLR Landing Page Redesign & Engineering Context

This document serves as the design and engineering context blueprint for the HZLR-beta landing page interface. It outlines the custom methods, parameters, aesthetic constraints, and development commands used to craft the premium Apple-style interactive experience.

---

## 1. Development & Verification Commands

Use the following commands inside the workspace to run, check, or compile changes:

* **Local Dev Server**:
  Run from `/apps/web`:
  ```bash
  npm run dev -- --port 5176 --host
  ```
* **TypeScript Validation**:
  Always verify code type safety before committing:
  ```bash
  npx tsc --noEmit
  ```
* **Production Build**:
  Ensure that all components, dynamic imports, and styles compile into production bundle assets successfully:
  ```bash
  npm run build
  ```
* **Git Versioning**:
  Stage, commit, and push changes to keep remote state synchronized:
  ```bash
  git add <modified-files>
  git commit -m "style/refactor: detailed commit message"
  git push origin main
  ```

---

## 2. Aesthetic Constraints & Brand Palette

The HZLR landing page uses premium dark aesthetics with a unified brand color block flowing below the hero background.

* **Base Brand Theme**: Scoped to the Tailwind `.dark` context to ensure color variables resolve correctly regardless of user system-level dark mode switches.
* **Palette Tokens**:
  * **Background (`bg-background`)**: Resolved to deep HZLR forest black-green (`hsl(158 70% 8%)` / `#01170f`).
  * **Primary (`bg-primary`)**: Emerald brand green (`#10b981`).
  * **Secondary / Accent**: Deep forest green (`#022c22`), Seafoam/Mint (`#34d399` / `#6ee7b7`).
  * **Foreground text**: Semantic tokens `text-foreground` and `text-muted-foreground` to ensure readable high-contrast overlays on dark backgrounds.
* **Desktop Frame Constraints**:
  * The Hero section must fit cleanly within a standard desktop frame without vertical overflow clutter.
  * Headings are scaled (e.g. `lg:text-5xl xl:text-6xl`), vertical container padding is compact (`py-8 md:py-12`), and interactive mocks (such as the phone cockpit mockup) are constrained to maximum dimensions (width `270px` - `280px`).

---

## 3. Redesign Engineering Methods

### A. Apple Dock Floating Island Navbar
Built inside [Header.tsx](file:///c:/Projects/HZLR-beta-main/apps/web/src/components/landing/Header.tsx) to replicate an macOS-style dock.

1. **Dual Glass Layer Blend**:
   * **Color Burn Overlay**: Translates translucent highlights.
     ```tsx
     <div className="absolute inset-0 rounded-full bg-white/5 mix-blend-color-burn pointer-events-none" />
     ```
   * **Overlay Highlight**: Specular reflection highlight around the glass border.
     ```tsx
     <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay pointer-events-none shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),_inset_-1px_-1px_1px_rgba(0,0,0,0.1)]" />
     ```
2. **Spring Link Hovers**:
   * Utilizes `framer-motion` to animates a capsule-shaped background highlight bubble behind navigation links during hover states. Uses `layoutId="nav-hover-bubble"` to slide the highlight smoothly between adjacent items.
3. **Mobile Popover Menu**:
   * Configured as a floating popover anchored directly below the island dock with a glassy background and spring transitions.

### B. Animated WebGL Liquid Background
Implemented in the Hero section background via [AnimatedLiquidBackground.tsx](file:///c:/Projects/HZLR-beta-main/apps/web/src/components/landing/AnimatedLiquidBackground.tsx).

1. **WebGL 2.0 Shader Canvas**:
   * Rendered using a customized vertex/fragment shader mapping brand green, emerald, and forest hues in real-time.
2. **Graceful Degradation Fallback**:
   * Detects WebGL availability and seamlessly falls back to a CSS linear gradient on devices lacking WebGL 2.0 support:
     ```tsx
     if (!webglSupported) {
       return <div className="w-full h-full bg-gradient-to-br from-[#022c22] to-[#064e3b]" />;
     }
     ```

### C. Seamless Gradient Transitions (Double-Dissolve)
Transitions between adjacent dark green sections (e.g., `Hero → InteractiveDemo`, `WhyHZLR → ForWorkers`, and `Pricing → Safety`) are rendered completely invisible through a matching overlay gradient mask:

1. **Bottom Bleed (First Section)**:
   * Dissolves the bottom border of a section into the background color.
     ```tsx
     <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
     ```
2. **Top Bleed (Second Section)**:
   * Fades in the next section's contents.
     ```tsx
     <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
     ```

### D. Premium Bento Grid & Interactive Cards
Used in `InteractiveDemo.tsx` and `ForWorkers.tsx`.

1. **Spotlight Radial Mask**:
   * Mesh grid background with a radial mask center spotlight that fades out cleanly:
     ```css
     mask-image: radial-gradient(circle, black 30%, transparent 70%);
     ```
2. **Rotating Laser Border Outline**:
   * Utilized in `Pricing.tsx` to display moving borders around card elements.
   * Conic rotating animation:
     ```css
     @keyframes pricing-border-rotate {
       0% { transform: rotate(0deg); }
       100% { transform: rotate(360deg); }
     }
     ```
   * Applied dynamically inside a 1px border wrapper container:
     ```tsx
     <div className="absolute -inset-[150%] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(from 0deg, ${glowColors})`,
            animation: 'pricing-border-rotate 8s linear infinite'
          }} />
     ```
