// hooks/useDistributionStatus.ts
'use client';

import { useEffect, useState } from 'react';
import type { Distribution, Platform } from '@/types';

type StatusMap = Partial<Record<Platform, Distribution>>;

export function useDistributionStatus(postId: string | null) {
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const es = new EventSource(`/api/status/${postId}`);

    es.onopen = () => setConnected(true);

    es.onmessage = (e) => {
      const payload = JSON.parse(e.data);

      if (payload.type === 'init') {
        const map: StatusMap = {};
        for (const d of payload.distributions as Distribution[]) {
          map[d.platform as Platform] = d;
        }
        setStatusMap(map);
      }

      if (payload.type === 'update') {
        const d = payload.distribution as Distribution;
        setStatusMap((prev) => ({ ...prev, [d.platform]: d }));
      }
    };

    es.onerror = () => setConnected(false);

    return () => es.close();
  }, [postId]);

  return { statusMap, connected };
}
