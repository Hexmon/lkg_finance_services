// src/lib/auth/hooks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSession, type SessionInfo } from './session';

export function useSession() {
  return useQuery<SessionInfo, unknown, SessionInfo>({
    queryKey: ['auth', 'session'],
    queryFn: () => fetchSession(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: { authenticated: false, userId: null },
    select: (d) => d ?? { authenticated: false, userId: null },
  });
}
