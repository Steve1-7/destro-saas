-- supabase/migrations/002_drop_and_recreate_posts.sql
-- Run: supabase db push

-- WARNING: This will remove the existing `posts` table and all its data.
-- Run only if you're sure you want to destroy existing rows.

DROP TABLE IF EXISTS posts CASCADE;

create table posts (
  id            uuid          default gen_random_uuid() primary key,
  user_id       uuid          references auth.users not null,

  -- Content
  title         text,
  caption       text          not null,
  media_url     text,
  media_type    text          check (media_type in ('video', 'image', 'text')),
  thumbnail_url text,

  -- Platform-adapted captions (AI-generated)
  caption_youtube   text,
  caption_tiktok    text,
  caption_linkedin  text,
  caption_facebook  text,

  -- Status lifecycle
  status        text          default 'draft'
                check (status in (
                  'draft', 'queued', 'scheduled',
                  'publishing', 'published', 'failed'
                )),
  scheduled_at  timestamptz,

  -- Metadata
  hashtags      text[]        default '{}',
  content_type  text,

  created_at    timestamptz   default now(),
  updated_at    timestamptz   default now()
);

-- Row Level Security
alter table posts enable row level security;

create policy "Users can manage their own posts"
  on posts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index idx_posts_user_status on posts (user_id, status);
create index idx_posts_scheduled on posts (scheduled_at)
  where status = 'scheduled';
create index idx_posts_created on posts (created_at desc);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();
