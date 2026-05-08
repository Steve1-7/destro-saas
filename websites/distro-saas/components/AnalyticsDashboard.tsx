'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Clock,
  MousePointer,
  ChevronDown,
  Download,
  Loader2,
} from 'lucide-react';
import { useAnalyticsStore, useUIStore } from '@/lib/store';
import type { Platform, AnalyticsMetrics } from '@/types';

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000',
  tiktok: '#ff0050',
  linkedin: '#0077b5',
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
};

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeMetric, setActiveMetric] = useState('views');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const { selectedPlatforms, togglePlatform } = useAnalyticsStore();
  const { addToast } = useUIStore();

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/analytics?period=${period}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to load analytics data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [period, addToast]);

  // Default empty state data
  const dailyStats = metrics?.daily_stats || [];
  const platformData = Object.entries(metrics?.platform_breakdown || {}).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: data.posts,
    color: PLATFORM_COLORS[name as Platform] || '#8884d8',
  }));
  const topPosts = metrics?.top_posts || [];
  
  const METRICS = [
    { id: 'views', label: 'Total Views', value: metrics?.total_views?.toLocaleString() || '-', change: '+24%', icon: Eye, color: 'var(--accent)' },
    { id: 'reach', label: 'Reach', value: metrics?.total_reach?.toLocaleString() || '-', change: '+18%', icon: Users, color: 'var(--accent2)' },
    { id: 'likes', label: 'Likes', value: metrics?.total_likes?.toLocaleString() || '-', change: '+32%', icon: Heart, color: 'var(--danger)' },
    { id: 'comments', label: 'Comments', value: metrics?.total_comments?.toLocaleString() || '-', change: '+15%', icon: MessageCircle, color: 'var(--warning)' },
    { id: 'shares', label: 'Shares', value: metrics?.total_shares?.toLocaleString() || '-', change: '+28%', icon: Share2, color: 'var(--success)' },
    { id: 'watchTime', label: 'Avg Watch Time', value: '1:42', change: '+8%', icon: Clock, color: 'var(--accent3)' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart2Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="font-display font-semibold text-lg">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg2)' }}>
            {(['7d', '30d', '90d', '1y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1 text-xs font-medium rounded-md transition-all"
                style={{
                  background: period === p ? 'var(--bg3)' : 'transparent',
                  color: period === p ? 'var(--text)' : 'var(--text3)',
                }}
              >
                {p === '7d' ? '7 days' : p === '30d' ? '30 days' : p === '90d' ? '90 days' : '1 year'}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:border-[var(--border2)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        {METRICS.map((metric, index) => (
          <motion.button
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveMetric(metric.id)}
            className="p-3 rounded-xl border text-left transition-all hover:border-[var(--border2)]"
            style={{
              background: activeMetric === metric.id ? 'rgba(110,231,183,0.05)' : 'var(--bg1)',
              borderColor: activeMetric === metric.id ? 'var(--accent)' : 'var(--border)',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${metric.color}20` }}
              >
                <metric.icon size={16} style={{ color: metric.color }} />
              </div>
              <span
                className="text-[11px] font-mono flex items-center gap-0.5"
                style={{ color: metric.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}
              >
                <TrendingUp size={10} />
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: 'var(--text)' }}>
              {metric.value}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
              {metric.label}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Main Chart */}
        <div className="rounded-xl border p-4" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm" style={{ color: 'var(--text)' }}>
              Engagement Trends
            </h3>
            <div className="flex items-center gap-2">
              {/* Platform filters */}
              {Object.entries(PLATFORM_COLORS).slice(0, 4).map(([platform, color]) => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform as Platform)}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    background: color,
                    opacity: selectedPlatforms.has(platform as Platform) ? 1 : 0.3,
                  }}
                  title={platform}
                />
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text3)" fontSize={10} />
                <YAxis stroke="var(--text3)" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'var(--text)' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--accent)"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="var(--accent2)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="rounded-xl border p-4" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
          <h3 className="font-medium text-sm mb-4" style={{ color: 'var(--text)' }}>
            Platform Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'var(--text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {platformData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-[11px]" style={{ color: 'var(--text2)' }}>
                  {item.name} {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-medium text-sm" style={{ color: 'var(--text)' }}>
            Top Performing Posts
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {topPosts.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--text3)' }}>
              <p className="text-sm">No data available</p>
            </div>
          ) : (
            topPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: `${PLATFORM_COLORS[post.platform as Platform]}20`,
                    color: PLATFORM_COLORS[post.platform as Platform],
                  }}
                >
                  {post.platform.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                    Post #{post.post_id.slice(-4)}
                  </p>
                  <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text3)' }}>
                    <span>{post.views?.toLocaleString() || 0} views</span>
                    <span>{post.likes?.toLocaleString() || 0} likes</span>
                  </div>
                </div>
                <div
                  className="text-[11px] font-mono flex items-center gap-0.5"
                  style={{ color: 'var(--success)' }}
                >
                  <TrendingUp size={10} />
                  +{post.shares || 0} shares
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BarChart2Icon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  );
}
