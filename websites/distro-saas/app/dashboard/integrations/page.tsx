'use client';

// app/dashboard/integrations/page.tsx
import { useState } from 'react';
import { Link, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import type { Platform } from '@/types';

const OAUTH_URLS: Record<Platform, string> = {
  youtube: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}/api/integrations/oauth/youtube&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload`,
  tiktok: `https://www.tiktok.com/v2/auth/authorize?client_key=${process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}/api/integrations/oauth/tiktok&response_type=code&scope=video.upload`,
  linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}/api/integrations/oauth/linkedin&response_type=code&scope=w_member_social`,
  facebook: `https://www.facebook.com/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}/api/integrations/oauth/facebook&scope=pages_manage_posts,pages_read_engagement`,
  instagram: `https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}/api/integrations/oauth/instagram&response_type=code&scope=user_profile,user_media`,
  twitter: `https://twitter.com/i/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}/api/integrations/oauth/twitter&response_type=code&scope=tweet.read%20tweet.write%20users.read%20offline.access`,
};

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

const PLATFORMS: Record<Platform, PlatformInfo> = {
  youtube: {
    label: 'YouTube',
    color: '#ff0000',
    abbr: 'YT',
    description: 'Publish Shorts and long-form videos via YouTube Data API v3',
    status: 'connected',
    username: '@yourchannel',
  },
  tiktok: {
    label: 'TikTok',
    color: '#ff0050',
    abbr: 'TT',
    description: 'Publish videos via TikTok Content Posting API',
    status: 'connected',
    username: '@yourhandle',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0077b5',
    abbr: 'LI',
    description: 'Share posts and media to your LinkedIn profile via UGC API',
    status: 'expiring',
    username: 'Your Name',
    expiresAt: 'Expires in 3 days',
  },
  facebook: {
    label: 'Facebook',
    color: '#1877f2',
    abbr: 'FB',
    description: 'Publish to your Facebook Pages via Graph API',
    status: 'disconnected',
  },
  instagram: {
    label: 'Instagram',
    color: '#e4405f',
    abbr: 'IG',
    description: 'Publish to Instagram (Business) via Graph API',
    status: 'disconnected',
  },
  twitter: {
    label: 'X/Twitter',
    color: '#1da1f2',
    abbr: 'TW',
    description: 'Publish short posts to Twitter (X)',
    status: 'disconnected',
  },
};

export default function IntegrationsPage() {
  const [platforms, setPlatforms] = useState(PLATFORMS);

  function getStatusUI(status: IntegrationStatus) {
    switch (status) {
      case 'connected':
        return { icon: <CheckCircle2 size={12} />, label: 'Connected', color: 'var(--success)', bg: 'rgba(52,211,153,0.1)' };
      case 'expiring':
        return { icon: <AlertTriangle size={12} />, label: 'Token Expiring', color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)' };
      case 'disconnected':
        return { icon: <XCircle size={12} />, label: 'Not Connected', color: 'var(--danger)', bg: 'rgba(248,113,113,0.1)' };
    }
  }

  function disconnect(platform: Platform) {
    setPlatforms(prev => ({
      ...prev,
      [platform]: { ...prev[platform], status: 'disconnected', username: undefined },
    }));
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

        <div className="grid grid-cols-1 gap-4">
          {(Object.entries(platforms) as [Platform, PlatformInfo][]).map(([key, info]) => {
            const statusUI = getStatusUI(info.status);
            return (
              <div key={key} className="rounded-xl border p-5 flex items-center justify-between gap-4"
                style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `${info.color}22`, color: info.color }}>
                    {info.abbr}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-sm">{info.label}</span>
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                        style={{ color: statusUI.color, background: statusUI.bg }}>
                        {statusUI.icon} {statusUI.label}
                      </span>
                    </div>
                    <p className="text-[12px]" style={{ color: 'var(--text3)' }}>{info.description}</p>
                    {info.username && (
                      <p className="text-[11px] font-mono mt-1" style={{ color: 'var(--text2)' }}>
                        {info.username}
                        {info.expiresAt && <span style={{ color: 'var(--warning)' }}> · {info.expiresAt}</span>}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {info.status === 'disconnected' ? (
                    <a href={OAUTH_URLS[key]}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ background: `${info.color}22`, color: info.color, border: `1px solid ${info.color}44` }}>
                      <Link size={13} /> Connect
                    </a>
                  ) : (
                    <>
                      {info.status === 'expiring' && (
                        <a href={OAUTH_URLS[key]}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all"
                          style={{ color: 'var(--warning)', borderColor: 'rgba(251,191,36,0.3)' }}>
                          <RefreshCw size={12} /> Reconnect
                        </a>
                      )}
                      <button onClick={() => disconnect(key)}
                        className="px-3 py-1.5 rounded-lg text-xs border transition-all"
                        style={{ color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.3)' }}>
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border p-4" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
          <h3 className="font-display font-semibold text-sm mb-2">Security Note</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>
            OAuth tokens are stored encrypted in your Supabase database and are never exposed client-side.
            Tokens are refreshed automatically before expiry. You can revoke access at any time from
            the respective platform's developer settings.
          </p>
        </div>
      </div>
    </div>
  );
}
