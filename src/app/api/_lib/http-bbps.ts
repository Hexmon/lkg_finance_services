import 'server-only';
import { BASE_URLS } from '@/config/endpoints';

const BASE = BASE_URLS.BBPS_BASE_URL;
const RAW_API_KEY = process.env.BBPS_API_KEY ?? process.env.RETAILER_API_KEY ?? process.env.AUTH_API_KEY ?? '';
const API_KEY = RAW_API_KEY.trim() || undefined;
const TIMEOUT_MS = 20_000;

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
};

function withTimeout(signal?: AbortSignal | null) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => ctl.abort(), { once: true });
  return { signal: ctl.signal, cancel: () => clearTimeout(id) };
}

function buildUrl(base: string, path: string, query?: Options['query']) {
  // allow absolute URLs just in case
  const url = path.startsWith('http')
    ? new URL(path)
    : new URL(`${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v == null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function shouldSendJsonBody(method?: string, body?: unknown) {
  const m = (method || 'GET').toUpperCase();
  return body !== undefined && m !== 'GET' && m !== 'HEAD';
}

export async function bbpsFetch<T>(path: string, init?: Options) {
  const method = (init?.method || 'GET').toUpperCase() as Options['method'];
  const url = buildUrl(BASE, path, init?.query);
  const { signal, cancel } = withTimeout(init?.signal);

  const headers = new Headers({
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...(init?.headers || {}),
  });

  const opts: RequestInit = { method, headers, cache: 'no-store', signal };

  if (shouldSendJsonBody(method, init?.body)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    opts.body = JSON.stringify(init!.body);
  }

  try {
    const res = await fetch(url, opts);
    const bodyText = await res.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = undefined;
    try { data = bodyText ? JSON.parse(bodyText) : undefined; } catch { /* non-JSON */ }

    if (!res.ok) {
      const status = res.status || data?.status || 500;
      const message = (data && (data.message || data.error || data.detail)) || `Upstream error (${status})`;
      const err = new Error(message) as Error & { status?: number; data?: unknown; bodyText?: string; url?: string };
      err.status = status;
      err.data = data;
      err.bodyText = bodyText;
      err.url = url;
      throw err;
    }

    return (data as T) ?? (undefined as unknown as T);
  } finally {
    cancel();
  }
}
