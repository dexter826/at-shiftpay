# 15: Screen — Settings

**What to build:** The settings screen speaks the new visual language, including the functional theme control from ticket 04, forms, and the password modal.

**Blocked by:** 04 (Theme switching), 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] Styled exclusively through semantic tokens; no hardcoded values. Static audit of the settings route, its three components, `ChangePasswordModal`, `ImageCropperModal` and `Switch` finds no raw palette hues, `text-xs`/`text-sm`, `rounded-lg`/`rounded-xl`/`rounded-2xl`, shadows, gradients, uppercase micro-labels or legacy `bg-line` hovers. Only false positive is the switch knob's `translate-x-5` (not a color).
- [x] The theme control is usable, keyboard accessible, and shows its current state clearly. `Switch` is a real button with `role="switch"`, `aria-checked`, an accessible label and the shared surface focus ring; the adjacent settings text mirrors the current mode (`Chế độ tối`/`Chế độ sáng`).
- [x] Password modal and form states meet WCAG AA in both themes by computed contrast: body `ink` on surface 16.23 light / 14.86 dark, labels `ink-muted` on surface 5.43 / 5.06, input text `ink` on `surface-2` 13.80 / 13.42, placeholder and 12px labels `ink-muted` on `surface-2` 4.62 / 4.57, `danger` on surface 5.27 / 5.27, `success` on its 5% tint 4.71 / 5.97. Error banners keep `ink` text with a `danger` icon so the tinted background cannot drop below AA.
- [x] Static checklist passes: token-only colors, 3/4/6px radii, no shadows or gradients, focus rings on every settings control, reduced-motion honored through the shared motion config (including a `useReducedMotion` guard on the save bar); both-theme, desktop/mobile and focus-visible manual passes are deferred (user instruction: static checks + review only).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Route cards: theme and logout panels moved from `rounded-lg` to `rounded-md`, the theme glyph sits in a `surface-2` square, and headings/subtitles use `text-body-sm font-medium` + `text-label font-medium` instead of `text-sm` + `text-xs`. The row focus ring is inset so it is not clipped by `overflow-hidden`.
- Theme control: `Switch` keeps its existing `role="switch"`/`aria-checked` contract, drops the ring from the inner track to the real button, and uses `focusRingOnSurfaceClasses` with the surface offset. Track radius is 4px; the adjacent copy still names the active mode.
- Account card: the avatar was a clickable `<div>`; it is now a `<button type="button">` with `aria-label="Đổi ảnh đại diện"`, a disabled state while uploading and an outer surface-offset focus ring. The image and hover overlay live in a clipped inner `<span>`; the ring is outside the image and within the card padding. The name editor got a labelled input, neutral 40px save/cancel buttons with `aria-label`s and shared `surface-2` field styling. Password/delete rows keep their button semantics, neutral password icon and danger delete icon on `surface-2`, with `text-ink` labels.
- Work config: `Mức lương / ca` now has a real `htmlFor`/`id` pair (`settings-shift-rate`); the two `TimePicker`s are wrapped in `role="group"` with `aria-labelledby` labels instead of orphan `<label>`s. Input, chip and hint use `rounded-sm`/`rounded-xs`, `surface-2`, `text-label` and `text-body-sm`; the chip is `px-2 py-[3px]`. The unsaved-changes bar uses `DURATION_BASE`/`EASE_STANDARD`, collapses to `duration: 0` under `useReducedMotion`, and the save/cancel buttons rely on the shared `Button` icon gap instead of `mr-2`.
- Password modal: the three underline fields became bordered `surface-2` groups with `rounded-sm`, 40px minimum height and a `focus-within` ring on the group. Each input has an `id`/`htmlFor` pair (`change-current-password`, `change-new-password`, `change-confirm-password`). The eye toggles lost `tabIndex={-1}`, gained `aria-label`s and 40px hit areas, so they are keyboard reachable. Error/success banners use 3px radius and token status colors; the success icon is now `CheckCircle` instead of a second `AlertCircle`.
- Delete account: warning banner uses `danger/30` border + `danger/5` fill; because `danger` text on that tint computes 4.34 in dark, the copy is `text-ink` and only the icon carries `danger`. Confirmation and password inputs use `htmlFor`/`id` pairs, `surface-2` fills, 4px radius and the shared focus ring.
- Shared cropper (`ImageCropperModal`, also used by the employee form): stage uses `surface-2`/`rounded-md`; zoom uses a 40px native range hit area with semantic `ink-muted` track and `ink` thumb, 4px control radius and a focus ring. Captions use `text-label`/`text-body-sm`, with `tabular-nums` on the zoom percentage.
- Contrast was computed from the OKLCH token values for both themes; the light `ink-muted` on `surface-2` (4.62) and success banner (4.71) sit just above the 4.5 floor, so those pairings should not be darkened later without rechecking.
- `npx prettier --write`, `npx tsc --noEmit`, `npm run lint` and `npm run build` all pass. No browser QA was run, per the established user instruction.

2026-10-30 — Review fixes (Standards + Spec; fixed point `a1e0bec`).

- Moved avatar focus outside its image; inset shadows were covered by child content.
- Zoom range now has a 40px hit area and neutral contrasting track/thumb, not a 6px accent track. Browser-specific native range pseudo-elements cover Chromium/WebKit and Firefox.
- Neutral ghost name-save/cancel controls replace status-colored actions; password icon is neutral. Eye buttons use 4px radius and cannot shrink. Section headings use `text-title font-semibold` rather than eyebrow labels; account list separator is dashed.
- Removed newly added password autocomplete attributes to preserve browser/password-manager behaviour. Keyboard semantics and labels remain required accessibility fixes, not data-flow or page-composition changes.
- Corrected radius/focus claims above. Password banners are 4px, not 3px. The VNĐ chip's explicit 3px padding follows DESIGN.md's chip specification, not an arbitrary style value.
- Manual QA remains deferred; the checked static checklist is not evidence of a rendered browser pass.
- Judgement-call debt for ticket 17: repeated inset focus strings and form-field class strings. No shared abstraction added during this screen migration.
