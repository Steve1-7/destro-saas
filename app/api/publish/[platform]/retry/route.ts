// app/api/publish/[platform]/retry/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Retry a failed distribution job.
 * Resets status and delegates to the main publish handler.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const body = await req.json();
  const { platform } = params;

  // Re-invoke the publish handler via internal fetch
  const publishUrl = new URL(
    `/api/publish/${platform}`,
    req.nextUrl.origin
  );

  const response = await fetch(publishUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
