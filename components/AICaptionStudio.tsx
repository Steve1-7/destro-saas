'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Zap,
  Briefcase,
  MessageCircle,
  Flame,
  GraduationCap,
  Hash,
  Target,
  TrendingUp,
  Type,
  Loader2,
  Check,
} from 'lucide-react';
import { useCaptionStore, useUIStore } from '@/lib/store';
import type { CaptionTone, Platform } from '@/types';

const TONES: { id: CaptionTone; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'founder',
    label: 'Founder',
    icon: <Briefcase size={14} />,
    description: 'Authentic founder voice, building-in-public style',
  },
  {
    id: 'tech',
    label: 'Tech',
    icon: <Zap size={14} />,
    description: 'Technical, developer-friendly language',
  },
  {
    id: 'casual',
    label: 'Casual',
    icon: <MessageCircle size={14} />,
    description: 'Relaxed, conversational tone',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    icon: <Briefcase size={14} />,
    description: 'Professional, business-appropriate',
  },
  {
    id: 'viral',
    label: 'Viral',
    icon: <Flame size={14} />,
    description: 'Hook-heavy, attention-grabbing',
  },
  {
    id: 'educational',
    label: 'Educational',
    icon: <GraduationCap size={14} />,
    description: 'Teaching, value-driven content',
  },
];

const REWRITE_OPTIONS = [
  { id: 'makeViral', label: 'Make Viral', icon: <Flame size={14} />, description: 'Add hooks & intrigue' },
  { id: 'makeProfessional', label: 'Make Professional', icon: <Briefcase size={14} />, description: 'Polish & formalize' },
  { id: 'makeShorter', label: 'Make Shorter', icon: <Type size={14} />, description: 'Concise & punchy' },
  { id: 'addCTA', label: 'Add CTA', icon: <Target size={14} />, description: 'Strong call-to-action' },
  { id: 'generateHashtags', label: 'Generate Hashtags', icon: <Hash size={14} />, description: 'AI hashtag suggestions' },
];

interface AICaptionStudioProps {
  onGenerate?: (caption: string, platform: Platform) => void;
  onRewrite?: (type: string, caption: string) => Promise<string>;
}

export function AICaptionStudio({ onGenerate, onRewrite }: AICaptionStudioProps) {
  const {
    masterCaption,
    tone,
    variants,
    selectedPlatforms,
    analysis,
    isGenerating,
    options,
    setMasterCaption,
    setTone,
    setVariants,
    togglePlatform,
    setAnalysis,
    setIsGenerating,
    setOption,
  } = useCaptionStore();
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<'studio' | 'analysis' | 'history'>('studio');

  const charCount = masterCaption.length;
  const wordCount = masterCaption.trim().split(/\s+/).filter(Boolean).length;

  const handleRewrite = useCallback(
    async (type: string) => {
      if (!masterCaption.trim()) {
        addToast({ type: 'error', message: 'Please enter a caption first' });
        return;
      }

      if (onRewrite) {
        setIsGenerating(true);
        try {
          const result = await onRewrite(type, masterCaption);
          setMasterCaption(result);
          addToast({ type: 'success', message: `Caption ${type.replace('make', '').toLowerCase()}d!` });
        } catch {
          addToast({ type: 'error', message: 'Failed to rewrite caption' });
        } finally {
          setIsGenerating(false);
        }
      }
    },
    [masterCaption, onRewrite, setMasterCaption, setIsGenerating, addToast]
  );

  const handleAnalyze = useCallback(async () => {
    if (!masterCaption.trim()) {
      addToast({ type: 'error', message: 'Please enter a caption to analyze' });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: masterCaption }),
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      setAnalysis(data.analysis);
      setActiveTab('analysis');
      addToast({ type: 'success', message: 'Analysis complete!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to analyze caption' });
    } finally {
      setIsGenerating(false);
    }
  }, [masterCaption, setAnalysis, setIsGenerating, addToast]);

  const handleGenerateVariants = useCallback(async () => {
    if (!masterCaption.trim()) {
      addToast({ type: 'error', message: 'Please enter a caption first' });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/adapt-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: masterCaption }),
      });

      if (!response.ok) throw new Error('Failed to generate variants');

      const data = await response.json();
      setVariants(data.variants);
      addToast({ type: 'success', message: 'Platform variants generated!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to generate variants' });
    } finally {
      setIsGenerating(false);
    }
  }, [masterCaption, setVariants, setIsGenerating, addToast]);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Wand2 size={18} style={{ color: 'var(--accent)' }} />
          <span className="font-display font-semibold text-[13px]">AI Caption Studio</span>
        </div>
        <div className="flex items-center gap-1">
          {['studio', 'analysis', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className="px-3 py-1 text-[11px] font-medium rounded-md transition-all capitalize"
              style={{
                background: activeTab === tab ? 'var(--bg2)' : 'transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--text3)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'studio' && (
          <div className="space-y-4">
            {/* Tone Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                Select Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className="flex flex-col items-start gap-1 p-2.5 rounded-lg border text-left transition-all hover:border-[var(--border2)]"
                    style={{
                      background: tone === t.id ? 'rgba(110,231,183,0.08)' : 'var(--bg2)',
                      borderColor: tone === t.id ? 'var(--accent)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: tone === t.id ? 'var(--accent)' : 'var(--text3)' }}>
                        {t.icon}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: tone === t.id ? 'var(--text)' : 'var(--text2)' }}
                      >
                        {t.label}
                      </span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      {t.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rewrite Options */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                AI Rewrites
              </label>
              <div className="flex flex-wrap gap-2">
                {REWRITE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setOption(opt.id as keyof typeof options, !options[opt.id as keyof typeof options]);
                      if (!options[opt.id as keyof typeof options]) {
                        handleRewrite(opt.id);
                      }
                    }}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all disabled:opacity-50 hover:border-[var(--border2)]"
                    style={{
                      background: options[opt.id as keyof typeof options] ? 'rgba(110,231,183,0.08)' : 'var(--bg2)',
                      borderColor: options[opt.id as keyof typeof options] ? 'var(--accent)' : 'var(--border)',
                      color: options[opt.id as keyof typeof options] ? 'var(--accent)' : 'var(--text2)',
                    }}
                  >
                    {isGenerating && options[opt.id as keyof typeof options] ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      opt.icon
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats & Analysis Button */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4 text-[11px] font-mono" style={{ color: 'var(--text3)' }}>
                <span>{charCount} chars</span>
                <span>{wordCount} words</span>
                {charCount > 280 && <span className="text-yellow-400">⚠️ Twitter limit</span>}
                {charCount > 2200 && <span className="text-red-400">⚠️ LinkedIn limit</span>}
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isGenerating || !masterCaption.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                style={{ background: 'var(--bg3)', color: 'var(--text2)' }}
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
                Analyze
              </button>
            </div>

            {/* Generate Variants */}
            <button
              onClick={handleGenerateVariants}
              disabled={isGenerating || !masterCaption.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all disabled:opacity-50 gradient-border"
              style={{
                background: 'var(--bg2)',
                borderColor: 'var(--border)',
                color: isGenerating ? 'var(--text3)' : 'var(--text)',
              }}
            >
              {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} style={{ color: 'var(--accent)' }} />
              )}
              {isGenerating ? 'Generating platform variants...' : 'Generate Platform Variants'}
            </button>

            {/* Platform Variants Display */}
            {Object.keys(variants).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2"
              >
                {Object.entries(variants).map(([platform, caption]) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform as Platform)}
                    className="relative p-3 rounded-lg border text-left transition-all"
                    style={{
                      background: selectedPlatforms.has(platform as Platform)
                        ? 'rgba(110,231,183,0.05)'
                        : 'var(--bg2)',
                      borderColor: selectedPlatforms.has(platform as Platform)
                        ? 'var(--accent)'
                        : 'var(--border)',
                    }}
                  >
                    {selectedPlatforms.has(platform as Platform) && (
                      <div
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: 'var(--accent)', color: '#040d0a' }}
                      >
                        <Check size={10} />
                      </div>
                    )}
                    <div
                      className="text-[10px] font-mono mb-1 px-1.5 py-0.5 rounded inline-block capitalize"
                      style={{
                        background: `var(--${platform})20`,
                        color: `var(--${platform})`,
                      }}
                    >
                      {platform}
                    </div>
                    <p className="text-[11px] line-clamp-3" style={{ color: 'var(--text2)' }}>
                      {caption}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && analysis && (
          <div className="space-y-4">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text2)' }}>
                    Engagement Score
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.engagement_score}%` }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                    {analysis.engagement_score}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Type size={14} style={{ color: 'var(--accent2)' }} />
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text2)' }}>
                    Readability
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.readability_score}%` }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--accent2)' }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent2)' }}>
                    {analysis.readability_score}%
                  </span>
                </div>
              </div>
            </div>

            {/* Suggested Hashtags */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                Suggested Hashtags
              </label>
              <div className="flex flex-wrap gap-2">
                {analysis.suggested_hashtags.map((tag) => (
                  <button
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: 'rgba(110,231,183,0.08)',
                      borderColor: 'rgba(110,231,183,0.3)',
                      color: 'var(--accent)',
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Optimization Tips */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                Optimization Tips
              </label>
              <ul className="space-y-2">
                {analysis.optimization_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--warning)' }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-8" style={{ color: 'var(--text3)' }}>
            <p className="text-sm">Caption history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
