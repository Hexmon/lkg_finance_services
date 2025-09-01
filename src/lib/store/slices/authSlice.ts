// src/lib/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions?: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  userId: string | null;
}

const initialState: AuthState = { token: null, user: null, userId: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser; userId?: string }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (action.payload.userId) state.userId = action.payload.userId;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {   // <-- ADD
      state.userId = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.userId = null;
    },
  },
});

export const { setCredentials, setToken, setUserId, setUser, clearAuth } = authSlice.actions; // <-- export setUserId
export default authSlice.reducer;
