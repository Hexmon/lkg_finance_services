// "use client";

// import { message } from "antd";
// import { ReactNode } from "react";

// /**
//  * Hook wrapper for AntD message API
//  */
// export function useMessage() {
//   const [api, contextHolder] = message.useMessage();

//   return {
//     contextHolder, // place this once in your layout
//     success: (content: string) => api.success(content),
//     error: (content: string) => api.error(content),
//     warning: (content: string) => api.warning(content),
//     info: (content: string) => api.info(content),
//     loading: (content: string) => api.loading(content),
//   };
// }

// /**
//  * Provider to mount the AntD message system once
//  */
// export function MessageProvider({ children }: { children: ReactNode }) {
//   const { contextHolder } = useMessage();
//   return (
//     <>
//       {contextHolder}
//       {children}
//     </>
//   );
// }


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
