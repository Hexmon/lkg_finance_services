// src/app/api/_lib/http-retailer.ts
import 'server-only';
import { BASE_URLS } from '@/config/endpoints';

const BASE = BASE_URLS.RETAILER_BASE_URL;
const API_KEY = process.env.RETAILER_API_KEY || process.env.AUTH_API_KEY || '';
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
  const url = new URL(`${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function shouldSendJsonBody(method?: string, body?: unknown) {
  const m = (method || 'GET').toUpperCase();
  return body !== undefined && m !== 'GET' && m !== 'HEAD';
}

export async function retailerFetch<T>(path: string, init?: Options) {
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
    opts.body = typeof init!.body === 'string' ? (init!.body as string) : JSON.stringify(init!.body);
  }

  try {
    const res = await fetch(url, opts);
    const text = await res.text();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = undefined;
    try { data = text ? JSON.parse(text) : undefined; } catch { /* ignore non-JSON */ }

    if (!res.ok) {
      const status = res.status || data?.status || 500;
      const message = data?.message || data?.error?.message || `Upstream error (${status})`;
      throw Object.assign(new Error(message), { status, data });
    }
    return data as T;
  } finally {
    cancel();
  }
}
