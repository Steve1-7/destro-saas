/**
 * Canonical app origin for OAuth redirects and auth callbacks.
 * Works on localhost, Vercel preview, and production.
 */
function normalizeOrigin(value?: string): string | null {
  if (!value) return null;
  try {
    const normalized = value.trim().replace(/\/$/, '');
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

export function getAppOrigin(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.NEXTAUTH_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeOrigin(candidate);
    if (normalized) return normalized;
  }

  return 'http://localhost:3000';
}

export function getOAuthCallbackPath(platform: string): string {
  return `/api/integrations/oauth/${platform}`;
}

export function getOAuthRedirectUri(platform: string): string {
  return `${getAppOrigin()}${getOAuthCallbackPath(platform)}`;
}

export function getSupabaseAuthRedirectPath(): string {
  return '/auth/callback';
}

export function getSupabaseAuthRedirectUrl(): string {
  return `${getAppOrigin()}${getSupabaseAuthRedirectPath()}`;
}
