// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Post, Integration, Distribution } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (service role — never expose to client)
export function createAdminClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Post helpers ──────────────────────────────────────────────
export async function createPost(data: Partial<Post>) {
  const { data: post, error } = await supabase
    .from('posts')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return post as Post;
}

export async function updatePost(id: string, data: Partial<Post>) {
  const { data: post, error } = await supabase
    .from('posts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return post as Post;
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Post[];
}

// ─── Distribution helpers ──────────────────────────────────────
export async function upsertDistribution(data: Partial<Distribution>) {
  const { data: dist, error } = await supabase
    .from('distributions')
    .upsert(data, { onConflict: 'post_id,platform' })
    .select()
    .single();
  if (error) throw error;
  return dist as Distribution;
}

export async function getDistributions(postId: string) {
  const { data, error } = await supabase
    .from('distributions')
    .select('*')
    .eq('post_id', postId);
  if (error) throw error;
  return data as Distribution[];
}

// ─── Integration helpers ───────────────────────────────────────
export async function getIntegrations() {
  const { data, error } = await supabase
    .from('integrations')
    .select('*');
  if (error) throw error;
  return data as Integration[];
}
