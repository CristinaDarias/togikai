-- Permisos admin (solo si vas a usar anon/publishable key para escribir)
-- Recomendado: usar SUPABASE_SERVICE_ROLE_KEY en servidor y quitar estas policies abiertas.

alter table public.fighters enable row level security;
alter table public.fights enable row level security;

drop policy if exists "write fighters" on public.fighters;
create policy "write fighters"
on public.fighters
for all
to anon
using (true)
with check (true);

drop policy if exists "write fights" on public.fights;
create policy "write fights"
on public.fights
for all
to anon
using (true)
with check (true);
