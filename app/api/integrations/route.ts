import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { integrationToConnectedAccount } from '@/lib/integrations-map';
import type { Integration } from '@/types';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('[integrations] Auth error', authError);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false });

    if (error) {
      console.error('[integrations] Query error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const accounts = (data as Integration[]).map(integrationToConnectedAccount);
    return NextResponse.json({ integrations: data, accounts });
  } catch (err) {
    console.error('[integrations] Unexpected error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
