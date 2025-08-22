'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetProfile, apiGetUserPermissions } from './endpoints';

const QK = {
  profile: ['profile', 'details'] as const,
  userPerms: ['profile', 'user-permissions'] as const,
};

/** Fetch logged-in user's profile (id, username, type, etc.) */
export function useProfileDetailsQuery(enabled = true) {
  return useQuery({
    queryKey: QK.profile,
    queryFn: apiGetProfile,
    enabled,
    retry: 1,
  });
}

/** Fetch logged-in user's permissions tree */
export function useUserPermissionsQuery(enabled = true) {
  return useQuery({
    queryKey: QK.userPerms,
    queryFn: apiGetUserPermissions,
    enabled,
    retry: 1,
  });
}
