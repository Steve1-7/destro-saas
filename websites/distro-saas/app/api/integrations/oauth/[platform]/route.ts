// app/api/integrations/oauth/[platform]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Platform } from '@/types';

const OAUTH_CONFIGS: Record<Platform, { tokenUrl: string; clientId: string; clientSecret: string }> = {
  youtube: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
  },
  tiktok: {
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    clientId: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
  },
  linkedin: {
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  },
  facebook: {
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    clientId: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
  },
  instagram: {
    // Instagram token exchange (Basic Display / Graph compatibility)
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    clientId: process.env.INSTAGRAM_CLIENT_ID!,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
  },
  twitter: {
    // Twitter OAuth2 token endpoint
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as Platform;
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=no_code', req.url)
    );
  }

  const config = OAUTH_CONFIGS[platform];
  if (!config) {
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=invalid_platform', req.url)
    );
  }

  // Exchange code for token
  const tokenRes = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/oauth/${platform}`,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=token_exchange', req.url)
    );
  }

  const tokenData = await tokenRes.json();

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Store token in integrations table
  await supabase.from('integrations').upsert(
    {
      user_id: session.user.id,
      platform,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
      token_expires_at: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : null,
      scope: tokenData.scope ?? null,
      is_active: true,
      connected_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,platform' }
  );

  return NextResponse.redirect(
    new URL('/dashboard/integrations?connected=' + platform, req.url)
  );
}
