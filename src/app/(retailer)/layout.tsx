// app/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies(); // Next.js 15: async cookies()
  const jwt = jar.get(AUTH_COOKIE_NAME)?.value;

  if (!jwt) {
    // Not authenticated -> send to signin BEFORE rendering any UI
    redirect('/signin');
  }

  return <>{children}</>;
}
