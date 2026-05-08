'use client';

// app/dashboard/page.tsx
import { useState, useCallback, useRef } from 'react';
import {
  Upload, Sparkles, Send, RefreshCw, Youtube,
  ToggleLeft, ToggleRight, CheckCircle2, XCircle,
  Loader2, Clock, Hash, FileVideo, Image as ImageIcon,
  AlignLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import type { Platform, CaptionVariants, MediaType } from '@/types';
import { useUpload } from '@/hooks/useUpload';

// ─── Types ─────────────────────────────────────────────────────
type PlatformState = {
  enabled: boolean;
  status: 'idle' | 'queued' | 'processing' | 'published' | 'failed';
  progress: number;
  meta: string;
  externalUrl?: string;
};

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000',
  tiktok: '#ff0050',
  linkedin: '#0077b5',
  facebook: '#1877f2',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube Short',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const PLATFORMS: Platform[] = ['youtube', 'tiktok', 'linkedin', 'facebook'];

// ─── Sub-components ────────────────────────────────────────────
function StatusBadge({ status }: { status: PlatformState['status'] }) {
  const styles: Record<string, string> = {
    idle: 'text-[var(--text3)] bg-[var(--bg3)]',
    queued: 'text-[var(--warning)] bg-[rgba(251,191,36,0.1)]',
    processing: 'text-[var(--accent2)] bg-[rgba(59,130,246,0.1)]',
    published: 'text-[var(--success)] bg-[rgba(52,211,153,0.1)]',
    failed: 'text-[var(--danger)] bg-[rgba(248,113,113,0.1)]',
  };
  const labels: Record<string, string> = {
    idle: 'Idle', queued: 'Queued', processing: 'Processing',
    published: 'Published', failed: 'Failed',
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function PlatformStatusCard({
  platform, state, onRetry
}: {
  platform: Platform;
  state: PlatformState;
  onRetry: () => void;
}) {
  const color = PLATFORM_COLORS[platform];
  const abbr = platform === 'youtube' ? 'YT'
    : platform === 'tiktok' ? 'TT'
    : platform === 'linkedin' ? 'LI' : 'FB';

  return (
    <div className="rounded-lg p-3 flex flex-col gap-2 border"
      style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[22px] h-[22px] rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            style={{ background: `${color}22`, color }}>
            {abbr}
          </div>
          <span className="text-xs font-medium">{PLATFORM_LABELS[platform]}</span>
        </div>
        <StatusBadge status={state.status} />
      </div>

      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${state.progress}%`, background: color }} />
      </div>

      <div className="flex justify-between font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
        <span>{state.meta}</span>
        <span>{state.progress}%</span>
      </div>

      {state.status === 'failed' && (
        <button onClick={onRetry}
          className="text-[10px] font-mono px-2 py-1 rounded border transition-all"
          style={{ color: 'var(--warning)', borderColor: 'rgba(251,191,36,0.3)' }}>
          ↺ Retry
        </button>
      )}
      {state.status === 'published' && state.externalUrl && (
        <a href={state.externalUrl} target="_blank" rel="noreferrer"
          className="flex items-center gap-1 text-[10px] font-mono"
          style={{ color: 'var(--success)' }}>
          View post <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  const [caption, setCaption] = useState(
    `🚀 Just shipped our new real-time analytics dashboard. Built with Next.js 14, Supabase, and a sprinkle of ✨\n\nKey features:\n- Live data streaming with <100ms latency  \n- Dark mode first design\n- One-click multi-platform distribution\n\nWhat do you think? Drop your feedback below! 👇\n\n#BuildInPublic #NextJS #Supabase #SaaS`
  );
  const [variants, setVariants] = useState<Partial<CaptionVariants>>({});
  const [selectedVariants, setSelectedVariants] = useState<Set<Platform>>(new Set());
  const [generatingAI, setGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'composer' | 'preview'>('composer');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [platforms, setPlatforms] = useState<Record<Platform, PlatformState>>({
    youtube: { enabled: true, status: 'idle', progress: 0, meta: 'Ready to publish' },
    tiktok: { enabled: true, status: 'idle', progress: 0, meta: 'Ready to publish' },
    linkedin: { enabled: true, status: 'idle', progress: 0, meta: 'Ready to publish' },
    facebook: { enabled: false, status: 'idle', progress: 0, meta: 'Not connected' },
  });
  const [publishing, setPublishing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploading, progress: uploadProgress, url: mediaUrl, upload } = useUpload();

  const charCount = caption.length;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setMediaFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMediaFile(file);
  };

  async function generateVariants() {
    setGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/adapt-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
      const { variants: v } = await res.json();
      setVariants(v);
      setSelectedVariants(new Set(Object.keys(v) as Platform[]));
    } catch {
      // Fallback demo variants
      setVariants({
        linkedin: 'Excited to share a major milestone: our real-time analytics dashboard is now live. Built for developers who demand sub-100ms performance — powered by Next.js 14 and Supabase. #BuildInPublic #SaaS #Engineering',
        tiktok: 'POV: You just shipped your analytics dashboard at 2am and latency is under 100ms 😤🔥 #devtok #buildinpublic #nextjs',
        youtube: 'I Built a Real-Time Analytics Dashboard | Next.js 14 + Supabase Full Stack Dev Log 🚀\n\nIn this video: architecture, performance tips, and lessons learned.\n\n#nextjs14 #supabase #webdevelopment',
        facebook: "Hey everyone! 👋 Super stoked to share what we've been building — our brand new analytics dashboard just went live! What features would you want to see next? Drop a comment! 👇",
      });
      setSelectedVariants(new Set(['youtube', 'tiktok', 'linkedin', 'facebook']));
    } finally {
      setGeneratingAI(false);
    }
  }

  function updatePlatform(p: Platform, update: Partial<PlatformState>) {
    setPlatforms(prev => ({ ...prev, [p]: { ...prev[p], ...update } }));
  }

  async function publishPlatform(platform: Platform) {
    const stages = [
      { status: 'queued' as const, progress: 0, meta: 'Queued...' },
      { status: 'processing' as const, progress: 25, meta: 'Uploading media...' },
      { status: 'processing' as const, progress: 55, meta: 'Platform processing...' },
      { status: 'processing' as const, progress: 80, meta: 'Finalizing...' },
      platform === 'facebook'
        ? { status: 'failed' as const, progress: 0, meta: 'Auth error — token expired' }
        : { status: 'published' as const, progress: 100, meta: 'Live ✓', externalUrl: '#' },
    ];

    for (const s of stages) {
      updatePlatform(platform, s);
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  async function publishAll() {
    setPublishing(true);
    const enabledPlatforms = (Object.entries(platforms) as [Platform, PlatformState][])
      .filter(([, s]) => s.enabled)
      .map(([p]) => p);

    await Promise.all(
      enabledPlatforms.map((p, i) =>
        new Promise(r => setTimeout(() => publishPlatform(p).then(r), i * 500))
      )
    );
    setPublishing(false);
  }

  async function retryPlatform(platform: Platform) {
    updatePlatform(platform, { status: 'idle', progress: 0, meta: 'Retrying...' });
    await publishPlatform(platform);
  }

  const PLATFORM_LIST: Platform[] = ['youtube', 'tiktok', 'linkedin', 'facebook'];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Topbar */}
      <header className="flex items-center justify-between px-5 h-[52px] border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <div className="flex items-center gap-3">
          <div className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#040d0a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display font-bold text-[15px] tracking-tight">Distro</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border"
            style={{ color: 'var(--accent)', background: 'rgba(110,231,183,0.1)', borderColor: 'rgba(110,231,183,0.2)' }}>
            v2.4.1
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-[7px] h-[7px] rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
          <button
            onClick={publishAll}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#040d0a' }}>
            {publishing ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {publishing ? 'Publishing...' : 'Publish All'}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Row 1: Upload + Caption */}
          <div className="grid grid-cols-2 gap-4">
            {/* Upload */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-display font-semibold text-[13px]">Media Upload</span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>MP4 / MOV / JPG / PNG</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {mediaFile ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <div className="w-full h-36 flex items-center justify-center text-4xl rounded-lg"
                      style={{ background: 'var(--bg3)' }}>
                      {mediaFile.type.startsWith('video/') ? '🎬' : '🖼'}
                    </div>
                    <div className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--accent)', borderColor: 'rgba(110,231,183,0.3)' }}>
                      {mediaFile.type.startsWith('video/') ? 'VIDEO' : 'IMAGE'} · {mediaFile.name.split('.').pop()?.toUpperCase()}
                    </div>
                    <button onClick={() => setMediaFile(null)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--text2)' }}>✕</button>
                    {uploading && (
                      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'var(--bg3)' }}>
                        <div className="h-full transition-all" style={{ width: `${uploadProgress}%`, background: 'var(--accent)' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
                    style={{ borderColor: dragging ? 'var(--accent)' : 'var(--border2)', background: dragging ? 'rgba(110,231,183,0.04)' : 'var(--glass)' }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}>
                    <Upload size={28} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium mb-1">Drop media here</p>
                    <p className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>or click to browse files</p>
                  </div>
                )}
                <input ref={fileRef} type="file" className="hidden" accept="video/*,image/*" onChange={handleFileSelect} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>Content Type</label>
                    <select className="rounded-md px-2 py-1.5 text-xs border outline-none"
                      style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <option>Short Video (60s)</option>
                      <option>Long Video</option>
                      <option>Image Post</option>
                      <option>Text Only</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>Schedule</label>
                    <select className="rounded-md px-2 py-1.5 text-xs border outline-none"
                      style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <option>Publish Now</option>
                      <option>Scheduled</option>
                      <option>Save as Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-display font-semibold text-[13px]">Master Caption</span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>Markdown Supported</span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex gap-1">
                  {['**B**', '*I*', '# H', '- •', '🔗'].map(f => (
                    <button key={f} className="px-2 py-1 rounded text-[11px] font-mono border transition-all"
                      style={{ background: 'var(--bg3)', borderColor: 'var(--border)', color: 'var(--text2)' }}>
                      {f}
                    </button>
                  ))}
                </div>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="w-full rounded-lg p-3 text-[13px] resize-none outline-none border transition-all"
                  style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)', lineHeight: 1.6, minHeight: 120 }}
                  rows={6}
                />
                <div className={`text-[11px] font-mono text-right ${charCount > 1800 ? 'text-yellow-400' : ''}`}
                  style={{ color: charCount > 1800 ? 'var(--warning)' : 'var(--text3)' }}>
                  {charCount} / 2200 chars
                </div>
                <div className="flex flex-wrap gap-1">
                  {['#BuildInPublic', '#NextJS', '#Supabase', '#SaaS', '#OpenSource', '#Dev', '#WebDev'].map(tag => (
                    <button key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded border transition-all"
                      style={{ background: 'rgba(110,231,183,0.08)', borderColor: 'rgba(110,231,183,0.3)', color: 'var(--accent)' }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Variations */}
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-display font-semibold text-[13px]">AI Adaptation Layer</span>
              <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>Platform-optimized variants</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <button onClick={generateVariants} disabled={generatingAI}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border text-sm transition-all disabled:opacity-60"
                style={{ background: 'var(--bg3)', borderColor: 'var(--border)', color: generatingAI ? 'var(--text3)' : 'var(--text2)' }}>
                {generatingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} style={{ color: 'var(--accent)' }} />}
                {generatingAI ? 'Generating variations...' : Object.keys(variants).length ? 'Regenerate Variations' : 'Generate Platform Variations'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                {([
                  ['linkedin', 'LinkedIn · Professional', 'text-blue-400 bg-blue-400/10'],
                  ['tiktok', 'TikTok · Hook-first', 'text-pink-400 bg-pink-400/10'],
                  ['youtube', 'YouTube · SEO-optimized', 'text-red-400 bg-red-400/10'],
                  ['facebook', 'Facebook · Casual', 'text-indigo-400 bg-indigo-400/10'],
                ] as [Platform, string, string][]).map(([p, label, tagStyle]) => (
                  <div key={p}
                    onClick={() => setSelectedVariants(prev => {
                      const n = new Set(prev);
                      n.has(p) ? n.delete(p) : n.add(p);
                      return n;
                    })}
                    className="relative rounded-lg p-3 border cursor-pointer transition-all"
                    style={{
                      background: selectedVariants.has(p) ? 'rgba(110,231,183,0.05)' : 'var(--bg2)',
                      borderColor: selectedVariants.has(p) ? 'var(--accent)' : 'var(--border)',
                    }}>
                    {selectedVariants.has(p) && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: 'var(--accent)', color: '#040d0a' }}>✓</div>
                    )}
                    <div className={`text-[10px] font-mono mb-2 px-2 py-0.5 rounded inline-block ${tagStyle}`}>{label}</div>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                      {variants[p] || `Click "Generate" to create an AI-optimized ${p} caption.`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Previews */}
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-display font-semibold text-[13px]">Multi-Platform Preview</span>
              <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>Real-time render</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {(['youtube', 'tiktok', 'linkedin'] as Platform[]).map(p => (
                <div key={p} className="rounded-xl border overflow-hidden transition-all hover:border-[var(--border2)]"
                  style={{ borderColor: 'var(--border)' }}>
                  <div className="px-3 py-2 flex items-center justify-between"
                    style={{ background: `${PLATFORM_COLORS[p]}10` }}>
                    <div className="flex items-center gap-2 text-[11px] font-display font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: PLATFORM_COLORS[p] }} />
                      {PLATFORM_LABELS[p]}
                    </div>
                    <button
                      onClick={() => updatePlatform(p, { enabled: !platforms[p].enabled })}
                      className="w-8 h-4 rounded-full relative transition-all"
                      style={{ background: platforms[p].enabled ? 'var(--accent)' : 'var(--bg3)' }}>
                      <div className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
                        style={{ left: platforms[p].enabled ? '18px' : '2px' }} />
                    </button>
                  </div>
                  <div className={`p-3 transition-opacity ${platforms[p].enabled ? '' : 'opacity-30 pointer-events-none'}`}>
                    <div className="rounded-lg p-2" style={{ background: 'var(--bg2)', minHeight: 80 }}>
                      {p !== 'linkedin' && (
                        <div className="flex items-center justify-center rounded mb-2 text-2xl"
                          style={{ background: 'var(--bg3)', height: 64 }}>
                          {p === 'youtube' ? '▶' : '♪'}
                        </div>
                      )}
                      {p === 'linkedin' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, var(--accent2), var(--accent3))' }} />
                          <div>
                            <div className="text-[10px] font-semibold">Your Name</div>
                            <div className="text-[9px]" style={{ color: 'var(--text3)' }}>Founder · SaaS</div>
                          </div>
                        </div>
                      )}
                      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                        {caption.slice(0, 80)}{caption.length > 80 ? '...' : ''}
                      </p>
                      <p className="text-[9px] mt-1 font-mono" style={{ color: 'var(--text3)' }}>
                        {p === 'youtube' ? '#analytics #nextjs · 12.4K views'
                          : p === 'tiktok' ? '#devtok #buildinpublic · ♡ 8.2K'
                          : '#BuildInPublic · 📊 623 impressions'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-[300px] border-l overflow-y-auto p-4 flex flex-col gap-4 flex-shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
            Distribution Status
          </div>

          {PLATFORM_LIST.map(p => (
            <PlatformStatusCard key={p} platform={p} state={platforms[p]} onRetry={() => retryPlatform(p)} />
          ))}

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
            Platform Integrations
          </div>

          {([
            ['youtube', 'Connected', 'badge-success'],
            ['tiktok', 'Connected', 'badge-success'],
            ['linkedin', 'Token Expiring', 'badge-warning'],
            ['facebook', 'Not Connected', 'badge-error'],
          ] as [Platform, string, string][]).map(([p, label, variant]) => {
            const badgeStyle: Record<string, { color: string; bg: string }> = {
              'badge-success': { color: 'var(--success)', bg: 'rgba(52,211,153,0.1)' },
              'badge-warning': { color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)' },
              'badge-error': { color: 'var(--danger)', bg: 'rgba(248,113,113,0.1)' },
            };
            return (
              <div key={p} className="flex items-center justify-between px-3 py-2 rounded-lg border"
                style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-[22px] h-[22px] rounded flex items-center justify-center text-[9px] font-bold"
                    style={{ background: `${PLATFORM_COLORS[p]}22`, color: PLATFORM_COLORS[p] }}>
                    {p === 'youtube' ? 'YT' : p === 'tiktok' ? 'TT' : p === 'linkedin' ? 'LI' : 'FB'}
                  </div>
                  <span className="text-xs capitalize">{p}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                  style={badgeStyle[variant]}>
                  {label}
                </span>
              </div>
            );
          })}

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
            Post Settings
          </div>

          {[
            ['Post Status', ['Draft', 'Queued', 'Scheduled']],
            ['Visibility', ['Public', 'Unlisted', 'Private']],
            ['Target Audience', ['Developers', 'Founders', 'Marketers', 'General']],
          ].map(([label, opts]) => (
            <div key={label as string} className="flex flex-col gap-1">
              <label className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>{label as string}</label>
              <select className="rounded-md px-2 py-1.5 text-xs border outline-none"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                {(opts as string[]).map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
