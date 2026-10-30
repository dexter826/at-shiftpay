# 05: Primitives A — form controls

**What to build:** Button, Checkbox, Switch, SearchInput, and TimePicker share the new visual language across every state and both themes, with their public prop APIs unchanged.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [x] All five primitives are styled exclusively through semantic tokens; no raw values.
- [x] Hover, active, disabled, invalid where applicable, and focus-visible states are defined and meet WCAG AA in both themes.
- [x] Prop APIs are unchanged; any new variants are additive.
- [x] The primitives are verified statically across their usage sites; visual verification on screens and breakpoints is deferred to the screen tickets (user instruction).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Button: 4px radius, 13px/600 text, 9×14 padding, focus ring via the `ring` token, `duration-fast`, disabled state; variants unchanged.
- Checkbox: 3px box, 40px row hit area, hover border, focus ring on the peer input, 12px label token.
- Switch: 40×48 hit area, 4px track (no pill, no shadow), knob uses `ink`/`canvas`, state-invariant label with `aria-checked`, focus ring, `duration-fast`.
- SearchInput: 4px radius, body-sm text, ring focus, 40px clear button with label and focus state, disabled state.
- TimePicker: 4px trigger with hover/focus ring and `aria-haspopup`/`aria-expanded`, flat panel (no shadow), surface-2 highlight.
- No raw palette or hex values remain in the five files. Gates: `tsc` 0, `eslint` 0, `vite build` 0. Visual verification on screens/breakpoints deferred to the screen tickets, per the user's instruction; contrast is carried by token pairs verified at the token layer.

2026-10-30 — Review fixes.

- Shared `focusRingClasses`/`peerFocusRingClasses` in utils; all five primitives use one ring recipe, and `ease-standard` is applied everywhere.
- Button padding 10×14 (height ≥38px); DESIGN.md updated to match.
- Checkbox unchecked border and switch track border use `ink-muted` (≥5:1 against canvas); hover states are visible border shifts; checkbox label gets 500 weight.
- Switch now uses lucide Sun/Moon with a 4px track; the focus ring hugs the track via `group-focus-visible`.
- TimePicker honors reduced-motion via `useReducedMotion`, includes the visible time in its aria-label, drops the unused `aria-haspopup`, and uses body/title tokens with a flat border instead of a ring; SearchInput disables the clear button and dims its icon when disabled.
