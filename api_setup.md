PROJECT CONTEXT
- Framework: Next.js 15.5 (App Router) / React 19 / TS 5 / Tailwind v4 / ESLint 9
- State: Redux Toolkit + redux-persist (already set up at src/lib/store)
- Query: TanStack Query v5
- Path alias: @/* → ./src/*  (✅ assumed; confirm in tsconfig)
- Providers file: src/app/providers.tsx (✅ yes)
- Existing HTTP clients to reuse: 
  - auth client at src/features/auth/data/client.ts (✅ reuse)
  - base client at src/lib/http/... (path if any): <<<none>>>
- Packages already installed (besides core): antd, @ant-design/icons, @tanstack/react-query, @tanstack/react-query-devtools, react-redux, redux-persist, zod
- Do not modify UI. Generate hooks only.

MODULE OVERVIEW
- Module name (folder under src/features): bbps
- Purpose: BBPS bill/recharge flows (prepaid plan fetch + payment; postpaid bill fetch + payment; txn status; complaints; online-biller batch ops).
- Base URLs:
  - UAT: https://bbps-uat.bhugtan.in
  - PROD: <<<TBD>>> 
- Auth model (per request unless overridden):
  - Bearer token from Redux auth slice: (✅ yes)
  - X-API-Key header: (✅ yes) | Key env var name: <<<BBPS_API_KEY (server-only) or NEXT_PUBLIC_BBPS_API_KEY if truly public>>>
  - Extra static headers (if any): Content-Type: application/json
- Timeouts: 20000
- Error envelope (typical failure shape): <<<TBD – sample JSON needed>>>
- Pagination style (if any): <<<none/TBD>>> + response meta shape <<<TBD>>>
- Rate limit headers (if provided): <<<none/TBD>>>
- RBAC notes (if any): <<<TBD – permission keys if UI gates actions>>>

ENDPOINTS
# For each endpoint, add one block. Duplicate as needed #

1) Endpoint name: Fetch All Plans (Prepaid)
   Method & path: GET /secure/bbps/bills/all-plans/{tenantId}/{billerId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Query params: <<<none>>>
   Request body (if applicable): <<<n/a>>>
   Success response: <<<TBD – array of plans (id, amount, talkTime, validity, description, circle, etc.)>>>
   Error response (if special): <<<TBD>>>
   Hook kind: query
   Cache key suggestion: ['bbps','plans', billerId]
   Invalidates: <<<n/a>>>

2) Endpoint name: Bill Fetch (Postpaid)
   Method & path: POST /secure/bbps/bills/bill-fetch/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Query params: <<<none>>>
   Request body: <<<TBD – e.g., { billerId, customerParams: { mobile|account|dob|... } }>>>
   Success response: <<<TBD – bill details, amountDue, dueDate, customerName, referenceIds>>>
   Error response: <<<TBD>>>
   Hook kind: query (enabled=false + manual trigger) or mutation (if side-effectful fetch)
   Cache key suggestion: ['bbps','bill', { billerId, lookupKey }]
   Invalidates: <<<n/a>>>

3) Endpoint name: Bill Payment
   Method & path: POST /secure/bbps/bills/bill-payment/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Request body: <<<TBD – e.g., { billerId, amount, planId? , billRef?, customerParams, paymentMode, idempotencyKey? }>>>
   Success response: <<<TBD – txnId, transRefId, status, receipt, gatewayRef, etc.>>>
   Error response (if special): <<<TBD>>>
   Hook kind: mutation
   Invalidates: ['bbps','bill', ...], ['bbps','plans', billerId], ['account','balance'] <<<adjust if needed>>>

4) Endpoint name: Transaction Status
   Method & path: POST /secure/bbps/bills/txn-status/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Request body: <<<TBD – { transRefId } >>>
   Success response: <<<TBD – status, message, timestamps, amount, billerId>>>
   Hook kind: query (polling optional)
   Cache key suggestion: ['bbps','txn-status', transRefId]
   Invalidates: <<<n/a>>>

5) Endpoint name: Register Complaint
   Method & path: POST /secure/bbps/bills/complaint-Reg/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Request body: <<<TBD – { transRefId, category, remarks } >>>
   Success response: <<<TBD – complaintId, status>>>
   Hook kind: mutation
   Invalidates: ['bbps','complaints','list'] <<<if listing exists>>>

6) Endpoint name: Track Complaint
   Method & path: GET /secure/bbps/bills/track-complaint/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Query params: <<<TBD – complaintId or transRefId>>>
   Success response: <<<TBD – status timeline>>>
   Hook kind: query
   Cache key suggestion: ['bbps','complaint', id]
   Invalidates: <<<n/a>>>

7) Endpoint name: Add Online Biller (Batch)
   Method & path: POST /secure/bbps/add-online-biller/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Request body: <<<TBD – { billerId, customerParams, plan/bill details }>>>
   Success response: <<<TBD – biller_batch_id, status>>>
   Hook kind: mutation
   Invalidates: ['bbps','online-billers','list']

8) Endpoint name: Online Biller List
   Method & path: GET /secure/bbps/online-biller-list/{tenantId}
   Requires auth: (Bearer ✅) (API Key ✅)
   Query params: <<<TBD – paging? filters?>>>
   Success response: <<<TBD – list + optional pagination meta>>>
   Hook kind: query
   Cache key suggestion: ['bbps','online-billers','list', params]
   Invalidates: <<<n/a>>>

9) Endpoint name: Update Online Biller
   Method & path: PATCH /secure/bbps/update-online-biller/{biller_batch_id}
   Requires auth: (Bearer ✅) (API Key ✅)
   Request body: <<<TBD – fields updatable>>>
   Success response: <<<TBD>>>
   Hook kind: mutation
   Invalidates: ['bbps','online-billers','list']

ENV & CONFIG
- Env keys to introduce:
  - NEXT_PUBLIC_BBPS_BASE_URL_UAT=https://bbps-uat.bhugtan.in
  - NEXT_PUBLIC_BBPS_BASE_URL_PROD=<<<TBD>>>
  - BBPS_API_KEY=<<<secure server-only>>>   (or NEXT_PUBLIC_BBPS_API_KEY if the provider allows public exposure)
  - NEXT_PUBLIC_BBPS_TENANT_ID=2a249a83-d924-4bae-8976-5e12c52dea30
- Should we generate module-scoped client? (✅ yes – with bearer from Redux + optional API key header)
- Naming for hooks: prefix <<<useBbps...>>> (default: use<Module><Action>)

OUTPUT RULES (important)
- Folder structure under src/features/bbps:
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
- Special behaviors: Recommend `Idempotency-Key` header for payments to avoid double charge (if provider supports).
- Retries: Conservative retries on network errors only; payment mutatons no auto-retry.
- If API key must remain secret, route via Next.js route handlers (app/api/*) and have hooks call your internal endpoints instead.
- Cross-module invalidations: Payment success could invalidate ['account','balance'] or related finance summaries (<<<TBD>>>).
- Anything else: Provide exact request/response JSON (success + error) per endpoint; confirm which endpoints require both bearer and API key; specify any pagination/rate-limit headers.
