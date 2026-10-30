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

- Tiles: hover/return motion now uses the `--duration-slow` token (new `DURATION_SLOW` in the motion bridge); grid lines stay on `line`.
- LoadMore: 4px radius, `text-body-sm`/semantics, `duration-fast ease-standard` transitions, hover via border instead of accent tint, focus ring, `type="button"`; the counter drops uppercase/11px for `text-label` with tabular numerals.
- ScrollToTopButton: 48px square control (no pill), flat (no shadow), accent border + `on-accent` ink, focus ring, `aria-label` instead of `title`, tokenized transitions.
- Prop APIs unchanged. Gates: `tsc` 0, `eslint` 0, `vite build` 0.
