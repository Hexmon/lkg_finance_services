import { getJSON, postJSON } from '@/lib/api/client';
import {
  CreateTicketRequestSchema,
  CreateTicketResponseSchema,
  type CreateTicketRequest,
  type CreateTicketResponse,
  GetTicketsQuerySchema,
  GetTicketsResponseSchema,
  type GetTicketsQuery,
  type GetTicketsResponse,
} from '../domain/types';

/* -------------------- create ticket (existing) -------------------- */
// BFF path (this file maps to the route.ts above)
const CREATE_TICKET_PATH = '/retailer/support/support-list'; // (unchanged as per your existing mapping)

export async function apiCreateTicket(
  body: CreateTicketRequest
): Promise<CreateTicketResponse> {
  const payload = CreateTicketRequestSchema.parse(body);

  const res = await postJSON<unknown>(CREATE_TICKET_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return CreateTicketResponseSchema.parse(res);
}

/* -------------------- get tickets (new) -------------------- */
const GET_TICKETS_PATH = '/retailer/support/get-tickets';

function buildQueryPath(path: string, query?: GetTicketsQuery) {
  if (!query) return path;
  const q = GetTicketsQuerySchema.parse(query);

  const qs = new URLSearchParams();
  if (typeof q.per_page === 'number') qs.set('per_page', String(q.per_page));
  if (typeof q.page === 'number') qs.set('page', String(q.page));
  if (q.order) qs.set('order', q.order);
  if (q.sort_by) qs.set('sort_by', q.sort_by);
  if (q.ticket_id) qs.set('ticket_id', q.ticket_id);
  if (q.status) qs.set('status', q.status);
  if (q.priority) qs.set('priority', q.priority);
  if (typeof q.sr_number !== 'undefined') qs.set('sr_number', String(q.sr_number));

  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

export async function apiGetTickets(
  query?: GetTicketsQuery
): Promise<GetTicketsResponse> {
  const path = buildQueryPath(GET_TICKETS_PATH, query);
  const res = await getJSON<unknown>(path, {
    redirectOn401: true,
    redirectPath: '/signin',
  });
  return GetTicketsResponseSchema.parse(res);
}
