# 11: Screen — Calendar

**What to build:** The calendar keeps its dense scheduling information legible under the new visual language: shift entries, status colors, and the event modal all match the design system in both themes.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] Shift and payment statuses use one consistent semantic status color language, matching payroll and dashboard.
- [x] Density stays readable: no information lost, no truncation regressions at either breakpoint.
- [x] The event modal and all controls match the new primitives.
- [x] Static checklist passes: token-only colors, 4/6px radii, no shadows, no uppercase micro-labels, focus rings on calendar controls, reduced-motion honored through the shared motion config. Visual pass at both themes and breakpoints is deferred to the screen QA sweep (user instruction).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Raw palette removed across the calendar (day cells, sidebar, grid, header, assignment list, event detail, event modal): greens/reds/oranges/slate now map to `success`/`danger`/`warning`/`ink-muted`, so calendar states read with the same tokens as dashboard and payroll.
- Radii onto the scale (6px panels, 4px controls), all `rounded-lg`/pill markers removed, event-count and session markers standardized to 3px squares; the assignment selection marker matches the checkbox geometry.
- Off-scale type (`text-[8px]`–`text-[11px]`) replaced by `text-label`/`text-body-sm`; uppercase micro-labels dropped; `font-bold` normalized to the 600 weight used by the tokens.
- Shadows removed (selected day, sidebar add button, event history rows) for the flat depth model; accent tint surfaces replaced by `surface-2`/`danger/10`.
- Focus rings added to day cells, sidebar icon buttons, and every event-modal input/toggle using the surface-aware variant; inputs use `placeholder:text-ink-muted`.
- Transitions moved to `duration-fast ease-standard`; nav and hover motion continues to honor `MotionConfig reducedMotion="user"`.
- Composition, flows, and data behavior untouched. Gates: `tsc` 0, `eslint` 0, `vite build` 0; grep finds no raw palette, hex, uppercase, shadow, off-scale radii or px text in the calendar files.
