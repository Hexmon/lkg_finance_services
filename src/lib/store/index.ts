import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
  type Storage as PersistStorage
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

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
  whitelist: ['token'], // <— this is the important part
};

// Combine reducers with persisted auth
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: uiReducer,
});

// Optionally persist other top-level slices (ui) at root
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['ui'],
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

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
