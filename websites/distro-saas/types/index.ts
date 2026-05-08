// types/index.ts

export type Platform = 'youtube' | 'tiktok' | 'linkedin' | 'facebook';

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
  status: PostStatus;
  scheduled_at?: string;
  hashtags: string[];
  content_type?: string;
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
  settings: Record<string, unknown>;
  is_active: boolean;
  connected_at: string;
  last_used_at?: string;
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
}

export interface CaptionVariants {
  linkedin: string;
  tiktok: string;
  youtube: string;
  facebook: string;
}

export interface PublishPayload {
  postId: string;
  caption: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  hashtags?: string[];
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  externalUrl?: string;
  error?: string;
}
