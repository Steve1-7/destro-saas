// app/api/team/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's team
  const { data: teamMember, error: teamError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .single();

  if (teamError || !teamMember) {
    return NextResponse.json({ members: [], invites: [] });
  }

  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamMember.team_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: invites, error: invitesError } = await supabase
    .from('team_invites')
    .select('*')
    .eq('team_id', teamMember.team_id);

  if (invitesError) {
    return NextResponse.json({ error: invitesError.message }, { status: 500 });
  }

  return NextResponse.json({ members, invites });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, role } = await request.json();

  // Get user's team
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .single();

  if (!teamMember) {
    return NextResponse.json({ error: 'No team found' }, { status: 400 });
  }

  // Create invite
  const { data, error } = await supabase
    .from('team_invites')
    .insert({
      team_id: teamMember.team_id,
      email,
      role,
      invited_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invite: data });
}

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { memberId, role } = await request.json();

  const { data, error } = await supabase
    .from('team_members')
    .update({ role })
    .eq('id', memberId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ member: data });
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { memberId } = await request.json();

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
