'use client';

import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal, Verified } from 'lucide-react';

interface TwitterPreviewProps {
  caption: string;
  hashtags: string[];
  username?: string;
  displayName?: string;
  avatar?: string;
  isVerified?: boolean;
  replies?: string;
  retweets?: string;
  likes?: string;
  views?: string;
  isEnabled?: boolean;
  mediaType?: 'text' | 'image' | 'video';
}

export function TwitterPreview({
  caption,
  hashtags,
  username = 'username',
  displayName = 'Display Name',
  avatar,
  isVerified = false,
  replies = '42',
  retweets = '128',
  likes = '1.5K',
  views = '12.5K',
  isEnabled = true,
  mediaType = 'text',
}: TwitterPreviewProps) {
  const displayCaption = caption.length > 280 ? caption.slice(0, 280) + '...' : caption;
  const charCount = caption.length;

  return (
    <div
      className={`transition-all ${isEnabled ? '' : 'opacity-50 grayscale'}`}
      style={{
        background: '#000',
        border: '1px solid var(--border)',
        maxWidth: 500,
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Tweet Container */}
      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-lg font-bold">{username[0]?.toUpperCase()}</span>
              )}
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white font-bold text-[15px] hover:underline cursor-pointer">
                  {displayName}
                </span>
                {isVerified && (
                  <Verified size={16} className="text-blue-500 fill-blue-500" />
                )}
              </div>
              <span className="text-gray-500 text-[15px]">@{username}</span>
            </div>
          </div>

          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Tweet Content */}
        <div className="ml-[60px]">
          <p className="text-white text-[17px] leading-normal whitespace-pre-wrap">
            {displayCaption}
          </p>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 mt-1">
              {hashtags.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  className="text-blue-500 text-[17px] hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Media placeholder */}
          {mediaType !== 'text' && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
              {mediaType === 'video' ? (
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                  <div className="relative w-16 h-16 rounded-full bg-blue-500/80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                    0:42
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900" />
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900" />
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 col-span-2" />
                </div>
              )}
            </div>
          )}

          {/* Timestamp & Source */}
          <p className="text-gray-500 text-[15px] mt-3">
            2:30 PM · May 8, 2026 · <span className="text-blue-500 hover:underline cursor-pointer">100K Views</span>
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 py-3 mt-2 border-y border-gray-800">
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
              <span className="text-white font-semibold">{replies}</span>
              <span className="text-[13px]">Replies</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
              <span className="text-white font-semibold">{retweets}</span>
              <span className="text-[13px]">Retweets</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors">
              <span className="text-white font-semibold">{likes}</span>
              <span className="text-[13px]">Likes</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button className="group flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors p-2 -m-2">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle size={18} />
              </div>
            </button>
            <button className="group flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors p-2 -m-2">
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 size={18} />
              </div>
            </button>
            <button className="group flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors p-2 -m-2">
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart size={18} />
              </div>
            </button>
            <button className="group flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors p-2 -m-2">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <Share size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
