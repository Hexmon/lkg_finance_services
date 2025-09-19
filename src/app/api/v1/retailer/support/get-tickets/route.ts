import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { GetTicketsQuerySchema, GetTicketsResponseSchema } from '@/features/support/domain/types';
import { authFetch } from '@/app/api/_lib/http';

export async function GET(req: NextRequest) {
    // 1) Read & validate query params
    const url = new URL(req.url);
    const raw = Object.fromEntries(url.searchParams.entries());

    // Coerce numeric fields when present
    const coerced = {
        ...raw,
        per_page: raw.per_page ? Number(raw.per_page) : undefined,
        page: raw.page ? Number(raw.page) : undefined,
        sr_number:
            raw.sr_number !== undefined &&
                raw.sr_number !== '' &&
                !Number.isNaN(Number(raw.sr_number))
                ? Number(raw.sr_number)
                : (raw.sr_number ?? undefined),
    };

    const query = GetTicketsQuerySchema.parse(coerced);

    // 2) Ensure we have JWT (HttpOnly) -> forward as Bearer
    const jar = await cookies();
    const jwt = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!jwt) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 3) Call upstream (no manual QS; use `query`)
    try {
        const upstream = await authFetch<unknown>('/secure/tickets', {
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json',
            },
            query, 
        });

        // 4) Validate & return
        const parsed = GetTicketsResponseSchema.parse(upstream);
        return NextResponse.json(parsed, { status: 200 });
    } catch (err: unknown) {
        const anyErr = err as { status?: number; message?: string; data?: unknown };
        const status = anyErr?.status ?? 502;
        const message = anyErr?.message ?? 'Upstream error';
        return NextResponse.json({ message, data: anyErr?.data }, { status });
    }
}
