import { store, type RootState } from "@/lib/store";

/** ===== Env & Constants ===== */
const BBPS_ENV = (process.env.NEXT_PUBLIC_BBPS_ENV ?? "uat").toLowerCase();
const BBPS_BASE =
    BBPS_ENV === "prod"
        ? (process.env.NEXT_PUBLIC_BBPS_BASE_URL_PROD ?? "")
        : (process.env.NEXT_PUBLIC_BBPS_BASE_URL_UAT ?? "");

const BBPS_TENANT_ID = process.env.NEXT_PUBLIC_BBPS_TENANT_ID ?? "";

const BBPS_API_KEY_SERVER = process.env.BBPS_API_KEY ?? "";
const BBPS_API_KEY_PUBLIC = process.env.NEXT_PUBLIC_BBPS_API_KEY ?? "";
const BBPS_API_KEY = BBPS_API_KEY_SERVER.length > 0 ? BBPS_API_KEY_SERVER : BBPS_API_KEY_PUBLIC;

if (BBPS_BASE.length === 0) {
    console.warn("[BBPS] Base URL not configured. Set NEXT_PUBLIC_BBPS_BASE_URL_UAT/PROD.");
}
if (BBPS_TENANT_ID.length === 0) {
    console.warn("[BBPS] Tenant/Service ID not configured. Set NEXT_PUBLIC_BBPS_TENANT_ID.");
}

/** ===== Public helpers ===== */
export function getTenantId(): string {
    if (BBPS_TENANT_ID.length === 0) throw new Error("NEXT_PUBLIC_BBPS_TENANT_ID is not set");
    return BBPS_TENANT_ID;
}
export function getBaseUrl(): string {
    if (BBPS_BASE.length === 0) throw new Error("BBPS base URL is not configured");
    return BBPS_BASE;
}

/** ===== Error ===== */
export class ApiError extends Error {
    status: number;
    code?: string;
    data?: unknown;
    constructor(status: number, message: string, data?: unknown, code?: string) {
        super(message);
        this.status = status;
        this.data = data;
        this.code = code;
        this.name = "ApiError";
    }
}

/** ===== Timeout ===== */
const TIMEOUT_MS = 20_000;
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ReqInit = Omit<RequestInit, "method" | "body">;

function withTimeout(signal?: AbortSignal | null) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

    if (signal) {
        const onAbort = () => controller.abort();
        signal.addEventListener("abort", onAbort, { once: true });
    }

    return {
        signal: controller.signal,
        cancel: () => {
            clearTimeout(id);
            controller.abort();
        },
    };
}

function safeJson<T = unknown>(text: string): T | null {
    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}
function getMessageFromJson(json: unknown): string | undefined {
    if (json && typeof json === "object") {
        const obj = json as Record<string, unknown>;
        if (typeof obj.message === "string") return obj.message;
        if (typeof obj.error === "string") return obj.error;
        if (typeof obj.statusMessage === "string") return obj.statusMessage;
    }
    return undefined;
}
function buildQuery(q?: Record<string, string | number | boolean | undefined>): string {
    if (!q) return "";
    const sp = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => {
        if (v === undefined) return;
        sp.set(k, String(v));
    });
    const qs = sp.toString();
    return qs.length > 0 ? `?${qs}` : "";
}

/** ===== Main retailer request (auth + api key as options) ===== */
export async function retailerRequest<T>(
    path: string,
    method: Method,
    body?: unknown,
    init?: ReqInit,
    opts?: {
        includeApiKey?: boolean;
        includeAuth?: boolean;
        query?: Record<string, string | number | boolean | undefined>;
    },
): Promise<T> {
    const base = getBaseUrl();
    const url = `${base}${path}${buildQuery(opts?.query)}`;
    const headers = new Headers((init?.headers as HeadersInit | undefined) ?? {});

    headers.set("Accept", "application/json");
    if (body !== undefined) headers.set("Content-Type", "application/json");
    if (opts?.includeApiKey && BBPS_API_KEY.length > 0) headers.set("X-API-Key", BBPS_API_KEY);

    if (opts?.includeAuth) {
        const state = store.getState() as RootState;
        const token = state.auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    const timeout = withTimeout(init?.signal ?? null);

    const res = await fetch(url, {
        ...init,
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: "no-store",
        signal: timeout.signal,
    });

    const text = await res.text().catch(() => "");
    const json = text ? safeJson<unknown>(text) : null;

    if (!res.ok) {
        const message =
            getMessageFromJson(json) ||
            (res.statusText && res.statusText.trim().length > 0 ? res.statusText : `HTTP ${res.status}`) ||
            "Request failed";

        // ✅ Ensure string | undefined (no boolean chaining)
        let code: string | undefined;
        if (json && typeof json === "object") {
            const maybe = (json as Record<string, unknown>)["code"];
            code = typeof maybe === "string" ? maybe : undefined;
        }

        throw new ApiError(res.status, message, json ?? text, code);
    }

    return (json as T) ?? ({} as T);
}
