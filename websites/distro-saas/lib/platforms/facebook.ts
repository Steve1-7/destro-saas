// lib/platforms/facebook.ts
import type { PublishPayload, PublishResult } from '@/types';

/**
 * Facebook Graph API — Page posts
 * Docs: https://developers.facebook.com/docs/pages/getting-started/create-page-content
 */
export async function publishToFacebook(
  payload: PublishPayload,
  accessToken: string,
  pageId: string
): Promise<PublishResult> {
  let endpoint: string;
  let body: Record<string, string>;

  if (payload.mediaUrl && payload.mediaType === 'video') {
    // Video post
    endpoint = `https://graph-video.facebook.com/v19.0/${pageId}/videos`;
    body = {
      description: payload.caption,
      file_url: payload.mediaUrl,
      access_token: accessToken,
    };
  } else if (payload.mediaUrl && payload.mediaType === 'image') {
    // Photo post
    endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
    body = {
      caption: payload.caption,
      url: payload.mediaUrl,
      access_token: accessToken,
    };
  } else {
    // Text-only post
    endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    body = {
      message: payload.caption,
      access_token: accessToken,
    };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Facebook post failed: ${err?.error?.message}`);
  }

  const data = await res.json();
  const postId: string = data.id || data.post_id || '';

  return {
    success: true,
    externalId: postId,
    externalUrl: `https://www.facebook.com/${postId}`,
  };
}
