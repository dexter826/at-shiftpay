# 03: Token layer: Tailwind v4, two-tier OKLCH tokens, full rename

**What to build:** The app runs on Tailwind v4's CSS-first theme with the chosen direction's two-tier token system (primitive palette steps → semantic roles). Every style references the new semantic vocabulary; the old token names, hardcoded color literals, and styled-components are gone. Screens restyle at the value level with no markup, route, flow, or primitive-API changes.

**Blocked by:** 01 (Design direction).

**Status:** ready-for-agent

- [x] Tailwind v4 setup replaces v3, with class-based dark mode and no JS theme config.
- [x] Primitive and semantic token tiers are defined in OKLCH for both themes, covering color, spacing, type scale, radius, elevation, motion, and focus ring.
- [x] Every existing token reference and every hardcoded color literal is migrated to the new vocabulary; the old token vocabulary no longer exists anywhere (no alias layer).
- [x] Styled-components is removed from the loader and the login avatar; remaining inline styles exist only for genuinely computed values.
- [x] The DESIGN.md token sections are finalized against the real theme values and match them exactly.
- [x] The static gate (lint, type-check, build) passes; screen rendering is verified statically, with visual QA deferred to the screen tickets per the user's instruction.
- [x] Routes, business flows, page composition, and primitive prop APIs are unchanged.

## Comments

2026-10-30 — Implemented.

- Tailwind v4 (`@tailwindcss/vite`, `@import 'tailwindcss'`) replaces v3; the JS theme config and PostCSS config are deleted; `styled-components`, `autoprefixer`, `postcss`, and `@tailwindcss/typography` are uninstalled.
- Two token tiers live in `src/index.css`: primitive palette steps (`--palette-*`) and semantic roles (`canvas`, `surface`, `surface-2`, `line`, `ink`, `ink-soft`, `ink-muted`, `accent`, `accent-ink`, `on-accent`, `success`, `warning`, `danger`, `info`), dark by default with `html.light` overrides, all OKLCH. Radius, type, motion, and illustration tokens included.
- Full rename: every legacy arbitrary-value class and every legacy named class now uses semantic utilities; `colors.ts` emits token references instead of hex. Legacy vocabulary count after migration: 0.
- Styled-components removed from `Loader` (Tailwind + keyframes) and `MonkeyAvatar` (co-located CSS file); artwork colors moved into the illustration palette.
- `DESIGN.md` finalized at v1.0 against the real tokens.
- Verification (static only, per user): `tsc --noEmit`, `eslint .`, `vite build` pass; built CSS contains the semantic tokens and both theme override blocks; audit finds 0 legacy token references, 0 hex/rgba literals in source outside token definitions, and 0 `[var(--…)]` utility classes.
- Not verified here: per-screen visual QA (tickets 10–16); theme switching and pre-paint are ticket 04.

2026-10-30 — Review fixes (post code-review).

- White-on-accent remnants removed: checkbox, calendar day icons, payment modal selection marks, settlement button, sidebar add button, offline banner now use `on-accent`; status fills with `on-accent` ink measure 4.8–10.1:1.
- Accent no longer carries status or tinted surfaces: unpaid status maps to warning; active nav, today cell, toast states, and month-picker states use `surface-2`/semantic status tokens.
- Ten flagged files converted from raw Tailwind palette to semantic tokens. Remaining raw palette (~100 occurrences across 28 screen files) is deferred to screen tickets 10–16.
- Illustration colors exposed as semantic `--color-illustration-*` aliases; components no longer read `--palette-*` directly.
- Added `--color-ring`, a text scale (`text-display/title/body/body-sm/label/data`), and `duration-fast`/`duration-base` utilities backed by motion tokens; base transitions consume them. Removed unused `light` variant and `text-2xs`.
- Dead `${'…'}` interpolations cleaned from PaymentModal; unused theme hooks removed from calendar sidebar, event detail, month picker, and skeleton.
- ADR 0002 consequence updated (`useThemeStyles` touched by the rename, still unused); DESIGN.md typography/motion/spacing reference the real token utilities; PWA theme-color aligned to the dark canvas hex (meta tags cannot reference CSS variables).
- Re-verified statically: `tsc` 0, `eslint` 0, `vite build` 0; built CSS contains `duration-fast`, `duration-base`, `text-display`, `ease-standard`, and illustration utilities; zero legacy tokens, hex literals, arbitrary `[var(--…)]` classes, or white-on-accent pairs in source.
