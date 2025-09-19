// src/lib/errors.ts
export interface ApiErrorPayload {
    created_at: string;
    error: { code: string; message: string };
    method: string;
    request_id: string;
    status: number;
}

export class ApiError extends Error {
    payload: ApiErrorPayload;
    // optional meta for diagnostics
    url?: string;
    bodyText?: string;

    constructor(payload: ApiErrorPayload, meta?: { url?: string; bodyText?: string }) {
        super(payload?.error?.message ?? "API Error");
        this.name = "ApiError";
        this.payload = payload;
        this.url = meta?.url;
        this.bodyText = meta?.bodyText;
    }
}

// Narrowing helpers (zero-churn in UI)
export function isApiError(err: unknown): err is ApiError {
    return !!err && typeof err === "object" && "payload" in err && "message" in err;
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong") {
    if (isApiError(err)) return err.payload.error?.message || err.message || fallback;
    if (err instanceof Error) return err.message || fallback;
    return fallback;
}

export function getErrorStatus(err: unknown): number | undefined {
    if (isApiError(err)) return err.payload.status;
    if (typeof err === "object" && err && "status" in err && typeof (err as any).status === "number") {
        return (err as any).status;
    }
    return undefined;
}
