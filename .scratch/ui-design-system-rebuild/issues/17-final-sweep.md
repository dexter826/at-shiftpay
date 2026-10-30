# 17: Final sweep: consistency, DESIGN.md sync, full QA

**What to build:** The rebuild closes cleanly: DESIGN.md matches the real tokens, no dangling references or stray literals remain, and the full visual QA matrix passes.

**Blocked by:** 04 (Theme switching), 10 (Dashboard), 11 (Calendar), 12 (Employees), 13 (Locations), 14 (Payroll), 15 (Settings), 16 (Login).

**Status:** completed

- [ ] DESIGN.md tokens match the generated CSS exactly, and the prose sections describe what actually shipped.
- [ ] Token resolution check reports zero unresolved references; no hardcoded color literals remain outside token definitions.
- [ ] Visual QA matrix passes: all seven screens × both themes × desktop and mobile.
- [ ] Focus-visible, reduced-motion, contrast (WCAG AA), and theme persistence verified across the matrix.
- [ ] The static gate and full CI pipeline are green on main.

## Comments

2026-10-30 — Closed at the user's request without executing the final sweep. Acceptance checkboxes remain unchecked because DESIGN.md sync, token resolution, the full visual/accessibility matrix and CI on main have not been verified for this ticket. Previously recorded cleanup debt remains unresolved.
