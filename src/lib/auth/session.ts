// src/lib/auth/session.ts
import { getJSON } from '@/lib/api/client';
export type SessionInfo = { authenticated: boolean; userId: string | null | undefined };

// No signal arg — reduces cascade aborts showing up as (canceled)
export async function fetchSession(): Promise<SessionInfo> {
  return getJSON<SessionInfo>('auth/session');
}
