# WS-02 Service Conventions

_Last updated: November 8, 2025_

## Purpose

WS-02 standardizes how frontend services talk to Supabase so that contexts, hooks, and future server actions can share a single, predictable data layer. This note captures the contract every service module follows.

## Module Layout

- Location: `frontend/services/*.ts` (one module per domain).
- Shared helpers live in `frontend/services/serviceHelpers.ts` and may be extended rather than duplicated.
- Barrel exports come from `frontend/services/index.ts` to keep imports consistent.

## Naming

- Export a `*Service` object (e.g., `guidesService`) with methods for the supported operations.
- Re-export individual functions for tree shaking when only one operation is required.
- Types for hydrated records use the `Record` suffix (`CategoryRecord`, `DivisionRecord`, `TagRecord`).

## Inputs

- Accept plain data objects (already validated upstream) or simple primitives such as IDs and filter strings.
- Callers pass domain models (`GuideData`, `HeroImage`) rather than raw Supabase rows.
- Mutation helpers accept partials only when the API truly supports optional fields.

## Outputs

- Always return hydrated domain objects (never raw `PostgrestResponse`).
- Normalise identifiers to strings when table keys are numeric so React components can rely on stable keys.
- `refresh*` helpers return composite payloads when multiple datasets must be fetched together.

## Error Semantics

- Wrap every Supabase call with `withSupabase`.
- Let `handleSupabaseError` throw a rich `Error` with the supplied fallback message; callers surface those to UI state.
- Never swallow errors—if recovery is possible, perform it in the service before rethrowing.

## Logging

- The helper logs every request (`logApiCall`) and response (`logApiResponse`) when an endpoint and method are provided.
- Use `logger` directly only for additional context that cannot be expressed via the helper (e.g., serialization warnings).

## Serialization

- Services are responsible for converting between domain structures and stored JSON.
- Use focused utilities (such as `serializeContent` in `guidesService.ts`) to retain parity with Supabase JSON columns.

## Type Strategy

- Start from generated Supabase types (`Database[...]`) and derive slimmer shapes via `Pick`, mapped types, or dedicated `Record` interfaces.
- Export feature-specific constants (e.g., `MAX_FEATURED_GUIDES`) as part of the service for reuse in UI validation.

## Extending the Pattern

1. Add new functions to the service module.
2. Update the barrel export (`services/index.ts`).
3. Move any heavy lifting (transforms, validation) into small private helpers so tests can target them directly.

Following these conventions keeps contexts thin, improves observability, and prepares the codebase for future server-side data fetching.
