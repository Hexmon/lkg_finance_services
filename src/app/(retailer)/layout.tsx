// app/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import ProfileBootstrap from './ProfileBootstrap';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-only: OK to use in a server layout
  const jar = await cookies();
  const jwt = jar.get(AUTH_COOKIE_NAME)?.value;

  if (!jwt) {
    redirect('/signin');
  }

  return (
    <>
      <ProfileBootstrap />   {/* client side hooks run here */}
      {children}
    </>
  );
}
