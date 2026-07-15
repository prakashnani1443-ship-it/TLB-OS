-- Clients module — first real data table for TLB-OS.
-- Run this in the Supabase SQL Editor (or via `supabase db push` once
-- the project is linked to the CLI).

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  -- Deviates slightly from the literal spec: defaults to the calling
  -- user's id so inserts don't need to pass it explicitly, and
  -- references auth.users with ON DELETE CASCADE so a deleted account
  -- doesn't leave orphaned client rows behind.
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  -- Deviates from the literal "timestamp" spec: timestamptz is the
  -- Postgres/Supabase-recommended type — plain timestamp silently
  -- drops timezone info, which is almost never what you want.
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- Every query here filters by user_id (via RLS or explicitly), so this
-- index is load-bearing once the table has more than a handful of rows.
create index if not exists clients_user_id_idx on public.clients (user_id);

alter table public.clients enable row level security;

create policy "Users can view their own clients"
  on public.clients
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own clients"
  on public.clients
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own clients"
  on public.clients
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own clients"
  on public.clients
  for delete
  to authenticated
  using (auth.uid() = user_id);
