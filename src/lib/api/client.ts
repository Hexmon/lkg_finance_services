// src/lib/api/client.ts
// Production-ready browser client for calling your Next.js BFF routes (/api/v1/**)
// - Adds X-CSRF-Token automatically for unsafe methods (POST/PUT/PATCH/DELETE)
// - Sends cookies (credentials: 'include') but never reads HttpOnly token
// - Clears timeout properly in finally
// - Redirects to /signin on 401 by default (can be disabled per-call)

import { apiLogout } from "@/features/auth/data/endpoints";

let redirectingToSignin = false;
let onUnauthorized: null | (() => void | Promise<void>) = null;

export function registerOnUnauthorized(handler: () => void | Promise<void>) {
  onUnauthorized = handler;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ReqInit = Omit<RequestInit, 'method' | 'body'>;

export type ClientInit = ReqInit & {
  redirectOn401?: boolean;
  redirectPath?: string;
};

export interface BackendErrorData {
  created_at: string;
  error: {
    code: string;
    message: string;
    [key: string]: unknown;
  };
  method: string;
  request_id: string;
  status: number;
  user_id?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data?: BackendErrorData | string;
  constructor(status: number, message: string, data?: BackendErrorData | string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /** Convenience getters for UI */
  get code(): string | undefined {
    return typeof this.data === 'object' && this.data
      ? (this.data as BackendErrorData).error?.code
      : undefined;
  }

  get requestId(): string | undefined {
    return typeof this.data === 'object' && this.data
      ? (this.data as BackendErrorData).request_id
      : undefined;
  }

  get backendMessage(): string | undefined {
    if (typeof this.data === 'object' && this.data) {
      const d = this.data as BackendErrorData;
      return d.error?.message ?? (d as any).message;
    }
    return undefined;
  }
}

function isBackendErrorData(x: unknown): x is BackendErrorData {
  return !!x && typeof x === 'object'
    && 'created_at' in (x as any)
    && 'error' in (x as any);
}

const API_BASE = '/api/v1';
const TIMEOUT_MS = 30000;

/** ---- Timeout helper (no abort on normal completion) ---- */
function withTimeout(signal?: AbortSignal | null) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function isFormData(x: unknown): x is FormData {
  return typeof FormData !== 'undefined' && x instanceof FormData;
}
function isUploadBody(x: unknown): x is Blob | ArrayBuffer | URLSearchParams {
  return (
    (typeof Blob !== 'undefined' && x instanceof Blob) ||
    (typeof ArrayBuffer !== 'undefined' && x instanceof ArrayBuffer) ||
    (typeof URLSearchParams !== 'undefined' && x instanceof URLSearchParams)
  );
}

function safeJson<T = unknown>(text: string): T | null {
  try { return JSON.parse(text) as T; } catch { return null; }
}
function getMessageFromJson(json: unknown): string | undefined {
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    if (typeof o.message === 'string') return o.message;
    if (typeof o.error === 'string') return o.error;
  }
  return undefined;
}

/** ---- CSRF helpers (double-submit cookie) ---- */
function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined; // SSR-safe
  const escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const m = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function isUnsafe(method: Method) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
}

/** Add X-CSRF-Token for unsafe methods (browser only) */
function maybeAddCsrf(headers: Headers, method: Method) {
  if (typeof window === 'undefined') return;
  if (!isUnsafe(method)) return;
  const csrf = readCookie('bt_csrf');
  if (csrf && !headers.has('X-CSRF-Token')) {
    headers.set('X-CSRF-Token', csrf);
  }
}

export async function request<T>(
  path: string,
  method: Method,
  body?: unknown,
  init?: ClientInit
): Promise<T> {
  const url = joinUrl(API_BASE, path);
  const headers = new Headers(init?.headers as HeadersInit | undefined);
  const opts: RequestInit = { ...init, method, credentials: 'include', cache: 'no-store' };

  if (body !== undefined && !isFormData(body) && !isUploadBody(body)) {
    headers.set('Content-Type', 'application/json');
    opts.body = JSON.stringify(body);
  } else if (body !== undefined) {
    opts.body = body as BodyInit;
  }

  headers.set('Accept', 'application/json');
  maybeAddCsrf(headers, method);
  opts.headers = headers;

  const { signal, cancel } = withTimeout(init?.signal ?? null);
  opts.signal = signal;

  try {
    const res = await fetch(url, opts);
    if (res.status === 204) return undefined as unknown as T;

    const text = await res.text().catch(() => '');
    const json: unknown = text ? safeJson<unknown>(text) : null;

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        const shouldRedirect = init?.redirectOn401 ?? true;
        if (shouldRedirect) {
          const signinPath = init?.redirectPath || '/signin';
          const here = window.location.pathname + window.location.search + window.location.hash;

          if (!window.location.pathname.startsWith(signinPath) && !redirectingToSignin) {
            redirectingToSignin = true;
            try { await onUnauthorized?.(); } catch {}
            try { await apiLogout?.(); } catch {}
            window.location.replace(`${signinPath}?next=${encodeURIComponent(here)}`);
          }
          return new Promise<never>(() => {});
        }
      }

      const message =
        getMessageFromJson(json) ?? (res.statusText || `HTTP ${res.status}`) ?? 'Request failed';

      // ✅ Narrow json to the right union before throwing
      const errorData: BackendErrorData | string | undefined =
        isBackendErrorData(json) ? json :
        (text || undefined);

      throw new ApiError(res.status, message, errorData);
    }

    return (json as T) ?? ({} as T);
  } finally {
    cancel();
  }
}


export const getJSON = <T>(path: string, init?: ClientInit) => request<T>(path, 'GET', undefined, init);
export const postJSON = <T>(path: string, body?: unknown, init?: ClientInit) => request<T>(path, 'POST', body, init);
export const putJSON = <T>(path: string, body?: unknown, init?: ClientInit) => request<T>(path, 'PUT', body, init);
export const patchJSON = <T>(path: string, body?: unknown, init?: ClientInit) => request<T>(path, 'PATCH', body, init);
export const deleteJSON = <T>(path: string, body?: unknown, init?: ClientInit) => request<T>(path, 'DELETE', body, init);
