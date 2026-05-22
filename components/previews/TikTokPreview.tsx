'use client';

import { Heart, MessageCircle, Share2, Bookmark, Music } from 'lucide-react';
import type { Platform } from '@/types';

interface TikTokPreviewProps {
  caption: string;
  hashtags: string[];
  username?: string;
  avatar?: string;
  musicTitle?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  isEnabled?: boolean;
}

export function TikTokPreview({
  caption,
  hashtags,
  username = 'yourusername',
  avatar,
  musicTitle = 'Original Sound - Creator',
  likes = '12.4K',
  comments = '842',
  shares = '156',
  isEnabled = true,
}: TikTokPreviewProps) {
  const displayCaption = caption.length > 100 ? caption.slice(0, 100) + '...' : caption;

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all ${
        isEnabled ? '' : 'opacity-50 grayscale'
      }`}
      style={{
        background: '#000',
        border: '1px solid var(--border)',
        maxWidth: 280,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-black">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500" />
          <span className="text-white text-xs font-bold">TikTok</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Video Area */}
      <div className="relative aspect-[9/16] bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
              <Music size={24} className="text-white/40" />
            </div>
            <span className="text-white/30 text-xs">Video Preview</span>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-white flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white/60 text-xs">{username[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs">+</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3">
            <button className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <span className="text-white text-[10px] font-semibold">{likes}</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <span className="text-white text-[10px] font-semibold">{comments}</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Bookmark size={20} className="text-white" />
              </div>
              <span className="text-white text-[10px] font-semibold">Save</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="text-white text-[10px] font-semibold">{shares}</span>
            </button>
          </div>

          {/* Music disc */}
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-3 h-3 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          {/* Username */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-sm font-semibold">@{username}</span>
            <div className="px-2 py-0.5 rounded-full bg-white/20">
              <span className="text-white text-[10px]">Follow</span>
            </div>
          </div>

          {/* Caption */}
          <p className="text-white/90 text-sm mb-2 leading-relaxed">{displayCaption}</p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {hashtags.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-white font-semibold text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* Music */}
          <div className="flex items-center gap-2">
            <Music size={12} className="text-white" />
            <div className="overflow-hidden w-40">
              <div className="text-white text-xs whitespace-nowrap animate-marquee">
                {musicTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
