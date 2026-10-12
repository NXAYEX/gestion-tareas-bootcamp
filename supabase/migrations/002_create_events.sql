-- Crea la tabla de eventos (certámenes, exámenes, entregas...) y activa seguridad: cada usuario solo ve y modifica los suyos.
-- Los días restantes NO se guardan: se calculan en la app a partir de event_date.

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  type text not null default 'otro'
    check (type in ('certamen', 'examen', 'tarea', 'entrega', 'proyecto', 'presentacion', 'practica', 'otro')),
  event_date date not null,
  color text not null default '#B3D4F2' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  subject text check (subject is null or char_length(subject) <= 60),
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled'))
);

create index events_user_date_idx on public.events (user_id, event_date);
create index events_user_status_idx on public.events (user_id, status);

create trigger events_set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "events_select_own" on public.events for select using (auth.uid() = user_id);
create policy "events_insert_own" on public.events for insert with check (auth.uid() = user_id);
create policy "events_update_own" on public.events for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "events_delete_own" on public.events for delete using (auth.uid() = user_id);
