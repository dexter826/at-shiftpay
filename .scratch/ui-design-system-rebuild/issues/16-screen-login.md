# 16: Screen — Login

**What to build:** The login screen becomes the clearest expression of the new identity while preserving quick login and the existing authentication flow.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] The auth shell and login composition use the timecard direction through theme-agnostic semantic tokens. Logo, form order and conditional views stay unchanged; rendered confirmation is deferred.
- [x] Quick login, verification and error-state handlers preserve their flows. Static accessibility checks include labelled fields/buttons, invalid states, alert announcements and AA contrast in both themes (figures below); runtime flow checks are deferred.
- [x] Active avatar/loading visuals follow semantic tokens; no styled-components or hardcoded colors remain in the login route and its rendered components. The quick-login image retains its existing source/fallback; the reset-password spinner uses Lucide with inherited button ink.
- [x] Static checklist passes: semantic colors/type, 3/4/6px geometry, visible keyboard focus classes, 40px controls, reduced-motion guards and responsive wrapping. Manual both-theme, mobile/desktop, focus-visible and reduced-motion checks are deferred per user instruction; this does not claim browser verification.

## Comments

2026-10-30 — Implemented (static verification only; no code review, per user instruction).

- Auth shell: removed decorative amber blobs; card is `bg-surface border-line rounded-md`, with existing width, padding, logo, tagline, footer and view order retained. Footer heart/link are neutral rather than red/decorative accent, with a canvas-offset link focus ring.
- Form: semantic display heading, 4px-radius `surface-2` fields, body-sm input text and muted placeholders. Neutral input borders use `ink-muted` rather than low-contrast `line`; errors use `danger`. Existing autocomplete values and authentication/validation handlers are unchanged.
- Accessibility: visible labels now connect to input IDs; invalid inputs expose `aria-invalid`. Password toggles, quick-login account removal and back control have accessible names and 40px hit areas. All local interactive controls have focus rings; eye toggles use inset rings to avoid overflowing their fields. Error messages announce through `role="alert"`.
- Quick login: saved-user avatar remains an image with its original fallback; border changes from decorative accent/2px to semantic line/1px. Greeting/name/email use neutral text tokens. Account removal is a neutral 4px-radius icon button rather than a tiny red pill. Remember-me, password, account switching and submit callbacks remain intact.
- Verification: neutral surface-2 mail tile and instruction panel, readable email with wrapping, existing resend/check/logout actions preserved. Secondary actions are neutral 40px controls with focus rings; primary submit uses the shared Button styling.
- Forgot-password modal is part of the rendered login flow: linked email label, semantic field/focus styling, Lucide `Loader2` inheriting `on-accent` instead of the white CSS spinner. Reset-email handler and toast flow unchanged.
- Motion: `AuthForm`, `QuickLoginView`, `VerificationView` and `ValidationError` use `DURATION_BASE`/`EASE_STANDARD`; `useReducedMotion` sets duration to zero and skips root entry transforms. CSS spinner/interaction reduced motion continues through the global stylesheet.
- Computed contrast from current OKLCH tokens (dark / light): body on surface 14.86 / 16.23; muted labels on surface 5.06 / 5.43; input placeholders and neutral borders against surface-2 4.57 / 4.62; input text 13.42 / 13.80; danger validation text on surface 5.27 / 5.27; danger field border 4.76 / 4.48; links on surface 10.04 / 4.83; footer text on canvas 5.46 / 4.98; primary button ink 9.25 / 8.32. Error banners use neutral ink on surface-2, avoiding tinted-background contrast pitfalls.
- Verification: targeted Prettier formatting, `npx tsc --noEmit`, `npm run lint`, `npm run build` and active-file legacy-style audit pass. No browser QA or code-review agents were run.
- Existing unused `LoginIllustration` and `MonkeyAvatar` files have no callers; left untouched rather than deleting or restyling dead code. Their legacy decoration/motion can be evaluated in ticket 17; they are not rendered by this login screen.
