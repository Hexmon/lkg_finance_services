import { authRequest } from '@/features/auth/data/client';
import {
  CreateTicketRequest,
  CreateTicketRequestSchema,
  CreateTicketResponse,
  CreateTicketResponseSchema,
  GetTicketsQuery,
  GetTicketsQuerySchema,
  GetTicketsResponse,
  GetTicketsResponseSchema,
  HealthResponse,
  HealthResponseSchema,
} from '../domain/types';

const CREATE_TICKET_PATH =
  process.env.NEXT_PUBLIC_SUPPORT_CREATE_TICKET_PATH || '/secure/create-ticket';
const TICKETS_PATH =
  process.env.NEXT_PUBLIC_SUPPORT_TICKETS_PATH || '/secure/tickets';
const HEALTH_PATH =
  process.env.NEXT_PUBLIC_HEALTH_PATH || '/health';

/** Build query string safely from typed query */
function toSearchParams(q?: GetTicketsQuery): string {
  if (!q) return '';
  const { per_page, page, order, sort_by, ticket_id, status, priority, sr_number } =
    GetTicketsQuerySchema.parse(q);
  const sp = new URLSearchParams();
  if (per_page !== undefined) sp.set('per_page', String(per_page));
  if (page !== undefined) sp.set('page', String(page));
  if (order) sp.set('order', order);
  if (sort_by) sp.set('sort_by', sort_by);
  if (ticket_id) sp.set('ticket_id', ticket_id);
  if (status) sp.set('status', status);
  if (priority) sp.set('priority', priority);
  if (sr_number !== undefined) sp.set('sr_number', String(sr_number));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** POST /secure/create-ticket (Bearer; API Key optional) */
export async function apiCreateTicket(
  payload: CreateTicketRequest
): Promise<CreateTicketResponse> {
  const body = CreateTicketRequestSchema.parse(payload);
  const data = await authRequest<CreateTicketResponse>(
    CREATE_TICKET_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return CreateTicketResponseSchema.parse(data);
}

/** GET /secure/tickets (Bearer; API Key optional) */
export async function apiGetTickets(
  query?: GetTicketsQuery
): Promise<GetTicketsResponse> {
  const url = `${TICKETS_PATH}${toSearchParams(query)}`;
  const data = await authRequest<GetTicketsResponse>(
    url,
    'GET',
    undefined,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return GetTicketsResponseSchema.parse(data);
}

/** GET /health (Bearer; API Key optional) */
export async function apiHealth(): Promise<HealthResponse> {
  const data = await authRequest<HealthResponse>(
    HEALTH_PATH,
    'GET',
    undefined,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return HealthResponseSchema.parse(data);
}
