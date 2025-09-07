// src/lib/query/client.ts
// keep: react-query singleton (unchanged API), cookies handle auth now.

import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | null = null;

export const getQueryClient = () => {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        mutations: { retry: 0 },
      },
    });
  }
  return client;
};
