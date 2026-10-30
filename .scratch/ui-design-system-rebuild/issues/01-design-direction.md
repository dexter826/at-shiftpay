# 01: Design direction: propose, prototype, choose

**What to build:** A chosen design direction for the whole app, validated on a real screen. The direction defines palette, typography, spacing, shape, elevation, and motion, and it becomes the single source for the token layer and DESIGN.md.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] 2–3 complete directions proposed, each with palette (OKLCH values), typography (Vietnamese-capable), spacing, shape, elevation, and motion, plus a one-paragraph rationale.
- [x] One throwaway dashboard prototype per direction, each on its own `prototype/<name>` branch, with screenshots attached to the ticket.
- [ ] The user has selected exactly one direction; the selection is recorded in this ticket.
- [ ] A draft DESIGN.md in the Stitch open format is written for the chosen direction.
- [x] Every direction meets WCAG AA contrast for body text and primary controls in both themes.

## Comments

2026-10-30 — Three directions proposed and prototyped; awaiting selection.

- **A — Thẻ ca (timecard).** Warm graphite and signal amber, keeping the brand accent while switching primary buttons to dark text on amber (fixes the current contrast failure). Be Vietnam Pro throughout, tabular numerals, 4px radii, hairline-dense layout, flat surfaces with borders, 140ms ease-out motion. Rationale: continuity plus utility density for managers scanning shifts and money. Prototype: `prototype/timecard` @ 20f6f7a. Screenshots: `directions/timecard-dark.png`, `directions/timecard-light.png`.
- **B — Sổ lương (ledger).** Deep green ink and brass, Lora serif for headings and money, Be Vietnam Pro for UI text, 2px radii, ruled ledger structure, flat surfaces with borders, 180ms motion. Rationale: makes payroll the hero and reads as accountable financial record-keeping. Prototype: `prototype/ledger` @ 1b2af08. Screenshots: `directions/ledger-dark.png`, `directions/ledger-light.png`.
- **C — Bảng ca (signal).** Indigo ink with one tangerine accent reserved for the primary action and "today", cobalt support; Lexend headings and Source Sans 3 body; 14px radii, soft cards, shift timeline with tinted status chips, 220ms motion. Rationale: staff-facing energy and fast mobile scanning without losing managerial density. Prototype: `prototype/signal` @ f20efc5. Screenshots: `directions/signal-dark.png`, `directions/signal-light.png`.
- Contrast (OKLCH, computed): body text 14.4–17.3:1, muted 5.9–7.5:1, primary/button pairs 4.5–9.3:1 in both themes; C's chips and links were tuned to pass AA.
- Prototypes are static HTML with Vietnamese content, light/dark via class, focus-visible and reduced-motion handling. Prototype branches are local and not pushed yet.
- Pending: direction selection (recorded here), then the DESIGN.md draft.
