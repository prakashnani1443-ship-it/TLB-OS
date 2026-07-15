-- Projects module. Grants are included from the start this time — the
-- clients module hit "permission denied for table clients" because RLS
-- policies alone don't grant anything, they only restrict what a grant
-- already allows. Not repeating that discovery loop here.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- ON DELETE SET NULL, not CASCADE: deleting a client shouldn't
  -- silently delete their project history too. client_id is nullable
  -- so a project can exist unassigned.
  client_id uuid references public.clients (id) on delete set null,
  name text not null,
  project_type text,
  status text not null default 'active',
  start_date date,
  due_date date,
  budget numeric,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_client_id_idx on public.projects (client_id);

alter table public.projects enable row level security;

create policy "Users can view their own projects"
  on public.projects
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.projects to authenticated;
