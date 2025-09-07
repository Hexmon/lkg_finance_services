// src/lib/auth/session.ts
// tiny client for session probing via cookies-backed Next API

import { getJSON } from '@/lib/api/client';

export type SessionInfo = {
  authenticated: boolean;
  userId: string | null | undefined;
};

export async function fetchSession(signal?: AbortSignal): Promise<SessionInfo> {
  return getJSON<SessionInfo>('auth/session', { signal });
}
