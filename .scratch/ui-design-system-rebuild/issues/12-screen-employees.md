# 12: Screen — Employees

**What to build:** The employees screen — lists, forms, and modals — speaks the new visual language in both themes while preserving the existing flows.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] Lists, forms, and modals are styled exclusively through semantic tokens.
- [x] Form validation and empty states use token pairs that clear WCAG AA by computed contrast; the visual confirmation of that claim happens in the screen QA sweep.
- [x] Page composition and flows are unchanged.
- [x] Static checklist passes: token-only colors, 3/4/6px radii, no shadows or gradients, no uppercase micro-labels, focus rings on employee controls, reduced-motion honored through the shared motion config. The manual pass at both themes and both breakpoints is deferred (user instruction: static checks + review only).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Raw palette removed: `bg-black/40`+`text-white` overlays → `bg-surface`/`bg-surface/90` with `text-ink`/`text-ink-soft`; `bg-emerald-500/80`+`bg-orange-500/70` → `success`/`warning`; `bg-red-500/10`+`text-red-400` → `danger`; `bg-yellow-500`/`text-yellow-*` artwork deleted; `text-slate-400` and `placeholder-slate-500` → `ink-muted`.
- Card photo legibility no longer relies on a `from-black/60` gradient: the name/phone/shift row sits in a solid `bg-surface` band, so it reads identically in both themes. The bank chip and edit/delete controls use the same solid-surface treatment.
- Fake bank-card artwork cut: blurred decorative blobs, the chip SVG, and the two red/yellow network circles (which implied a card brand the data never states) removed; `BankCard` is now a flat data panel. Its `useThemeStore`/`mix-blend-screen` dark-mode ternary is gone with them.
- Type onto the scale: `text-[8px]`/`text-[10px]`/`text-xs`/`text-sm`/`text-lg`/`text-2xl`/`text-3xl` → `text-label`/`text-body-sm`/`text-title`/`text-display`/`text-data`; uppercase + `tracking-widest` micro-labels and the `Hệ thống thanh toán` eyebrow dropped; `font-black` → 600, labels → 500 per the type contract; account number, phone, dates and shift count use `tabular-nums`.
- Radii onto the scale (6px cards/panels, 4px controls, 3px chips), all `shadow-2xl`/`shadow-lg`/`shadow-sm`/`drop-shadow-*` removed for the flat depth model.
- Interaction: the click-to-open card area is a real `<button>` with an accessible name (`Xem hồ sơ <name>`), edit/delete are labelled 40px buttons, and the avatar picker is a `<button>` rather than a clickable `div`. Focus rings on all of them plus the phone link, the reset-bank button and every text input. Edit/delete are now always visible instead of desktop-hover-only.
- Text inputs use `placeholder:text-ink-muted`, `text-ink`, `rounded-sm` and the surface-aware focus ring; the four labelled fields are associated through `htmlFor`/`id`.
- `EmployeeDetailModal` avatar fallback no longer calls ui-avatars.com with hardcoded `background=ecb52d&color=fff`; it renders the same two-letter initials as the card, and its error state lives in a component remounted per employee (`key={employee.id}`) so a broken image for one person cannot suppress another's photo.
- Dead/stale classes removed: `via-border` (pre-rename token) in the section divider → `bg-line`, `opacity-50`/`opacity-60` fading of icons and the empty bank panel. Composition, flows and prop APIs untouched.
- Known debt left in place: `Dropdown` has no `id`/`aria-labelledby` passthrough, so the bank selector label is visual-only; the `LoadMore` in `EmployeeList` carries an inert `col-span-full`; the two-letter initials block is now duplicated between `EmployeeCard` and `EmployeeDetailModal`; calendar labels still pair `text-label` with `font-semibold` and its inputs still use `focus:border-accent`. All for the ticket 17 sweep.

2026-10-30 — Review fixes (Standards + Spec axes).

- Focus rings that could not appear: the card's open-profile button carried an outset ring inside `overflow-hidden` (clipped) — the clip moved to the photo layer, so the ring draws at the card edge. Edit/delete gained the surface-aware ring they were missing.
- Click regression: the bank chip sat above the open-profile target and swallowed clicks, so tapping it no longer opened the profile. The chip and info band are now `pointer-events-none`, and the overlay layers are ordered by DOM position instead of fighting z-index.
- Accent stopped being a surface: `bg-accent/10`+`hover:bg-accent/20` (phone link) and `hover:bg-accent/10` (reset button) → `bg-surface-2` with `brightness-110` hover; `hover:border-accent`/`focus:border-accent` → `hover:border-ink-muted`, matching the `SearchInput` primitive, so accent remains only the action/nav/chart/ring signal.
- 38px control floor met: edit/delete `h-[38px]` arbitrary → `h-10 w-10`; the ~26px reset button → `min-h-10 px-3`; the phone link → `min-h-10 px-3`.
- Type contract: labels moved from `font-semibold` to the documented 500; field hints and the validation message moved off `text-label` onto `text-body-sm`; the employee name moved to `text-display` so it no longer matches the modal's own `text-title` header.
- Chip geometry: the bank chip and the profile chips now follow the documented status chip (3px radius, `surface-2`, 6px square dot, 12px/500 label) instead of a 4px tinted pill; `BankCard` padding 20px → 16px card padding.
- Scope pulled back: `inputMode="numeric"` and the rewritten `BankCard` default strings reverted — a restyle ticket does not get to change data or copy behaviour.
- Ticket claims corrected: the log said `bg-black/40` → `scrim` when it became `surface`/`surface/90`; AC 2's "meets WCAG AA in both themes" was a visual outcome and is now stated as computed-contrast with the visual check deferred.
