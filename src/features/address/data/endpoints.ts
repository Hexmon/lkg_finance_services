// src/features/address/data/endpoints.ts
import { getJSON, postJSON, patchJSON } from "@/lib/api/client";
import {
    AddAddressRequestSchema,
    type AddAddressRequest,
    type AddAddressResponse,
    GetAddressesQuerySchema,
    type GetAddressesQuery,
    type GetAddressesResponse,
    PatchAddressLandmarkBodySchema,
    type PatchAddressLandmarkBody,
    type UpdateAddressResponse,
} from "@/features/address/domain/types";

function toQS(q: GetAddressesQuery) {
    const sp = new URLSearchParams();
    if (q.user_id) sp.set("user_id", q.user_id);
    const s = sp.toString();
    return s ? `?${s}` : "";
}

/** GET /api/v1/address?user_id=... */
export async function apiGetAddresses(query: Partial<GetAddressesQuery> = {}) {
    const normalized = GetAddressesQuerySchema.parse(query);
    const qs = toQS(normalized);
    return await getJSON<GetAddressesResponse>(`/address${qs}`);
}

/** POST /api/v1/address */
export async function apiAddAddress(body: AddAddressRequest) {
    const validated = AddAddressRequestSchema.parse(body);
    return await postJSON<AddAddressResponse>(`/address`, validated);
}

/** PATCH /api/v1/address (landmark only) */
export async function apiPatchAddressLandmark(body: PatchAddressLandmarkBody) {
    const validated = PatchAddressLandmarkBodySchema.parse(body);
    return await patchJSON<UpdateAddressResponse>(`/address`, validated);
}
