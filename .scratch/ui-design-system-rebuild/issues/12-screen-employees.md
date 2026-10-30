# 12: Screen — Employees

**What to build:** The employees screen — lists, forms, and modals — speaks the new visual language in both themes while preserving the existing flows.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] Lists, forms, and modals are styled exclusively through semantic tokens.
- [x] Form validation and empty states are legible and meet WCAG AA in both themes.
- [x] Page composition and flows are unchanged.
- [x] Static checklist passes: token-only colors, 4/6px radii, no shadows, no uppercase micro-labels, focus rings on employee controls, reduced-motion honored through the shared motion config. Manual pass at both themes and breakpoints is deferred to the screen QA sweep (user instruction).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Raw palette removed: `bg-black/40`, `text-white`, `bg-emerald-500/80`, `bg-orange-500/70`, `bg-red-500/10`+`text-red-400`, `bg-yellow-500`, `text-slate-400`/`placeholder-slate-500` → `scrim`, `ink`/`ink-soft`/`ink-muted`, `success`, `warning`, `danger`, `surface`/`surface-2`.
- Card photo legibility no longer relies on a `from-black/60` gradient: the name/phone/shift row sits in a solid `bg-surface` band, so it reads identically in both themes. Bank badge and edit/delete controls use the same solid-surface treatment.
- Fake bank-card artwork cut: blurred decorative blobs, the chip SVG, and the two red/yellow network circles (which implied a card brand the data never states) removed; `BankCard` is now a flat data panel. Its `useThemeStore`/`mix-blend-screen` dark-mode ternary is gone with them.
- Type onto the scale: `text-[8px]`/`text-[10px]`/`text-xs`/`text-sm`/`text-lg`/`text-2xl`/`text-3xl` → `text-label`/`text-body-sm`/`text-title`/`text-data`; uppercase + `tracking-widest` micro-labels dropped; `font-black` → the token weight 600; account number, phone and shift count use `tabular-nums`.
- Radii onto the scale (6px cards/panels, 4px controls/badges), all `shadow-2xl`/`shadow-lg`/`shadow-sm`/`drop-shadow-*` removed for the flat depth model.
- Interaction: the click-to-open card area is a real `<button>` with an accessible name (`Xem hồ sơ <name>`), edit/delete are buttons with `aria-label` at the 38px floor, and the avatar picker is a `<button>` rather than a clickable `div`. Focus rings on all of them plus the phone link, the reset-bank button and every text input.
- Text inputs use `placeholder:text-ink-muted`, `text-ink`, `rounded-sm` and the surface-aware focus ring; the four labelled fields are associated through `htmlFor`/`id`.
- `EmployeeDetailModal` avatar fallback no longer calls ui-avatars.com with hardcoded `background=ecb52d&color=fff`; it renders initials, and the state is keyed per employee so a broken photo for one person no longer suppresses another's.
- Dead/stale classes removed: `via-border` (pre-rename token) in the section divider → `bg-line`, `opacity-50`/`opacity-60` fading of icons and the empty bank panel. Composition, flows and prop APIs untouched.
- Known debt left in place: `Dropdown` has no `id`/`aria-labelledby` passthrough, so the bank selector label is visual-only; the `LoadMore` in `EmployeeList` carries an inert `col-span-full`. Both for the ticket 17 sweep.
