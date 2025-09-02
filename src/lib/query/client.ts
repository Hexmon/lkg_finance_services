// src\lib\query\client.ts
import { QueryClient } from '@tanstack/react-query';
import { getAuth } from '@/lib/store/authAccess';

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

/** Build headers with token/userId */
export function authHeaders(extra?: Record<string, string>) {
  const { token, userId } = getAuth();

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { 'X-User-Id': userId } : {}), // <-- optional custom header
    ...extra,
  };
}
