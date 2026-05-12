create table if not exists public.calendar_events (
  id text primary key,
  event_date date not null,
  event_time time not null,
  fight_name text not null,
  fighters_called text not null,
  matchups text not null default '',
  created_at timestamptz not null default now()
);

alter table public.calendar_events
add column if not exists matchups text not null default '';

alter table public.calendar_events enable row level security;

drop policy if exists "read calendar_events" on public.calendar_events;
create policy "read calendar_events"
on public.calendar_events
for select
to anon, authenticated
using (true);

revoke insert, update, delete, truncate, references, trigger
on table public.calendar_events
from anon, authenticated;

grant select on table public.calendar_events to anon, authenticated;
