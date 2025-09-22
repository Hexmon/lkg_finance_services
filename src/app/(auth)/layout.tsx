// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, getJwtExp } from "@/app/api/_lib/auth-cookies";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Read HttpOnly JWT set by your server
  const jar = await cookies();
  const jwt = jar.get(AUTH_COOKIE_NAME)?.value;

  if (jwt) {
    // Optional: only redirect if not expired (defensive)
    const exp = getJwtExp(jwt); // seconds since epoch
    const now = Math.floor(Date.now() / 1000);
    if (!exp || exp > now) {
      redirect("/"); // already signed in -> bounce away from auth pages
    }
  }

  // No valid session -> render auth pages (signin/signup/forgot, etc.)
  return <>{children}</>;
}
