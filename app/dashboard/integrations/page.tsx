'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Link,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from 'lucide-react';
import type { Platform } from '@/types';
import { connectPlatformOAuth, getOAuthErrorMessage } from '@/lib/connect-oauth';
import { useUIStore } from '@/lib/store';

type IntegrationStatus = 'connected' | 'expiring' | 'disconnected';

interface PlatformInfo {
  label: string;
  color: string;
  abbr: string;
  description: string;
  status: IntegrationStatus;
  username?: string;
  expiresAt?: string;
}

const PLATFORM_META: Record<
  Platform,
  Omit<PlatformInfo, 'status' | 'username' | 'expiresAt'>
> = {
  youtube: {
    label: 'YouTube',
    color: '#ff0000',
    abbr: 'YT',
    description: 'Publish Shorts and long-form videos via YouTube Data API v3',
  },
  tiktok: {
    label: 'TikTok',
    color: '#ff0050',
    abbr: 'TT',
    description: 'Publish videos via TikTok Content Posting API',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0077b5',
    abbr: 'LI',
    description: 'Share posts and media to your LinkedIn profile via UGC API',
  },
  facebook: {
    label: 'Facebook',
    color: '#1877f2',
    abbr: 'FB',
    description: 'Publish to your Facebook Pages via Graph API',
  },
  instagram: {
    label: 'Instagram',
    color: '#e4405f',
    abbr: 'IG',
    description: 'Publish to Instagram (Business) via Graph API',
  },
  twitter: {
    label: 'X/Twitter',
    color: '#1da1f2',
    abbr: 'TW',
    description: 'Publish short posts to Twitter (X)',
  },
};

const DEFAULT_PLATFORMS = Object.fromEntries(
  (Object.keys(PLATFORM_META) as Platform[]).map((key) => [
    key,
    { ...PLATFORM_META[key], status: 'disconnected' as IntegrationStatus },
  ])
) as Record<Platform, PlatformInfo>;

function IntegrationsPageContent() {
  const searchParams = useSearchParams();
  const { addToast } = useUIStore();
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/integrations', { credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      console.log('[integrations] Loaded', res.status, body);

      if (!res.ok) {
        if (res.status !== 401) {
          addToast({ type: 'error', message: body.error ?? 'Failed to load integrations' });
        }
        return;
      }

      const next = { ...DEFAULT_PLATFORMS };
      for (const account of body.accounts ?? []) {
        const key = account.platform as Platform;
        if (!next[key]) continue;
        next[key] = {
          ...next[key],
          status: account.connection_status,
          username: account.platform_username
            ? `@${account.platform_username}`
            : undefined,
          expiresAt:
            account.connection_status === 'expiring' && account.expires_in_days
              ? `Expires in ${account.expires_in_days} days`
              : undefined,
        };
      }
      setPlatforms(next);
    } catch (err) {
      console.error('[integrations] Load error', err);
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Network error',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  useEffect(() => {
    const error = searchParams.get('error');
    const connected = searchParams.get('connected');
    const detail = searchParams.get('error_detail');

    if (error) {
      const message = getOAuthErrorMessage(error);
      addToast({
        type: 'error',
        message: detail ? `${message} (${detail})` : message,
      });
      console.error('[integrations] OAuth error from URL', error, detail);
    }

    if (connected) {
      addToast({
        type: 'success',
        message: `${PLATFORM_META[connected as Platform]?.label ?? connected} connected successfully`,
      });
      void loadIntegrations();
    }
  }, [searchParams, addToast, loadIntegrations]);

  function getStatusUI(status: IntegrationStatus) {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle2 size={12} />,
          label: 'Connected',
          color: 'var(--success)',
          bg: 'rgba(52,211,153,0.1)',
        };
      case 'expiring':
        return {
          icon: <AlertTriangle size={12} />,
          label: 'Token Expiring',
          color: 'var(--warning)',
          bg: 'rgba(251,191,36,0.1)',
        };
      case 'disconnected':
        return {
          icon: <XCircle size={12} />,
          label: 'Not Connected',
          color: 'var(--danger)',
          bg: 'rgba(248,113,113,0.1)',
        };
    }
  }

  async function handleConnect(platform: Platform) {
    if (connectingPlatform) return;
    setConnectingPlatform(platform);
    console.log('[integrations] Connect', platform);

    try {
      const result = await connectPlatformOAuth(platform);
      if (!result.ok) {
        addToast({ type: 'error', message: result.message });
        setConnectingPlatform(null);
      }
    } catch (err) {
      console.error('[integrations] Connect error', err);
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to start OAuth',
      });
      setConnectingPlatform(null);
    }
  }

  async function disconnect(platform: Platform) {
    try {
      const res = await fetch(`/api/integrations/${platform}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast({ type: 'error', message: body.error ?? 'Disconnect failed' });
        return;
      }
      setPlatforms((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], status: 'disconnected', username: undefined },
      }));
      addToast({ type: 'success', message: `${PLATFORM_META[platform].label} disconnected` });
    } catch (err) {
      addToast({ type: 'error', message: 'Network error while disconnecting' });
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="font-display font-bold text-xl">Platform Integrations</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
            Connect your social accounts to enable one-click distribution
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text3)' }}>
            <Loader2 size={16} className="animate-spin" />
            Loading integrations...
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {(Object.entries(platforms) as [Platform, PlatformInfo][]).map(([key, info]) => {
            const statusUI = getStatusUI(info.status);
            const isConnecting = connectingPlatform === key;

            return (
              <div
                key={key}
                className="rounded-xl border p-5 flex items-center justify-between gap-4"
                style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `${info.color}22`, color: info.color }}
                  >
                    {info.abbr}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-sm">{info.label}</span>
                      <span
                        className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                        style={{ color: statusUI.color, background: statusUI.bg }}
                      >
                        {statusUI.icon} {statusUI.label}
                      </span>
                    </div>
                    <p className="text-[12px]" style={{ color: 'var(--text3)' }}>
                      {info.description}
                    </p>
                    {info.username && (
                      <p className="text-[11px] font-mono mt-1" style={{ color: 'var(--text2)' }}>
                        {info.username}
                        {info.expiresAt && (
                          <span style={{ color: 'var(--warning)' }}> · {info.expiresAt}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {info.status === 'disconnected' ? (
                    <button
                      type="button"
                      onClick={() => handleConnect(key)}
                      disabled={!!connectingPlatform}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      style={{
                        background: `${info.color}22`,
                        color: info.color,
                        border: `1px solid ${info.color}44`,
                      }}
                    >
                      {isConnecting ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Link size={13} />
                      )}
                      {isConnecting ? 'Connecting...' : 'Connect Account'}
                    </button>
                  ) : (
                    <>
                      {info.status === 'expiring' && (
                        <button
                          type="button"
                          onClick={() => handleConnect(key)}
                          disabled={!!connectingPlatform}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all disabled:opacity-50"
                          style={{ color: 'var(--warning)', borderColor: 'rgba(251,191,36,0.3)' }}
                        >
                          <RefreshCw size={12} className={isConnecting ? 'animate-spin' : ''} />
                          Reconnect
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => disconnect(key)}
                        className="px-3 py-1.5 rounded-lg text-xs border transition-all"
                        style={{ color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.3)' }}
                      >
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="rounded-xl border p-4"
          style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-display font-semibold text-sm mb-2">Security Note</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>
            OAuth tokens are stored in your Supabase database and are never exposed client-side.
            Tokens are refreshed automatically before expiry. You can revoke access at any time from
            the respective platform&apos;s developer settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-6 flex items-center gap-2" style={{ background: 'var(--bg)' }}>
          <Loader2 size={18} className="animate-spin" style={{ color: 'var(--accent)' }} />
          <span className="text-sm" style={{ color: 'var(--text3)' }}>
            Loading integrations...
          </span>
        </div>
      }
    >
      <IntegrationsPageContent />
    </Suspense>
  );
}
