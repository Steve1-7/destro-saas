import { z } from 'zod';

export const safePathSchema = z
  .string()
  .refine(
    (value) => value.startsWith('/') && !value.startsWith('//') && !value.includes('\\'),
    {
    message: 'Path must be an internal absolute path.',
    }
  );

export const notificationBodySchema = z.object({
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  link: z.string().url().optional().or(z.literal('')),
  is_read: z.boolean().optional(),
});

export const notificationReadSchema = z.object({
  id: z.string().uuid(),
  is_read: z.boolean(),
});

export const captionRequestSchema = z.object({
  caption: z.string().trim().min(10).max(5000),
});

export const uploadRequestSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  fileType: z.enum([
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ]),
});

export const publishPayloadSchema = z.object({
  postId: z.string().uuid(),
  caption: z.string().trim().min(1).max(5000),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(['video', 'image', 'text']).optional(),
  hashtags: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
  platform_variants: z.record(z.string().max(5000)).optional(),
});

export function getSafePath(value: string | null): string {
  const parsed = safePathSchema.safeParse(value ?? '');
  return parsed.success ? parsed.data : '/dashboard';
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}
