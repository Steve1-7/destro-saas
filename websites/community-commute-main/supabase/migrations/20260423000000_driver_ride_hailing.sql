-- =========================================
-- DRIVER & RIDE-HAILING SCHEMA
-- =========================================

-- New enums
create type public.verification_status as enum ('pending', 'approved', 'rejected');
create type public.ride_request_status as enum ('pending', 'accepted', 'rejected', 'expired');
create type public.vehicle_type as enum ('sedan', 'suv', 'van', 'hatchback', 'motorcycle', 'other');
create type public.call_status as enum ('ringing', 'connected', 'ended', 'missed');

-- =========================================
-- DRIVER PROFILES
-- =========================================
create table public.driver_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  license_number text not null,
  license_expiry date not null,
  license_document_url text,
  background_check_status public.verification_status not null default 'pending',
  verification_status public.verification_status not null default 'pending',
  is_online boolean not null default false,
  current_lat double precision,
  current_lng double precision,
  location_updated_at timestamptz,
  rating numeric(3,2) not null default 5.00,
  total_trips integer not null default 0,
  total_earnings numeric(12,2) not null default 0,
  bank_account text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.driver_profiles enable row level security;

create policy "Driver can view own profile"
  on public.driver_profiles for select to authenticated
  using (id = auth.uid());
create policy "Authenticated users can view approved drivers"
  on public.driver_profiles for select to authenticated
  using (verification_status = 'approved');
create policy "Driver can insert own profile"
  on public.driver_profiles for insert to authenticated with check (id = auth.uid());
create policy "Driver can update own profile"
  on public.driver_profiles for update to authenticated using (id = auth.uid());

create trigger driver_profiles_updated_at before update on public.driver_profiles
  for each row execute function public.update_updated_at_column();

-- =========================================
-- VEHICLES
-- =========================================
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  vehicle_type public.vehicle_type not null,
  make text not null,
  model text not null,
  year integer not null,
  color text not null,
  license_plate text not null,
  registration_document_url text,
  insurance_document_url text,
  verification_status public.verification_status not null default 'pending',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (driver_id, is_active) -- only one active vehicle at a time
);
alter table public.vehicles enable row level security;

create policy "Driver can view own vehicles"
  on public.vehicles for select to authenticated
  using (driver_id = auth.uid());
create policy "Authenticated users can view verified active vehicles"
  on public.vehicles for select to authenticated
  using (verification_status = 'approved' and is_active = true);
create policy "Driver can insert own vehicles"
  on public.vehicles for insert to authenticated with check (driver_id = auth.uid());
create policy "Driver can update own vehicles"
  on public.vehicles for update to authenticated using (driver_id = auth.uid());

create trigger vehicles_updated_at before update on public.vehicles
  for each row execute function public.update_updated_at_column();

-- =========================================
-- RIDE REQUESTS (on-demand hailing)
-- =========================================
create table public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid references auth.users(id) on delete set null,
  circle_id uuid references public.circles(id) on delete set null,
  pickup_lat double precision not null,
  pickup_lng double precision not null,
  pickup_address text,
  dropoff_lat double precision not null,
  dropoff_lng double precision not null,
  dropoff_address text,
  status public.ride_request_status not null default 'pending',
  fare numeric(10,2),
  estimated_duration_min integer,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  expired_at timestamptz
);
alter table public.ride_requests enable row level security;

create policy "Rider can view own requests"
  on public.ride_requests for select to authenticated
  using (rider_id = auth.uid());
create policy "Online drivers can view pending requests"
  on public.ride_requests for select to authenticated
  using (status = 'pending' and exists (
    select 1 from public.driver_profiles where id = auth.uid() and is_online = true and verification_status = 'approved'
  ));
create policy "Assigned driver can view request"
  on public.ride_requests for select to authenticated
  using (driver_id = auth.uid());
create policy "Rider can create requests"
  on public.ride_requests for insert to authenticated with check (rider_id = auth.uid());
create policy "Driver can accept/reject (update) pending requests"
  on public.ride_requests for update to authenticated
  using (status = 'pending' or driver_id = auth.uid());

-- =========================================
-- RIDE LOCATION UPDATES (real-time tracking)
-- =========================================
create table public.ride_locations (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  driver_id uuid not null references auth.users(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  heading double precision,
  speed_kmh double precision,
  recorded_at timestamptz not null default now()
);
alter table public.ride_locations enable row level security;

create policy "Driver can insert own location"
  on public.ride_locations for insert to authenticated with check (driver_id = auth.uid());
create policy "Ride participants can view locations"
  on public.ride_locations for select to authenticated
  using (exists (
    select 1 from public.rides r
    where r.id = ride_id and (r.driver_id = auth.uid() or exists (
      select 1 from public.ride_requests rr where rr.rider_id = auth.uid()
    ))
  ));

-- Enable realtime for ride_locations
alter publication supabase_realtime add table public.ride_locations;
alter publication supabase_realtime add table public.ride_requests;
alter publication supabase_realtime add table public.driver_profiles;

-- =========================================
-- CONVERSATIONS
-- =========================================
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references public.rides(id) on delete set null,
  ride_request_id uuid references public.ride_requests(id) on delete set null,
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (participant_a, participant_b)
);
alter table public.conversations enable row level security;

create policy "Participants can view their conversations"
  on public.conversations for select to authenticated
  using (participant_a = auth.uid() or participant_b = auth.uid());
create policy "Participants can create conversations"
  on public.conversations for insert to authenticated
  with check (participant_a = auth.uid() or participant_b = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table public.conversations;

-- =========================================
-- MESSAGES
-- =========================================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;

create policy "Conversation participants can view messages"
  on public.messages for select to authenticated
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  ));
create policy "Conversation participants can send messages"
  on public.messages for insert to authenticated
  with check (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  ) and sender_id = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table public.messages;

-- =========================================
-- CALLS
-- =========================================
create table public.calls (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  caller_id uuid not null references auth.users(id) on delete cascade,
  callee_id uuid not null references auth.users(id) on delete cascade,
  status public.call_status not null default 'ringing',
  webrtc_session_id text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_sec integer,
  created_at timestamptz not null default now()
);
alter table public.calls enable row level security;

create policy "Call participants can view calls"
  on public.calls for select to authenticated
  using (caller_id = auth.uid() or callee_id = auth.uid());
create policy "Participants can create calls"
  on public.calls for insert to authenticated
  with check (caller_id = auth.uid());
create policy "Participants can update calls"
  on public.calls for update to authenticated
  using (caller_id = auth.uid() or callee_id = auth.uid());

-- =========================================
-- DRIVER EARNINGS (materialized view helper)
-- =========================================
create table public.driver_earnings (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  ride_id uuid references public.rides(id) on delete set null,
  ride_request_id uuid references public.ride_requests(id) on delete set null,
  amount numeric(10,2) not null,
  platform_fee numeric(10,2) not null default 0,
  net_amount numeric(10,2) generated always as (amount - platform_fee) stored,
  period text not null, -- e.g. '2026-W17' or '2026-04-23'
  created_at timestamptz not null default now()
);
alter table public.driver_earnings enable row level security;

create policy "Driver can view own earnings"
  on public.driver_earnings for select to authenticated using (driver_id = auth.uid());
create policy "System can insert earnings"
  on public.driver_earnings for insert to authenticated with check (driver_id = auth.uid());

-- =========================================
-- INDEXES
-- =========================================
create index idx_ride_locations_ride on public.ride_locations(ride_id);
create index idx_ride_locations_recorded on public.ride_locations(recorded_at desc);
create index idx_ride_requests_rider on public.ride_requests(rider_id);
create index idx_ride_requests_status on public.ride_requests(status);
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_messages_created on public.messages(created_at desc);
create index idx_conversations_participants on public.conversations(participant_a, participant_b);
create index idx_driver_earnings_driver on public.driver_earnings(driver_id);
create index idx_driver_earnings_period on public.driver_earnings(period);
create index idx_driver_profiles_online on public.driver_profiles(is_online) where is_online = true;
