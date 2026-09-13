---
name: Monochrome Engineering Console
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#2f3038'
  tertiary-container: '#e3e1ec'
  on-tertiary-container: '#63646c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#e3e1ec'
  tertiary-fixed-dim: '#c6c5cf'
  on-tertiary-fixed: '#1a1b22'
  on-tertiary-fixed-variant: '#46464e'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.08em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the calculated precision, focus, and utility of modern high-performance engineering consoles. Inspired by tools like Linear, Vercel, and internal infrastructure consoles at Stripe, the aesthetic rejects superficial decoration and chromatic distraction in favor of strict black-and-white tonal contrast, micro-geometry, and dense, structured data hierarchy.

The brand persona is authoritative, uncompromising, and deeply technical. It addresses engineers, platform architects, and site reliability operators who prioritize throughput, zero-latency scanning, and unambiguous state definitions. The visual environment evokes absolute clarity and mechanical elegance: dark zinc fields, hairline architectural rules, and high-impact white callouts.

The design movement is Minimalist High-Contrast Developer Console. It merges Swiss typography fundamentals—rigid grid alignment, explicit hierarchy, and intentional whitespace—with brutalist functional density and pristine, hairline borders.

## Colors

The system operates on an absolute monochromatic rule: zero hue accents. Semantic communication, alerts, and operational states must not rely on green, yellow, red, or blue. Instead, hierarchy and criticality are communicated through contrast ratios, fill states, stroke weights, and typography.

### Color Tiers
- **Canvas / Root Background (`#09090B` / `#0A0A0A`):** Deep, pure neutral base providing total depth.
- **Surface Level 1 (`#121214`):** Primary card, panel, and sidebar background, defining distinct functional zones.
- **Surface Level 2 (`#18181B`):** Nested containers, form inputs, badge backdrops, and active hover states.
- **Surface Level 3 (`#27272A`):** Interactive toggle states, selected item backgrounds, and elevated overlays.
- **Hairline Borders (`#27272A` default, `#3F3F46` focused/hover):** 1px structural boundaries defining the architectural grid.
- **Primary Text (`#FAFAFA`):** Maximum contrast foreground for primary headers, active values, and critical telemetry.
- **Muted Text / Slate (`#A1A1AA`):** Secondary labels, metadata descriptors, and subheadings.
- **Subtle Text / Zinc (`#71717A`):** Tertiary hints, static prefixes, timestamps, and inactive controls.

### Monochromatic State Grammar
- **Critical / P1 / Urgent:** Solid `#FAFAFA` background with `#09090B` bold text. Maximum retinal draw across the dark field.
- **Standard / Processed / Active:** 1px hairline border (`#FAFAFA`) on transparent `#121214` surface with `#FAFAFA` medium text.
- **Pending / In-Queue / Degraded:** Dashed or dotted 1px border (`#71717A`) with `#A1A1AA` text and a monospaced hollow ring indicator (`○`).
- **Resolved / Neutral / Historical:** Solid `#27272A` surface with `#71717A` text and subdued contrast.

## Typography

The typography strategy builds tension between the modern, proportional geometry of **Geist** for structural context and the uncompromising, tabular rhythm of **JetBrains Mono** for payload data, metadata tags, and body prose.

### Role Stratification
- **Geist (Headlines & Section Anchors):** Provides effortless readability and contemporary polish at structural boundaries. Tight tracking (`-0.02em` to `-0.03em`) produces an engineered editorial voice.
- **JetBrains Mono (Content, Metrics & Forms):** Handles inputs, descriptions, queue tokens, system IDs, and statuses. Monospaced rendering ensures numerical data aligns across recurring rows and cards without shift.
- **Micro-Labels (`label-sm`, `label-md`):** Rendered strictly in JetBrains Mono uppercase with expanded letter-spacing (`0.06em` to `0.08em`) to guarantee immediate scannability at 10px and 11px heights.

## Layout & Spacing

The layout model utilizes a fluid 12-column engineering grid structured by a strict 4px base cadence. Workspaces prioritize high-density data surfaces without visual claustrophobia by balancing compact interior component paddings with generous macro margins.

### Breakpoint Matrix
- **Desktop (1280px+):** Fixed/fluid hybrid. Sidebar/action panels lock to 380px or 420px; operational feeds and data grids expand across the remaining canvas with `1.5rem` gutters.
- **Tablet (768px – 1279px):** Stacks multi-column consoles into a unified vertical flow. Gutters scale down to `1rem`; panels adopt a `100%` width with horizontal dividers.
- **Mobile (< 768px):** Single-column stack. Outer canvas margins contract to `1rem`, and secondary metadata cells fold from inline key-value pairs to stacked key-above-value arrangements.

### Spacing Usage Rules
- `space-xs` (4px): Used between badge icons/dots and text labels, or internal icon button paddings.
- `space-sm` (8px): Form input inner vertical padding; spacing between tight metadata groups.
- `space-md` (12px): Standard inner card padding for sub-containers; horizontal form input padding.
- `space-lg` (20px): Primary surface container padding (cards, panels, modals).
- `space-xl` (32px): Vertical division between major operational blocks and headers.

## Elevation & Depth

Visual depth is achieved through **tonal stratification and hairline boundaries**, completely avoiding saturated drop shadows or ambient color glows.

### Elevation Levels
- **Canvas Base (Level 0):** `#09090B`. The viewport floor. Everything rests on this zero-plane.
- **Panels & Base Containers (Level 1):** `#121214` bounded by a 1px solid hairline border of `#27272A`. No shadow.
- **Nested Rows & Sub-Panels (Level 2):** `#18181B` bounded by 1px `#27272A`. Creates depth within cards.
- **Dropdowns, Overlays & Popovers (Level 3):** `#18181B` bounded by 1px `#3F3F46` with an architectural black shadow: `0px 8px 24px rgba(0, 0, 0, 0.7)`.
- **Active / Dragged Elements (Level 4):** Surface `#27272A` with `0px 12px 32px rgba(0, 0, 0, 0.9)` and a crisp `#FAFAFA` hairline stroke.

Interactive focus and elevation transitions must be instantaneous (under 120ms) using cubic ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).

## Shapes

The geometric personality is sharp and disciplined. All structural elements, surfaces, and control primitives adhere to micro-radii that preserve technical precision without visual harshness.

- **Primary Geometry (`roundedness: 1`):** Base components (buttons, input fields, badges, code chips) utilize a tight `4px` to `6px` radius (`0.25rem` / `0.375rem`).
- **Cards & Modals:** Scaled to `6px` or `8px` (`rounded-lg` max), maintaining strict alignment with nested 4px input fields.
- **Status Dots & Pill Badges:** Micro-badges requiring pill profiles take `9999px`, but only when their height does not exceed `20px`. Structural cards must never feature pill or organic rounded treatments.

## Components

### Buttons
- **Primary CTA:** Background `#FAFAFA`, text `#09090B` (JetBrains Mono 12px Bold), border `1px solid #FAFAFA`. Hover: Background `#E4E4E7`. Active: Background `#D4D4D8`.
- **Secondary Action:** Background `#18181B`, text `#FAFAFA`, border `1px solid #27272A`. Hover: Border `#3F3F46`, background `#27272A`.
- **Ghost / Tertiary:** Background transparent, text `#A1A1AA`, border `1px solid transparent`. Hover: Text `#FAFAFA`, border `1px solid #27272A`.

### Status & Priority Badges (Strict Monochrome Grammar)
- **P1 / Critical:** Solid `#FAFAFA` fill, `#09090B` bold text, radius `4px`, padding `2px 6px`. Maximum visual priority.
- **P2 / High:** Transparent fill, `1px solid #FAFAFA` border, `#FAFAFA` regular text.
- **P3 / Low:** Transparent fill, `1px solid #3F3F46` border, `#71717A` regular text.
- **PROCESSED / RESOLVED:** Outline `#27272A`, surface `#18181B`, text `#A1A1AA`, prefixed with a solid square `■` or checked glyph.
- **PENDING / DEGRADED:** Outline `1px dashed #71717A`, text `#FAFAFA`, prefixed with a hollow ring `○`.

### Input Fields & Controls
- **Text Inputs & Textareas:** Background `#121214`, border `1px solid #27272A`, font JetBrains Mono 13px, text `#FAFAFA`, placeholder `#71717A`. Focus: Border `1px solid #FAFAFA` with no ring glow.
- **Checkboxes & Radios:** `14px × 14px`, border `1px solid #3F3F46`, background `#121214`. Checked: Background `#FAFAFA`, indicator `#09090B`.

### Cards & Data Panels
- **Structure:** Background `#121214`, border `1px solid #27272A`, radius `6px`, padding `20px`.
- **Header:** Geist 15px/18px with metadata counts right-aligned in JetBrains Mono 11px uppercase `#71717A`.
- **Nested Item Rows:** Separated by `1px solid #1E1E22` dividers or rendered as distinct `#18181B` sub-cards with `1px solid #27272A` borders.

### Telemetry & Metadata Chips
- Height `22px`, font JetBrains Mono 11px, background `#18181B`, border `1px solid #27272A`, color `#A1A1AA`. Key-value pairs inside chips use `#71717A` for keys and `#FAFAFA` for values (e.g., `Urgency: 100/100`).