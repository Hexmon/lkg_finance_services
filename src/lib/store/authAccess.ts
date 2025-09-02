// src/lib/store/authAccess.ts
import { store } from './index';

export function getAuth() {
  const { token, userId } = store.getState().auth;
  return { token, userId };
}
