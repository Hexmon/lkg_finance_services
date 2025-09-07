// src/lib/auth/hooks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSession, type SessionInfo } from './session';

export function useSession() {
  return useQuery<SessionInfo>({
    queryKey: ['session'],
    queryFn: ({ signal }) => fetchSession(signal),
    // ↓ make sure we don't reuse a stale "authenticated: true"
    staleTime: 0,
    gcTime: 5 * 60_000,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
  });
}
