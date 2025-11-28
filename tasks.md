# TravelHosta Delivery Plan

**Last Updated:** November 28, 2025  
**Status:** WS-01–WS-03 shipped; pivoting to diagnostics and tooling

---

## 🎯 Primary Objectives (Q4 2025)

- Restore server-rendering paths and reduce client-side overfetching.
- Standardize the data layer around reusable services and transport helpers.
- Simplify critical UI flows (auth + admin tooling) for maintainability and testing.
- Raise automated test coverage above 50% to protect refactors.
- Document the new conventions so additional contributors can onboard quickly.

---

## 🗂️ Workstream Overview

| ID | Workstream | Goal | Target Window | Notes |
| -- | ---------- | ---- | ------------- | ----- |
| WS-01 | Provider Footprint | Scope client providers to only the routes that need them and restore SSR where possible. | Weeks 1-2 | ✅ Completed Nov 8 (regression smoke pending). |
| WS-02 | Services & Data Access | Create modular services for guides, categories, hero, and auth; migrate contexts to consume them. | Weeks 2-4 | ✅ Completed Nov 8 (see `WS-02_SERVICE_CONVENTIONS.md`). |
| WS-03 | Auth Rationalization | Remove duplicate session caches, streamline `AuthContext`, and rely on Supabase persistence. | Weeks 3-4 | ✅ Completed Nov 28 (Supabase-first auth stack live; tests added). |
| WS-04 | Admin UX Decomposition | Break down mega-components (e.g., `GuideContentEditor`) into smaller, testable modules. | Weeks 4-6 | Coordinate with WS-02 service changes. |
| WS-05 | Diagnostics Discipline | Route console usage through `logger`, add ESLint guardrails, and wire error utilities into fetchers. | Weeks 1-2 | Lightweight, keeps telemetry clean. |
| WS-06 | Tooling Modernization | Update `tsconfig`, lint rules, and scripts to match Next 15 expectations. | Weeks 2-3 | Re-run type check & CI smoke after changes. |
| WS-07 | Quality Safety Net | Establish Jest + RTL, add regression suites for parsers/hooks/components. | Weeks 3-6 | Parallel effort once WS-01 lands. |
| WS-08 | Knowledge Base | Publish architecture overview, testing guide, and migration notes. | Weeks 5-6 | Should reflect outcomes of WS-01–WS-07. |

---

## 🛠️ Detailed Task Backlog

### WS-01 · Provider Footprint
1. Audit current `Providers` usage and map each consumer route. (`frontend/components/Providers.tsx`) **(Complete – see `WS-01_PROVIDER_MAP.md`)**
2. Move `GuidesProvider`, `CategoriesProvider`, and `HeroProvider` into the admin feature shell and homepage only. **(Complete – scoped to `app/page.tsx`, `app/guides/page.tsx`, `app/guides/[id]/page.tsx`, and `app/admin/layout.tsx`)**
3. Ensure public routes (`/about`, `/terms`, `/guides/[id]`, etc.) render without client hydration unless required. **(Complete – `PlaceholderPage` now server-rendered with `PublicNavbar`)**
4. Validate Supabase calls through React server components or route handlers where feasible. **(Complete – confirmed all Supabase usage lives inside scoped context providers; deeper server migration scheduled for WS-02)**

### WS-02 · Services & Data Access
1. Create `services/guidesService.ts`, `services/categoriesService.ts`, `services/heroService.ts` with a consistent API (fetch, mutate, hydration helpers). **(Complete)**
2. Refactor contexts to delegate persistence logic to these services; restrict contexts to state orchestration. **(Complete)**
3. Introduce shared fetch helpers (e.g., `withSupabase`, `handleSupabaseError`) to eliminate repeated try/catch blocks. **(Complete)**
4. Document service conventions (inputs, outputs, error semantics). **(Complete – see `WS-02_SERVICE_CONVENTIONS.md`)**

### WS-03 · Auth Rationalization
1. Collapse `sessionCache` redundancy; rely on Supabase `persistSession` and `logger` instrumentation. **(Complete – `AuthContext` now defers to Supabase; `utils/sessionCache.ts` deprecated shim)**
2. Simplify `AuthContext` to derive state from a single source of truth, removing console noise and repeated retries. **(Complete – centralized sync with `authService.validateSession`)**
3. Extract admin policy helpers (isAdmin, isSuperAdmin) into `services/authService.ts` or a new `authPolicies.ts`. **(Complete – see `services/authPolicies.ts`)**
4. Backfill integration tests for sign-up/sign-in flows using Supabase stubs. **(Complete – `tests/authService.test.ts`)**

### WS-04 · Admin UX Decomposition
1. Split `GuideContentEditor` into subcomponents (language switcher, toolbar, editor, preview, table modal) with clear props.
2. Apply the same pattern to other complex admin modules (`GuidesManagement`, `EnhancedGuideForm`).
3. Add Storybook-style sandboxes or minimal render tests to lock UI expectations.
4. Ensure new modules live under `components/admin/editor/` (or similar) for discoverability.

### WS-05 · Diagnostics Discipline
1. Replace remaining `console.*` usage (notably `app/guides/[id]/page.tsx`) with `logger` helpers. _(In progress – align next sprint once auth telemetry settles.)_
2. Add ESLint rule: `no-console` with `warn`/`error` exceptions and document the policy in the README.
3. Promote `logApiCall`/`logApiResponse` usage inside service modules.
4. Review `logger` feature flags to guarantee silence in production builds.

### WS-06 · Tooling Modernization
1. Update `tsconfig.json` to target at least `ES2018`, disable `allowJs`, and adopt Next.js recommended defaults.
2. Verify build/lint/test scripts after the change and adjust CI if needed.
3. Add `eslint-config-next` rules for hooks/exhaustive-deps to reduce stale effects.
4. Capture any migration gotchas in the knowledge base (WS-08).

### WS-07 · Quality Safety Net
1. Install Jest, React Testing Library, and supporting utilities; configure `setupTests.ts`.
2. Seed tests for content parsers, sanitization helpers, and error utilities.
3. Add hook tests (`useGuideForm`, `useContentParser`) and component tests (`ErrorBoundary`, `GuideCard`).
4. Set 50% line coverage as the interim gate; document gaps that remain high risk.

### WS-08 · Knowledge Base
1. Draft `ARCHITECTURE.md` describing provider placement, service boundaries, and logging conventions.
2. Create `TESTING_GUIDE.md` covering tooling setup, sample tests, and CI expectations.
3. Update `README.md` with an “Architecture at a Glance” section.
4. Publish migration notes for new contributors (e.g., “Working with services” cheatsheet).

---

## 🚦 Execution Cadence

- **Weekly Check-in:** 30 minutes to unblock cross-workstream dependencies.
- **Demo Fridays:** Showcase tangible progress (e.g., SSR restored, new tests passing) to stakeholders.
- **Definition of Done:** Workstream stories ship with tests, docs, and logger instrumentation updated.

---

## 📈 Success Metrics

| Metric | Baseline (Nov 2025) | Target | Measurement |
| ------ | ------------------- | ------ | ----------- |
| Public routes rendered via SSR | ~0% | >70% | Next.js build analysis + Lighthouse |
| Automated test coverage | 0% | ≥50% | Jest coverage report |
| Console policy violations | 6 files | 0 files | ESLint + CI gate |
| Mega-component line count | >700 lines (3 files) | <350 lines each | `wc -l` in CI |
| Architecture docs freshness | Stale | “Current” within 30 days | Handbook timestamps |

---

## 📎 Reference Material

- `CODEBASE_AUDIT_REPORT.md` – Deep-dive findings that inspired this reset.
- `REFACTORING_TASKS.md` – Legacy phases; use only for historical context.
- `utils/logger.ts` & `constants/app.ts` – Canonical patterns to reuse.
- `frontend/contexts/*` – Current hotspots targeted by WS-01 through WS-04.

---

## 🧭 Immediate Next Steps (Week 1)

1. Run a quick regression of `/`, `/guides`, `/guides/[id]`, and admin routes to confirm provider scoping holds as auth changes land.
2. Draft the ESLint `no-console` rule change and run it locally to surface offenders (kick off WS-05).
3. Prioritize lint warning cleanup (unused variables, `@next/next/no-img-element`) as part of WS-05 diagnostics.
4. Communicate the updated plan to the team, highlighting WS-03 completion and upcoming WS-05/WS-06 focus areas.

---

_This plan supersedes the previous Phase 1–4 roadmap. Update this document at the close of each sprint so it remains the single source of truth._
