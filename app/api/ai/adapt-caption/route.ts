// app/api/ai/adapt-caption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { generateCaptionVariants } from '@/lib/ai';
import { captionRequestSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = captionRequestSchema.safeParse(await req.json());
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 }
    );
  }

  try {
    const variants = await generateCaptionVariants(parsedBody.data.caption);
    return NextResponse.json({ variants });
  } catch (err) {
    console.error('[ai/adapt-caption]', err);
    return NextResponse.json(
      { error: 'Caption generation failed' },
      { status: 500 }
    );
  }
}
