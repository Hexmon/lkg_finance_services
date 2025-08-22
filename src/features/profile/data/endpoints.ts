import { authRequest } from '@/features/auth/data/client';
import {
  GetProfileResponse,
  GetProfileResponseSchema,
  GetUserPermissionsResponse,
  GetUserPermissionsResponseSchema,
} from '../domain/types';

const PROFILE_PATH =
  process.env.NEXT_PUBLIC_PROFILE_GET_PATH || '/secure/profile';
const USER_PERMS_PATH =
  process.env.NEXT_PUBLIC_USER_PERMISSIONS_PATH || '/secure/get-user-permissions';

/** GET /secure/profile (Bearer; API Key optional) */
export async function apiGetProfile(): Promise<GetProfileResponse> {
  const data = await authRequest<GetProfileResponse>(
    PROFILE_PATH,
    'GET',
    undefined,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: true,
    }
  );
  return GetProfileResponseSchema.parse(data);
}

/** GET /secure/get-user-permissions (Bearer; API Key optional) */
export async function apiGetUserPermissions(): Promise<GetUserPermissionsResponse> {
  const data = await authRequest<GetUserPermissionsResponse>(
    USER_PERMS_PATH,
    'GET',
    undefined,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: true,
    }
  );
  return GetUserPermissionsResponseSchema.parse(data);
}
