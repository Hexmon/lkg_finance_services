# 🔧 Universal API Onboarding Prompt (fill & send)

> Paste the template below and replace every `<<<like this>>>`.

```
PROJECT CONTEXT
- Framework: Next.js 15.5 (App Router) / React 19 / TS 5 / Tailwind v4 / ESLint 9
- State: Redux Toolkit + redux-persist (already set up at src/lib/store)
- Query: TanStack Query v5
- Path alias: @/* → ./src/*
- Providers file: src/app/providers.tsx (✅ yes / ❌ no, if no specify where)
- Existing HTTP clients to reuse: 
  - auth client at src/features/auth/data/client.ts (✅ reuse / ❌ make new generic)
  - base client at src/lib/http/... (path if any): <<<none or path>>>
- Packages already installed (besides core): <<<list if special>>>
- Do not modify UI. Generate hooks only.

MODULE OVERVIEW
- Module name (folder under src/features): <<<e.g., payments>>>
- Purpose: <<<what the module does>>>
- Base URLs:
  - UAT: <<<https://api-uat.example.com>>>
  - PROD: <<<https://api.example.com>>>   (if unknown, put TBD)
- Auth model (per request unless overridden):
  - Bearer token from Redux auth slice: (✅ yes / ❌ no)
  - X-API-Key header: (✅ yes / ❌ no) | Key env var name: <<<NEXT_PUBLIC_...>>>
  - Extra static headers (if any): <<<name: value>>> 
- Timeouts: <<<ms, default 20000>>>
- Error envelope (typical failure shape): <<<example JSON>>>
- Pagination style (if any): (page/pageSize | offset/limit | cursor) + response meta shape <<<example>>>
- Rate limit headers (if provided): <<<X-RateLimit-Limit/Remaining/Reset or none>>>
- RBAC notes (if any): <<<permission keys the UI will check>>>

ENDPOINTS
# For each endpoint, add one block. Duplicate as needed #

1) Endpoint name: <<<List Payments>>>
   Method & path: <<<GET /v1/payments>>>
   Requires auth: (Bearer ✅/❌) (API Key ✅/❌)
   Query params: <<<page,pageSize,status? string>>>
   Request body (if applicable): <<<zod-ish description or example>>>
   Success response: <<<full JSON example>>>
   Error response (if special): <<<JSON example>>>
   Hook kind: (query/mutation)
   Cache key suggestion: <<<['payments','list']>>>
   Invalidates: <<<which keys should be invalidated after mutations>>>

2) Endpoint name: <<<Create Payment>>>
   Method & path: <<<POST /v1/payments>>>
   Requires auth: (Bearer ✅/❌) (API Key ✅/❌)
   Request body: <<<example>>>
   Success response: <<<example>>>
   Hook kind: mutation
   Invalidates: <<<['payments','list']>>>

... (add as many as needed)

ENV & CONFIG
- Env keys to introduce:
  - NEXT_PUBLIC_<MODULE>_BASE_URL_UAT=<<<url>>>
  - NEXT_PUBLIC_<MODULE>_BASE_URL_PROD=<<<url or blank>>>
  - NEXT_PUBLIC_<MODULE>_API_KEY=<<<optional>>>
  - Custom path envs (if you want overridable paths): <<<list or none>>>
- Should we generate module-scoped client? (✅ yes / ❌ no, reuse auth client)
- Naming for hooks: prefix <<<usePayments...>>> (default: use<Module><Action>)

OUTPUT RULES (important)
- Folder structure under src/features/<module>:
  - domain/types.ts           # Zod schemas + TS types
  - data/client.ts            # module-scoped client (or factory usage)
  - data/endpoints.ts         # low-level fetchers per endpoint
  - data/hooks.ts             # React Query hooks (queries/mutations)
  - index.ts                  # barrel export
- Respect SSR safety: no require(), no window on server, use AbortController timeout
- No `any`. No mixing `??` and `||` without parentheses.
- Use Zod for schema validation at boundaries.
- Only generate UI if explicitly asked (default: no UI).
- If Redux changes are needed (e.g., tokens from a new login flow), state slice path is src/lib/store/slices/authSlice.ts.

ADDITIONAL NOTES
- Special behaviors (idempotency keys, retries, file uploads, multipart, SSE, websockets): <<<details or none>>>
- Cross-module invalidations (e.g., creating invoice should invalidate finance reports): <<<list or none>>>
- Anything else: <<<...>>>
```

---

## 🧾 What you’ll get back from me (per submission)

1. **Dependencies** to add (if any).
2. **.env keys** (UAT/PROD/API keys/paths) with sample values.
3. **Folder structure** (exact tree) under `src/features/<module>`.
4. **All file contents**:

   * `domain/types.ts` with Zod schemas and TS types.
   * `data/client.ts` (module client or factory usage) — SSR-safe, Bearer/API key, timeouts, normalized ApiError.
   * `data/endpoints.ts` — one function per endpoint, using schemas.
   * `data/hooks.ts` — `useXxxQuery` / `useXxxMutation` with proper cache keys & invalidations.
   * `index.ts` barrel for nice imports.
5. **Integration notes**:

   * exact `import` lines for hooks,
   * which queries get invalidated by which mutations,
   * where to add cross-module cache invalidations if requested.
6. **Optional adjustments** to existing files (only if necessary), with minimal diffs.

---

## ✅ Example (tiny, to show style)

If you gave:

* Module: `payments`
* Base URL (UAT): `https://pay-uat.example.com`
* Endpoints:

  * `GET /v1/payments?page&pageSize` (Bearer yes, API key no) → list
  * `POST /v1/payments` (Bearer yes) → create

I will return (abridged):

```
src/features/payments/
  domain/types.ts         # Zod: Payment, ListQuery, ListResponse, CreateBody, CreateResponse
  data/client.ts          # base URL from env, Bearer from Redux, timeout, ApiError
  data/endpoints.ts       # apiListPayments, apiCreatePayment
  data/hooks.ts           # useListPaymentsQuery, useCreatePaymentMutation
  index.ts
```

…and the code will match your project conventions (no `require`, SSR-safe, no `any`, strict schemas).
