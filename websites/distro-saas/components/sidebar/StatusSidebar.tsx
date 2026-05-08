'use client';

// components/sidebar/StatusSidebar.tsx
import { ExternalLink, RefreshCw } from 'lucide-react';
import type { Platform, Distribution } from '@/types';

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000',
  tiktok: '#ff0050',
  linkedin: '#0077b5',
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
};

const PLATFORM_ABBR: Record<Platform, string> = {
  youtube: 'YT', tiktok: 'TT', linkedin: 'LI', facebook: 'FB', instagram: 'IG', twitter: 'TW',
};

interface PlatformEntry {
  platform: Platform;
  status: 'idle' | 'queued' | 'processing' | 'published' | 'failed';
  progress: number;
  meta: string;
  externalUrl?: string;
}

interface StatusSidebarProps {
  entries: PlatformEntry[];
  onRetry: (platform: Platform) => void;
}

const STATUS_STYLES = {
  idle:       { color: 'var(--text3)',   bg: 'var(--bg3)',                   label: 'Idle' },
  queued:     { color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)',          label: 'Queued' },
  processing: { color: 'var(--accent2)', bg: 'rgba(59,130,246,0.1)',          label: 'Processing' },
  published:  { color: 'var(--success)', bg: 'rgba(52,211,153,0.1)',          label: 'Published' },
  failed:     { color: 'var(--danger)',  bg: 'rgba(248,113,113,0.1)',         label: 'Failed' },
};

export function StatusSidebar({ entries, onRetry }: StatusSidebarProps) {
  return (
    <div className="flex flex-col gap-3">
      {entries.map(entry => {
        const color = PLATFORM_COLORS[entry.platform];
        const s = STATUS_STYLES[entry.status];

        return (
          <div
            key={entry.platform}
            className="rounded-lg p-3 flex flex-col gap-2 border"
            style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-[22px] h-[22px] rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: `${color}22`, color }}>
                  {PLATFORM_ABBR[entry.platform]}
                </div>
                <span className="text-xs font-medium capitalize">{entry.platform}</span>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ color: s.color, background: s.bg }}>
                {s.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${entry.progress}%`, background: color }}
              />
            </div>

            {/* Meta row */}
            <div
              className="flex justify-between text-[10px] font-mono"
              style={{ color: 'var(--text3)' }}>
              <span>{entry.meta}</span>
              <span>{entry.progress}%</span>
            </div>

            {/* Actions */}
            {entry.status === 'failed' && (
              <button
                onClick={() => onRetry(entry.platform)}
                className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded border w-fit transition-all"
                style={{ color: 'var(--warning)', borderColor: 'rgba(251,191,36,0.3)' }}>
                <RefreshCw size={10} /> Retry
              </button>
            )}

            {entry.status === 'published' && entry.externalUrl && (
              <a
                href={entry.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[10px] font-mono w-fit"
                style={{ color: 'var(--success)' }}>
                View post <ExternalLink size={10} />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
