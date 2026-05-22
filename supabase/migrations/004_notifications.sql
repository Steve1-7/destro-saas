-- Notifications table (fixes /api/notifications 500 when missing)

create table if not exists notifications (
  id            uuid          default gen_random_uuid() primary key,
  user_id       uuid          references auth.users not null,
  type          text          not null default 'info'
                check (type in ('info', 'success', 'warning', 'error')),
  title         text          not null,
  message       text,
  is_read       boolean       default false,
  link          text,
  created_at    timestamptz   default now()
);

alter table notifications enable row level security;

create policy "Users can manage their own notifications"
  on notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_notifications_user_created
  on notifications (user_id, created_at desc);
