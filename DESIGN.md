---
version: 0.1-draft
name: ShiftPay — Thẻ ca
description: Warm graphite timecard direction with a single signal-amber accent, dense tabular data, flat bordered surfaces, and Be Vietnam Pro throughout. Dark is the default theme; light is a warm paper variant.
colors:
  bg: oklch(0.17 0.006 80)
  surface: oklch(0.21 0.008 80)
  surface-2: oklch(0.25 0.009 80)
  border: oklch(0.31 0.01 80)
  text: oklch(0.94 0.008 85)
  text-muted: oklch(0.69 0.01 85)
  accent: oklch(0.79 0.145 82)
  on-accent: oklch(0.2 0.015 80)
  success: oklch(0.74 0.13 150)
  warning: oklch(0.82 0.14 92)
  danger: oklch(0.66 0.17 27)
  info: oklch(0.72 0.1 240)
  bg-light: oklch(0.965 0.005 85)
  surface-light: oklch(0.995 0.002 85)
  surface-2-light: oklch(0.94 0.006 85)
  border-light: oklch(0.87 0.008 85)
  text-light: oklch(0.24 0.012 80)
  text-muted-light: oklch(0.48 0.01 80)
  accent-light: oklch(0.76 0.15 82)
  on-accent-light: oklch(0.2 0.015 80)
  success-light: oklch(0.53 0.13 150)
  warning-light: oklch(0.62 0.14 92)
  danger-light: oklch(0.55 0.19 27)
  info-light: oklch(0.5 0.1 240)
typography:
  display:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.015em
  title:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  body:
    fontFamily: Be Vietnam Pro
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  data:
    fontFamily: Be Vietnam Pro
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
rounded:
  xs: 3px
  sm: 4px
  md: 6px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  7: 28px
  8: 32px
  10: 40px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 9px 14px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 9px 14px
  icon-button:
    backgroundColor: transparent
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    size: 38px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 16px
  stat-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 14px 16px
  status-chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 3px 8px
  nav-item-active:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 9px 10px
  table-row:
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
---

## Overview

Thẻ ca (timecard) treats ShiftPay as the place where hours become money. The visual reference is the punch clock and the shift board: warm graphite surfaces, one signal-amber accent that behaves like a stamped mark, hairline structure, and figures set in tabular numerals so columns of hours and đồng align. The interface is dense but calm — managers scan it daily, so density is the feature, not a compromise. Dark is the default; light is a warm paper variant with the same structure.

## Colors

Semantic roles only. The accent is a signal, not a surface: it appears on the primary action, the active navigation marker, the current-day chart bar, and focus rings — nowhere else. Text never sits on the accent except `on-accent` (dark ink), which replaces the previous white-on-amber failure. Status colors carry state and nothing else. Both themes are AA-checked: body text 14.9–16.0:1, muted 5.9–6.9:1, accent buttons 8.3–9.3:1.

## Typography

One family — Be Vietnam Pro — chosen for Vietnamese diacritics. Display is 24px/600, data figures 26px/600 with tabular numerals, body 15px/400, labels 12px/500. Negative tracking is capped at -0.02em and used only on short numerals or headings; running Vietnamese text keeps normal spacing so diacritics never collide. No all-caps labels, no eyebrow labels.

## Layout

Desktop uses a 248px sidebar and a 32px main gutter; content stacks at 12px gaps, larger sections at 20px. Stats form a four-column band (two columns on mobile); the dashboard pairs a wide chart card with a narrow list card. Mobile drops the sidebar for a compact top strip with icon-only navigation and 16px page padding. Every control is at least 38px tall; primary actions sit in the page header.

## Elevation & Depth

Flat by design. Hierarchy comes from three surface steps (bg → surface → surface-2) and 1px borders, never from shadows. Dashed separators mark list rows, matching the perforated edge of a timecard.

## Shapes

Small radii: 3px for chips, 4px for buttons and navigation, 6px for cards. Borders are 1px. Nothing is pill-shaped except avatars; nothing is fully square either — the geometry should read as an index card, not a spreadsheet.

## Components

Buttons are 4px-radius, 13px/600 text, 9px × 14px padding; primary uses accent with dark ink, ghost uses a border and muted text that brightens on hover. Cards and stat cards share surface, border, and radius, differing only in padding. Status chips are 3px-radius, surface-2, with a 6px colored square dot and a 12px label; the dot carries the status color, never a tinted pill. Active navigation is surface-2 with a 2px inset accent bar. Table rows use body-sm with tabular numerals for hours and money.

## Do's and Don'ts

- Do reference semantic roles (`bg`, `surface`, `text-muted`, `accent`) instead of raw values.
- Do keep figures tabular; hours and đồng must align vertically.
- Do keep the accent scarce: one primary action per view.
- Don't put white text on the accent; use `on-accent` ink.
- Don't add shadows, gradients, or glass effects — depth is borders and surface steps.
- Don't use uppercase labels, serif display faces, or decorative numbering.
- Don't introduce a second accent color; status colors are not accents.
