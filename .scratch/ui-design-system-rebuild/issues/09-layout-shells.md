# 09: Layout shells and loading moments

**What to build:** The app shell (desktop sidebar, mobile bottom tabs) and the auth shell share the new visual language, as do the loading moments — splashscreen, pull-to-refresh, and scroll-to-top. Navigation structure and labels stay exactly as they are.

**Blocked by:** 03 (Token layer), 08 (Icon standard).

**Status:** ready-for-agent

- [x] The app shell is styled exclusively through semantic tokens in both themes; auth-shell screen colors belong to ticket 16.
- [x] Platform-safe areas are respected in the app shell (sidebar `pt-safe`, bottom bar `pb-safe`); the auth shell's safe areas are handled with ticket 16.
- [x] Splashscreen, pull-to-refresh, and scroll-to-top match the new identity and respect reduced-motion.
- [x] Navigation items, structure, and labels are unchanged; verified statically (visual pass at both breakpoints is deferred to the screen QA sweep).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- App shell: sidebar widened to the documented 248px (main offset matched), nav items on the 4px radius and `text-body-sm`/`text-label` scale, active marker `rounded-xs`, focus rings on every nav control, logout moved from raw red to `danger`, theme button switched from `title` to `aria-label`, transitions on `duration-fast ease-standard`.
- Pull-to-refresh: flat `surface` chip with a 1px `line` border (no pill, no shadow); computed offsets stay inline as intended.
- Splashscreen: reduced-motion users get the static wordmark and a 600ms hold instead of the Lottie run.
- Scroll-to-top already restyled in ticket 07; safe-area utilities (`pt-safe`, `pb-safe`) are unchanged and still applied.
- Navigation items, order, and Vietnamese labels untouched; logo image untouched.
- Open for ticket 16: one decorative `text-red-500` heart in the login footer; the auth shell itself (canvas background, safe areas) is token-driven.
- Gates: `tsc` 0, `eslint` 0, `vite build` 0.

2026-10-30 — Review fixes.

- Sidebar width is a single source: a `--sidebar-width` token consumed by both the sidebar and the main offset.
- The active marker is a 2px square-ended accent bar (the 3px rounded bar was the pill shape DESIGN.md bans).
- Nav indicator springs honor reduced-motion via `useReducedMotion`, matching the splashscreen fix.
- Shell focus rings use the surface-aware offset variant so the halo matches the surface they sit on.
