# 09: Layout shells and loading moments

**What to build:** The app shell (desktop sidebar, mobile bottom tabs) and the auth shell share the new visual language, as do the loading moments — splashscreen, pull-to-refresh, and scroll-to-top. Navigation structure and labels stay exactly as they are.

**Blocked by:** 03 (Token layer), 08 (Icon standard).

**Status:** ready-for-agent

- [x] The app shell and auth shell are styled exclusively through semantic tokens in both themes.
- [x] Platform-safe areas (mobile home indicator, notch) are respected.
- [x] Splashscreen, pull-to-refresh, and scroll-to-top match the new identity and respect reduced-motion.
- [x] Navigation items, structure, and labels are unchanged; desktop and mobile breakpoints both verified.

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- App shell: sidebar widened to the documented 248px (main offset matched), nav items on the 4px radius and `text-body-sm`/`text-label` scale, active marker `rounded-xs`, focus rings on every nav control, logout moved from raw red to `danger`, theme button switched from `title` to `aria-label`, transitions on `duration-fast ease-standard`.
- Pull-to-refresh: flat `surface` chip with a 1px `line` border (no pill, no shadow); computed offsets stay inline as intended.
- Splashscreen: reduced-motion users get the static wordmark and a 600ms hold instead of the Lottie run.
- Scroll-to-top already restyled in ticket 07; safe-area utilities (`pt-safe`, `pb-safe`) are unchanged and still applied.
- Navigation items, order, and Vietnamese labels untouched; logo image untouched.
- Open for ticket 16: one decorative `text-red-500` heart in the login footer; the auth shell itself (canvas background, safe areas) is token-driven.
- Gates: `tsc` 0, `eslint` 0, `vite build` 0.
