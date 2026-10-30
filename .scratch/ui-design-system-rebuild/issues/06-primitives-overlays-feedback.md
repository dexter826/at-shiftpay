# 06: Primitives B — overlays and feedback

**What to build:** Modal, Dropdown, ToastProvider, Skeleton, and Loader share the new visual language, with motion tokens applied and reduced-motion respected, without changing their public prop APIs or behavior.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [x] All five primitives are styled exclusively through semantic tokens; no raw values.
- [x] Enter/exit motion uses motion tokens and is suppressed under reduced-motion.
- [x] Focus management, dismissal, and stacking behavior are unchanged.
- [x] Prop APIs are unchanged; any new variants are additive.
- [x] Verified statically in both themes; visual verification at both breakpoints is deferred to the screen tickets (user instruction).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Added `src/lib/motion.ts` mirroring the motion tokens for Framer transitions, and wrapped the app in `<MotionConfig reducedMotion="user">` so every overlay honors reduced-motion; Skeleton additionally skips its shimmer loop under reduced-motion.
- Added a theme-invariant `scrim` token; Modal uses `bg-scrim/70` instead of a raw black overlay.
- Modal: surface panel with 6px radii (no shadow), title on `text-title`, close button focus ring and hover tokens; focus trap, Escape, scroll lock, and z-index untouched.
- Dropdown: 4px panel/trigger radii, no shadow, motion tokens, visible hover borders, ring-based focus, ARIA `aria-haspopup`/`aria-expanded` plus `listbox`/`option` roles and `aria-selected`; outside-click, Escape, and search focus behavior untouched.
- Toast: flat surface with status-colored border, `status`/`alert` roles, focusable labelled close button, motion tokens; timers and stacking untouched.
- Skeleton: 3px/6px radii, motion tokens, shimmer skipped when reduced-motion is requested.
- Loader: already token-driven with CSS keyframes covered by the global reduced-motion reset (verified in ticket 03); no raw values or shadows.
- Gates: `tsc` 0, `eslint` 0, `vite build` 0; built CSS contains the `scrim` token and utility; no palette/hex/shadow classes remain in the five files.
