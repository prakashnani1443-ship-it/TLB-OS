-- Earlier testing showed INSERT was blocked by a missing table-level
-- GRANT — RLS policies restrict what a grant already allows, they
-- don't grant anything by themselves. Granting all four operations
-- explicitly here so Edit Client's UPDATE doesn't hit the identical
-- "permission denied for table clients" error. Idempotent — safe to
-- re-run even if some of these are already in place.
grant select, insert, update, delete on public.clients to authenticated;
