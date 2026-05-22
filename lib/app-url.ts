/**
 * Canonical app origin for OAuth redirects and auth callbacks.
 * Works on localhost, Vercel preview, and production.
 */
export function getAppOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '');
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
