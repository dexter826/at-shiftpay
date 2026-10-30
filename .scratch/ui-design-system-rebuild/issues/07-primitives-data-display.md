# 07: Primitives C — data display and interaction

**What to build:** Tiles, LoadMore, and ScrollToTopButton share the new visual language across states and both themes, with their public prop APIs unchanged.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [x] All three primitives are styled exclusively through semantic tokens; no raw values.
- [x] States (selected, disabled, hover, focus-visible) meet WCAG AA in both themes.
- [x] Prop APIs are unchanged; any new variants are additive.
- [x] Verified statically in both themes; visual verification at both breakpoints is deferred to the screen tickets (user instruction).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Tiles: hover/return motion uses the shared `DURATION_BASE` token and is skipped under reduced-motion. Note: Tiles currently has zero call sites in `src/` — pre-existing dead code, flagged here rather than deleted (AGENTS §3).
- LoadMore: 4px radius, `px-3.5`/`text-body-sm`/semibold, `duration-fast ease-standard` transitions, hover via border instead of accent tint, focus ring, `type="button"`; the counter drops uppercase/11px for `text-label` with tabular numerals.
- ScrollToTopButton: 40px square control, 4px radius, flat (no shadow, no accent glow), secondary surface styling (`surface` + `line`, hover `surface-2`) since it is not the view's primary action, focus ring, `aria-label` instead of `title`.
- Prop APIs unchanged. Gates: `tsc` 0, `eslint` 0, `vite build` 0.
