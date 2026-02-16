# KodNest Premium Build System

A premium SaaS design system for serious B2C product companies. Calm, intentional, coherent, confident.

---

## Design Philosophy

- **Calm** — No visual noise, no animation overload
- **Intentional** — Every decision serves a purpose
- **Coherent** — One mind designed it; no drift
- **Confident** — Serif headlines, generous spacing, clear hierarchy

### What to Avoid

- Gradients, glassmorphism, neon colors
- Flashy, loud, playful, hackathon-style
- Decorative fonts, random sizes
- Random spacing (13px, 27px, etc.)

---

## Color System

**Maximum 4 colors across the entire system.**

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F7F6F3` | Page background, off-white |
| Primary text | `#111111` | Body, headings |
| Accent | `#8B0000` | Primary buttons, links, focus states |
| Success | `#4A6B4A` | Shipped status, confirmations |
| Warning | `#8B7B3A` | In progress, caution |

Supporting neutrals (borders, muted text): `#E5E4E0`, `#5C5C5C`

---

## Typography

### Fonts

- **Headings:** Serif (`Georgia`, Cambria, Times New Roman)
- **Body:** System sans-serif (`-apple-system`, Segoe UI, Roboto)

### Scale

| Use | Size | Line height |
|-----|------|-------------|
| Headline XL | 2.5rem (40px) | 1.3 |
| Headline | 2rem (32px) | 1.3 |
| Headline SM | 1.5rem (24px) | 1.3 |
| Body | 1.125rem (18px) | 1.6 |
| Body SM | 1rem (16px) | 1.6 |
| Caption | 0.875rem (14px) | 1.6 |

### Rules

- Body text: 16–18px, line-height 1.6–1.8
- Text blocks: max-width 720px
- Headings: large, generous spacing, confident
- No decorative fonts, no random sizes

---

## Spacing System

**Use only these values.** Whitespace is part of the design.

| Scale | Value |
|-------|-------|
| 1 | 8px |
| 2 | 16px |
| 3 | 24px |
| 4 | 40px |
| 5 | 64px |

Never use: 13px, 27px, or other arbitrary values.

---

## Global Layout Structure

Every page follows this structure from top to bottom:

```
[Top Bar]
    ↓
[Context Header]
    ↓
[Primary Workspace] + [Secondary Panel]
    ↓
[Proof Footer]
```

### Top Bar

- **Left:** Project name
- **Center:** Progress indicator (e.g., Step 2 / 5)
- **Height:** 64px
- **Right:** Status badge — Not Started | In Progress | Shipped

### Context Header

- Large serif headline
- 1-line subtext
- Clear purpose, no hype language
- Padding: 40px horizontal, 24px vertical

### Primary Workspace (70% width)

- Where main product interaction happens
- Clean cards, predictable components
- No crowding

### Secondary Panel (30% width, ~320px)

- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer (persistent bottom)

- Height: 64px
- Checklist style:
  - □ UI Built
  - □ Logic Working
  - □ Test Passed
  - □ Deployed
- Each checkbox requires user proof input

---

## Components

### Buttons

- **Primary:** Solid deep red (`#8B0000`), white text
- **Secondary:** Outlined, transparent background
- **Hover:** Opacity 0.9 (same for all)
- **Border radius:** 6px (same everywhere)
- **Padding:** 8px vertical, 16px horizontal

### Inputs

- Clean borders, no heavy shadows
- Clear focus state: 2px accent border, subtle ring
- Border: 1px solid `#E5E4E0`

### Cards

- Subtle 1px border
- No drop shadows
- Balanced padding (24px)
- White background

### Checkboxes (Proof Footer)

- 16×16px
- 1px border, 4px radius
- Checked: accent fill

---

## Interaction Rules

- **Transitions:** 150–200ms, ease-in-out
- **No:** bounce, parallax, overscroll effects
- Keep interactions predictable and restrained

---

## Error & Empty States

### Errors

- Explain what went wrong
- Explain how to fix it
- Never blame the user
- Use `kn-error-message`, `kn-error-title`, `kn-error-fix`

### Empty States

- Provide a clear next action
- Never feel dead
- Use `kn-empty-state`, `kn-empty-title`, `kn-empty-action`

---

## File Structure

```
design-system/
├── index.css          # Single import for full system
├── tokens.css         # CSS custom properties
├── base.css           # Layout structure, reset
├── components.css     # Buttons, inputs, cards, etc.
└── KODNEST-DESIGN-SYSTEM.md  # This document
```

### Usage

```html
<link rel="stylesheet" href="design-system/index.css">
```

Or in your bundler:

```css
@import './design-system/index.css';
```

---

## Class Reference

| Purpose | Class |
|---------|-------|
| App shell | `kn-app` |
| Top bar | `kn-topbar` |
| Top bar sections | `kn-topbar-left`, `kn-topbar-center`, `kn-topbar-right` |
| Status badge | `kn-status-badge`, `kn-status-not-started`, `kn-status-in-progress`, `kn-status-shipped` |
| Context header | `kn-context-header` |
| Workspace | `kn-workspace` |
| Primary area | `kn-primary` |
| Secondary panel | `kn-secondary` |
| Proof footer | `kn-proof-footer` |
| Proof checklist | `kn-proof-checklist`, `kn-proof-item` |
| Primary button | `kn-btn kn-btn-primary` |
| Secondary button | `kn-btn kn-btn-secondary` |
| Input | `kn-input` |
| Card | `kn-card` |
| Step explanation | `kn-step-explanation` |
| Prompt box | `kn-prompt-box` |
| Panel actions | `kn-panel-actions` |
| Checkbox | `kn-checkbox` |
| Error message | `kn-error-message`, `kn-error-title`, `kn-error-fix` |
| Empty state | `kn-empty-state`, `kn-empty-title`, `kn-empty-action` |
