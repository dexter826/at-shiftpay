# UI design system rebuild

The UI layer was ad hoc: color variables without spacing, radius, shadow, or motion tokens; 13 hand-rolled primitives; 68 hardcoded hex values; two files styled with styled-components; a theme switch that never worked. We decided to rebuild the visual layer rather than restyle it: move to Tailwind CSS v4 with CSS-first `@theme`, define two-tier tokens (primitive palette steps → semantic roles) in OKLCH, keep both dark and light themes (dark default, with a functional switch), standardise on lucide icons, and add motion tokens for primitives only. Routes, user flows, page composition, the logo, and primitive prop APIs stay stable; only the visual language changes. Migration is incremental in three layers — tokens (full mechanical rename of the 663 `[var(--…)]` references and removal of styled-components), then the 13 primitives and 2 shells, then all seven screens (six routes plus login). The chosen design direction is recorded in a `DESIGN.md` (Stitch open format: YAML tokens plus prose sections) written once the direction is selected and kept in sync with the real `@theme` tokens, so coding agents implement pages against it.

## Considered Options

- **Stay on Tailwind v3**: rejected — the purpose of the rebuild is a single CSS-first token vocabulary, which is exactly what v4's `@theme` provides; doing the token work on v3 would be redone later.
- **Alias old token names onto the new ones**: rejected — it preserves the old vocabulary as a permanent second language. The rename is mechanical and codemod-able, and the app stays shippable after the token commit because values are swapped, not markup.
- **Big-bang rewrite of the whole UI**: rejected — 102 `.tsx` files in one unreviewable change, with the main branch broken for its duration.
- **Dark-only**: rejected — the product wants both themes.

## Consequences

- The token commit is large and mechanical (663 arbitrary-value classes plus 68 hex literals) and changes every screen at once, because values change even where markup does not.
- Tailwind v4 raises the browser floor (Safari 16.4+, Chrome 111+, Firefox 128+) and replaces the JS theme config with `@theme`; the PostCSS setup changes with it.
- Contrast on the primary accent (white text on `#ecb52d`) fails today; the new palette must clear WCAG AA in both themes.
- `src/hooks/useThemeStyles.ts` is pre-existing dead code, noted but left alone by this work.
