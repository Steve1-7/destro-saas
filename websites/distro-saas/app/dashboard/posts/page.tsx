'use client';

// app/dashboard/posts/page.tsx
import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import type { Post } from '@/types';

const STATUS_STYLES: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  draft:      { color: 'var(--text3)',   bg: 'var(--bg3)',                      icon: <FileText size={11} /> },
  queued:     { color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)',             icon: <Clock size={11} /> },
  publishing: { color: 'var(--accent2)', bg: 'rgba(59,130,246,0.1)',             icon: <RefreshCw size={11} className="animate-spin" /> },
  published:  { color: 'var(--success)', bg: 'rgba(52,211,153,0.1)',             icon: <CheckCircle2 size={11} /> },
  failed:     { color: 'var(--danger)',  bg: 'rgba(248,113,113,0.1)',            icon: <XCircle size={11} /> },
};

const DEMO_POSTS: Post[] = [
  {
    id: '1', user_id: 'u1', caption: '🚀 Just shipped our new real-time analytics dashboard...', status: 'published',
    media_type: 'video', hashtags: ['#BuildInPublic', '#NextJS'], created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2', user_id: 'u1', caption: 'Deep dive into Supabase Row Level Security — everything you need to know...', status: 'queued',
    media_type: 'image', hashtags: ['#Supabase', '#Security'], created_at: new Date(Date.now() - 3600000 * 3).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3', user_id: 'u1', caption: 'Why we chose Tailwind CSS over CSS Modules for our SaaS...', status: 'draft',
    media_type: 'text', hashtags: ['#CSS', '#WebDev'], created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '4', user_id: 'u1', caption: 'A thread on building in public — 6 months of lessons learned 🧵', status: 'failed',
    media_type: 'image', hashtags: ['#IndieHacker'], created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(),
  },
];

export default function PostsPage() {
  const [posts] = useState<Post[]>(DEMO_POSTS);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl">Posts</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>All your distributed content</p>
          </div>
          <a href="/dashboard" className="px-4 py-2 rounded-lg text-sm border transition-all"
            style={{ background: 'var(--accent)', color: '#040d0a', borderColor: 'transparent', fontWeight: 500 }}>
            + New Post
          </a>
        </div>

        <div className="flex flex-col gap-3">
          {posts.map(post => {
            const s = STATUS_STYLES[post.status] ?? STATUS_STYLES.draft;
            return (
              <div key={post.id} className="rounded-xl border p-4 flex items-center justify-between gap-4"
                style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                    style={{ background: 'var(--bg3)' }}>
                    {post.media_type === 'video' ? '🎬' : post.media_type === 'image' ? '🖼' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{post.caption}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>
                        {timeAgo(post.created_at)}
                      </span>
                      <div className="flex gap-1">
                        {post.hashtags.slice(0, 2).map(h => (
                          <span key={h} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(110,231,183,0.08)', color: 'var(--accent)' }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded"
                    style={{ color: s.color, background: s.bg }}>
                    {s.icon} {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                  <a href={`/dashboard/posts/${post.id}`}
                    className="p-1.5 rounded-lg border transition-all"
                    style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
