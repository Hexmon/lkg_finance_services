You will receive the API details in the next message.
Using those details, generate a complete, type-safe API module that follows this exact structure, style, and conventions.

Project conventions (fixed)

Next.js 15.5 / React 19 / TS 5 / Tailwind v4 / ESLint 9

State: Redux Toolkit + redux-persist (store at src/lib/store)

Query: TanStack Query v5

Path alias: @/* → ./src/*

Providers file: src/app/providers.tsx

Validation: Zod (no any)

SSR safety: No window, no require, use AbortController-based timeout

Auth: Bearer token from state.auth.token (when required)

API key: X-API-Key (when required; env: server BBPS_API_KEY, browser NEXT_PUBLIC_BBPS_API_KEY)

Shared BBPS client available at:

import { retailerRequest, getTenantId } from "@/features/retailer/retailer_bbps/shared/client"

Do not generate any UI. Hooks only.

Output folder & files

Create everything under this module root (I will provide it in the API details):

src/features/<featurePath>/<module>/
  domain/types.ts           # Zod schemas + TS types (requests + responses)
  data/endpoints.ts         # Low-level fetchers calling retailerRequest()
  data/hooks.ts             # React Query hooks (queries/mutations)
  index.ts                  # Barrel exports
  # (Only if explicitly requested: data/client.ts for a module-scoped client.
  # Otherwise always reuse the shared client above.)

Coding rules & style

No any. Use Zod schemas at boundaries.

Timeouts: Use the shared client’s timeout (AbortController).

Headers per endpoint: Support custom static headers (e.g., apiurl) when specified.

Auth & API Key: Respect per-endpoint requirements (Bearer ✅/❌, API Key ✅/❌).

Query params: Build via retailerRequest opts.query.

Paths with tenant: Use getTenantId() and append {tenantId} into paths when specified.

Errors: Throw normalized ApiError from the shared client; do not swallow.

Imports: Use @/* alias. Avoid unused imports.

Zod: Keep strict. Use .passthrough() only when provider response is known to vary.

Naming:

Hook names: use<ModulePascal><ActionPascal>Query/Mutation

Cache keys: Top-level arrays like ["bbps", "<module>", "<resource>", ...]

Endpoint fn names: api<ModulePascal><ActionPascal>

Mutations: Invalidate related queries as appropriate (note them clearly).

Index barrel: Re-export all types + hooks + endpoint functions cleanly.

What to generate (deliverables)

Return only files with code fences and header comments, in this order:

// File: src/features/<featurePath>/<module>/domain/types.ts

Zod request/response schemas per endpoint

Export types via z.infer<>

Handle provider quirks (optional fields, union shapes, passthrough if needed)

// File: src/features/<featurePath>/<module>/data/endpoints.ts

import { retailerRequest, getTenantId } from "@/features/retailer/retailer_bbps/shared/client";

One typed function per endpoint: api<Module><Action>

Insert {tenantId} into the path where required

Apply per-endpoint headers (e.g., { headers: { apiurl: "..." } })

Validate request before sending and response after receiving with Zod

// File: src/features/<featurePath>/<module>/data/hooks.ts

React Query v5 hooks: use...Query / use...Mutation

Clean cache keys; enabled guards for queries needing params

Mutations should invalidateQueries for related lists when appropriate

Also provide an aggregator hook: use<ModulePascal>Api() returning mutateAsync callables for each mutation and query helpers where it makes sense

// File: src/features/<featurePath>/<module>/index.ts

Barrel export types, endpoints, and hooks

(If explicitly requested) // File: src/features/<featurePath>/<module>/data/client.ts

Only generate if I say “module-scoped client ✅” in the next message.

Otherwise, do not create this—always reuse the shared client.

(If provided in details) Safe additions to src/config/endpoints.ts

Append keys under the right tree (e.g., RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.<GROUP>)

Use const string paths (no {tenantId} in the const; tenant gets appended in code)

Show a small diff or the exact block to insert
