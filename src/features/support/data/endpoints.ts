import { getJSON, postJSON } from '@/lib/api/client';
import {
  GetTicketsQuery,
  GetTicketsQuerySchema,
  GetTicketsResponse,
  GetTicketsResponseSchema,
  type GetTicketsResponse as GetTicketsResponseType,
} from '@/features/support/domain/types';

const TICKET_LIST_PATH = '/retailer/support/support-list';

export async function apiGetTickets(
  query: GetTicketsQuery
): Promise<GetTicketsResponseType> {
  const q = GetTicketsQuerySchema.parse(query);
  const sp = new URLSearchParams();
  if (q?.page !== undefined) sp.set('page', String(q.page));
  if (q?.per_page !== undefined) sp.set('per_page', String(q.per_page));
  if (q?.order !== undefined) sp.set('order', q.order);
  if (q?.sort_by !== undefined) sp.set('sort_by', q.sort_by);
  if (q?.ticket_id !== undefined) sp.set('ticket_id', q.ticket_id);
  if (q?.status !== undefined) sp.set('status', String(q.status));
  if (q?.priority !== undefined) sp.set('priority', String(q.priority));
  if (q?.sr_number !== undefined) sp.set('sr_number', String(q.sr_number));
  const path = sp.toString()
    ? `${TICKET_LIST_PATH}?${sp.toString()}`
    : TICKET_LIST_PATH;
  const res = await getJSON<unknown>(path, { redirectOn401: true, redirectPath: '/signin' });
  return GetTicketsResponseSchema.parse(res);
}