// app/auth/callback/route.ts — Supabase Auth PKCE / OAuth callback
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAppOrigin } from '@/lib/app-url';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const authError = searchParams.get('error');
  const authErrorDescription = searchParams.get('error_description');
  const next = searchParams.get('next');

  const origin = getAppOrigin();
  const safeNext =
    next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  if (authError) {
    console.error('[auth/callback] Provider error', authError, authErrorDescription);
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('error', authErrorDescription ?? authError);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession failed', error);
      const loginUrl = new URL('/login', origin);
      loginUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(loginUrl);
    }

    console.log('[auth/callback] Session established, redirecting to', safeNext);
  } else {
    console.warn('[auth/callback] No code in callback URL');
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
