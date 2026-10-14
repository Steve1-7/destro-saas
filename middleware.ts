import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return updateSession(request);
}

async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createMiddlewareClient({
    req: request,
    res: response,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if (pathname === '/login' && user) {
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
