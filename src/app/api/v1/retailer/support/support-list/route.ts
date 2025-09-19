import 'server-only';
import { NextRequest, NextResponse } from "next/server";
import { apiGetTickets } from "@/features/support/data/endpoints";
import { GetTicketsQuerySchema } from "@/features/support/domain/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const qp: Record<string, any> = {
    page: sp.get('page') ? Number(sp.get('page')) : undefined,
    per_page: sp.get('per_page') ? Number(sp.get('per_page')) : undefined,
    order: (sp.get('order') as 'asc' | 'desc') || undefined,
    sort_by: sp.get('sort_by') || undefined,
    ticket_id: sp.get('ticket_id') || undefined,
    status: sp.get('status') || undefined,
    priority: sp.get('priority') || undefined,
    sr_number: sp.get('sr_number') ? Number(sp.get('sr_number')) : undefined,
  };
  const parsed = GetTicketsQuerySchema.safeParse(qp);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const data = await apiGetTickets(parsed.data);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch tickets" }, { status: 500 });
  }
}
