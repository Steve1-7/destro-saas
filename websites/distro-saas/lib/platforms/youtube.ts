// lib/platforms/youtube.ts
import type { PublishPayload, PublishResult } from '@/types';

/**
 * YouTube Data API v3 — Shorts upload via resumable upload
 * Docs: https://developers.google.com/youtube/v3/guides/uploading_a_video
 */
export async function publishToYouTube(
  payload: PublishPayload,
  accessToken: string
): Promise<PublishResult> {
  if (!payload.mediaUrl) {
    // Text-only post — YouTube doesn't support text-only
    throw new Error('YouTube requires a media file');
  }

  // Step 1: Initiate resumable upload session
  const initResponse = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/*',
      },
      body: JSON.stringify({
        snippet: {
          title: payload.caption.split('\n')[0].slice(0, 100),
          description: payload.caption,
          tags: payload.hashtags?.map((h) => h.replace('#', '')),
          categoryId: '28', // Science & Technology
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      }),
    }
  );

  if (!initResponse.ok) {
    const error = await initResponse.json();
    throw new Error(`YouTube init failed: ${JSON.stringify(error)}`);
  }

  const uploadUrl = initResponse.headers.get('location');
  if (!uploadUrl) throw new Error('No resumable upload URL returned');

  // Step 2: Fetch the media file from Supabase Storage
  const mediaResponse = await fetch(payload.mediaUrl);
  const mediaBuffer = await mediaResponse.arrayBuffer();

  // Step 3: Upload the media
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/*',
      'Content-Length': String(mediaBuffer.byteLength),
    },
    body: mediaBuffer,
  });

  if (!uploadResponse.ok) {
    throw new Error(`YouTube upload failed: ${uploadResponse.status}`);
  }

  const video = await uploadResponse.json();

  return {
    success: true,
    externalId: video.id,
    externalUrl: `https://www.youtube.com/shorts/${video.id}`,
  };
}
