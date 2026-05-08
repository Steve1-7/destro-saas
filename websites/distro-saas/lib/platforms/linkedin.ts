// lib/platforms/linkedin.ts
import type { PublishPayload, PublishResult } from '@/types';

/**
 * LinkedIn Share API (UGC Posts)
 * Docs: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api
 */
export async function publishToLinkedIn(
  payload: PublishPayload,
  accessToken: string,
  personUrn: string // e.g. "urn:li:person:ABC123"
): Promise<PublishResult> {
  const body: Record<string, unknown> = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: payload.caption },
        shareMediaCategory: payload.mediaUrl ? 'IMAGE' : 'NONE',
        ...(payload.mediaUrl && {
          media: [
            {
              status: 'READY',
              description: { text: payload.caption.slice(0, 200) },
              media: payload.mediaUrl,
              title: { text: payload.caption.split('\n')[0].slice(0, 100) },
            },
          ],
        }),
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`LinkedIn post failed: ${JSON.stringify(err)}`);
  }

  const postId = res.headers.get('x-restli-id') || '';

  return {
    success: true,
    externalId: postId,
    externalUrl: `https://www.linkedin.com/feed/update/${postId}`,
  };
}
