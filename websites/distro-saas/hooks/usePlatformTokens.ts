// hooks/usePlatformTokens.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Integration, Platform } from '@/types';

type TokenMap = Partial<Record<Platform, Integration>>;

export function usePlatformTokens() {
  const [tokens, setTokens] = useState<TokenMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true);

      if (!error && data) {
        const map: TokenMap = {};
        for (const integration of data as Integration[]) {
          map[integration.platform] = integration;
        }
        setTokens(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  function isConnected(platform: Platform): boolean {
    return !!tokens[platform];
  }

  function isExpiring(platform: Platform): boolean {
    const integration = tokens[platform];
    if (!integration?.token_expires_at) return false;
    const expiresAt = new Date(integration.token_expires_at);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return expiresAt < threeDaysFromNow;
  }

  return { tokens, loading, isConnected, isExpiring };
}
