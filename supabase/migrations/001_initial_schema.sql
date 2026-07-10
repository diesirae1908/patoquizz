-- Patoquizz schema

create extension if not exists "pgcrypto";

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  accepted_answers text[] not null,
  display_answer text not null,
  difficulty int not null check (difficulty between 1 and 6),
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_quizzes (
  id uuid primary key default gen_random_uuid(),
  quiz_date date not null unique,
  quiz_number int not null unique,
  question_ids uuid[] not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  country text,
  guest_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_id text,
  quiz_date date not null,
  quiz_number int not null,
  answers jsonb not null default '[]'::jsonb,
  score int not null default 0,
  points int not null default 0,
  completed_at timestamptz not null default now(),
  constraint results_identity_check check (user_id is not null or guest_id is not null)
);

create unique index if not exists results_user_date_unique
  on public.results (user_id, quiz_date)
  where user_id is not null;

create unique index if not exists results_guest_date_unique
  on public.results (guest_id, quiz_date)
  where guest_id is not null;

create index if not exists results_quiz_date_idx on public.results (quiz_date);
create index if not exists results_user_id_idx on public.results (user_id);
create index if not exists results_guest_id_idx on public.results (guest_id);

alter table public.questions enable row level security;
alter table public.daily_quizzes enable row level security;
alter table public.profiles enable row level security;
alter table public.results enable row level security;

create policy "Questions are readable by everyone"
  on public.questions for select
  using (true);

create policy "Daily quizzes are readable by everyone"
  on public.daily_quizzes for select
  using (true);

create policy "Profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Results are readable by everyone"
  on public.results for select
  using (true);

create policy "Users can insert their own results"
  on public.results for insert
  with check (
    auth.uid() = user_id
    or (auth.uid() is null and user_id is null and guest_id is not null)
  );

create policy "Users can update their own results"
  on public.results for update
  using (
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
  count(*) as games_played
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
  r.score
from public.results r
left join public.profiles p on p.id = r.user_id;
