// app/api/ai/adapt-caption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { generateCaptionVariants } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { caption } = await req.json();

  if (!caption || typeof caption !== 'string' || caption.trim().length < 10) {
    return NextResponse.json(
      { error: 'Caption must be at least 10 characters' },
      { status: 400 }
    );
  }

  try {
    const variants = await generateCaptionVariants(caption);
    return NextResponse.json({ variants });
  } catch (err) {
    console.error('[ai/adapt-caption]', err);
    return NextResponse.json(
      { error: 'Caption generation failed' },
      { status: 500 }
    );
  }
}
