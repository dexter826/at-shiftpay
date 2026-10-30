# Feature-based source layout

The `src/` tree mixed screens, feature UI, and data access under `components/pages`, so ownership was ambiguous and imports drifted. We adopted the Bulletproof React project structure verbatim — `app/` (routes, router, shell), `features/<feature>/` for the seven domains (`auth`, `calendar`, `dashboard`, `employee`, `location`, `payroll`, `settings`), and shared code in `components/`, `hooks/`, `lib/`, `stores/`, `types/`, `utils/`, `config/`, `assets/` — because it gives each domain one home and keeps the shared-to-feature-to-app flow one-directional.

## Consequences

- Shared Firestore access sits in `lib/api/` for now: the standard has no shared-API folder, and these services are used by more than one feature, so they cannot own a single `features/<f>/api/`.
- `features/settings` used to import `ChangePasswordModal` from `features/auth`; it is now composed at the `app/routes/settings.tsx` level, so features no longer import each other.
- Barrel files still exist (`components/index.ts`, `components/layouts/index.ts`, `lib/api/index.ts`, `stores/index.ts`, `features/auth/index.ts`); the standard discourages them and they are slated for removal in the dead-code pass.
- No `testing/` or `app/provider.tsx` folders were created because the repo has no tests and no global providers yet.
