// File: src/features/retailer/retailer_bbps/shared/client.ts
import { BASE_URLS } from "@/config/endpoints";
import { getAuth } from "@/lib/store/authAccess";

const isServer = typeof window === "undefined";
const TIMEOUT_MS = 20000;

/** Normalized API error */
export class ApiError extends Error {
  status: number;
  code?: string | number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown, code?: string | number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RetailerRequestOptions<TBody = unknown> = {
  method: HttpMethod;
  path: string; // relative (joined with BASE_URLS.RETAILER_BASE_URL) or absolute
  query?: Record<string, unknown>;
  headers?: Record<string, string | number | boolean>;
  body?: TBody;
  auth?: boolean;
  apiKey?: boolean;
  baseUrlOverride?: string; // optional, for special cases
  signal?: AbortSignal | null;
};

type Jsonish =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

/** Public helper: tenant id (fallback if needed) */
export function getTenantId(): string {
  return (
    process.env.NEXT_PUBLIC_TENANT_ID ||
    process.env.TENANT_ID ||
    "default"
  );
}

/** Core request */
export async function retailerRequest<TResponse = unknown, TBody = unknown>(
  opts: RetailerRequestOptions<TBody>
): Promise<TResponse> {
  const {
    method,
    path,
    query,
    headers = {},
    body,
    auth = false,
    apiKey = false,
    baseUrlOverride,
    signal: externalSignal,
  } = opts;

  const url = buildUrl(path, query, baseUrlOverride);
  const finalHeaders: Record<string, string> = normalizeHeaders(headers);

  // Attach Bearer token if requested
  if (auth) {
    const { token } = getAuth();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Attach API key if requested
  if (apiKey) {
    const key = isServer
      ? process.env.BBPS_API_KEY
      : process.env.NEXT_PUBLIC_BBPS_API_KEY;
    if (key) {
      finalHeaders["X-API-Key"] = key;
    }
  }

  // Body handling
  let fetchBody: BodyInit | undefined;
  if (method !== "GET" && body != null) {
    if (isFormData(body) || isBinary(body)) {
      fetchBody = body as BodyInit;
    } else {
      fetchBody = JSON.stringify(body as Jsonish);
      if (!hasHeader(finalHeaders, "content-type")) {
        finalHeaders["Content-Type"] = "application/json";
      }
    }
  }

  const { signal, cancel } = withTimeout(externalSignal, TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: fetchBody,
      signal,
    });
  } catch (err: unknown) {
    cancel();
    if (isAbortError(err)) {
      throw new ApiError(499, "Request aborted or timed out");
    }
    throw wrapUnknownError(err);
  } finally {
    cancel();
  }

  const isJson = contentTypeIsJson(res.headers.get("content-type"));
  const raw = isJson ? await safeJson(res) : await res.text();

  if (!res.ok) {
    const message =
      (isJSONObject(raw) && (raw.message as string)) ||
      res.statusText ||
      "Request failed";
    const code =
      (isJSONObject(raw) && (raw.code as string | number)) || undefined;
    throw new ApiError(res.status, message, raw, code);
  }

  return raw as TResponse;
}

/* ---------------- helpers ---------------- */

function resolveBaseUrl(baseUrlOverride?: string): string {
  if (baseUrlOverride) return baseUrlOverride;
  return BASE_URLS.RETAILER_BASE_URL || "";
}

function buildUrl(
  path: string,
  query?: Record<string, unknown>,
  baseUrlOverride?: string
): string {
  if (/^https?:\/\//i.test(path)) {
    return appendQuery(path, query);
  }
  const base = resolveBaseUrl(baseUrlOverride);
  const url = joinUrl(base, path);
  return appendQuery(url, query);
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function appendQuery(url: string, query?: Record<string, unknown>): string {
  if (!query || Object.keys(query).length === 0) return url;
  const usp = new URLSearchParams();
  for (const [key, val] of Object.entries(query)) {
    if (val == null) continue;
    if (Array.isArray(val)) {
      for (const item of val) usp.append(key, serializeScalar(item));
    } else if (typeof val === "object") {
      usp.append(key, JSON.stringify(val));
    } else {
      usp.append(key, serializeScalar(val));
    }
  }
  return url.includes("?") ? `${url}&${usp}` : `${url}?${usp}`;
}

function serializeScalar(v: unknown): string {
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "";
  return String(v);
}

function normalizeHeaders(h: Record<string, string | number | boolean>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(h)) {
    if (v != null) out[k] = String(v);
  }
  return out;
}

function hasHeader(h: Record<string, string>, name: string): boolean {
  const lower = name.toLowerCase();
  return Object.keys(h).some((k) => k.toLowerCase() === lower);
}

function contentTypeIsJson(ct: string | null): boolean {
  return !!ct && (/\bapplication\/json\b/i.test(ct) || /\+json\b/i.test(ct));
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

function isFormData(x: unknown): x is FormData {
  return typeof FormData !== "undefined" && x instanceof FormData;
}

function isBinary(x: unknown): x is Blob | ArrayBuffer | URLSearchParams {
  return (
    (typeof Blob !== "undefined" && x instanceof Blob) ||
    (typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer) ||
    (typeof URLSearchParams !== "undefined" && x instanceof URLSearchParams)
  );
}

function isJSONObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function wrapUnknownError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  const msg =
    (err as { message?: string })?.message ||
    (typeof err === "string" ? err : "Network error");
  return new ApiError(500, msg);
}

function withTimeout(
  external: AbortSignal | null | undefined,
  ms: number
): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  if (external) {
    external.addEventListener("abort", () => controller.abort(), { once: true });
  }
  const cancel = () => {
    clearTimeout(id);
    controller.abort();
  };
  return { signal: controller.signal, cancel };
}
