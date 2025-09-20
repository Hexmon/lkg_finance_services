// /* eslint-disable @typescript-eslint/no-explicit-any */
// import "server-only";
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
// import { bbpsFetch } from "@/app/api/_lib/http-bbps";
// import {
//   BillerListResponseSchema,
//   type BillerListResponse,
// } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

// export const dynamic = "force-dynamic";

// // ✅ Not a Promise
// type Ctx = { params: { service_id: string; bbps_category_id: string } };

// // Small adapter: upstream (camelCase) -> schema (snake_case) where needed
// function normalizeBiller(u: any) {
//   const out: any = { ...u };

//   // required/commonly used fields in your schema
//   out.biller_id = u.biller_id ?? u.billerId;
//   out.bbps_category_id = u.bbps_category_id; // already matches
//   out.service_id = u.service_id; // already matches

//   // naming differences
//   out.biller_name = u.biller_name ?? u.billerName ?? "";
//   out.biller_alias = u.biller_alias ?? u.billerAliasName ?? null;
//   out.biller_status = u.biller_status ?? u.billerStatus ?? null;
//   out.biller_fetch_requiremet =
//     u.biller_fetch_requiremet ?? u.billerFetchRequiremet ?? null;
//   out.biller_payment_exactness =
//     u.biller_payment_exactness ?? u.billerPaymentExactness ?? null;
//   out.support_pending_status =
//     u.support_pending_status ?? u.supportPendingStatus ?? null;

//   // minor type tweak: some UATs send string "45"
//   out.billerTimeout =
//     typeof u.billerTimeout === "string" ? Number(u.billerTimeout) : u.billerTimeout;

//   // make is_active consistent if only status exists
//   if (typeof out.is_active === "undefined" && typeof u.billerStatus === "string") {
//     out.is_active = u.billerStatus === "ACTIVE";
//   }

//   return out;
// }

// export async function GET(req: NextRequest, { params }: Ctx) {
//   const { service_id, bbps_category_id } = await params;

//   const jar = await cookies();
//   let token = jar.get(AUTH_COOKIE_NAME)?.value;
//   if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   token = token.replace(/^Bearer\s+/i, "").trim(); // avoid double Bearer

//   const sp = req.nextUrl.searchParams;
//   const is_offline = sp.get("is_offline") ?? "false";
//   const mode = sp.get("mode") ?? "ONLINE";
//   const opr_id = sp.get("opr_id") ?? undefined;
//   const is_active = sp.get("is_active") ?? undefined;

//   try {
//     const upstream = await bbpsFetch<unknown>(
//       `/secure/bbps/biller-list/${encodeURIComponent(service_id)}/${encodeURIComponent(
//         bbps_category_id
//       )}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//         query: {
//           is_offline,
//           mode,
//           ...(opr_id ? { opr_id } : {}),
//           ...(is_active ? { is_active } : {}),
//         },
//       }
//     );

//     // Normalize and validate
//     const normalized: BillerListResponse = {
//       status: (upstream as any)?.status ?? 200,
//       data: Array.isArray((upstream as any)?.data)
//         ? (upstream as any).data.map(normalizeBiller)
//         : [],
//     };

//     const data = BillerListResponseSchema.parse(normalized);
//     return NextResponse.json<BillerListResponse>(data, { status: 200 });
//   } catch (err: any) {
//     const status = err?.status ?? err?.data?.status ?? 502;
//     return NextResponse.json(
//       err?.data ?? { error: err?.message ?? "Biller list failed", status },
//       { status }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { bbpsFetch } from "@/app/api/_lib/http-bbps";
import {
  BillerListResponseSchema,
  type BillerListResponse,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

export const dynamic = "force-dynamic";

/** This path's validator expects Promise-based params */
type Ctx = { params: Promise<{ service_id: string; bbps_category_id: string }> };

// Small adapter: upstream (camelCase) -> schema (snake_case) where needed
function normalizeBiller(u: any) {
  const out: any = { ...u };

  // required/commonly used fields in your schema
  out.biller_id = u.biller_id ?? u.billerId;
  out.bbps_category_id = u.bbps_category_id;
  out.service_id = u.service_id;

  // naming differences
  out.biller_name = u.biller_name ?? u.billerName ?? "";
  out.biller_alias = u.biller_alias ?? u.billerAliasName ?? null;
  out.biller_status = u.biller_status ?? u.billerStatus ?? null;
  out.biller_fetch_requiremet =
    u.biller_fetch_requiremet ?? u.billerFetchRequiremet ?? null;
  out.biller_payment_exactness =
    u.biller_payment_exactness ?? u.billerPaymentExactness ?? null;
  out.support_pending_status =
    u.support_pending_status ?? u.supportPendingStatus ?? null;

  // minor type tweak: some UATs send string "45"
  out.billerTimeout =
    typeof u.billerTimeout === "string" ? Number(u.billerTimeout) : u.billerTimeout;

  // make is_active consistent if only status exists
  if (typeof out.is_active === "undefined" && typeof u.billerStatus === "string") {
    out.is_active = u.billerStatus === "ACTIVE";
  }

  return out;
}

export async function GET(req: NextRequest, { params }: Ctx) {
  // params is a Promise for this route — await it
  const { service_id, bbps_category_id } = await params;

  // cookies() is sync in route handlers
  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  token = token.replace(/^Bearer\s+/i, "").trim();

  const sp = req.nextUrl.searchParams;
  const is_offline = sp.get("is_offline") ?? "false";
  const mode = sp.get("mode") ?? "ONLINE";
  const opr_id = sp.get("opr_id") ?? undefined;
  const is_active = sp.get("is_active") ?? undefined;

  try {
    const upstream = await bbpsFetch<unknown>(
      `/secure/bbps/biller-list/${encodeURIComponent(service_id)}/${encodeURIComponent(
        bbps_category_id
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        query: {
          is_offline,
          mode,
          ...(opr_id ? { opr_id } : {}),
          ...(is_active ? { is_active } : {}),
        },
      }
    );

    // Normalize and validate
    const normalized: BillerListResponse = {
      status: (upstream as any)?.status ?? 200,
      data: Array.isArray((upstream as any)?.data)
        ? (upstream as any).data.map(normalizeBiller)
        : [],
    };

    const data = BillerListResponseSchema.parse(normalized);
    return NextResponse.json<BillerListResponse>(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { error: err?.message ?? "Biller list failed", status },
      { status }
    );
  }
}
