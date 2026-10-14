// app/api/publish/[platform]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { publishToYouTube } from '@/lib/platforms/youtube';
import { publishToTikTok } from '@/lib/platforms/tiktok';
import { publishToLinkedIn } from '@/lib/platforms/linkedin';
import { publishToFacebook } from '@/lib/platforms/facebook';
import { publishPayloadSchema } from '@/lib/validation';
import { createAdminClient } from '@/lib/supabase';
import type { Platform, PublishPayload, PublishResult } from '@/types';

const MAX_RETRIES = 3;
const BACKOFF_MS = [1000, 3000, 8000]; // Exponential backoff

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type PlatformHandler = (
  payload: PublishPayload,
  token: string,
  extra?: string
) => Promise<PublishResult>;

const platformHandlers: Record<Platform, PlatformHandler> = {
  youtube: (p, t) => publishToYouTube(p, t),
  tiktok: (p, t) => publishToTikTok(p, t),
  linkedin: (p, t, extra) => publishToLinkedIn(p, t, extra ?? ''),
  facebook: (p, t, extra) => publishToFacebook(p, t, extra ?? ''),
  instagram: async () => {
    throw new Error('Publishing to Instagram is not implemented');
  },
  twitter: async () => {
    throw new Error('Publishing to Twitter is not implemented');
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as Platform;

  if (!['youtube', 'tiktok', 'linkedin', 'facebook', 'instagram', 'twitter'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const payloadResult = publishPayloadSchema.safeParse(await req.json());

  if (!payloadResult.success) {
    return NextResponse.json(
      { error: payloadResult.error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 }
    );
  }

  const payload = payloadResult.data as PublishPayload;

  // Verify user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id')
    .eq('id', payload.postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (postError) {
    console.error(`[publish/${platform}] Failed to verify post ownership`, postError);
    return NextResponse.json({ error: 'Could not verify the post.' }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  const admin = createAdminClient();

  // Fetch integration token
  const { data: integration } = await admin
    .from('integrations')
    .select('access_token, platform_user_id, settings')
    .eq('user_id', user.id)
    .eq('platform', platform)
    .eq('is_active', true)
    .single();

  if (!integration) {
    return NextResponse.json(
      { error: `No active ${platform} integration found` },
      { status: 404 }
    );
  }

  // Update status → queued
  await admin.from('distributions').upsert(
    {
      post_id: payload.postId,
      platform,
      status: 'queued',
      queued_at: new Date().toISOString(),
      retry_count: 0,
      progress: 0,
    },
    { onConflict: 'post_id,platform' }
  );

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < MAX_RETRIES) {
    try {
      // Update status → processing
      await admin
        .from('distributions')
        .update({ status: 'processing', progress: 20 + attempt * 15 })
        .eq('post_id', payload.postId)
        .eq('platform', platform);

      const handler = platformHandlers[platform];
      const result = await handler(
        payload,
        integration.access_token,
        integration.platform_user_id ?? undefined
      );

      // Update → published
      await admin
        .from('distributions')
        .update({
          status: 'published',
          external_id: result.externalId,
          external_url: result.externalUrl,
          published_at: new Date().toISOString(),
          progress: 100,
          error_message: null,
        })
        .eq('post_id', payload.postId)
        .eq('platform', platform);

      // Update integration last_used_at
      await admin
        .from('integrations')
        .update({ last_used_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('platform', platform);

      return NextResponse.json({ success: true, result });
    } catch (err) {
      lastError = err as Error;
      attempt++;

      console.error(`[publish/${platform}] Attempt ${attempt} failed:`, err);

      if (attempt < MAX_RETRIES) {
        await sleep(BACKOFF_MS[attempt - 1]);
      }
    }
  }

  // All retries exhausted → mark failed
  await admin
    .from('distributions')
    .update({
      status: 'failed',
      error_message: lastError?.message ?? 'Unknown error',
      retry_count: attempt,
      progress: 0,
    })
    .eq('post_id', payload.postId)
    .eq('platform', platform);

  return NextResponse.json(
    { error: lastError?.message ?? 'Publish failed after retries' },
    { status: 500 }
  );
}
