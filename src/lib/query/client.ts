// // src/lib/query/client.ts
// // keep: react-query singleton (unchanged API), cookies handle auth now.

// import { QueryClient } from '@tanstack/react-query';

// let client: QueryClient | null = null;

// export const getQueryClient = () => {
//   if (!client) {
//     client = new QueryClient({
//       defaultOptions: {
//         queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
//         mutations: { retry: 0 },
//       },
//     });
//   }
//   return client;
// };

// src/lib/query/client.ts
import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/client';

let client: QueryClient | null = null;

export const getQueryClient = () => {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          // Don’t auto refetch on focus/reconnect to avoid accidental quick repeats
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,

          // Cache settings as you had
          staleTime: 30_000,

          // ✅ Exactly ONE retry, but only for non-auth errors
          retry: (failureCount, error) => {
            const status = (error as ApiError)?.status;
            if (status === 401 || status === 403) return false; // don't retry auth failures
            return failureCount < 1; // one retry max
          },

          // ✅ Wait 3s before retrying (prevents two hits within 3 seconds)
          retryDelay: () => 3000,
        },

        // Mutations: keep no retries unless you want them
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return client;
};
