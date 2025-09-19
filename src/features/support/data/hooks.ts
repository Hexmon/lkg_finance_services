import { useMutation, useQuery } from '@tanstack/react-query';
import { apiCreateTicket, apiGetTickets } from './endpoints';
import type {
  CreateTicketRequest,
  CreateTicketResponse,
  GetTicketsQuery,
  GetTicketsResponse,
} from '../domain/types';

export function useCreateTicket() {
  const mutation = useMutation<CreateTicketResponse, unknown, CreateTicketRequest>({
    mutationFn: apiCreateTicket,
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    createTicket: mutation.mutate,          // callback style
    createTicketAsync: mutation.mutateAsync // async/await style
  };
}

export function useGetTickets(query: GetTicketsQuery, enabled = true) {
  return useQuery<GetTicketsResponse, unknown>({
    queryKey: ['support', 'tickets', query],
    queryFn: () => apiGetTickets(query),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
