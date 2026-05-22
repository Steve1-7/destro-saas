// lib/platforms/tiktok.ts
import type { PublishPayload, PublishResult } from '@/types';

/**
 * TikTok Content Posting API
 * Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
 */
export async function publishToTikTok(
  payload: PublishPayload,
  accessToken: string
): Promise<PublishResult> {
  // Step 1: Initialize upload
  const initRes = await fetch(
    'https://open.tiktokapis.com/v2/post/publish/video/init/',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: {
          title: payload.caption.slice(0, 150),
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: payload.mediaUrl,
        },
      }),
    }
  );

  if (!initRes.ok) {
    const err = await initRes.json();
    throw new Error(`TikTok init failed: ${err?.error?.message}`);
  }

  const { data } = await initRes.json();

  return {
    success: true,
    externalId: data.publish_id,
    externalUrl: `https://www.tiktok.com/@user/video/${data.publish_id}`,
  };
}
