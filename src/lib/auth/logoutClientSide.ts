// src/lib/auth/logoutClientSide.ts
import { store, persistor } from '@/lib/store';
import { clearAuth } from '@/lib/store/slices/authSlice';
import { clearProfile } from '@/lib/store/slices/profileSlice';
import { QueryClient } from '@tanstack/react-query';

// If you also want to clear customer or other slices, export their reset actions
// import { resetCustomer } from '@/lib/store/slices/customerSlice';

let queryClient: QueryClient | null = null;
export function registerQueryClient(qc: QueryClient) { queryClient = qc; }

export async function logoutClientSide() {
    try { persistor.pause(); } catch { }

    const { dispatch } = store;
    dispatch(clearProfile());
    dispatch(clearAuth());
    // dispatch(resetCustomer()); // uncomment if you add this reducer

    try { queryClient?.clear(); } catch { }

    try { await persistor.flush(); } catch { }
    try { await persistor.purge(); } catch { }

    try { persistor.persist(); } catch { }
}
