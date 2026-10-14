import { describe, expect, it } from 'vitest';
import {
  captionRequestSchema,
  getSafePath,
  notificationBodySchema,
  publishPayloadSchema,
  uploadRequestSchema,
} from './validation';

describe('getSafePath', () => {
  it('keeps internal paths', () => {
    expect(getSafePath('/dashboard/posts')).toBe('/dashboard/posts');
  });

  it('falls back for external or missing paths', () => {
    expect(getSafePath('//example.com')).toBe('/dashboard');
    expect(getSafePath('/\\example.com')).toBe('/dashboard');
    expect(getSafePath('https://example.com')).toBe('/dashboard');
    expect(getSafePath(null)).toBe('/dashboard');
  });
});

describe('request schemas', () => {
  it('validates caption length', () => {
    expect(captionRequestSchema.safeParse({ caption: 'short' }).success).toBe(false);
    expect(captionRequestSchema.safeParse({ caption: 'A valid caption for testing' }).success).toBe(true);
  });

  it('rejects notifications without a title', () => {
    expect(notificationBodySchema.safeParse({ title: '' }).success).toBe(false);
    expect(notificationBodySchema.safeParse({ title: 'Published' }).success).toBe(true);
  });

  it('requires a UUID post ID for publishing', () => {
    expect(publishPayloadSchema.safeParse({ postId: 'bad', caption: 'Post' }).success).toBe(false);
    expect(
      publishPayloadSchema.safeParse({
        postId: 'ebfeea2e-e18d-4a59-a48e-489913a21ab6',
        caption: 'Post caption',
      }).success
    ).toBe(true);
  });

  it('allows only supported upload media types', () => {
    expect(uploadRequestSchema.safeParse({ fileName: 'clip.mp4', fileType: 'video/mp4' }).success).toBe(true);
    expect(uploadRequestSchema.safeParse({ fileName: 'script.exe', fileType: 'application/octet-stream' }).success).toBe(false);
  });
});
