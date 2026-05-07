
-- =========================================
-- ENUMS
-- =========================================
create type public.user_role as enum ('driver', 'passenger', 'both');
create type public.member_status as enum ('pending', 'active', 'banned', 'left');
create type public.payment_cadence as enum ('monthly', 'weekly', 'on_demand');
create type public.pricing_model as enum ('flat_seat', 'fuel_split', 'per_km');
create type public.contract_status as enum ('proposed', 'active', 'pending_settlement', 'settled', 'defaulted');
create type public.ride_status as enum ('scheduled', 'in_progress', 'completed', 'skipped', 'disputed');
create type public.ban_reason as enum ('safety_breach', 'contract_default', 'identity_fraud', 'other');

-- =========================================
-- updated_at trigger fn
-- =========================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================
-- PROFILES
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  neighborhood text,
  role public.user_role not null default 'passenger',
  id_verified boolean not null default false,
  device_fingerprint text,
  phone_masked text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles viewable by authenticated users"
  on public.profiles for select to authenticated using (true);
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- CIRCLES
-- =========================================
create table public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  neighborhood text not null,
  route_summary text,
  origin_label text,
  destination_label text,
  driver_id uuid not null references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.circles enable row level security;

create trigger circles_updated_at before update on public.circles
  for each row execute function public.update_updated_at_column();

-- =========================================
-- CIRCLE MEMBERS
-- =========================================
create table public.circle_members (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null default 'passenger',
  status public.member_status not null default 'active',
  joined_at timestamptz not null default now(),
  unique (circle_id, user_id)
);
alter table public.circle_members enable row level security;

-- Security-definer membership check to avoid recursive RLS
create or replace function public.is_circle_member(_circle_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.circle_members
    where circle_id = _circle_id and user_id = _user_id and status = 'active'
  );
$$;

create or replace function public.is_circle_driver(_circle_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.circles where id = _circle_id and driver_id = _user_id
  );
$$;

-- Circles policies
create policy "Members or driver can view circle"
  on public.circles for select to authenticated
  using (driver_id = auth.uid() or public.is_circle_member(id, auth.uid()));
create policy "Authenticated users can create circles"
  on public.circles for insert to authenticated with check (driver_id = auth.uid());
create policy "Driver can update their circle"
  on public.circles for update to authenticated using (driver_id = auth.uid());
create policy "Driver can delete their circle"
  on public.circles for delete to authenticated using (driver_id = auth.uid());

-- circle_members policies
create policy "Members can view their circle members"
  on public.circle_members for select to authenticated
  using (user_id = auth.uid() or public.is_circle_member(circle_id, auth.uid()) or public.is_circle_driver(circle_id, auth.uid()));
create policy "Users can request to join (insert self)"
  on public.circle_members for insert to authenticated with check (user_id = auth.uid());
create policy "Driver can update memberships in their circle"
  on public.circle_members for update to authenticated using (public.is_circle_driver(circle_id, auth.uid()));
create policy "Users can leave (delete self)"
  on public.circle_members for delete to authenticated using (user_id = auth.uid() or public.is_circle_driver(circle_id, auth.uid()));

-- =========================================
-- CONTRACTS
-- =========================================
create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  passenger_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid not null references auth.users(id) on delete cascade,
  cadence public.payment_cadence not null,
  model public.pricing_model not null,
  amount numeric(10,2) not null,
  lien_deposit numeric(10,2) not null default 0,
  status public.contract_status not null default 'proposed',
  signed_pdf_url text,
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.contracts enable row level security;

create trigger contracts_updated_at before update on public.contracts
  for each row execute function public.update_updated_at_column();

create policy "Parties can view contract"
  on public.contracts for select to authenticated
  using (passenger_id = auth.uid() or driver_id = auth.uid());
create policy "Driver or passenger can create contract"
  on public.contracts for insert to authenticated
  with check (driver_id = auth.uid() or passenger_id = auth.uid());
create policy "Parties can update contract"
  on public.contracts for update to authenticated
  using (passenger_id = auth.uid() or driver_id = auth.uid());

-- =========================================
-- RIDES
-- =========================================
create table public.rides (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  driver_id uuid not null references auth.users(id) on delete cascade,
  scheduled_for timestamptz not null,
  started_at timestamptz,
  ended_at timestamptz,
  start_lat double precision,
  start_lng double precision,
  end_lat double precision,
  end_lng double precision,
  distance_km numeric(8,2),
  status public.ride_status not null default 'scheduled',
  geofence_verified boolean not null default false,
  review_locked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.rides enable row level security;

create policy "Members can view circle rides"
  on public.rides for select to authenticated
  using (public.is_circle_member(circle_id, auth.uid()) or public.is_circle_driver(circle_id, auth.uid()));
create policy "Driver can create rides"
  on public.rides for insert to authenticated
  with check (driver_id = auth.uid() and public.is_circle_driver(circle_id, auth.uid()));
create policy "Driver can update unlocked rides"
  on public.rides for update to authenticated
  using (driver_id = auth.uid() and (review_locked_at is null or review_locked_at > now()));

-- =========================================
-- LEDGER
-- =========================================
create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  ride_id uuid references public.rides(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  description text,
  is_settlement boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.ledger_entries enable row level security;

create policy "User or driver can view ledger entries"
  on public.ledger_entries for select to authenticated
  using (user_id = auth.uid() or public.is_circle_driver(circle_id, auth.uid()));
create policy "Driver can insert ledger entries"
  on public.ledger_entries for insert to authenticated
  with check (public.is_circle_driver(circle_id, auth.uid()));

-- =========================================
-- PANIC ALERTS
-- =========================================
create table public.panic_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  circle_id uuid references public.circles(id) on delete set null,
  ride_id uuid references public.rides(id) on delete set null,
  current_lat double precision,
  current_lng double precision,
  audio_recording_url text,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
alter table public.panic_alerts enable row level security;

create policy "Members of circle can view active alerts"
  on public.panic_alerts for select to authenticated
  using (user_id = auth.uid() or (circle_id is not null and (public.is_circle_member(circle_id, auth.uid()) or public.is_circle_driver(circle_id, auth.uid()))));
create policy "Authenticated users can trigger panic"
  on public.panic_alerts for insert to authenticated with check (user_id = auth.uid());
create policy "User can resolve their own alert"
  on public.panic_alerts for update to authenticated using (user_id = auth.uid());

-- =========================================
-- BANS
-- =========================================
create table public.bans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_fingerprint text,
  reason public.ban_reason not null,
  details text,
  banned_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.bans enable row level security;

create policy "Authenticated users can view bans"
  on public.bans for select to authenticated using (true);

-- Indexes
create index idx_circle_members_user on public.circle_members(user_id);
create index idx_circle_members_circle on public.circle_members(circle_id);
create index idx_rides_circle on public.rides(circle_id);
create index idx_ledger_user on public.ledger_entries(user_id);
create index idx_ledger_circle on public.ledger_entries(circle_id);
create index idx_panic_circle on public.panic_alerts(circle_id);
