-- The Add Client form collects Address and Notes, which the original
-- clients table (0001) has no columns for. Both nullable — safe to run
-- against a table that already has rows.

alter table public.clients
  add column if not exists address text,
  add column if not exists notes text;
