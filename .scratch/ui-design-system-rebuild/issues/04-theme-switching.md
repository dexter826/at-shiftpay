# 04: Theme switching: functional switch, persistence, pre-paint

**What to build:** Theme switching works end to end. A user flips dark/light from Settings, the choice persists across sessions, and the correct theme is applied before the first paint.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [x] The Settings theme control toggles the theme, and both themes are fully styled after switching.
- [x] The choice persists across reloads.
- [x] The saved theme is applied before first paint; no flash of the wrong theme is observable in either direction.
- [x] Users with no saved choice get the dark default.
- [x] The control is keyboard accessible with a visible focus state.

## Comments

2026-10-30 — Implemented.

- Pre-paint script in `index.html` reads the persisted `theme` key (zustand persist JSON), applies the `light`/`dark` class and `color-scheme` before the stylesheet, and defaults to dark for missing, invalid, or corrupted values.
- `themeStore` now applies the theme through one helper (class + `color-scheme`) used by toggle, set, and rehydration.
- The Settings switch was already wired to the store; it now has `type="button"`, `role="switch"`, `aria-checked`, a keyboard focus ring using the `ring` token, `duration-fast` transitions, and a semantic `ink`/`canvas` knob.
- Static verification: `tsc` 0, `eslint` 0, `vite build` 0; built `dist/index.html` keeps the inline script ahead of the stylesheet; extracted-script simulation passes 5 cases (missing, light, dark, invalid value, corrupted JSON). No browser QA per the user's instruction.

2026-10-30 — Review fixes.

- Light-theme focus ring now resolves to ink (dark accent failed 3:1 on paper); `ring` documented in DESIGN.md for both themes.
- Switch label is state-invariant (`Chế độ tối`); `aria-checked` carries the state.
- Rehydration validates the persisted value and falls back to dark; the store notes that index.html mirrors its storage key and JSON shape.
