// src/app/(auth)/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      router.replace("/bbps");
    }
  }, [token, router]);

  return <>{!token && children}</>;
}
