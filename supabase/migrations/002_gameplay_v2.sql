-- Patoquizz gameplay v2 migration

alter table public.results
  add column if not exists base_points int not null default 0,
  add column if not exists joker_played boolean not null default false,
  add column if not exists joker_won boolean,
  add column if not exists total_time_ms bigint not null default 0;

create table if not exists public.collected_departments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_id text,
  dept_code text not null,
  dept_name text not null,
  region text not null,
  quiz_date date not null,
  collected_at timestamptz not null default now(),
  constraint collected_identity_check check (user_id is not null or guest_id is not null)
);

create unique index if not exists collected_user_dept_unique
  on public.collected_departments (user_id, dept_code)
  where user_id is not null;

create unique index if not exists collected_guest_dept_unique
  on public.collected_departments (guest_id, dept_code)
  where guest_id is not null;

create index if not exists collected_user_id_idx on public.collected_departments (user_id);
create index if not exists collected_guest_id_idx on public.collected_departments (guest_id);

alter table public.collected_departments enable row level security;

create policy "Collected departments are readable by everyone"
  on public.collected_departments for select
  using (true);

create policy "Users can insert their own collected departments"
  on public.collected_departments for insert
  with check (
    auth.uid() = user_id
    or (auth.uid() is null and user_id is null and guest_id is not null)
  );

create or replace view public.leaderboard_all_time as
select
  coalesce(p.username, 'Joueur anonyme') as username,
  coalesce(p.country, null) as country,
  r.user_id,
  r.guest_id,
  sum(r.points) as total_points,
  sum(r.score) as total_score,
  count(*) as games_played,
  sum(r.total_time_ms) as total_time_ms
from public.results r
left join public.profiles p on p.id = r.user_id
group by coalesce(p.username, 'Joueur anonyme'), coalesce(p.country, null), r.user_id, r.guest_id;

create or replace view public.leaderboard_daily as
select
  coalesce(p.username, 'Joueur anonyme') as username,
  coalesce(p.country, null) as country,
  r.user_id,
  r.guest_id,
  r.quiz_date,
  r.points,
  r.score,
  r.total_time_ms
from public.results r
left join public.profiles p on p.id = r.user_id;
