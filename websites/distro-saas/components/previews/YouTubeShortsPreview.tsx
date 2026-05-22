'use client';

import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical } from 'lucide-react';

interface YouTubeShortsPreviewProps {
  caption: string;
  hashtags: string[];
  username?: string;
  avatar?: string;
  views?: string;
  likes?: string;
  isEnabled?: boolean;
}

export function YouTubeShortsPreview({
  caption,
  hashtags,
  username = 'Your Channel',
  avatar,
  views = '12.4K',
  likes = '1.2K',
  isEnabled = true,
}: YouTubeShortsPreviewProps) {
  const title = caption.split('\n')[0].slice(0, 60);
  const description = caption.split('\n').slice(1).join(' ').slice(0, 100);

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all ${
        isEnabled ? '' : 'opacity-50 grayscale'
      }`}
      style={{
        background: '#0f0f0f',
        border: '1px solid var(--border)',
        maxWidth: 320,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0f0f0f]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-red-600 rounded-md flex items-center justify-center">
              <div className="w-0 h-0 border-t-3 border-b-3 border-l-5 border-transparent border-l-white" />
            </div>
            <span className="text-white text-sm font-bold">Shorts</span>
          </div>
        </div>
        <button className="p-1 hover:bg-white/10 rounded">
          <MoreVertical size={18} className="text-white" />
        </button>
      </div>

      {/* Video Player */}
      <div className="relative aspect-[9/16] bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
              <div className="w-0 h-0 border-t-10 border-b-10 border-l-16 border-transparent border-l-white/60" />
            </div>
          </div>
        </div>

        {/* Right sidebar actions */}
        <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3">
          {/* Like */}
          <div className="flex flex-col items-center gap-0.5">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ThumbsUp size={20} className="text-white" />
            </button>
            <span className="text-white text-xs font-medium">{likes}</span>
          </div>

          {/* Dislike */}
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ThumbsDown size={20} className="text-white" />
          </button>

          {/* Comment */}
          <div className="flex flex-col items-center gap-0.5">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <MessageSquare size={20} className="text-white" />
            </button>
            <span className="text-white text-xs font-medium">234</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-0.5">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Share2 size={20} className="text-white" />
            </button>
            <span className="text-white text-xs font-medium">Share</span>
          </div>

          {/* More */}
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <MoreVertical size={20} className="text-white" />
          </button>

          {/* Channel avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-white flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">{username[0]?.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          {/* Title */}
          <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2">{title}</h3>

          {/* Channel info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-xs font-bold">
              {username[0]?.toUpperCase()}
            </div>
            <span className="text-white/90 text-xs">@{username.toLowerCase().replace(/\s/g, '')}</span>
            <button className="px-2 py-0.5 rounded-full bg-white text-black text-xs font-semibold">
              Subscribe
            </button>
          </div>

          {/* Views */}
          <p className="text-white/70 text-xs">{views} views</p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mt-1">
            {hashtags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-blue-400 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Comments preview */}
      <div className="px-3 py-2 bg-[#0f0f0f] border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs">Comments 234</span>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border border-[#0f0f0f]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
