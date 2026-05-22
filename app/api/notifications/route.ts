// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const MISSING_TABLE_CODES = new Set(['42P01', 'PGRST205']);

function isMissingTableError(error: { code?: string; message?: string }): boolean {
  if (error.code && MISSING_TABLE_CODES.has(error.code)) return true;
  return (error.message ?? '').toLowerCase().includes('notifications');
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('[notifications] Auth error', authError);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[notifications] Table missing — returning empty list. Run migration 004_notifications.sql');
        return NextResponse.json({ notifications: [] });
      }
      console.error('[notifications] Query error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notifications: data ?? [] });
  } catch (err) {
    console.error('[notifications] Unexpected GET error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        ...body,
      })
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('[notifications] Table missing on insert');
        return NextResponse.json({ notification: null }, { status: 200 });
      }
      console.error('[notifications] Insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification: data });
  } catch (err) {
    console.error('[notifications] Unexpected POST error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, is_read } = await request.json();

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ notification: null });
      }
      console.error('[notifications] Patch error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification: data });
  } catch (err) {
    console.error('[notifications] Unexpected PATCH error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
