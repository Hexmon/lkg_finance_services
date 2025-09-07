import 'server-only';
import { BASE_URLS } from '@/config/endpoints';

const BASE = BASE_URLS.AUTH_BASE_URL;
const API_KEY = process.env.AUTH_API_KEY || '';
const TIMEOUT_MS = 20_000;

function withTimeout(signal?: AbortSignal | null) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => ctl.abort(), { once: true });
  return { signal: ctl.signal, cancel: () => clearTimeout(id) };
}

export async function authFetch<T>(path: string, init?: { method?: string; headers?: HeadersInit; body?: unknown; signal?: AbortSignal; }) {
  const url = `${BASE}${path}`;
  const { signal, cancel } = withTimeout(init?.signal);
  try {
    const res = await fetch(url, {
      method: init?.method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
        ...init?.headers,
      },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
      signal,
    });

    const text = await res.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = undefined;
    try { data = text ? JSON.parse(text) : undefined; } catch { /* non-JSON */ }

    if (!res.ok) {
      const status = res.status || data?.status || 500;
      const message = data?.message || `Upstream error (${status})`;
      throw Object.assign(new Error(message), { status, data });
    }
    return data as T;
  } finally {
    cancel();
  }
}
