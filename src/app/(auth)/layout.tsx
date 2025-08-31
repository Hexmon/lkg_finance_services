// src/app/(auth)/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);
  const [hydrated, setHydrated] = useState(false);

  // Wait for rehydration so we don't read a pre-hydrate null token
  useEffect(() => setHydrated(true), []);

  // Redirect once hydrated and token exists
  useEffect(() => {
    if (!hydrated) return;
    if (token) router.replace("/");
  }, [hydrated, token, router]);

  // Avoid UI flash while hydrating or when already authenticated
  if (!hydrated || token) return null;

  return <>{children}</>;
}
