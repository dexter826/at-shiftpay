# 02: Token resolution check

**What to build:** A deterministic check that fails CI when any style token reference in the source does not resolve against the generated CSS, so the token rename in ticket 03 cannot silently break styling.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] A script scans every token reference in the source and the production-built CSS, and fails listing every unresolved reference.
- [ ] The script runs in CI after the production build and passes on current main.
- [ ] Breaking one reference deliberately turns CI red, and the failure output names the offending reference (demonstrated in the ticket).
