# 14: Screen — Payroll

**What to build:** The payroll screen — totals, payment modal, and money figures — speaks the new visual language with unambiguous figures and trustworthy presentation in both themes.

**Blocked by:** 05 (Primitives A), 06 (Primitives B), 07 (Primitives C), 08 (Icon standard), 09 (Layout shells).

**Status:** ready-for-agent

- [x] Money and totals use tabular figures (`tabular-nums` on every money, count and date figure) so columns compare cleanly.
- [x] Payment modal and status colors use the `src/config/colors.ts` mapping (unpaid = `warning`, paid/regular = `success`, advanced = `info`, settlement/total-earned = `accent-ink`); where a status text fails on `surface-2` in light, the color sits on a 6px square dot and the label stays `text-ink-soft`.
- [x] Styled exclusively through semantic tokens; status text clears WCAG AA on `bg-surface` by computed contrast (4.77–5.83:1). The visual confirmation of that claim happens in the screen QA sweep.
- [x] Static checklist passes: token-only colors, 3/4/6px radii, no shadows or gradients, no uppercase micro-labels, focus rings on payroll controls, reduced-motion honored through the shared motion config. The manual pass at both themes and both breakpoints is deferred (user instruction: static checks + review only).

## Comments

2026-10-30 — Implemented (static verification only, per user instruction).

- Accent band → surface card: `PayrollStats` root `bg-accent/10 border-accent/20 rounded-lg` is now `bg-surface border-line rounded-md`; the decorative accent corner blob in `PaymentModal` and the fake green avatar "online" dot are gone, so every panel is flat surface + 1px line.
- Raw hues now follow `src/config/colors.ts`: `text-blue-500`/`text-orange-500`/`text-green-500`/`border-orange-500`/`border-blue-500` → `accent-ink` (total earned, settlement), `warning` (unpaid/remaining), `info` (advanced), `success` (paid/regular), `danger` (settlement error); `text-slate-*`/`border-slate-300` → `ink-muted`; `text-red-500` → `text-danger`.
- Motion durations read from `@/lib/motion` (`DURATION_BASE`) in `PayrollStats`, `PayrollList`, `HistoryList`; CSS transitions use `duration-fast ease-standard`. No `transition-all` left in the ticket's files.
- Money, counts and dates: `text-data` for the headline totals, `text-body-sm` for row amounts, `tabular-nums` on every figure (including `Số tiền cần trả thêm`, the bank account number, month/year labels and the transaction timestamp).
- Status chips are `bg-surface-2` + 3px radius + 6px square dot carrying the status color, with `text-label font-medium text-ink-soft` labels: history `Ứng tiền` (info) / `Quyết toán` (accent-ink), transaction `Thanh toán thường` (success), payroll `Có phụ phí` (info). Inline status text stays on `bg-surface`, where warning 4.77 / info 5.83 / success 4.90 / accent-ink 4.83 clear AA.
- Radii: cards/panels/list rows 6px, month and filter controls 4px, chips and selection boxes 3px; avatars stay pill-shaped. The 2px borders on the payment-type cards, QR panel and list containers dropped to 1px.
- Selection controls: payment-type cards and shift rows are `<button type="button">` with `aria-pressed`; the chevron checkboxes are 20px `rounded-xs` + `Check` (`text-on-accent`, strokeWidth 3) instead of a `rounded-full` ring; the export debt toggle became a `<button aria-pressed>` with the same checkbox geometry.
- Clickable rows/selectors: payroll and history rows already were buttons and now carry `focusRingClasses`; year steppers got `aria-label` (`Năm trước`/`Năm sau`), tabs got `aria-pressed`, and the filter control gained the shared ring. No `div`/`span` click handlers remain in the ticket's files.
- 38px floor: year steppers 40px (`h-10 w-10`), select-all link, tabs and the month filter control `min-h-10`.
- `rounded-lg` overrides removed from every `Button` call site; the month picker footer is now `Button variant="secondary" fullWidth` instead of a hand-rolled button.
- Empty-state icons lost the `opacity-20` fade; session labels read `Tiệc Sáng` = `warning`, `Tiệc Chiều` = `accent-ink` as before, now through tokens.
- Deleted the two artifact comments `/* removed unused import ... */` from `src/app/routes/payroll.tsx`.
