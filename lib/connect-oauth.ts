'use client';

import type { Platform } from '@/types';

export type ConnectOAuthResult =
  | { ok: true; mode: 'redirect' }
  | { ok: false; message: string; code?: string };

/**
 * Starts platform OAuth by navigating to the server authorize endpoint.
 * Full-page redirect avoids popup blockers and matches provider best practices.
 */
export async function connectPlatformOAuth(platform: Platform): Promise<ConnectOAuthResult> {
  const logPrefix = `[oauth:${platform}]`;
  console.log(logPrefix, 'Starting OAuth connect flow');

  try {
    const checkRes = await fetch(`/api/integrations/oauth/${platform}?check=1`, {
      credentials: 'include',
    });

    const checkBody = await checkRes.json().catch(() => ({}));
    console.log(logPrefix, 'Config check response', checkRes.status, checkBody);

    if (!checkRes.ok || !checkBody.ok) {
      const message =
        checkBody.message ||
        'OAuth is not configured for this platform. Add client ID and secret env vars.';
      return { ok: false, message, code: checkBody.code };
    }

    const authUrl = `/api/integrations/oauth/${platform}`;
    console.log(logPrefix, 'Redirecting to authorize endpoint', authUrl);
    window.location.assign(authUrl);
    return { ok: true, mode: 'redirect' };
  } catch (err) {
    console.error(logPrefix, 'Network or unexpected error', err);
    const message =
      err instanceof Error ? err.message : 'Network error while starting OAuth';
    return { ok: false, message };
  }
}

export function getOAuthErrorMessage(code: string | null): string {
  const messages: Record<string, string> = {
    no_code: 'Authorization was cancelled or no code was returned.',
    invalid_platform: 'Unsupported platform.',
    token_exchange: 'Failed to exchange authorization code for tokens.',
    missing_client_id: 'OAuth client ID is not configured. Add NEXT_PUBLIC_* and server env vars in Vercel.',
    missing_client_secret: 'OAuth client secret is not configured on the server (Vercel env).',
    not_authenticated: 'Please sign in before connecting accounts.',
    state_mismatch: 'OAuth state mismatch. Please try connecting again.',
    provider_error: 'The provider returned an error during authorization.',
    storage_failed: 'Connected successfully but failed to save tokens.',
    popup_blocked: 'Popup was blocked. Using full-page redirect instead.',
  };
  return messages[code ?? ''] ?? `OAuth error: ${code ?? 'unknown'}`;
}
