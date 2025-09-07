// src\hooks\useMessage.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { message } from "antd";

type MessageApi = {
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
  info: (content: string) => void;
  loading: (content: string) => void;
};

const MessageCtx = createContext<MessageApi | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [api, contextHolder] = message.useMessage();

  const value: MessageApi = {
    success: (c) => api.success(c),
    error: (c) => api.error(c),
    warning: (c) => api.warning(c),
    info: (c) => api.info(c),
    loading: (c) => api.loading(c),
  };

  return (
    <>
      {contextHolder}
      <MessageCtx.Provider value={value}>{children}</MessageCtx.Provider>
    </>
  );
}

export function useMessage(): MessageApi {
  const ctx = useContext(MessageCtx);
  if (!ctx) {
    throw new Error("useMessage must be used within <MessageProvider>");
  }
  return ctx;
}
