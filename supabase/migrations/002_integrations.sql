-- supabase/migrations/002_integrations.sql

create table integrations (
  id                  uuid          default gen_random_uuid() primary key,
  user_id             uuid          references auth.users not null,
  platform            text          not null
                      check (platform in (
                        'youtube', 'tiktok', 'linkedin', 'facebook'
                      )),

  -- OAuth tokens
  -- Note: Encrypt with pgcrypto in production:
  -- pgp_sym_encrypt(token, current_setting('app.encryption_key'))
  access_token        text          not null,
  refresh_token       text,
  token_expires_at    timestamptz,
  scope               text,

  -- Platform identity
  platform_user_id    text,
  platform_username   text,
  platform_avatar     text,

  -- Platform-specific settings (e.g. page_id for Facebook, channel_id for YouTube)
  settings            jsonb         default '{}',

  is_active           boolean       default true,
  connected_at        timestamptz   default now(),
  last_used_at        timestamptz,

  -- One integration per platform per user
  unique (user_id, platform)
);

-- RLS
alter table integrations enable row level security;

create policy "Users can manage their own integrations"
  on integrations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index
create index idx_integrations_user on integrations (user_id);
create index idx_integrations_expiry on integrations (token_expires_at)
  where is_active = true;
