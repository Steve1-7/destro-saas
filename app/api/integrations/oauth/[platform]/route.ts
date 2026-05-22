// app/api/integrations/oauth/[platform]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Platform } from '@/types';
import { getAppOrigin, getOAuthRedirectUri } from '@/lib/app-url';
import {
  buildPlatformAuthorizeUrl,
  getPlatformClientId,
  getPlatformClientSecret,
  OAUTH_TOKEN_CONFIG,
  validatePlatformOAuthConfig,
} from '@/lib/oauth-platforms';
import { generateCodeChallenge, generateCodeVerifier } from '@/lib/oauth-pkce';

const PLATFORMS: Platform[] = [
  'youtube',
  'tiktok',
  'linkedin',
  'facebook',
  'instagram',
  'twitter',
];

function redirectWithError(req: NextRequest, code: string, detail?: string) {
  const url = new URL('/dashboard/integrations', getAppOrigin());
  url.searchParams.set('error', code);
  if (detail) url.searchParams.set('error_detail', detail.slice(0, 200));
  console.error('[oauth] Redirecting with error', code, detail);
  return NextResponse.redirect(url);
}

function redirectWithSuccess(platform: Platform) {
  const url = new URL('/dashboard/integrations', getAppOrigin());
  url.searchParams.set('connected', platform);
  console.log('[oauth] Connected platform', platform);
  return NextResponse.redirect(url);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as Platform;
  const logPrefix = `[oauth:${platform}]`;

  if (!PLATFORMS.includes(platform)) {
    return redirectWithError(req, 'invalid_platform');
  }

  // Client-side preflight: validate env configuration
  if (req.nextUrl.searchParams.get('check') === '1') {
    const validation = validatePlatformOAuthConfig(platform);
    console.log(logPrefix, 'Config check', validation);
    return NextResponse.json(validation, { status: validation.ok ? 200 : 400 });
  }

  const providerError = req.nextUrl.searchParams.get('error');
  if (providerError) {
    const description = req.nextUrl.searchParams.get('error_description') ?? providerError;
    return redirectWithError(req, 'provider_error', description);
  }

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  // ─── Step 1: Start OAuth (redirect to provider) ─────────────────
  if (!code) {
    if (!session) {
      console.warn(logPrefix, 'No session — redirecting to login');
      const loginUrl = new URL('/login', getAppOrigin());
      loginUrl.searchParams.set('next', `/api/integrations/oauth/${platform}`);
      return NextResponse.redirect(loginUrl);
    }

    const validation = validatePlatformOAuthConfig(platform);
    if (!validation.ok) {
      return redirectWithError(req, validation.code, validation.message);
    }

    const oauthState = crypto.randomUUID();
    const cookieStore = cookies();
    const stateCookieName = `oauth_state_${platform}`;
    cookieStore.set(stateCookieName, oauthState, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    });

    let codeChallenge: string | undefined;
    if (platform === 'twitter') {
      const verifier = generateCodeVerifier();
      codeChallenge = generateCodeChallenge(verifier);
      cookieStore.set(`oauth_pkce_${platform}`, verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10,
        path: '/',
      });
    }

    const authorizeUrl = buildPlatformAuthorizeUrl(platform, oauthState, { codeChallenge });
    console.log(logPrefix, 'Redirecting to provider', authorizeUrl);
    return NextResponse.redirect(authorizeUrl);
  }

  // ─── Step 2: OAuth callback — exchange code ─────────────────────
  const savedState = cookies().get(`oauth_state_${platform}`)?.value;
  if (!state || !savedState || state !== savedState) {
    console.error(logPrefix, 'State mismatch', { state, savedState });
    return redirectWithError(req, 'state_mismatch');
  }

  if (!session) {
    return redirectWithError(req, 'not_authenticated');
  }

  const validation = validatePlatformOAuthConfig(platform);
  if (!validation.ok) {
    return redirectWithError(req, validation.code, validation.message);
  }

  const clientId = getPlatformClientId(platform)!;
  const clientSecret = getPlatformClientSecret(platform)!;
  const redirectUri = getOAuthRedirectUri(platform);
  const tokenConfig = OAUTH_TOKEN_CONFIG[platform];

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  if (platform === 'twitter') {
    const verifier = cookies().get(`oauth_pkce_${platform}`)?.value;
    if (!verifier) {
      return redirectWithError(req, 'state_mismatch', 'Missing PKCE verifier');
    }
    body.set('code_verifier', verifier);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (tokenConfig.useBasicAuth) {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    headers.Authorization = `Basic ${basic}`;
    body.delete('client_secret');
  }

  console.log(logPrefix, 'Exchanging code for token');
  let tokenRes: Response;
  try {
    tokenRes = await fetch(tokenConfig.tokenUrl, {
      method: 'POST',
      headers,
      body,
    });
  } catch (err) {
    console.error(logPrefix, 'Token request failed', err);
    return redirectWithError(req, 'token_exchange', err instanceof Error ? err.message : 'fetch failed');
  }

  const tokenText = await tokenRes.text();
  let tokenData: Record<string, unknown>;
  try {
    tokenData = JSON.parse(tokenText) as Record<string, unknown>;
  } catch {
    console.error(logPrefix, 'Invalid token JSON', tokenText.slice(0, 300));
    return redirectWithError(req, 'token_exchange', 'Invalid token response');
  }

  if (!tokenRes.ok) {
    console.error(logPrefix, 'Token exchange error', tokenRes.status, tokenData);
    const detail =
      typeof tokenData.error_description === 'string'
        ? tokenData.error_description
        : typeof tokenData.error === 'string'
          ? tokenData.error
          : tokenText.slice(0, 200);
    return redirectWithError(req, 'token_exchange', detail);
  }

  const accessToken = tokenData.access_token as string | undefined;
  if (!accessToken) {
    return redirectWithError(req, 'token_exchange', 'No access_token in response');
  }

  const expiresIn = tokenData.expires_in as number | undefined;
  const { error: dbError } = await supabase.from('integrations').upsert(
    {
      user_id: session.user.id,
      platform,
      access_token: accessToken,
      refresh_token: (tokenData.refresh_token as string | undefined) ?? null,
      token_expires_at: expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : null,
      scope: (tokenData.scope as string | undefined) ?? null,
      is_active: true,
      connected_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,platform' }
  );

  if (dbError) {
    console.error(logPrefix, 'Failed to store integration', dbError);
    return redirectWithError(req, 'storage_failed', dbError.message);
  }

  cookies().set(`oauth_state_${platform}`, '', { maxAge: 0, path: '/' });
  if (platform === 'twitter') {
    cookies().set(`oauth_pkce_${platform}`, '', { maxAge: 0, path: '/' });
  }

  return redirectWithSuccess(platform);
}
