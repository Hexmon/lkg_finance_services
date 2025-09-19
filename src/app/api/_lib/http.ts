// import 'server-only';
// import { BASE_URLS } from '@/config/endpoints';

// const BASE = BASE_URLS.AUTH_BASE_URL;
// const API_KEY = process.env.AUTH_API_KEY || '';
// const TIMEOUT_MS = 20_000;

// function withTimeout(signal?: AbortSignal | null) {
//   const ctl = new AbortController();
//   const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
//   if (signal) signal.addEventListener('abort', () => ctl.abort(), { once: true });
//   return { signal: ctl.signal, cancel: () => clearTimeout(id) };
// }

// export async function authFetch<T>(path: string, init?: { method?: string; headers?: HeadersInit; body?: unknown; signal?: AbortSignal; }) {
//   const url = `${BASE}${path}`;
//   const { signal, cancel } = withTimeout(init?.signal);
//   try {
//     const res = await fetch(url, {
//       method: init?.method ?? 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
//         ...init?.headers,
//       },
//       body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
//       cache: 'no-store',
//       signal,
//     });

//     const text = await res.text();
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let data: any = undefined;
//     try { data = text ? JSON.parse(text) : undefined; } catch { /* non-JSON */ }

//     if (!res.ok) {
//       const status = res.status || data?.status || 500;
//       const message = data?.message || `Upstream error (${status})`;
//       throw Object.assign(new Error(message), { status, data });
//     }
//     return data as T;
//   } finally {
//     cancel();
//   }
// }

// src/app/api/_lib/http.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { BASE_URLS } from '@/config/endpoints';

const BASE = BASE_URLS.AUTH_BASE_URL;
const API_KEY = process.env.AUTH_API_KEY || '';
const TIMEOUT_MS = 20_000;

export type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>; // <-- ensure this is here
  signal?: AbortSignal;
};

function withTimeout(signal?: AbortSignal | null) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => ctl.abort(), { once: true });
  return { signal: ctl.signal, cancel: () => clearTimeout(id) };
}

function buildUrl(base: string, path: string, query?: HttpOptions['query']) {
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

export async function authFetch<T>(path: string, init?: HttpOptions) {
  const method = (init?.method || 'GET').toUpperCase() as HttpOptions['method'];
  const url = buildUrl(BASE, path, init?.query); // <-- uses query
  const { signal, cancel } = withTimeout(init?.signal);

  const headers = new Headers({
    Accept: 'application/json',
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
    const text = await res.text();
    let data: unknown = undefined;
    try { data = text ? JSON.parse(text) : undefined; } catch { }

    if (!res.ok) {
      const status = res.status || (data as any)?.status || 500;
      const message = (data as any)?.message || `Upstream error (${status})`;
      throw Object.assign(new Error(message), { status, data });
    }
    return data as T;
  } finally {
    cancel();
  }
}
