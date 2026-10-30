# 06: Primitives B — overlays and feedback

**What to build:** Modal, Dropdown, ToastProvider, Skeleton, and Loader share the new visual language, with motion tokens applied and reduced-motion respected, without changing their public prop APIs or behavior.

**Blocked by:** 03 (Token layer).

**Status:** ready-for-agent

- [ ] All five primitives are styled exclusively through semantic tokens; no raw values.
- [ ] Enter/exit motion uses motion tokens and is suppressed under reduced-motion.
- [ ] Focus management, dismissal, and stacking behavior are unchanged.
- [ ] Prop APIs are unchanged; any new variants are additive.
- [ ] Verified in both themes and at both breakpoints.
