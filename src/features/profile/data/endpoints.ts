// src\features\profile\data\endpoints.ts
import { getJSON } from '@/lib/api/client';
import {
    GetProfileResponseSchema,
    GetUserPermissionsResponse,
    GetUserPermissionsResponseSchema,
    type GetProfileResponse,
} from '@/features/profile';

const p = {
    profile: 'profile',
     permissions: 'permissions'
} as const;

export async function apiGetProfile(): Promise<GetProfileResponse> {
    const data = await getJSON<unknown>(p.profile);
    return GetProfileResponseSchema.parse(data);
}

export async function apiGetUserPermissions(): Promise<GetUserPermissionsResponse> {
  const data = await getJSON<unknown>(p.permissions);
  return GetUserPermissionsResponseSchema.parse(data);
}