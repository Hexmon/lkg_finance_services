/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { AUTHERIZATION_ENDPOINT } from "@/config/endpoints";
import {
  CreateTicketRequestSchema,
  CreateTicketResponseSchema,
  GetTicketsResponseSchema,
  type CreateTicketRequest,
} from "@/features/support/domain/types";
import { supportFetch } from "@/app/api/_lib/http-support";

export const dynamic = "force-dynamic";

/**
 * BFF: POST /api/v1/retailer/support/support-list
 * -> POST {AUTH_BASE_URL}/secure/create-ticket
 * On 409, returns { existing_ticket } for the same transaction_id (status=OPEN).
 */
export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: CreateTicketRequest;
  try {
    const raw = await req.json();
    payload = CreateTicketRequestSchema.parse(raw);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: "Validation failed", issues: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    const upstream = await supportFetch<unknown>(
      AUTHERIZATION_ENDPOINT.AUTH_SUPPORT_CREATE_TICKET_PATH, // '/secure/create-ticket'
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      }
    );

    const parsed = CreateTicketResponseSchema.parse(upstream);
    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;

    if (status === 409 && payload.transaction_id) {
      try {
        const existing = await supportFetch<unknown>(
          AUTHERIZATION_ENDPOINT.AUTH_SUPPORT_TICKETS_PATH, // '/secure/tickets'
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            query: {
              transaction_id: payload.transaction_id,
              status: "OPEN",
              per_page: 1,
              page: 1,
              order: "desc",
              sort_by: "created_at",
            },
          }
        );
        const safe = GetTicketsResponseSchema.parse(existing);
        const existing_ticket =
          Array.isArray(safe.data) && safe.data.length > 0 ? safe.data[0] : null;

        return NextResponse.json(
          {
            status,
            error:
              err?.data?.error ?? {
                code: "ERROR_CODE_RECORD_EXIST",
                message: "Record already exists",
                field_name: "ticket_status",
              },
            existing_ticket,
          },
          { status: 409 }
        );
      } catch {
        // fall through if lookup fails
      }
    }

    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? "Create ticket failed" } },
      { status }
    );
  }
}
