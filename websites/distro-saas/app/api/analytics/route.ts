// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { AnalyticsMetrics, Platform } from '@/types';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') as '7d' | '30d' | '90d' | '1y' || '30d';

  // Calculate date range
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  try {
    // Fetch distributions (published posts) within date range
    const { data: distributions, error } = await supabase
      .from('distributions')
      .select(`
        *,
        posts!inner(user_id, created_at)
      `)
      .eq('posts.user_id', user.id)
      .gte('published_at', startDate.toISOString())
      .lte('published_at', now.toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Analytics fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate metrics
    const totalViews = distributions?.reduce((sum, d) => sum + (d.views || 0), 0) || 0;
    const totalLikes = distributions?.reduce((sum, d) => sum + (d.likes || 0), 0) || 0;
    const totalComments = distributions?.reduce((sum, d) => sum + (d.comments || 0), 0) || 0;
    const totalShares = distributions?.reduce((sum, d) => sum + (d.shares || 0), 0) || 0;

    // Platform breakdown
    const platformBreakdown: Record<string, { views: number; engagement: number; posts: number }> = {};
    distributions?.forEach((d) => {
      if (!platformBreakdown[d.platform]) {
        platformBreakdown[d.platform] = { views: 0, engagement: 0, posts: 0 };
      }
      platformBreakdown[d.platform].views += d.views || 0;
      platformBreakdown[d.platform].engagement += (d.likes || 0) + (d.comments || 0) + (d.shares || 0);
      platformBreakdown[d.platform].posts += 1;
    });

    // Daily stats (for charts)
    const dailyStatsMap = new Map();
    distributions?.forEach((d) => {
      const date = new Date(d.published_at).toLocaleDateString('en-US', { weekday: 'short' });
      const existing = dailyStatsMap.get(date) || { date, views: 0, engagement: 0 };
      existing.views += d.views || 0;
      existing.engagement += (d.likes || 0) + (d.comments || 0);
      dailyStatsMap.set(date, existing);
    });

    const dailyStats = Array.from(dailyStatsMap.values());

    // Top posts
    const topPosts = distributions
      ?.sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5) || [];

    const metrics: Partial<AnalyticsMetrics> = {
      period,
      total_views: totalViews,
      total_reach: totalViews * 0.7, // Estimate
      total_likes: totalLikes,
      total_comments: totalComments,
      total_shares: totalShares,
      avg_watch_time: 0,
      avg_ctr: 0,
      audience_growth: 0,
      top_posts: topPosts,
      platform_breakdown: platformBreakdown as Record<Platform, { views: number; engagement: number; posts: number }>,
      daily_stats: dailyStats,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
