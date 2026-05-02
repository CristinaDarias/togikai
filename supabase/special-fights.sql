create table if not exists public.special_fights (
  id text primary key,
  title text not null,
  description text not null,
  image_url text not null,
  display_order int not null unique
);

alter table public.special_fights enable row level security;

drop policy if exists "read special fights" on public.special_fights;
create policy "read special fights"
on public.special_fights
for select
to anon
using (true);

insert into public.special_fights (id, title, description, image_url, display_order) values
('SP-001', 'Crimson Crown', 'Combate ceremonial donde solo los invictos pueden desafiar al líder.', '/images/base/fondo-home-togikai.png', 1),
('SP-002', 'Black Docks', 'Pelea nocturna en el muelle con reglas de resistencia extrema.', '/images/base/background.png', 2),
('SP-003', 'Silent Katana', 'Sin público y sin campana: solo termina por KO o rendición.', '/images/base/fondo-home-togikai.png', 3),
('SP-004', 'Iron Oath', 'Encuentro de honor entre escuelas rivales con jueces del clan.', '/images/base/background.png', 4),
('SP-005', 'Blood Lantern', 'Evento especial bajo faroles rojos en la arena subterránea.', '/images/base/fondo-home-togikai.png', 5)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  display_order = excluded.display_order;
