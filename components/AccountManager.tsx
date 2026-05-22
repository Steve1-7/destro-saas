'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Youtube,
  Music2,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Unlink,
  Check,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAccountStore, useUIStore } from '@/lib/store';
import { connectPlatformOAuth } from '@/lib/connect-oauth';
import type { Platform, ConnectedAccount } from '@/types';

const PLATFORM_CONFIG: Record<Platform, { icon: React.ReactNode; color: string; name: string }> = {
  youtube: { icon: <Youtube size={18} />, color: '#ff0000', name: 'YouTube' },
  tiktok: { icon: <Music2 size={18} />, color: '#ff0050', name: 'TikTok' },
  linkedin: { icon: <Linkedin size={18} />, color: '#0077b5', name: 'LinkedIn' },
  facebook: { icon: <Facebook size={18} />, color: '#1877f2', name: 'Facebook' },
  instagram: { icon: <Instagram size={18} />, color: '#e4405f', name: 'Instagram' },
  twitter: { icon: <Twitter size={18} />, color: '#1da1f2', name: 'X/Twitter' },
};

const STATUS_CONFIG = {
  connected: { color: 'var(--success)', bg: 'rgba(52,211,153,0.1)', label: 'Connected' },
  expiring: { color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)', label: 'Expiring' },
  disconnected: { color: 'var(--text3)', bg: 'var(--bg3)', label: 'Disconnected' },
  error: { color: 'var(--danger)', bg: 'rgba(248,113,113,0.1)', label: 'Error' },
};

interface AccountManagerProps {
  className?: string;
}

export function AccountManager({ className }: AccountManagerProps) {
  const {
    accounts,
    selectedAccountId,
    isConnecting,
    selectAccount,
    setIsConnecting,
    setAccounts,
    removeAccount,
  } = useAccountStore();
  const { addToast } = useUIStore();
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<Platform>>(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const accountsByPlatform = accounts.reduce((acc, account) => {
    if (!acc[account.platform]) acc[account.platform] = [];
    acc[account.platform].push(account);
    return acc;
  }, {} as Record<Platform, ConnectedAccount[]>);

  const loadAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch('/api/integrations', { credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      console.log('[AccountManager] Loaded integrations', res.status, body);

      if (!res.ok) {
        if (res.status !== 401) {
          addToast({
            type: 'error',
            message: body.error ?? 'Failed to load connected accounts',
          });
        }
        return;
      }

      setAccounts(body.accounts ?? []);
    } catch (err) {
      console.error('[AccountManager] Load error', err);
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Network error loading accounts',
      });
    } finally {
      setLoadingAccounts(false);
    }
  }, [addToast, setAccounts]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const togglePlatformExpand = (platform: Platform) => {
    setExpandedPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  const handleConnect = async (platform: Platform) => {
    if (isConnecting) return;

    setIsConnecting(true);
    setShowAddMenu(false);
    console.log('[AccountManager] Connect clicked', platform);

    try {
      const result = await connectPlatformOAuth(platform);
      if (!result.ok) {
        addToast({ type: 'error', message: result.message });
        setIsConnecting(false);
      }
      // On success the page redirects — keep loading state
    } catch (err) {
      console.error('[AccountManager] Connect error', err);
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to start OAuth',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (account: ConnectedAccount) => {
    try {
      const res = await fetch(`/api/integrations/${account.platform}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast({ type: 'error', message: body.error ?? 'Failed to disconnect' });
        return;
      }
      removeAccount(account.id);
      addToast({ type: 'success', message: `${PLATFORM_CONFIG[account.platform].name} disconnected` });
      await loadAccounts();
    } catch (err) {
      console.error('[AccountManager] Disconnect error', err);
      addToast({ type: 'error', message: 'Network error while disconnecting' });
    }
  };

  const handleReconnect = (account: ConnectedAccount) => {
    addToast({ type: 'info', message: `Opening ${PLATFORM_CONFIG[account.platform].name} login...` });
    void handleConnect(account.platform);
  };

  const allPlatforms: Platform[] = ['youtube', 'tiktok', 'linkedin', 'facebook', 'instagram', 'twitter'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>
            Connected Accounts
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
            {loadingAccounts
              ? 'Loading...'
              : `${accounts.filter((a) => a.connection_status === 'connected').length} connected`}
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            disabled={isConnecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#040d0a' }}
          >
            {isConnecting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            {isConnecting ? 'Connecting...' : 'Connect Account'}
          </button>

          {showAddMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border overflow-hidden shadow-xl z-20"
              style={{ background: 'var(--bg1)', borderColor: 'var(--border2)' }}
            >
              {allPlatforms.map((platform) => {
                const config = PLATFORM_CONFIG[platform];
                const hasAccounts = (accountsByPlatform[platform] || []).length > 0;
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handleConnect(platform)}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all hover:bg-white/5 disabled:opacity-50"
                  >
                    <span style={{ color: config.color }}>{config.icon}</span>
                    <span className="text-sm" style={{ color: 'var(--text2)' }}>
                      {config.name}
                    </span>
                    {hasAccounts && (
                      <span
                        className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--bg3)', color: 'var(--text3)' }}
                      >
                        +{accountsByPlatform[platform].length}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Platform List */}
      <div className="space-y-2">
        {allPlatforms.map((platform) => {
          const platformAccounts = accountsByPlatform[platform] || [];
          const config = PLATFORM_CONFIG[platform];
          const isExpanded = expandedPlatforms.has(platform);
          const hasAccounts = platformAccounts.length > 0;

          return (
            <div
              key={platform}
              className="rounded-xl border overflow-hidden transition-all"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
            >
              <button
                type="button"
                onClick={() => togglePlatformExpand(platform)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${config.color}20` }}
                  >
                    <span style={{ color: config.color }}>{config.icon}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {config.name}
                    </span>
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      {hasAccounts
                        ? `${platformAccounts.length} account${platformAccounts.length !== 1 ? 's' : ''}`
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasAccounts &&
                    platformAccounts.some((a) => a.connection_status === 'connected') && (
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
                    )}
                  {isExpanded ? (
                    <ChevronDown size={16} style={{ color: 'var(--text3)' }} />
                  ) : (
                    <ChevronRight size={16} style={{ color: 'var(--text3)' }} />
                  )}
                </div>
              </button>

              {isExpanded && hasAccounts && (
                <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                  {platformAccounts.map((account) => {
                    const status = STATUS_CONFIG[account.connection_status];
                    const isSelected = selectedAccountId === account.id;

                    return (
                      <div
                        key={account.id}
                        className="px-3 py-2.5 border-b last:border-b-0 transition-all hover:bg-white/5"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-start justify-between">
                          <button
                            type="button"
                            onClick={() => selectAccount(isSelected ? null : account.id)}
                            className="flex items-center gap-2 flex-1 text-left"
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
                              style={{ background: 'var(--bg3)' }}
                            >
                              {account.platform_avatar ? (
                                <img
                                  src={account.platform_avatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={14} style={{ color: 'var(--text3)' }} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-medium truncate"
                                style={{ color: 'var(--text)' }}
                              >
                                {account.platform_display_name ||
                                  account.platform_username ||
                                  'Account'}
                              </p>
                              <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                                {account.platform_username
                                  ? `@${account.platform_username}`
                                  : platform}
                              </p>
                            </div>
                            {isSelected && <Check size={14} style={{ color: 'var(--accent)' }} />}
                          </button>

                          <div className="flex items-center gap-1">
                            <span
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                              style={{ background: status.bg, color: status.color }}
                            >
                              {status.label}
                            </span>
                            <div className="relative group">
                              <button
                                type="button"
                                className="p-1 rounded hover:bg-white/5 transition-colors"
                              >
                                <MoreHorizontal size={14} style={{ color: 'var(--text3)' }} />
                              </button>

                              <div
                                className="absolute right-0 top-full mt-1 w-40 rounded-lg border overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10 shadow-xl"
                                style={{ background: 'var(--bg1)', borderColor: 'var(--border2)' }}
                              >
                                {account.connection_status !== 'connected' && (
                                  <button
                                    type="button"
                                    onClick={() => handleReconnect(account)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors"
                                    style={{ color: 'var(--text2)' }}
                                  >
                                    <RefreshCw size={12} />
                                    Reconnect
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDisconnect(account)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors"
                                  style={{ color: 'var(--danger)' }}
                                >
                                  <Unlink size={12} />
                                  Disconnect
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {account.expires_in_days && account.connection_status === 'expiring' && (
                          <div className="flex items-center gap-1 mt-1.5 ml-9">
                            <AlertCircle size={10} style={{ color: 'var(--warning)' }} />
                            <span className="text-[9px]" style={{ color: 'var(--warning)' }}>
                              Expires in {account.expires_in_days} days
                            </span>
                          </div>
                        )}
                        {account.last_synced_at && (
                          <div className="flex items-center gap-1 mt-1.5 ml-9">
                            <Clock size={10} style={{ color: 'var(--text3)' }} />
                            <span className="text-[9px]" style={{ color: 'var(--text3)' }}>
                              Synced {new Date(account.last_synced_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {isExpanded && !hasAccounts && (
                <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => handleConnect(platform)}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-all hover:border-[var(--accent)] disabled:opacity-50"
                    style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                  >
                    {isConnecting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Connect {config.name}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
