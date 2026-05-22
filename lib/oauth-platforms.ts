import type { Platform } from '@/types';
import { getOAuthRedirectUri } from '@/lib/app-url';

export type OAuthValidationCode =
  | 'ok'
  | 'invalid_platform'
  | 'missing_client_id'
  | 'missing_client_secret';

export interface OAuthValidationResult {
  ok: boolean;
  code: OAuthValidationCode;
  message: string;
  platform?: Platform;
}

interface PlatformOAuthMeta {
  authorizeUrl: string;
  scopes: string[];
  usePublicClientId?: boolean;
}

const PLATFORM_META: Record<Platform, PlatformOAuthMeta> = {
  youtube: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'openid',
      'email',
      'profile',
    ],
    usePublicClientId: true,
  },
  tiktok: {
    authorizeUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    scopes: ['user.info.basic', 'video.upload'],
  },
  linkedin: {
    authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['openid', 'profile', 'w_member_social'],
    usePublicClientId: true,
  },
  facebook: {
    authorizeUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    usePublicClientId: true,
  },
  instagram: {
    authorizeUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media'],
    usePublicClientId: true,
  },
  twitter: {
    authorizeUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    usePublicClientId: true,
  },
};

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getPlatformClientId(platform: Platform): string | undefined {
  const map: Record<Platform, string[]> = {
    youtube: ['NEXT_PUBLIC_YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_ID'],
    tiktok: ['NEXT_PUBLIC_TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_KEY'],
    linkedin: ['NEXT_PUBLIC_LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_ID'],
    facebook: ['NEXT_PUBLIC_FACEBOOK_APP_ID', 'FACEBOOK_APP_ID'],
    instagram: ['NEXT_PUBLIC_INSTAGRAM_CLIENT_ID', 'INSTAGRAM_CLIENT_ID'],
    twitter: ['NEXT_PUBLIC_TWITTER_CLIENT_ID', 'TWITTER_CLIENT_ID'],
  };
  return readEnv(...map[platform]);
}

export function getPlatformClientSecret(platform: Platform): string | undefined {
  const map: Record<Platform, string[]> = {
    youtube: ['YOUTUBE_CLIENT_SECRET'],
    tiktok: ['TIKTOK_CLIENT_SECRET'],
    linkedin: ['LINKEDIN_CLIENT_SECRET'],
    facebook: ['FACEBOOK_APP_SECRET'],
    instagram: ['INSTAGRAM_CLIENT_SECRET'],
    twitter: ['TWITTER_CLIENT_SECRET'],
  };
  return readEnv(...map[platform]);
}

export function validatePlatformOAuthConfig(platform: string): OAuthValidationResult {
  const platforms: Platform[] = [
    'youtube',
    'tiktok',
    'linkedin',
    'facebook',
    'instagram',
    'twitter',
  ];

  if (!platforms.includes(platform as Platform)) {
    return {
      ok: false,
      code: 'invalid_platform',
      message: `Unsupported platform: ${platform}`,
    };
  }

  const p = platform as Platform;
  const clientId = getPlatformClientId(p);
  const clientSecret = getPlatformClientSecret(p);

  if (!clientId) {
    return {
      ok: false,
      code: 'missing_client_id',
      message: `Missing OAuth client ID for ${p}. Set the platform client ID env vars.`,
      platform: p,
    };
  }

  if (!clientSecret) {
    return {
      ok: false,
      code: 'missing_client_secret',
      message: `Missing OAuth client secret for ${p}. Set the server-side secret env vars.`,
      platform: p,
    };
  }

  return { ok: true, code: 'ok', message: 'OK', platform: p };
}

export function buildPlatformAuthorizeUrl(
  platform: Platform,
  state: string,
  extra?: { codeChallenge?: string }
): string {
  const meta = PLATFORM_META[platform];
  const clientId = getPlatformClientId(platform);
  if (!clientId) {
    throw new Error(`Missing client ID for ${platform}`);
  }

  const redirectUri = getOAuthRedirectUri(platform);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  });

  if (platform === 'tiktok') {
    params.set('client_key', clientId);
  }

  if (platform === 'youtube') {
    params.set('access_type', 'offline');
    params.set('prompt', 'consent');
    params.set('include_granted_scopes', 'true');
  }

  if (platform === 'twitter' && extra?.codeChallenge) {
    params.set('code_challenge', extra.codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  params.set('scope', meta.scopes.join(platform === 'facebook' || platform === 'instagram' ? ',' : ' '));

  return `${meta.authorizeUrl}?${params.toString()}`;
}

export const OAUTH_TOKEN_CONFIG: Record<
  Platform,
  { tokenUrl: string; useBasicAuth?: boolean }
> = {
  youtube: { tokenUrl: 'https://oauth2.googleapis.com/token' },
  tiktok: { tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/' },
  linkedin: { tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken' },
  facebook: { tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token' },
  instagram: { tokenUrl: 'https://api.instagram.com/oauth/access_token' },
  twitter: { tokenUrl: 'https://api.twitter.com/2/oauth2/token', useBasicAuth: true },
};
