// src\features\auth\data\client.ts

import { BASE_URLS } from '@/config/endpoints';
import { store } from '@/lib/store';

const AUTH_BASE = BASE_URLS.AUTH_BASE_URL;
const AUTH_API_KEY = process.env.NEXT_PUBLIC_AUTH_API_KEY || '';

export class ApiError extends Error {
  status: number;
  data?: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type Method = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
type ReqInit = Omit<RequestInit, 'method' | 'body'>;

const TIMEOUT_MS = 20_000;

function withTimeout(signal?: AbortSignal | null) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  if (signal) {
    const onAbort = () => controller.abort();
    signal.addEventListener('abort', onAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cancel: () => { clearTimeout(id); controller.abort(); },
  };
}

export async function authRequest<T>(
  path: string,
  method: Method,
  body?: unknown,
  init?: ReqInit,
  opts?: { includeApiKey?: boolean; includeAuth?: boolean }
): Promise<T> {
  const url = `${AUTH_BASE}${path}`;
  const headers = new Headers(init?.headers as HeadersInit | undefined);

  headers.set('Accept', 'application/json');
  if (body !== undefined) headers.set('Content-Type', 'application/json');
  if (opts?.includeApiKey && AUTH_API_KEY) headers.set('X-API-Key', AUTH_API_KEY);

  if (opts?.includeAuth) {
    const { auth } = store.getState();
    if (auth?.token) headers.set('Authorization', `Bearer ${auth.token}`);
  }

  const timeout = withTimeout(init?.signal ?? null);

  const res = await fetch(url, {
    ...init,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal: timeout.signal,
  });

  const text = await res.text().catch(() => '');
  const json = text ? safeJson<unknown>(text) : null;

  if (!res.ok) {
    const message =
      getMessageFromJson(json) ??
      (res.statusText?.trim() || `HTTP ${res.status}`) ??
      'Request failed';
    throw new ApiError(res.status, message, json ?? text);
  }

  return (json as T) ?? ({} as T);
}

function safeJson<T = unknown>(text: string): T | null {
  try { return JSON.parse(text) as T; } catch { return null; }
}

function getMessageFromJson(json: unknown): string | undefined {
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.error === 'string') return obj.error;
  }
  return undefined;
}