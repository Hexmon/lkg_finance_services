// src/features/profile/data/hooks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiGetProfile, apiGetUserPermissions } from './endpoints';
import type { GetProfileResponse, GetUserPermissionsResponse } from '@/features/profile';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectUserId } from '@/lib/store';
import { selectProfileLoaded, setProfileFromApi } from '@/lib/store/slices/profileSlice';

export function useProfileQuery(p0: { enabled: boolean; }) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);
  const alreadyLoaded = useAppSelector(selectProfileLoaded);

  const query = useQuery<GetProfileResponse, unknown, GetProfileResponse>({
    queryKey: ['profile'],
    queryFn: apiGetProfile,
    enabled: !!userId && !alreadyLoaded,   // only run when logged in and not yet loaded
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });

  // v5 replacement for onSuccess: react to data with useEffect
  useEffect(() => {
    if (query.isSuccess && query.data && !alreadyLoaded) {
      dispatch(setProfileFromApi(query.data));
    }
  }, [query.isSuccess, query.data, alreadyLoaded, dispatch]);

  return query;
}

export function useUserPermissionsQuery() {
  return useQuery<GetUserPermissionsResponse, unknown>({
    queryKey: ['auth', 'permissions'],
    queryFn: apiGetUserPermissions,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
