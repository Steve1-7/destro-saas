-- Keep platform OAuth tokens out of the browser-accessible Supabase API.
-- Integration access must go through authenticated server routes using service_role.

alter table public.integrations enable row level security;

drop policy if exists "Users can manage their own integrations" on public.integrations;
drop policy if exists "Service role can manage integrations" on public.integrations;

create policy "Service role can manage integrations"
  on public.integrations
  for all
  to service_role
  using (true)
  with check (true);

revoke all privileges on table public.integrations from anon, authenticated;
grant all privileges on table public.integrations to service_role;
