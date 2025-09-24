// src/app/api/v1/auth/change-password/route.ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { AUTHERIZATION_ENDPOINT } from "@/config/endpoints";
import { authFetch } from "@/app/api/_lib/http";
import {
  ChangePasswordRequestSchema,
  ChangePasswordResponseSchema,   // <-- make sure this import exists
  type ChangePasswordRequest,
  type ChangePasswordResponse,
} from "@/features/auth/domain/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: ChangePasswordRequest;
  try {
    body = ChangePasswordRequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const upstream = await authFetch<unknown>(
      AUTHERIZATION_ENDPOINT.AUTH_CHANGE_PASSWORD_PATH, // "/secure/change-password"
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body, // authFetch JSON.stringifies and sets Content-Type
      }
    );

    // Use safeParse so we never throw on shape drift
    const parsed = ChangePasswordResponseSchema.safeParse(upstream);
    if (parsed.success) {
      return NextResponse.json<ChangePasswordResponse>(parsed.data, { status: 200 });
    } else {
      // If upstream returned something unexpected, still pass it through
      return NextResponse.json(upstream, { status: 200 });
    }
  } catch (err: any) {
    const status: number = err?.status ?? err?.data?.status ?? 502;
    const payload =
      err?.data && typeof err.data === "object"
        ? err.data
        : { status, error: { message: err?.message ?? "Change password failed" } };
    return NextResponse.json(payload, { status });
  }
}
