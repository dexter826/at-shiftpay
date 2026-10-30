# 04: Theme switching: functional switch, persistence, pre-paint

**What to build:** Theme switching works end to end. A user flips dark/light from Settings, the choice persists across sessions, and the correct theme is applied before the first paint.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [ ] The Settings theme control toggles the theme, and both themes are fully styled after switching.
- [ ] The choice persists across reloads.
- [ ] The saved theme is applied before first paint; no flash of the wrong theme is observable in either direction.
- [ ] Users with no saved choice get the dark default.
- [ ] The control is keyboard accessible with a visible focus state.
