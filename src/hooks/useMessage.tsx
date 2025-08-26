"use client";

import { message } from "antd";
import { ReactNode } from "react";

/**
 * Hook wrapper for AntD message API
 */
export function useMessage() {
  const [api, contextHolder] = message.useMessage();

  return {
    contextHolder, // place this once in your layout
    success: (content: string) => api.success(content),
    error: (content: string) => api.error(content),
    warning: (content: string) => api.warning(content),
    info: (content: string) => api.info(content),
    loading: (content: string) => api.loading(content),
  };
}

/**
 * Provider to mount the AntD message system once
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const { contextHolder } = useMessage();
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}
