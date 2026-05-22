import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Platform } from '@/types';

const PLATFORMS: Platform[] = [
  'youtube',
  'tiktok',
  'linkedin',
  'facebook',
  'instagram',
  'twitter',
];

export async function DELETE(
  _req: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform as Platform;

  if (!PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('integrations')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('platform', platform);

    if (error) {
      console.error('[integrations] Disconnect error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, platform });
  } catch (err) {
    console.error('[integrations] Disconnect unexpected error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
