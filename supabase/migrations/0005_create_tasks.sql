-- Tasks module. Grants included from the start (same lesson as
-- projects/clients: RLS policies restrict what a grant already
-- allows, they don't grant anything themselves).

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Both relationships are optional and independent — a task can have
  -- a client, a project, both, or neither. ON DELETE SET NULL so
  -- deleting a client/project doesn't cascade-delete task history.
  client_id uuid references public.clients (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'medium',
  status text not null default 'pending',
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_client_id_idx on public.tasks (client_id);
create index if not exists tasks_project_id_idx on public.tasks (project_id);

alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
  on public.tasks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.tasks to authenticated;
