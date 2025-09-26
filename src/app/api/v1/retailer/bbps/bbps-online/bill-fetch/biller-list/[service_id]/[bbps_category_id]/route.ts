/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { bbpsFetch } from "@/app/api/_lib/http-bbps";

export const dynamic = "force-dynamic";

// Keep the promise params if your route uses them
type Ctx = { params: Promise<{ service_id: string; bbps_category_id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { service_id, bbps_category_id } = await params;

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
    // If bbpsFetch returns parsed JSON:
    const upstreamJson = await bbpsFetch<any>(
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

    // 🚀 Transparent passthrough (no normalize, no validation)
    return NextResponse.json(upstreamJson, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });

    // If bbpsFetch can give you a Response, do this instead to truly stream:
    // const upstreamRes = await bbpsFetchResponse(...);
    // const body = upstreamRes.body; // ReadableStream
    // return new NextResponse(body, {
    //   status: upstreamRes.status,
    //   headers: {
    //     "content-type": upstreamRes.headers.get("content-type") ?? "application/json",
    //     "cache-control": "no-store",
    //   },
    // });

  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { error: err?.message ?? "Biller list failed", status },
      { status }
    );
  }
}
