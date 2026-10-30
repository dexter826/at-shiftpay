# UI design system rebuild

Status: ready-for-agent

## Problem Statement

ShiftPay's interface grew ad hoc. Screens were assembled from one-off colors and hand-built controls, so the app reads as a patchwork rather than a product with a deliberate identity. The accent color is hard to read against white text, light theme exists in code but cannot be enabled from settings, and loading moments, icons, and motion all speak slightly different visual languages. Every new screen re-invents its own styling, and there is no document a coding agent can read to build new UI consistently. The user wants the entire visual layer torn down and rebuilt as one coherent design system — distinct enough to be recognised, systematic enough that every future screen inherits it.

## Solution

Rebuild the visual layer end to end. Three complete design directions are proposed and prototyped on a real dashboard screen; the chosen direction becomes a two-tier design-token system (primitive palette steps → semantic roles) expressed in OKLCH through Tailwind CSS v4's CSS-first theme. The tokens restyle the 13 primitives, the two layout shells, and all seven screens (dashboard, calendar, employees, locations, payroll, settings, login). Routes, business flows, the logo, and primitive prop APIs stay unchanged, so users experience an upgrade rather than a different app. Dark and light themes both work, including a functional theme switch. The direction is documented in a `DESIGN.md` in the Stitch open format so both humans and coding agents implement against it.

## User Stories

1. As a shop manager, I want every screen to share one visual language, so that the app feels like one product rather than a patchwork.
2. As a shop manager, I want the dashboard to open with a clear, distinctive look, so that the app is recognisable at a glance.
3. As a shop manager, I want text and controls sized for quick scanning on desktop, so that I can review shifts and payroll without straining.
4. As an employee, I want the mobile layout to stay readable with strong contrast, so that I can check my schedule anywhere.
5. As an employee, I want navigation structure and labels I already know, so that my muscle memory keeps working after the redesign.
6. As a user, I want to switch between dark and light themes from settings, so that I can match my environment.
7. As a user, I want my theme choice to persist and to apply before the first paint, so that I never see a flash of the wrong theme.
8. As a user, I want both themes fully styled on every screen, so that nothing looks half-finished in either mode.
9. As a user with low vision, I want body text and primary buttons to meet WCAG AA contrast, so that I can read and act without guessing.
10. As a keyboard user, I want visible focus states on every interactive element, so that I can navigate without a mouse.
11. As a user sensitive to motion, I want animations to respect reduced-motion preferences, so that the interface does not make me uncomfortable.
12. As a user, I want buttons, inputs, modals, dropdowns, toasts, switches, checkboxes, and skeletons to look like one family, so that I learn the interface once.
13. As a user, I want shift and payment statuses to use one consistent color language across calendar and payroll, so that I read state correctly.
14. As a manager, I want dashboard charts to use the same semantic colors as the rest of the app, so that data is easy to correlate.
15. As a manager, I want the calendar's dense information to stay legible after restyling, so that scheduling remains fast.
16. As a manager, I want payroll totals and the payment modal to look trustworthy and consistent, so that money figures are unambiguous.
17. As an employee, I want the login screen to express the new identity, so that the first impression is deliberate.
18. As a manager, I want copy clarified where the new design demands it, so that labels match what the interface actually shows.
19. As a developer, I want all styling to reference semantic tokens, so that themes and future palette changes become one-file changes.
20. As a developer, I want no hardcoded color literals outside the token definitions, so that the palette has a single source of truth.
21. As a developer, I want new screens to compose existing primitives, so that consistency does not depend on memory.
22. As a developer, I want a `DESIGN.md` describing the chosen direction, so that I or an agent can implement new screens without reverse-engineering styles.
23. As a developer, I want the build to fail when a token reference does not resolve, so that renames cannot silently break styling.
24. As a developer, I want primitive prop APIs to stay stable, so that the rebuild does not force call-site rewrites.
25. As a developer, I want motion values defined as tokens, so that timing is consistent across modals, dropdowns, and toasts.
26. As a developer, I want Tailwind v4's CSS-first theme as the token source, so that there is one vocabulary instead of a JS config plus loose CSS variables.
27. As a designer, I want to compare three concrete directions on a real screen, so that the choice is made on evidence rather than description.
28. As a designer, I want the winning direction captured as tokens plus prose, so that implementation cannot drift from intent.
29. As a product owner, I want routes, flows, and the logo unchanged, so that users feel an upgrade, not a different app.
30. As a product owner, I want the rebuild delivered incrementally, so that the app stays shippable and demos keep working throughout.
31. As a manager, I want the splashscreen, loader, and pull-to-refresh moments to match the new identity, so that loading does not break the illusion.
32. As an employee, I want the quick-login experience preserved, so that logging in stays fast after the redesign.

## Implementation Decisions

**Design direction**
- `/ui-ux-pro-max` proposes 2–3 complete design directions (palette, typography, spacing, shape, motion); each gets a throwaway dashboard prototype on its own `prototype/<name>` branch.
- The user picks one direction; its prototype remains a primary source, referenced from the direction ticket.
- The winning direction is encoded twice: as tokens (the implementation) and as `DESIGN.md` (the description agents read). The two must agree.

**Token architecture**
- Tailwind CSS v4 with CSS-first configuration replaces the v3 JS theme config; the dark variant is class-based on the document root.
- Two tiers: primitive tokens hold raw palette steps and scale values; semantic tokens name roles (surface, text, text-muted, border, accent, destructive, and the status set). Only semantic tokens are consumed by primitives, shells, and screens.
- All color values are OKLCH. Dark and light themes swap semantic token values only; markup stays theme-agnostic.
- Token categories: color, spacing, type scale, radius, elevation/shadow, motion (durations and easing), and focus ring. Components do not define their own raw values.
- Migration is a full rename with no compatibility alias layer: every existing token reference and every hardcoded color literal is replaced with the new vocabulary in one mechanical step, then the old vocabulary disappears.

**Theme behavior**
- Dark remains the default; light is fully supported.
- The settings switch gets a real handler that toggles the theme class and persists the choice; the persisted choice is applied before first paint to remove the wrong-theme flash.

**Primitives and shells**
- The 13 primitives keep their public prop APIs; new variants may be added but existing props must not break. They are restyled through semantic tokens, including focus-visible states meeting WCAG AA in both themes.
- Motion tokens apply to primitives only — modals, dropdowns, toasts — and all motion respects reduced-motion.
- The two layout shells (app shell with desktop sidebar and mobile bottom tabs; full-screen auth shell) are restyled. Pull-to-refresh, splashscreen, loader, and scroll-to-top subscribe to the same tokens.
- Styled-components is removed from the two files that use it; styles become token-driven like everything else. Inline styles may remain only for genuinely computed values.

**Screens**
- All seven screens are migrated: dashboard, calendar, employees, locations, payroll, settings, login.
- Page composition is preserved — no information-architecture, navigation, or layout-structure changes.
- Copy may be edited locally where the new design requires it; routes and business flows do not change.
- Chart series and status colors map to semantic status tokens so calendar, payroll, and dashboard agree.

**Icons**
- Lucide is the single icon standard. The local icon set is kept only where lucide lacks an equivalent, redrawn to match. The logo is untouched.

**DESIGN.md**
- Written in the Stitch open format: YAML frontmatter tokens (colors, typography, rounded, spacing, components referencing `{path.to.token}`) plus prose sections in canonical order (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts).
- Authored after the direction is selected, finalized in the token ticket against the real theme values, and kept in sync with them thereafter.

**Rollout**
- Layer order: (1) token layer + Tailwind v4 upgrade + full rename (this commit changes values only — every screen restyles at once); (2) primitives and shells; (3) screens, page by page; (4) final sweep (design-doc sync, dangling references, leftovers).
- Main stays shippable between layers; each ticket ships as its own PR with visual evidence.

**Known defects fixed within this work**
- Primary accent contrast failure (white text on the current accent).
- Non-functional settings theme switch.
- Wrong-theme flash on load.
- Two competing icon sets resolved to the lucide standard.

## Testing Decisions

**What makes a good check here** — the repo has no automated test framework, by explicit product decision. Verification must still assert external behavior at the highest seam:
- The build seam: the static gate and the rendered app are the observable output; token work is verified through them and the screens, not through internal file assertions.
- The screen seam: the rendered screen in both themes at both breakpoints is the observable behavior; manual checks follow a fixed per-screen checklist.
- No check may assert implementation details such as class-name spelling or component internals.

**Seams**
1. Existing static gate — lint, type-check, production build, run on every PR.
2. Manual screen seam — for each screen ticket: both themes, both breakpoints, contrast, focus-visible, reduced-motion, charts/status colors, theme persistence.

**Modules tested**
- Token layer: verified through the static gates and the screen sweep in both themes; a dedicated token checker was considered and dropped as temporary migration tooling, not permanent infrastructure.
- Primitives and shells: manual checklist exercised through the screens that use them most (dashboard, calendar, settings).
- Screens: manual checklist per screen.
- `DESIGN.md`: reviewed against the generated CSS in the token ticket's review (manual, not scripted).

**Prior art**
- The repo's established practice is a static gate plus manual smoke, with screenshots in PRs (visual PR format). There are no unit or integration tests, and this work does not introduce a test framework.

## Out of Scope

- Information architecture, navigation structure, routes, and page composition.
- New features, new screens, and business-logic or data-layer changes.
- Internationalisation and copy translation; only local copy adjustments required by the design.
- Changing the logo or brand name.
- Adopting a third-party component library (including shadcn) — primitives remain custom.
- An automated test framework.
- Performance optimisation beyond avoiding regressions.
- CI/CD pipeline changes beyond adding the token resolution check.

## Further Notes

- Canonical records: ADR 0002 (rebuild decision and rejected alternatives) and `GLOSSARY.md` (design token, primitive token, semantic token, primitive, layout shell, design direction). This spec uses that vocabulary.
- The `DESIGN.md` format is the open specification published by Google Labs (`google-labs-code/design.md`); the file follows it exactly rather than a house variant.
- Tailwind v4 raises the browser floor (Safari 16.4+, Chrome 111+, Firefox 128+) and requires the v4 PostCSS/Vite setup; this is accepted.
- Pre-existing dead code (an unused theme-styles hook) is noted but not deleted as part of this work.
- Contrast, the theme switch, and the pre-paint theme fix are inside scope because the rebuild would otherwise ship a new identity with the old defects.
