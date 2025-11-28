# WS-01 Provider Footprint – Route Inventory

_Last updated: November 8, 2025_

## Current Mount Points

| Provider | Mount Location | Consumer Scope | Notes |
| -------- | -------------- | --------------- | ----- |
| `AuthProvider` | `components/Providers.tsx` (global) | Navbar (`SigninButton`), auth flows, admin shell | Still global to avoid auth regressions; candidate for lazy segmenting once SSR backlog clears. |
| `GuidesProvider` | `app/page.tsx`, `app/guides/page.tsx`, `app/guides/[id]/page.tsx`, `app/admin/layout.tsx` | Homepage featured cards, guides listing/detail, admin guides tooling | Removed from global wrapper; each route now opts in explicitly. |
| `CategoriesProvider` | `app/guides/page.tsx`, `app/admin/layout.tsx` | Guides filters, admin taxonomy management | Only mounted when filters or admin dashboards need it; no longer global. |
| `HeroProvider` | `app/page.tsx`, `app/admin/layout.tsx` | Homepage hero carousel, admin hero management | Scoped to hero-enabled screens to avoid unnecessary client fetches. |
| `LenisProvider` | `components/Providers.tsx` (global) | Smooth scroll behaviour on client pages | Remains global but only affects client transitions; revisit if SSR-first experience suffers. |

## Route Audit Snapshot

- ✅ `app/page.tsx`: Local `GuidesProvider` + `HeroProvider`; renders featured content without bloating other routes.
- ✅ `app/guides/page.tsx`: Local `GuidesProvider` + `CategoriesProvider`; filters continue to function.
- ✅ `app/guides/[id]/page.tsx`: Local `GuidesProvider`; detail view still hydrates client editor blocks.
- ✅ `app/admin/layout.tsx`: Maintains `Guides`, `Categories`, `Hero` providers for dashboard features.
- ✅ `app/(auth)/signin`, `app/(auth)/signup`: Rely solely on `AuthProvider`; no additional contexts required.
- ✅ Static placeholder routes (`about`, `contact`, `destinations`, `terms`): Now server-rendered via `PlaceholderPage` + `PublicNavbar`, avoiding unnecessary client hydration.

## Component Audit Summary

- ✅ `useGuides` consumers confined to homepage, guides routes, and admin modules already wrapped by local providers.
- ✅ `useCategories` usage limited to guides listing and admin management flows under provider control.
- ✅ `useHero` only consumed by homepage hero and admin hero tools, both inside provider boundaries.
- ℹ️ Supabase interactions remain within context providers; migration to server actions is scheduled under WS-02.

## Next Actions

- [ ] (Manual) Smoke-test `/`, `/guides`, `/guides/[id]`, and admin routes to confirm scoped providers behave as expected.
- [ ] Kick off WS-02 service refactors using the scoped-provider baseline established here.
