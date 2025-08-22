'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiCreateTicket, apiGetTickets, apiHealth } from './endpoints';
import type {
  CreateTicketRequest,
  CreateTicketResponse,
  GetTicketsQuery,
  GetTicketsResponse,
  HealthResponse,
} from '../domain/types';

const QK = {
  tickets: (q?: GetTicketsQuery) => ['support', 'tickets', q ?? {}] as const,
  health: ['support', 'health'] as const,
};

/** Create support ticket */
export function useCreateTicketMutation() {
  return useMutation<CreateTicketResponse, unknown, CreateTicketRequest>({
    mutationFn: (payload) => apiCreateTicket(payload),
  });
}

/** List tickets (with filters/pagination) */
export function useTicketsQuery(query?: GetTicketsQuery, enabled = true) {
  return useQuery<GetTicketsResponse>({
    queryKey: QK.tickets(query),
    queryFn: () => apiGetTickets(query),
    enabled,
    retry: 1,
  });
}

/** Service health check */
export function useHealthQuery(enabled = true) {
  return useQuery<HealthResponse>({
    queryKey: QK.health,
    queryFn: apiHealth,
    enabled,
    retry: 0,
  });
}
