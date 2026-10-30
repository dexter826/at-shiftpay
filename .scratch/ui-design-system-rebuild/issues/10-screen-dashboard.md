# 10: Screen — Dashboard

**What to build:** The dashboard shows the new design direction end to end: summary tiles, charts, and recent-activity surfaces all speak the new visual language in both themes and at both breakpoints.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] The dashboard is styled exclusively through semantic tokens; no hardcoded values.
- [x] Chart series use semantic status/chart tokens and stay legible in both themes, including gridlines and labels.
- [x] Page composition is unchanged; only the visual language differs.
- [x] Static checklist passes: token-only styling, focus rings, reduced-motion, no shadows or raw palette; visual pass at both themes and breakpoints deferred to QA of the full screen set (user instruction).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Stat cards: 6px radii, icon chips moved off the accent to `surface-2`/`ink-soft`, labels on `text-label` without uppercase, main figures on the `text-data` token with tabular numerals; salary figures no longer tinted with the accent.
- Activity chart: 6px card, month navigator on `surface-2` with 4px controls, focus rings, `duration-fast ease-standard`, trend chips moved from slate/emerald/rose to `surface-2`/`success`/`danger`, and a legend added so the two series are not distinguished by color alone.
- Payment chart and tooltip: 6px cards, `text-label`/`text-body-sm` type, flat tooltip (no shadow or translucency), square legend dots.
- Month picker: 4px cells without accent glow or scale transforms, year stepper with labelled 36px buttons and focus rings, header icon `text-on-accent`.
- Dashboard header: avatar border moved from a 2px accent ring to a 1px `line`; greeting on the type scale.
- Loading skeletons follow the same radii and surfaces. Axis ticks already read `--color-ink-muted`; tooltip cursor uses a `line` mix.
- Composition, routes, and data flow untouched. Gates: `tsc` 0, `eslint` 0, `vite build` 0; grep finds no raw palette, hex, uppercase labels, shadows, or off-scale radii in the dashboard files.

2026-10-30 — Review fixes.

- Type weights restored next to the size tokens (`text-title font-semibold`, `text-data font-semibold tabular-nums`).
- Month navigator and picker controls meet the 38px floor; rings use the surface-aware variant.
- Trend chips dropped tinted pills for `surface-2` + status text; legend dots read from `PAYMENT_COLORS` so a series has one color source; markers standardized to 6px squares.
- Tooltip sits on `surface-2` for a visible edge in light theme; the bar cursor mix is strong enough to see.
- Desktop gutter is 32px and skeletons match the real card padding and min-heights.
- Data series no longer use the accent: unpaid→warning, advanced→info, total earned→accent-ink.
- Dead `row.color` field removed from the stats config.
