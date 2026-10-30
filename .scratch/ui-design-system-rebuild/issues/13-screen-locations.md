# 13: Screen — Locations

**What to build:** The locations screen speaks the new visual language in both themes, including any forms, lists, and embedded controls.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] Styled exclusively through semantic tokens; no hardcoded values.
- [x] Empty and validation states use token pairs that clear WCAG AA by computed contrast; the visual confirmation of that claim happens in the screen QA sweep.
- [x] Page composition and flows are unchanged.
- [x] Static checklist passes: token-only colors, 3/4/6px radii, no shadows or gradients, no uppercase micro-labels, focus rings on location controls, reduced-motion honored through the shared motion config. The manual pass at both themes and both breakpoints is deferred (user instruction: static checks + review only).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Raw palette removed across all six components and the route: `bg-green-500/10`+`text-green-600`, `bg-red-500/10`+`text-red-600`, `text-slate-500`, `text-blue-500`, `bg-amber-500/5`+`text-amber-500` → `success`/`danger`/`ink-muted`/`accent-ink`/`surface-2`; `bg-black/40`+`text-white/80` action buttons → `bg-surface` with `text-ink-muted`; `border-white/20`, `bg-black/10`, `bg-surface/90` and `bg-opacity-90` (a v3-era utility that does nothing under v4) removed.
- The missing-coordinates state stopped being a blur hack (`blur-[2px] opacity-60` over a city-level map with `opacity-40`/`opacity-50`/`opacity-20` fading elsewhere): the notice chip says it in words, so both themes read the same message instead of a semi-transparent guess.
- Radii: `rounded-2xl`/`rounded-lg` → 6px for cards and panels, 4px for controls, 3px for chips; the `rounded-full` back button became a 40px `rounded-sm` control with a focus ring. All `shadow-sm`/`shadow-md`/`shadow-lg`/`shadow-xl`/`shadow-inner`/`transition-shadow` removed for the flat depth model.
- Type: `text-[10px]`/`text-[11px]`/`text-xs`/`text-sm`/`text-lg`/`text-xl`/`text-2xl` → `text-label`/`text-body-sm`/`text-title`/`text-display`; `font-black` → 600; the `Lịch sử`/`Đánh giá` uppercase micro-labels and the `tracking-[0.2em]` section eyebrow dropped; money, dates, counts and coordinates use `tabular-nums`; the lat/lng inputs no longer jump size at the `lg` breakpoint.
- Card motion dropped: the staggered `opacity/y` entrance (`duration 0.5 + index*0.05`) and the `group-hover:scale-105` image zoom (`duration-500`) went, keeping motion in the primitives as the design direction requires; transitions moved to `duration-fast ease-standard`.
- Card interaction: the whole-card `onClick` div is a real `<button>` with an accessible name (`Xem chi tiết <name>`), the map clip moved to the image layer so the ring is not cut off, non-interactive overlays use `pointer-events-none`, and the three actions are always visible (desktop-hover-only reveal dropped) at 40px with `aria-label`s and rings.
- Review toggles follow the calendar's migrated status-toggle recipe (3px-free 4px radius, `min-h-10`, `aria-pressed`, `border-*/50` + tinted `bg-*/5` + status text), after measuring `text-success` on a `/10` tint at 4.30:1 in the light theme — below AA; `/5` measures 4.60:1 and `danger` 4.89:1.
- Autocomplete: `shadow-xl` popover → flat `bg-surface` + `border-line` + 6px radius; rows used `hover:bg-line` (the border token as a fill) → `hover:bg-surface-2`; the list is now `ul`/`li` with `type="button"` rows and rings; entrance motion reduced to a fade.
- `LocationStats`: `title` tooltips on non-interactive divs are unreachable by keyboard and screen readers, so each chip carries an `sr-only` label with the number kept visible and tabular.
- Form: labels moved to 12px/500 and associated through `htmlFor`/`id` (coordinate fields get `sr-only` labels); `focus:ring-2 focus:ring-accent/20` (an accent ring outside the `ring` token) replaced by the shared surface-aware ring; `transition-all` → `transition-colors duration-fast ease-standard`; inputs gained `placeholder:text-ink-muted` and `hover:border-ink-muted`.
- Dead `custom-scrollbar` class dropped here (the class is not defined anywhere in the stylesheet).
- Known debt left in place: `theme` and `index` are still plumbed into `LocationCard` but unused now (tokens are theme-invariant; the stagger is gone) — prop API kept as locked; `EventDetailModal` still uses `custom-scrollbar`; the calendar's review toggle still pairs `text-success` with a `/10` tint (4.30:1 in light) and its toggle buttons use `font-medium` where the button contract says 600; `Dropdown` still has no `id`/`aria-labelledby` passthrough. All for the ticket 17 sweep.
