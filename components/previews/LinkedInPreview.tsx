'use client';

import { ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, Globe } from 'lucide-react';

interface LinkedInPreviewProps {
  caption: string;
  hashtags: string[];
  username?: string;
  avatar?: string;
  headline?: string;
  likes?: string;
  comments?: string;
  reposts?: string;
  isEnabled?: boolean;
  mediaType?: 'video' | 'image' | 'text';
}

export function LinkedInPreview({
  caption,
  hashtags,
  username = 'Your Name',
  avatar,
  headline = 'Founder & CEO at Company',
  likes = '234',
  comments = '18',
  reposts = '12',
  isEnabled = true,
  mediaType = 'text',
}: LinkedInPreviewProps) {
  const displayCaption = caption.length > 200 ? caption.slice(0, 200) + '...' : caption;

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all ${
        isEnabled ? '' : 'opacity-50 grayscale'
      }`}
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        maxWidth: 500,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 bg-white">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              username[0]?.toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[14px] text-gray-900">{username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-blue-600 text-[13px] font-semibold hover:underline cursor-pointer">
                Follow
              </span>
            </div>
            <p className="text-gray-500 text-xs">{headline}</p>
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
              <span>2h</span>
              <span>·</span>
              <Globe size={12} />
            </div>
          </div>
        </div>

        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pb-2">
        <p className="text-[14px] text-gray-900 leading-relaxed whitespace-pre-wrap">
          {displayCaption}
          {caption.length > 200 && (
            <span className="text-gray-500 cursor-pointer hover:underline"> ...see more</span>
          )}
        </p>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-x-1 mt-2">
            {hashtags.slice(0, 5).map((tag, i) => (
              <span key={i} className="text-blue-600 text-[14px] hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media placeholder */}
      {mediaType !== 'text' && (
        <div className="mx-3 rounded-lg overflow-hidden bg-gray-100">
          {mediaType === 'video' ? (
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Preview</span>
            </div>
          )}
        </div>
      )}

      {/* Engagement stats */}
      <div className="flex items-center justify-between px-3 py-2 text-gray-500 text-xs border-b border-gray-100">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <ThumbsUp size={8} className="text-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-[8px]">🎉</span>
            </div>
          </div>
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer">{comments} comments</span>
          <span className="hover:underline cursor-pointer">{reposts} reposts</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-around px-2 py-1">
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
          <ThumbsUp size={18} className="text-gray-500" />
          <span className="text-gray-500 text-sm font-semibold">Like</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
          <MessageSquare size={18} className="text-gray-500" />
          <span className="text-gray-500 text-sm font-semibold">Comment</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
          <Repeat2 size={18} className="text-gray-500" />
          <span className="text-gray-500 text-sm font-semibold">Repost</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
          <Send size={18} className="text-gray-500" />
          <span className="text-gray-500 text-sm font-semibold">Send</span>
        </button>
      </div>
    </div>
  );
}
