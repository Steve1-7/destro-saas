// types/index.ts

export type Platform = 'youtube' | 'tiktok' | 'linkedin' | 'facebook' | 'instagram' | 'twitter';

export type PostStatus =
  | 'draft'
  | 'queued'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed';

export type DistributionStatus =
  | 'queued'
  | 'processing'
  | 'published'
  | 'failed';

export type MediaType = 'video' | 'image' | 'text';

export type CaptionTone = 'founder' | 'tech' | 'casual' | 'corporate' | 'viral' | 'educational';

export type TeamRole = 'admin' | 'editor' | 'viewer';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type AutomationTrigger = 'upload_complete' | 'publish_success' | 'schedule_due' | 'engagement_threshold';

export type AutomationAction = 'crosspost' | 'generate_caption' | 'notify' | 'schedule';

export interface Post {
  id: string;
  user_id: string;
  title?: string;
  caption: string;
  media_url?: string;
  media_type?: MediaType;
  thumbnail_url?: string;
  caption_youtube?: string;
  caption_tiktok?: string;
  caption_linkedin?: string;
  caption_facebook?: string;
  caption_instagram?: string;
  caption_twitter?: string;
  status: PostStatus;
  scheduled_at?: string;
  hashtags: string[];
  content_type?: string;
  engagement_score?: number;
  readability_score?: number;
  folder_id?: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  platform: Platform;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  scope?: string;
  platform_user_id?: string;
  platform_username?: string;
  platform_avatar?: string;
  platform_display_name?: string;
  settings: Record<string, unknown>;
  is_active: boolean;
  is_primary: boolean;
  connected_at: string;
  last_synced_at?: string;
  last_used_at?: string;
}

export interface ConnectedAccount extends Integration {
  connection_status: 'connected' | 'expiring' | 'disconnected' | 'error';
  expires_in_days?: number;
}

export interface Distribution {
  id: string;
  post_id: string;
  platform: Platform;
  status: DistributionStatus;
  external_id?: string;
  external_url?: string;
  progress: number;
  error_message?: string;
  retry_count: number;
  queued_at?: string;
  published_at?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface CaptionVariants {
  linkedin: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  instagram?: string;
  twitter?: string;
}

export interface AICaptionOptions {
  tone: CaptionTone;
  makeViral?: boolean;
  makeProfessional?: boolean;
  makeShorter?: boolean;
  addCTA?: boolean;
  generateHashtags?: boolean;
  platform?: Platform;
}

export interface CaptionAnalysis {
  engagement_score: number;
  readability_score: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  word_count: number;
  char_count: number;
  suggested_hashtags: string[];
  optimization_tips: string[];
}

export interface RepurposedContent {
  original_type: 'video' | 'blog' | 'podcast';
  original_url?: string;
  tiktok_captions: string[];
  linkedin_posts: string[];
  youtube_shorts_captions: string[];
  facebook_posts: string[];
  twitter_posts: string[];
  hook_ideas: string[];
  title_suggestions: string[];
  cta_suggestions: string[];
}

export interface MediaItem {
  id: string;
  user_id: string;
  filename: string;
  url: string;
  thumbnail_url?: string;
  type: MediaType;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  folder_id?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  used_in_posts: string[];
}

export interface MediaFolder {
  id: string;
  user_id: string;
  name: string;
  color: string;
  item_count: number;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  post_id: string;
  title: string;
  platform: Platform;
  scheduled_at: string;
  status: PostStatus;
  color: string;
}

export interface AnalyticsMetrics {
  period: '7d' | '30d' | '90d' | '1y';
  total_views: number;
  total_reach: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  avg_watch_time: number;
  avg_ctr: number;
  audience_growth: number;
  top_posts: Distribution[];
  platform_breakdown: Record<Platform, {
    views: number;
    engagement: number;
    posts: number;
  }>;
  daily_stats: {
    date: string;
    views: number;
    engagement: number;
  }[];
}

export interface AutomationWorkflow {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  trigger: {
    type: AutomationTrigger;
    platform?: Platform;
    conditions?: Record<string, unknown>;
  };
  actions: {
    type: AutomationAction;
    platform?: Platform;
    config?: Record<string, unknown>;
  }[];
  created_at: string;
  last_run_at?: string;
  run_count: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  platform?: Platform;
  post_id?: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  email: string;
  name: string;
  avatar?: string;
  role: TeamRole;
  joined_at: string;
  last_active_at?: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  members: TeamMember[];
  settings: {
    require_approval: boolean;
    allowed_platforms: Platform[];
  };
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  resolved: boolean;
  created_at: string;
}

export interface VideoSubtitle {
  id: string;
  media_id: string;
  language: string;
  content: string;
  style_preset: 'minimal' | 'bold' | 'cinematic' | 'modern';
  animation: 'none' | 'fade' | 'slide' | 'typewriter';
  is_generated: boolean;
  created_at: string;
}

export interface TrendingItem {
  id: string;
  platform: Platform;
  type: 'hashtag' | 'sound' | 'topic';
  name: string;
  volume: number;
  growth: number;
  category?: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string;
  website?: string;
  contact_email?: string;
  contact_name?: string;
  deal_value?: number;
  status: 'prospect' | 'negotiating' | 'active' | 'completed' | 'cancelled';
  notes: string;
  campaigns: Campaign[];
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  sponsor_id: string;
  name: string;
  description?: string;
  deliverables: string[];
  start_date?: string;
  end_date?: string;
  value?: number;
  status: 'planning' | 'active' | 'completed';
  posts: string[];
  notes: string;
  created_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  children?: NavItem[];
}

export interface CommandPaletteItem {
  id: string;
  title: string;
  shortcut?: string;
  icon?: string;
  action: () => void;
  category: string;
}

export interface PublishPayload {
  postId: string;
  caption: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  hashtags?: string[];
  platform_variants?: Partial<CaptionVariants>;
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  externalUrl?: string;
  error?: string;
}
