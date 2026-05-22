import { NextRequest, NextResponse } from 'next/server';
import { getAppOrigin } from '@/lib/app-url';

/** Redirect legacy /callback to canonical /auth/callback */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = new URL(`/auth/callback${url.search}`, getAppOrigin());
  return NextResponse.redirect(target);
}
