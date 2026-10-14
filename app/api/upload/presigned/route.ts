// app/api/upload/presigned/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createAdminClient } from '@/lib/supabase';
import { uploadRequestSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = uploadRequestSchema.safeParse(await req.json());
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 }
    );
  }

  const { fileName, fileType } = parsedBody.data;
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  const supportedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'video/mp4': ['mp4'],
    'video/webm': ['webm'],
    'video/quicktime': ['mov'],
  };

  if (!supportedExtensions[fileType].includes(extension)) {
    return NextResponse.json({ error: 'File extension does not match the media type.' }, { status: 400 });
  }

  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const admin = createAdminClient();

  const { data, error } = await admin.storage
    .from('media')
    .createSignedUploadUrl(path, { upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = admin.storage.from('media').getPublicUrl(path).data.publicUrl;

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl,
  });
}
