// src\lib\store\index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
  type Storage as PersistStorage
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import customerReducer from './slices/customerSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import profileReducer from './slices/profileSlice';

// SSR-safe storage
function createNoopStorage(): PersistStorage {
  return {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
}
const storage: PersistStorage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// --- Persist ONLY token in auth slice ---
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'userId'], // <— this is the important part
};

// Combine reducers with persisted auth
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: uiReducer,
  customer: customerReducer,
  profile: profileReducer,
});

// Optionally persist other top-level slices (ui) at root
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui', 'customer'],
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export const selectCustomer = (s: RootState) => s.customer.details;
// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const selectToken = (s: RootState) => s.auth.token;
export const selectUserId = (s: RootState) => s.auth.userId;
export const selectIsAuthenticated = (s: RootState) => !!s.auth.token;