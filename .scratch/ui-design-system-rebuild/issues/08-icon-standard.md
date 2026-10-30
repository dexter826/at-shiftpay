# 08: Icon standard: lucide plus redrawn locals

**What to build:** One icon language across the app. Lucide is the standard; the local icon set survives only where lucide has no equivalent, redrawn to match lucide's stroke style and sizing.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [x] Every local icon is audited: replaced by a lucide equivalent where one exists, redrawn to match where none does.
- [x] No duplicate icons for the same meaning remain.
- [ ] Icon sizing and color follow semantic tokens; no hardcoded icon colors.
- [x] The logo is untouched.

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- All 27 local icons were audited. Every one was already a thin wrapper around a lucide icon with a no-op animation handle, so each had a direct equivalent and nothing needed redrawing. The 16 used wrappers were replaced at their 14 call sites with the same lucide components (ArrowLeft, Calendar, Check, ChevronDown/Left/Right, Download, Eye/EyeOff, Key, MapPin, Pencil, Plus, Search, Trash2, X); the 11 unused ones were deleted with the set.
- `Pen`/`Pencil` and `Calendar`/`CalendarDays` were resolved to the names the rest of the app already uses (`Pencil`, `Calendar`) so no two glyphs carry the same meaning.
- `src/components/ui/icons/` and the orphaned `src/components/ui/types.ts` are gone; the animated-icon hover machinery (`AnimatedIconHandle`, refs, `startAnimation`/`stopAnimation` handlers) was removed along with it, so icons now inherit color from their text token.
- No duplicate icon meanings remain; lucide is the only icon source (57 files import it).
- The logo and Lottie splash animation are untouched.
- Gates: `tsc` 0, `eslint` 0 (no warnings), `vite build` 0.

2026-10-30 — Review fixes.

- Duplicate meanings removed app-wide: `CalendarDays`→`Calendar`, `FileDown`→`Download`, `Wallet2`→`Wallet`, `CheckCircle2`→`CheckCircle`, `Edit2`→`Pencil`. `PenIcon` rendered lucide `Pen`, but `Pencil` is what the rest of the app already used, so call sites keep one glyph per meaning.
- Icon colors made semantic in the files this batch touched: Navbar theme icon (`text-accent-ink`), export button icon (`text-on-accent`), payroll stat icon (`text-info`), account danger chip (`text-danger`/`bg-danger/10`).
- The icon-color criterion stays open: raw icon colors remain in screen files (login heart, location cards, payroll stats text) owned by tickets 10–16.
- Cosmetic import-order churn in five files this batch did not otherwise change was reverted.
