create table if not exists public.fighters (
  alias text primary key,
  codename text not null default '悪魔',
  full_name text not null,
  points int not null default 1000,
  wins int not null default 0,
  losses int not null default 0,
  kos int not null default 0,
  style text not null default '',
  status text not null check (status in ('Activo', 'Lesionado', 'Suspendido'))
);

create table if not exists public.fights (
  id text primary key,
  date date not null,
  fighter_a text not null references public.fighters(alias) on update cascade,
  fighter_b text not null references public.fighters(alias) on update cascade,
  winner text not null,
  method text not null,
  winner_points int not null default 0,
  loser_points int not null default 0,
  chronicle text not null default 'Sin crónica registrada.'
);

alter table public.fighters enable row level security;
alter table public.fights enable row level security;

drop policy if exists "read fighters" on public.fighters;
create policy "read fighters"
on public.fighters
for select
to anon
using (true);

drop policy if exists "read fights" on public.fights;
create policy "read fights"
on public.fights
for select
to anon
using (true);
