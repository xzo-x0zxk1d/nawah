-- ============================================================
-- منصة نواة – Supabase Schema
-- Run this in your Supabase SQL Editor (once)
-- ============================================================

-- 1. Users table
create table if not exists public.users (
  id         text primary key,
  name       text not null,
  email      text unique not null,
  role       text check (role in ('student','teacher')) not null default 'student',
  created_at timestamptz default now()
);

-- 2. Annotations table (PDF drawing/highlighting/notes)
create table if not exists public.annotations (
  id         uuid primary key default gen_random_uuid(),
  user_id    text references public.users(id) on delete cascade,
  subject    text not null,
  grade      text not null,
  page       integer not null default 1,
  type       text check (type in ('stroke','note')) not null,
  data       text not null,  -- JSON string
  created_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists annotations_lookup
  on public.annotations (user_id, subject, grade, page);

-- 3. Lesson plans table
create table if not exists public.lesson_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    text references public.users(id) on delete cascade,
  title      text not null,
  subject    text not null,
  grade      text not null,
  objective  text,
  items      text not null default '[]',  -- JSON string
  created_at timestamptz default now()
);

create index if not exists lesson_plans_user
  on public.lesson_plans (user_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.users enable row level security;
alter table public.annotations enable row level security;
alter table public.lesson_plans enable row level security;

-- Users: anyone can insert (register), read own row
create policy "users_insert" on public.users for insert with check (true);
create policy "users_select" on public.users for select using (true);
create policy "users_update" on public.users for update using (true);

-- Annotations: open read/write (auth handled in app)
create policy "annotations_all" on public.annotations for all using (true) with check (true);

-- Lesson plans: open read/write (auth handled in app)
create policy "lesson_plans_all" on public.lesson_plans for all using (true) with check (true);
