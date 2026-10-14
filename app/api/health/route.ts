import { NextResponse } from 'next/server';
import { getMissingEnvVars } from '@/lib/env';

export async function GET() {
  const missing = getMissingEnvVars();
  const ready = missing.length === 0;

  return NextResponse.json(
    {
      ok: ready,
      status: ready ? 'ready' : 'not_ready',
      missing,
      timestamp: new Date().toISOString(),
      app: 'syntra',
    },
    { status: ready ? 200 : 503 }
  );
}
