'use client';

// components/composer/PlatformGrid.tsx
import type { Platform } from '@/types';

interface PlatformGridProps {
  caption: string;
  mediaType?: 'video' | 'image' | 'text';
  enabledPlatforms: Set<Platform>;
  onToggle: (platform: Platform) => void;
}

const PLATFORMS = [
  {
    key: 'youtube' as Platform,
    label: 'YouTube Short',
    color: '#ff0000',
    icon: '▶',
    meta: '#analytics #nextjs · 12.4K views',
  },
  {
    key: 'tiktok' as Platform,
    label: 'TikTok',
    color: '#ff0050',
    icon: '♪',
    meta: '#devtok #buildinpublic · ♡ 8.2K',
  },
  {
    key: 'linkedin' as Platform,
    label: 'LinkedIn',
    color: '#0077b5',
    icon: null,
    meta: '#BuildInPublic · 📊 623 impressions',
  },
];

export function PlatformGrid({ caption, enabledPlatforms, onToggle }: PlatformGridProps) {
  const preview = caption.slice(0, 80) + (caption.length > 80 ? '...' : '');

  return (
    <div className="grid grid-cols-3 gap-3">
      {PLATFORMS.map(({ key, label, color, icon, meta }) => {
        const enabled = enabledPlatforms.has(key);
        return (
          <div
            key={key}
            className="rounded-xl border overflow-hidden transition-all hover:-translate-y-px"
            style={{ borderColor: 'var(--border)' }}>
            {/* Platform header */}
            <div
              className="px-3 py-2 flex items-center justify-between"
              style={{ background: `${color}10` }}>
              <div className="flex items-center gap-2 text-[11px] font-display font-semibold">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                {label}
              </div>
              {/* Toggle */}
              <button
                onClick={() => onToggle(key)}
                className="w-8 h-4 rounded-full relative transition-all"
                style={{ background: enabled ? 'var(--accent)' : 'var(--bg3)' }}
                aria-label={`Toggle ${label}`}>
                <div
                  className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                  style={{ left: enabled ? '18px' : '2px' }}
                />
              </button>
            </div>

            {/* Preview body */}
            <div
              className="p-3 transition-opacity"
              style={{ opacity: enabled ? 1 : 0.3, pointerEvents: enabled ? 'auto' : 'none' }}>
              <div className="rounded-lg p-2" style={{ background: 'var(--bg2)', minHeight: 80 }}>
                {/* Video mockup */}
                {icon && (
                  <div
                    className="flex items-center justify-center rounded mb-2 text-2xl relative overflow-hidden"
                    style={{ background: 'var(--bg3)', height: 64 }}>
                    <span style={{ opacity: 0.6 }}>{icon}</span>
                    {key === 'youtube' && (
                      <span
                        className="absolute bottom-1 right-2 text-[9px] font-mono"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        0:58
                      </span>
                    )}
                  </div>
                )}

                {/* LinkedIn avatar row */}
                {key === 'linkedin' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--accent2), var(--accent3))' }}
                    />
                    <div>
                      <div className="text-[10px] font-semibold">Your Name</div>
                      <div className="text-[9px]" style={{ color: 'var(--text3)' }}>Founder · SaaS</div>
                    </div>
                  </div>
                )}

                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                  {preview}
                </p>
                <p className="text-[9px] mt-1 font-mono" style={{ color: 'var(--text3)' }}>
                  {meta}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
