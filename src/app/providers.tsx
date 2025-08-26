'use client';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store, persistor } from '@/lib/store';
import { getQueryClient } from '@/lib/query/client';
import { MessageProvider } from '@/hooks/useMessage';

export default function Providers({ children }: { children: React.ReactNode }) {
  const qc = getQueryClient();
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={qc}>
          <MessageProvider>
            {children}
          </MessageProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
