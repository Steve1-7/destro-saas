import type { ConnectedAccount, Integration, Platform } from '@/types';

export function integrationToConnectedAccount(row: Integration): ConnectedAccount {
  let connection_status: ConnectedAccount['connection_status'] = 'connected';
  let expires_in_days: number | undefined;

  if (!row.is_active) {
    connection_status = 'disconnected';
  } else if (row.token_expires_at) {
    const expiresAt = new Date(row.token_expires_at);
    const now = Date.now();
    if (expiresAt.getTime() <= now) {
      connection_status = 'error';
    } else {
      const days = Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
      expires_in_days = days;
      if (days <= 3) connection_status = 'expiring';
    }
  }

  return {
    ...row,
    platform_display_name: row.platform_username ?? row.platform_user_id ?? undefined,
    connection_status,
    expires_in_days,
    last_synced_at: row.last_used_at ?? row.connected_at,
  };
}

export function groupAccountsByPlatform(
  accounts: ConnectedAccount[]
): Record<Platform, ConnectedAccount[]> {
  const grouped = {} as Record<Platform, ConnectedAccount[]>;
  for (const account of accounts) {
    if (!grouped[account.platform]) grouped[account.platform] = [];
    grouped[account.platform].push(account);
  }
  return grouped;
}
