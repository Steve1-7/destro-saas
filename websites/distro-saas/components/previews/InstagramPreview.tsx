'use client';

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface InstagramPreviewProps {
  caption: string;
  hashtags: string[];
  username?: string;
  avatar?: string;
  likes?: string;
  comments?: string;
  isEnabled?: boolean;
  mediaType?: 'video' | 'image' | 'carousel';
}

export function InstagramPreview({
  caption,
  hashtags,
  username = 'yourusername',
  avatar,
  likes = '1,234',
  comments = '56',
  isEnabled = true,
  mediaType = 'image',
}: InstagramPreviewProps) {
  const displayCaption = caption.length > 100 ? caption.slice(0, 100) + '...' : caption;

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all ${
        isEnabled ? '' : 'opacity-50 grayscale'
      }`}
      style={{
        background: '#000',
        border: '1px solid var(--border)',
        maxWidth: 375,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-black">
        <div className="flex items-center gap-2">
          {/* Avatar with gradient border */}
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border-2 border-black">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{username[0]?.toUpperCase()}</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-white text-sm font-semibold">{username}</span>
            <span className="text-gray-400 text-xs ml-1">• Original audio</span>
          </div>
        </div>
        <button className="p-1">
          <MoreHorizontal size={20} className="text-white" />
        </button>
      </div>

      {/* Media */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
        {mediaType === 'video' && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50">
            <span className="text-white text-xs font-semibold">Reels</span>
          </div>
        )}
        {mediaType === 'carousel' && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="text-white text-xs font-semibold">1/5</span>
          </div>
        )}

        {/* Media placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
              {mediaType === 'video' || mediaType === 'carousel' ? (
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white/30" />
              ) : (
                <span className="text-white/20 text-3xl">📷</span>
              )}
            </div>
            <span className="text-white/30 text-xs">Media Preview</span>
          </div>
        </div>

        {/* Carousel dots */}
        {mediaType === 'carousel' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === 1 ? 'bg-blue-500' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-2 bg-black">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button>
              <Heart size={24} className="text-white hover:text-gray-300 transition-colors" />
            </button>
            <button>
              <MessageCircle size={24} className="text-white hover:text-gray-300 transition-colors" />
            </button>
            <button>
              <Send size={24} className="text-white hover:text-gray-300 transition-colors" />
            </button>
          </div>
          <button>
            <Bookmark size={24} className="text-white hover:text-gray-300 transition-colors" />
          </button>
        </div>

        {/* Likes */}
        <p className="text-white text-sm font-semibold mb-1">{likes} likes</p>

        {/* Caption */}
        <div className="text-sm">
          <span className="text-white font-semibold">{username}</span>{' '}
          <span className="text-gray-300">{displayCaption}</span>
          {caption.length > 100 && (
            <span className="text-gray-500 cursor-pointer hover:underline"> more</span>
          )}
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-x-2 mt-1">
          {hashtags.slice(0, 5).map((tag, i) => (
            <span key={i} className="text-blue-400 text-sm hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* Comments link */}
        <p className="text-gray-500 text-sm mt-2 hover:text-gray-400 cursor-pointer">
          View all {comments} comments
        </p>

        {/* Add comment */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
            You
          </div>
          <span className="text-gray-500 text-sm">Add a comment...</span>
        </div>

        {/* Timestamp */}
        <p className="text-gray-500 text-[10px] uppercase mt-2">2 hours ago</p>
      </div>
    </div>
  );
}
