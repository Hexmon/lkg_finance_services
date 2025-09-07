import 'server-only';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import { getJwtExp, setSessionCookies, clearAuthCookies } from '@/app/api/_lib/auth-cookies';

const Body = z.object({ username: z.string().min(3), password: z.string().min(6) });

type UpstreamOk = {
  status: 200;
  message: string;
  user_id: string;
  access_token: string;
  last_login_time?: string;
};
type UpstreamPwdReset = { status: 1001; message: string; user_id: string };

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

  try {
    const res = await authFetch<UpstreamOk | UpstreamPwdReset>(AUTHERIZATION_ENDPOINT.AUTH_LOGIN_PATH, { body });

    if ('status' in res && res.status === 1001) {
      await clearAuthCookies();
      return NextResponse.json({ status: 1001, message: res.message, userId: res.user_id }, { status: 200 });
    }

    const ok = res as UpstreamOk;
    const exp = getJwtExp(ok.access_token);
    const csrf = await setSessionCookies(ok.access_token, ok.user_id, exp);

    // Never return the JWT to the client
    return NextResponse.json({
      status: 200,
      message: ok.message,
      userId: ok.user_id,
      lastLoginTime: ok.last_login_time,
      csrf,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Login failed' }, { status: err?.status ?? 502 });
  }
}
