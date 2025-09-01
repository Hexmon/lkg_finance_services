
import { BASE_URLS, RETAILER_ENDPOINTS } from '@/config/endpoints';
import { ServiceListResponseSchema, type ServiceListParams, type ServiceListResponse } from '../domain/types';
import { authHeaders } from '@/lib/query/client';

const RETAILER_BASE = BASE_URLS.RETAILER_BASE_URL;
const PATH = RETAILER_ENDPOINTS.SERVICE.SERVICE_LIST; // "/secure/retailer/service-list"
const TIMEOUT_MS = 20_000;

function buildQuery(params?: ServiceListParams): string {
  if (!params) return '';
  const usp = new URLSearchParams();
  if (params.category) usp.set('category', params.category);
  if (params.status) usp.set('status', params.status);
  if (typeof params.per_page === 'number') usp.set('per_page', String(params.per_page));
  if (typeof params.page === 'number') usp.set('page', String(params.page));
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchServiceList(params?: ServiceListParams, signal?: AbortSignal): Promise<ServiceListResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${RETAILER_BASE}${PATH}${buildQuery(params)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        ...authHeaders({
          'Content-Type': 'application/json',
        }),
      },
      signal: signal ?? controller.signal,
      cache: 'no-store',
    });

    // Non-2xx → throw with best-effort body
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`Service list request failed: ${res.status} ${res.statusText} ${text}`);
      // @ts-expect-error attach extra info for consumers/logging
      err.status = res.status;
      // @ts-expect-error attach raw body
      err.body = text;
      throw err;
    }

    const json = (await res.json()) as unknown;
    const parsed = ServiceListResponseSchema.parse(json);
    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}
