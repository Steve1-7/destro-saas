'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Video,
  FileText,
  Headphones,
  Copy,
  Check,
  Wand2,
  RefreshCw,
  ArrowRight,
  Lightbulb,
  Type,
  Target,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import type { RepurposedContent } from '@/types';

const CONTENT_TYPES = [
  { id: 'video', label: 'Video', icon: <Video size={18} />, description: 'Repurpose a video into multiple formats' },
  { id: 'blog', label: 'Blog Post', icon: <FileText size={18} />, description: 'Turn a blog post into social content' },
  { id: 'podcast', label: 'Podcast Clip', icon: <Headphones size={18} />, description: 'Extract clips from podcast episodes' },
];

interface AIRepurposingEngineProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AIRepurposingEngine({ isOpen = true, onClose }: AIRepurposingEngineProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RepurposedContent | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('captions');
  const { addToast } = useUIStore();

  const handleRepurpose = useCallback(async () => {
    if (!selectedType || !sourceUrl.trim()) {
      addToast({ type: 'error', message: 'Please select a content type and provide a URL or upload' });
      return;
    }

    setIsProcessing(true);
    
    // Call the AI repurposing API
    try {
      const response = await fetch('/api/ai/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl,
          contentType: selectedType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to repurpose content');
      }

      const data = await response.json();
      setResult(data);
      addToast({ type: 'success', message: 'Content repurposed successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to repurpose content. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedType, sourceUrl, addToast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({ type: 'success', message: 'Copied to clipboard!' });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Wand2 size={18} style={{ color: 'var(--accent3)' }} />
          <span className="font-display font-semibold text-[13px]">AI Repurposing Engine</span>
        </div>
        {result && (
          <button
            onClick={() => {
              setResult(null);
              setSelectedType(null);
              setSourceUrl('');
            }}
            className="text-[11px] px-2 py-1 rounded-lg border transition-all hover:border-[var(--border2)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
          >
            Start Over
          </button>
        )}
      </div>

      <div className="p-4">
        {!result ? (
          <div className="space-y-4">
            {/* Content Type Selection */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider mb-3 block" style={{ color: 'var(--text3)' }}>
                Select Content Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all"
                    style={{
                      background: selectedType === type.id ? 'rgba(167,139,250,0.08)' : 'var(--bg2)',
                      borderColor: selectedType === type.id ? 'var(--accent3)' : 'var(--border)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: selectedType === type.id ? 'var(--accent3)20' : 'var(--bg3)',
                        color: selectedType === type.id ? 'var(--accent3)' : 'var(--text3)',
                      }}
                    >
                      {type.icon}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: selectedType === type.id ? 'var(--text)' : 'var(--text2)' }}
                      >
                        {type.label}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Source Input */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                Content Source
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste URL or describe your content..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border bg-transparent text-sm outline-none focus:border-[var(--accent3)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <button
                  onClick={handleRepurpose}
                  disabled={!selectedType || !sourceUrl.trim() || isProcessing}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                  style={{
                    background: 'var(--accent3)',
                    color: 'var(--bg)',
                  }}
                >
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {isProcessing ? 'Processing...' : 'Repurpose'}
                </button>
              </div>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border text-center"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <RefreshCw size={20} className="animate-spin" style={{ color: 'var(--accent3)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    AI is analyzing your content...
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px]" style={{ color: 'var(--text3)' }}>
                  <span className="animate-pulse">Extracting key points</span>
                  <span>•</span>
                  <span>Generating hooks</span>
                  <span>•</span>
                  <span>Optimizing for platforms</span>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Generated Content Sections */}
            {[
              { id: 'captions', label: 'Platform Captions', icon: <Type size={14} />, items: [
                ...result.tiktok_captions.map(c => ({ platform: 'TikTok', text: c })),
                ...result.linkedin_posts.map(c => ({ platform: 'LinkedIn', text: c })),
                ...result.youtube_shorts_captions.map(c => ({ platform: 'YouTube Shorts', text: c })),
                ...result.twitter_posts.map(c => ({ platform: 'Twitter', text: c })),
              ]},
              { id: 'hooks', label: 'Hook Ideas', icon: <Lightbulb size={14} />, items: result.hook_ideas.map(h => ({ text: h })) },
              { id: 'titles', label: 'Title Suggestions', icon: <Type size={14} />, items: result.title_suggestions.map(t => ({ text: t })) },
              { id: 'ctas', label: 'CTA Suggestions', icon: <Target size={14} />, items: result.cta_suggestions.map(c => ({ text: c })) },
            ].map((section) => (
              <div
                key={section.id}
                className="rounded-xl border overflow-hidden"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent3)' }}>{section.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {section.label}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--bg3)', color: 'var(--text3)' }}
                    >
                      {section.items.length}
                    </span>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronUp size={16} style={{ color: 'var(--text3)' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'var(--text3)' }} />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t overflow-hidden"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                        {section.items.map((item, index) => (
                          <div
                            key={index}
                            className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            {'platform' in item && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0"
                                style={{
                                  background: 'var(--bg3)',
                                  color: 'var(--text3)',
                                }}
                              >
                                {String(item.platform)}
                              </span>
                            )}
                            <p className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                              {item.text}
                            </p>
                            <button
                              onClick={() => copyToClipboard(item.text)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
                              style={{ color: 'var(--text3)' }}
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Copy All Button */}
            <button
              onClick={() => {
                const allContent = `
TikTok Captions:
${result.tiktok_captions.join('\n\n')}

LinkedIn Posts:
${result.linkedin_posts.join('\n\n')}

YouTube Shorts:
${result.youtube_shorts_captions.join('\n\n')}

Twitter Posts:
${result.twitter_posts.join('\n\n')}

Hook Ideas:
${result.hook_ideas.join('\n')}

Titles:
${result.title_suggestions.join('\n')}

CTAs:
${result.cta_suggestions.join('\n')}
                `.trim();
                copyToClipboard(allContent);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all hover:border-[var(--accent3)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
            >
              <Copy size={16} />
              Copy All Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
