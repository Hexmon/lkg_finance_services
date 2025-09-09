'use client';

import { useEffect } from 'react';
import { useProfileQuery } from '@/features/profile/data/hooks';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectUserId } from '@/lib/store';
import { setProfileFromApi, selectProfileLoaded } from '@/lib/store/slices/profileSlice';

export default function ProfileBootstrap() {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(selectUserId);
    const loaded = useAppSelector(selectProfileLoaded);

    // Only run the query when we have a userId and profile is not already loaded
    const { data, isSuccess } = useProfileQuery({ enabled: !!userId && !loaded });

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setProfileFromApi(data));
        }
    }, [isSuccess, data, dispatch]);

    return null;
}
