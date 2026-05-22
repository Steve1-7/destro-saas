// app/api/upload/presigned/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileName, fileType } = await req.json();

  const ext = fileName.split('.').pop();
  const path = `${session.user.id}/${Date.now()}.${ext}`;

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
