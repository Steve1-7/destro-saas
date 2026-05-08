'use client';

// app/dashboard/posts/[id]/page.tsx
import { useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import type { Platform, Distribution } from '@/types';

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000', tiktok: '#ff0050', linkedin: '#0077b5', facebook: '#1877f2',
};

const MOCK_DISTRIBUTIONS: Distribution[] = [
  { platform: 'youtube', status: 'published', progress: 100, external_url: 'https://youtube.com/shorts/abc', published_at: new Date().toISOString(), external_id: 'abc123', id: '1', post_id: '1', retry_count: 0 },
  { platform: 'tiktok', status: 'published', progress: 100, external_url: 'https://tiktok.com/@user/video/123', published_at: new Date().toISOString(), external_id: 'tik456', id: '2', post_id: '1', retry_count: 0 },
  { platform: 'linkedin', status: 'failed', progress: 0, error_message: 'Token expired — reconnect LinkedIn', retry_count: 3, id: '3', post_id: '1' },
  { platform: 'facebook', status: 'queued', progress: 0, id: '4', post_id: '1', retry_count: 0 },
];

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [distributions, setDistributions] = useState<Distribution[]>(MOCK_DISTRIBUTIONS);

  async function retry(platform: Platform) {
    setDistributions(prev =>
      prev.map(d => d.platform === platform ? { ...d, status: 'queued', progress: 0, error_message: undefined } : d)
    );
    setTimeout(() => {
      setDistributions(prev =>
        prev.map(d => d.platform === platform ? { ...d, status: 'published', progress: 100 } : d)
      );
    }, 3000);
  }

  const statusStyle = (status: string) => {
    const m: Record<string, string> = {
      published: 'text-[var(--success)] bg-[rgba(52,211,153,0.1)]',
      failed: 'text-[var(--danger)] bg-[rgba(248,113,113,0.1)]',
      queued: 'text-[var(--warning)] bg-[rgba(251,191,36,0.1)]',
      processing: 'text-[var(--accent2)] bg-[rgba(59,130,246,0.1)]',
    };
    return m[status] ?? 'text-[var(--text3)] bg-[var(--bg3)]';
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <a href="/dashboard/posts" className="flex items-center gap-2 text-sm w-fit transition-all"
          style={{ color: 'var(--text3)' }}>
          <ArrowLeft size={14} /> Back to Posts
        </a>

        <div className="rounded-xl border p-5 flex flex-col gap-3" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display font-bold text-lg">Post #{params.id}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>Distribution tracking & analytics</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded" style={{ color: 'var(--success)', background: 'rgba(52,211,153,0.1)' }}>
              2 / 4 published
            </span>
          </div>

          <div className="rounded-lg p-3 text-sm" style={{ background: 'var(--bg2)' }}>
            🚀 Just shipped our new real-time analytics dashboard. Built with Next.js 14, Supabase, and a sprinkle of ✨...
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-display font-semibold text-sm">Distribution Status</h2>
          {distributions.map(d => (
            <div key={d.platform} className="rounded-xl border p-4 flex flex-col gap-3"
              style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${PLATFORM_COLORS[d.platform]}22`, color: PLATFORM_COLORS[d.platform] }}>
                    {d.platform === 'youtube' ? 'YT' : d.platform === 'tiktok' ? 'TT' : d.platform === 'linkedin' ? 'LI' : 'FB'}
                  </div>
                  <span className="text-sm font-medium capitalize">{d.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${statusStyle(d.status)}`}>
                    {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                  </span>
                  {d.status === 'failed' && (
                    <button onClick={() => retry(d.platform)}
                      className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-all"
                      style={{ color: 'var(--warning)', borderColor: 'rgba(251,191,36,0.3)' }}>
                      <RefreshCw size={10} /> Retry
                    </button>
                  )}
                  {d.status === 'published' && (d as any).externalUrl && (
                    <a href={(d as any).externalUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-all"
                      style={{ color: 'var(--accent)', borderColor: 'rgba(110,231,183,0.3)' }}>
                      View <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${d.progress}%`, background: PLATFORM_COLORS[d.platform] }} />
              </div>

              {(d as any).error_message && (
                <p className="text-[11px] font-mono" style={{ color: 'var(--danger)' }}>
                  ⚠ {(d as any).error_message}
                </p>
              )}

              {(d as any).external_id && (
                <p className="text-[10px] font-mono" style={{ color: 'var(--text3)' }}>
                  ID: {(d as any).external_id}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
