# ShiftPay UI

Shared language for the app's interface layer: the vocabulary used when designing, building, and migrating UI.

## Language

**Design token**:
A named visual decision — color, spacing, type, radius, shadow, or motion — that interface styles reference instead of hardcoded values.
_Avoid_: theme variable, style constant

**Primitive token**:
A token holding a raw palette step (brand-500, neutral-900) or raw scale value; semantic tokens are built from these, never used directly by components.
_Avoid_: base color

**Semantic token**:
A token named for its role (surface, text-muted, accent, border) rather than its raw value; themes swap these and the markup stays unchanged.
_Avoid_: alias (that is a compatibility mechanism, not a token tier)

**Primitive**:
A shared interface control (button, modal, input…) that features compose instead of building their own.
_Avoid_: component (too broad — everything is a component), widget

**Layout shell**:
The persistent frame a screen renders inside: the auth shell (full-screen login) and the app shell (sidebar on desktop, bottom tabs on mobile).
_Avoid_: layout (ambiguous with a page's internal layout)

**Design direction**:
One complete visual proposal — palette, typography, spacing, shape, motion — that is adopted or rejected as a whole.
_Avoid_: theme (that is light/dark), style guide
