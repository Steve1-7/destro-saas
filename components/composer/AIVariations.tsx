'use client';

// components/composer/AIVariations.tsx
import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { CaptionVariants, Platform } from '@/types';

interface AIVariationsProps {
  masterCaption: string;
  variants: Partial<CaptionVariants>;
  selected: Set<Platform>;
  onGenerate: () => Promise<void>;
  onToggle: (platform: Platform) => void;
}

const VARIANT_CONFIG: { platform: Platform; label: string; tagClass: string }[] = [
  { platform: 'linkedin', label: 'LinkedIn · Professional',  tagClass: 'text-blue-400 bg-blue-400/10' },
  { platform: 'tiktok',   label: 'TikTok · Hook-first',      tagClass: 'text-pink-400 bg-pink-400/10' },
  { platform: 'youtube',  label: 'YouTube · SEO-optimized',  tagClass: 'text-red-400 bg-red-400/10' },
  { platform: 'facebook', label: 'Facebook · Casual',        tagClass: 'text-indigo-400 bg-indigo-400/10' },
];

export function AIVariations({ masterCaption, variants, selected, onGenerate, onToggle }: AIVariationsProps) {
  const [loading, setLoading] = useState(false);
  const hasVariants = Object.keys(variants).length > 0;

  async function handleGenerate() {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleGenerate}
        disabled={loading || !masterCaption.trim()}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border text-sm transition-all disabled:opacity-50"
        style={{ background: 'var(--bg3)', borderColor: 'var(--border)', color: 'var(--text2)' }}>
        {loading
          ? <><Loader2 size={14} className="animate-spin" /> Generating variations...</>
          : <><Sparkles size={14} style={{ color: 'var(--accent)' }} />
              {hasVariants ? 'Regenerate Variations' : 'Generate Platform Variations'}
            </>}
      </button>

      <div className="grid grid-cols-2 gap-3">
        {VARIANT_CONFIG.map(({ platform, label, tagClass }) => (
          <div
            key={platform}
            onClick={() => onToggle(platform)}
            className="relative rounded-lg p-3 border cursor-pointer transition-all select-none"
            style={{
              background: selected.has(platform) ? 'rgba(110,231,183,0.05)' : 'var(--bg2)',
              borderColor: selected.has(platform) ? 'var(--accent)' : 'var(--border)',
            }}>
            {selected.has(platform) && (
              <div
                className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'var(--accent)', color: '#040d0a' }}>
                ✓
              </div>
            )}
            <div className={`text-[10px] font-mono mb-2 px-2 py-0.5 rounded inline-block ${tagClass}`}>
              {label}
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2)' }}>
              {variants[platform] || `Click "Generate" to create an AI-optimized ${platform} caption.`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
