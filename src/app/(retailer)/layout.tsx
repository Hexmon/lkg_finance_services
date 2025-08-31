"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/store";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = useAppSelector((s) => s.auth.token);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace('/signin');
    }
  }, [hydrated, token, router, pathname, searchParams]);

  // while hydrating or if not authed (we just redirected), render nothing to avoid flicker
  if (!hydrated || !token) return null;

  return <>{children}</>;
}
