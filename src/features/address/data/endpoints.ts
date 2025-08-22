import { authRequest } from '@/features/auth/data/client';
import {
  AddAddressRequest,
  AddAddressRequestSchema,
  AddAddressResponse,
  AddAddressResponseSchema,
  GetAddressesResponse,
  GetAddressesResponseSchema,
  UpdateAddressBody,
  UpdateAddressBodySchema,
  UpdateAddressResponse,
  UpdateAddressResponseSchema,
  DeleteAddressResponse,
  DeleteAddressResponseSchema,
  AddressRecord,
  AddressRecordSchema,
} from '../domain/types';

const ADDRESS_PATH = process.env.NEXT_PUBLIC_ADDRESS_PATH || '/secure/address';

/** Add a new address (Bearer; API Key optional) */
export async function apiAddAddress(payload: AddAddressRequest): Promise<AddressRecord> {
  const body = AddAddressRequestSchema.parse(payload);
  const data = await authRequest<unknown>(
    ADDRESS_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );

  // UAT POST returns a flat object (no status wrapper)
  // But if backend wraps later ({ status, data }), unwrap it.
  const parsed =
    (typeof data === 'object' && data !== null && 'data' in (data))
      ? AddressRecordSchema.parse((data).data)
      : AddAddressResponseSchema.parse(data as AddAddressResponse);

  return parsed;
}

/** List addresses (Bearer). Optionally filter by user_id via query param. */
export async function apiGetAddresses(userId?: string): Promise<GetAddressesResponse> {
  const qs = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
  const data = await authRequest<GetAddressesResponse>(
    `${ADDRESS_PATH}${qs}`,
    'GET',
    undefined,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return GetAddressesResponseSchema.parse(data);
}

/** Update address by id (Bearer). We use /secure/address/:address_id */
export async function apiUpdateAddress(
  addressId: number | string,
  body: UpdateAddressBody
): Promise<UpdateAddressResponse> {
  const payload = UpdateAddressBodySchema.parse(body);
  const data = await authRequest<UpdateAddressResponse>(
    `${ADDRESS_PATH}/${encodeURIComponent(String(addressId))}`,
    'PATCH',
    payload,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return UpdateAddressResponseSchema.parse(data);
}

/** Delete address by id (Bearer). We use /secure/address/:address_id */
export async function apiDeleteAddress(addressId: number | string): Promise<DeleteAddressResponse> {
  const data = await authRequest<DeleteAddressResponse>(
    `${ADDRESS_PATH}/${encodeURIComponent(String(addressId))}`,
    'DELETE',
    undefined,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return DeleteAddressResponseSchema.parse(data);
}
