/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { GetProfileResponse } from '@/features/profile';

// Keep the whole API payload (small + future-proof). Don’t persist base64 in storage.
export interface ProfileState {
    data: GetProfileResponse | null;
    loaded: boolean;
    lastFetchedAt?: number;
}

const initialState: ProfileState = {
    data: null,
    loaded: false,
    lastFetchedAt: undefined,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileFromApi(state, action: PayloadAction<GetProfileResponse>) {
            state.data = action.payload;
            state.loaded = true;
            state.lastFetchedAt = Date.now();
        },
        clearProfile(state) {
            state.data = null;
            state.loaded = false;
            state.lastFetchedAt = undefined;
        },
    },
});

export const { setProfileFromApi, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

/* -------------------- selectors -------------------- */
export const selectProfileState = (s: RootState) => s.profile;
export const selectProfileLoaded = (s: RootState) => s.profile.loaded;
export const selectProfileData = (s: RootState) => s.profile.data;

export const selectProfileCore = createSelector(selectProfileData, (d) => d?.data);
export const selectUserType = createSelector(selectProfileData, (d) => d?.user_type);
export const selectUserIdFromProfile = createSelector(selectProfileData, (d) => d?.user_id);
export const selectProfileName = createSelector(selectProfileCore, (core) => core?.name ?? '');
export const selectProfileUsername = createSelector(selectProfileCore, (core) => core?.urn ?? '');
export const selectBalances = createSelector(selectProfileData, (d) => d?.balances ?? []);

export const makeSelectWalletBalance = (walletType: string) =>
    createSelector(selectBalances, (balances) => {
        const found = balances.find((b) => String((b as any).wallet_type ?? (b as any).wallet_name) === walletType);
        return (found as any)?.balance ?? 0;
    });

export const selectMainBalance = makeSelectWalletBalance('MAIN');
export const selectAepsBalance = makeSelectWalletBalance('AEPS');
