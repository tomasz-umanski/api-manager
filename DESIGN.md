---
name: API Manager
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  container-padding: 24px
---

## Brand & Style

The design system is engineered for the high-density requirements of modern API management. It prioritizes technical utility and speed of comprehension for developers and DevOps engineers. The aesthetic is **Minimalist-Technical**, utilizing a dark, low-fatigue palette to support long hours of monitoring and configuration.

The personality is "Precision Engineering": every element serves a functional purpose. By leveraging a high-density layout and a strict visual hierarchy, the design system ensures that critical data—such as breaking changes or latency spikes—is immediately visible without visual noise. It avoids decorative elements in favor of sharp lines and structural clarity.

## Colors

This design system uses a focused dark-mode palette to minimize eye strain and maximize the impact of semantic status colors.

- **Primary Neutrals:** The background and surface colors provide a deep, layered foundation. Background is reserved for the lowest level, while surfaces/cards represent active workspace areas.
- **Typography:** Pure white is used for headings and interactive states, while secondary text is muted to create a clear reading hierarchy.
- **Status Colors:** These are used sparingly but vibrantly. They are reserved for system health, API status codes, and validation states. Alert Red is specifically calibrated for "Breaking Changes" or critical downtime.
- **Accents:** Subtle border colors (#2C2C2C) are used to define boundaries without adding significant visual weight.

## Typography

The typography system relies on **Inter** for all UI controls and navigation to ensure maximum readability at small sizes. **JetBrains Mono** is introduced for technical data, including API endpoints, JSON payloads, and terminal outputs.

- **Hierarchy:** Use `label-caps` for table headers and section titles to differentiate them from interactive data.
- **Density:** Line heights are kept tight (typically 1.4x to 1.5x) to support the high-density layout requirements.
- **Monospace Usage:** Any data that requires character-level alignment (UUIDs, tokens, IP addresses) must use the `mono-code` or `mono-label` styles.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model with a 4px base unit. The layout is designed to stretch and fill the viewport, allowing developers to see as much data as possible on wide-screen monitors.

- **Grid:** A 12-column system is used for dashboard layouts, with a fixed 16px gutter.
- **Density:** Padding inside cards and data tables should stick to the `sm` (8px) and `md` (16px) units to maintain high information density.
- **Structure:** Use a persistent left-hand navigation rail (64px collapsed, 240px expanded) to anchor the workspace. Main content should be contained in fluid panels that can be resized if necessary for side-by-side code comparison.

## Elevation & Depth

To maintain a minimalist and professional look, the design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines**.

- **Z-Index 0 (Background):** #121212. Used for the main application canvas.
- **Z-Index 1 (Surface):** #1E1E1E with a 1px border (#2C2C2C). Used for cards, tables, and main content areas.
- **Z-Index 2 (Overlay):** #252525 with a subtle 4px blur shadow. Used for dropdowns, tooltips, and modals.
- **Interaction:** Hover states on interactive rows or cards should use a subtle lightening of the background (e.g., #2A2A2A) rather than an elevation increase.

## Shapes

The shape language is **Soft (0.25rem)**, providing a subtle modern touch without compromising the professional, technical atmosphere.

- **Buttons & Inputs:** Use a 4px (0.25rem) radius for a precise, "tooled" look.
- **Cards & Large Containers:** Use an 8px (0.5rem) radius to clearly define major layout sections.
- **Status Tags/Pills:** Use a fully rounded (pill) shape only for status indicators (e.g., "Active", "Deprecated") to make them visually distinct from clickable buttons.

## Components

### Buttons
- **Primary:** Solid White background with Black text. No shadow.
- **Secondary:** Ghost style with #2C2C2C border and White text.
- **Danger:** Ghost style with Alert Red border and text for destructive actions (e.g., Delete Key).

### Data Tables
The core of the system. Use a 40px row height for high density. Headers use `label-caps` in Secondary Text color. Every row should have a subtle 1px bottom border.

### Input Fields
Dark backgrounds (#121212) with a 1px border (#2C2C2C). On focus, the border changes to White. Error states use the Alert Red for both the border and a helper text label.

### Status Badges
Small, low-profile badges using a subtle background tint of the status color (e.g., 10% opacity Green) with high-contrast text.

### Code Blocks
Utilize JetBrains Mono. Use a slightly darker background (#0A0A0A) than the main surface to create an "inset" feel. Include a one-click "Copy to Clipboard" button in the top right corner.

### Additional Components
- **API Method Chips:** Color-coded boxes for HTTP methods (GET: Green, POST: Blue, PUT: Yellow, DELETE: Red).
- **Latency Sparklines:** Minimalist line graphs (no axes) embedded within table rows to show 24-hour performance trends.