# 03: Token layer: Tailwind v4, two-tier OKLCH tokens, full rename

**What to build:** The app runs on Tailwind v4's CSS-first theme with the chosen direction's two-tier token system (primitive palette steps → semantic roles). Every style references the new semantic vocabulary; the old token names, hardcoded color literals, and styled-components are gone. Screens restyle at the value level with no markup, route, flow, or primitive-API changes.

**Blocked by:** 01 (Design direction), 02 (Token resolution check).

**Status:** ready-for-agent

- [ ] Tailwind v4 setup replaces v3, with class-based dark mode and no JS theme config.
- [ ] Primitive and semantic token tiers are defined in OKLCH for both themes, covering color, spacing, type scale, radius, elevation, motion, and focus ring.
- [ ] Every existing token reference and every hardcoded color literal is migrated to the new vocabulary; the old token vocabulary no longer exists anywhere (no alias layer).
- [ ] Styled-components is removed from the loader and the login avatar; remaining inline styles exist only for genuinely computed values.
- [ ] The DESIGN.md token sections are finalized against the real theme values and match them exactly.
- [ ] The static gate (lint, type-check, build) and the token resolution check pass; all seven screens render in both themes.
- [ ] Routes, business flows, page composition, and primitive prop APIs are unchanged.
