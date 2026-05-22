-- supabase/migrations/003_distributions.sql

create table distributions (
  id              uuid          default gen_random_uuid() primary key,
  post_id         uuid          references posts(id) on delete cascade,
  platform        text          not null
                  check (platform in (
                    'youtube', 'tiktok', 'linkedin', 'facebook'
                  )),
  status          text          default 'queued'
                  check (status in (
                    'queued', 'processing', 'published', 'failed'
                  )),

  -- External platform reference
  external_id     text,
  external_url    text,

  -- Progress & error tracking
  progress        int           default 0 check (progress between 0 and 100),
  error_message   text,
  retry_count     int           default 0,

  -- Timestamps
  queued_at       timestamptz,
  published_at    timestamptz,

  -- One distribution record per post per platform
  unique (post_id, platform)
);

-- RLS (join to posts to verify ownership)
alter table distributions enable row level security;

create policy "Users can view their own distributions"
  on distributions for select
  using (
    exists (
      select 1 from posts
      where posts.id = distributions.post_id
      and posts.user_id = auth.uid()
    )
  );

create policy "Service role can manage distributions"
  on distributions for all
  using (auth.role() = 'service_role');

-- Enable Realtime for SSE progress streaming
alter publication supabase_realtime add table distributions;

-- Indexes
create index idx_distributions_post on distributions (post_id);
create index idx_distributions_status on distributions (status);
