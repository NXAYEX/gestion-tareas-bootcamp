-- Crea los hábitos y sus registros diarios, con seguridad: cada usuario solo ve y modifica los suyos.
-- Requiere haber ejecutado antes 002_create_events.sql (usa la función set_updated_at).
-- Archivar un hábito (is_archived) conserva su historial; borrarlo elimina también sus registros (on delete cascade).

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  description text check (description is null or char_length(description) <= 200),
  icon text not null default 'happy' check (char_length(icon) <= 30),
  color text not null default '#F4B6CC' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  daily_goal_label text check (daily_goal_label is null or char_length(daily_goal_label) <= 40),
  monthly_goal int check (monthly_goal between 1 and 31),
  position int not null default 0,
  is_archived boolean not null default false
);

create index habits_user_order_idx on public.habits (user_id, is_archived, position);

create trigger habits_set_updated_at before update on public.habits
  for each row execute function public.set_updated_at();

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  -- Un día de margen para tolerar la diferencia entre la zona horaria del servidor y la del usuario
  log_date date not null check (log_date <= current_date + 1),
  -- Evita duplicados: un hábito solo se registra una vez por fecha
  unique (habit_id, log_date)
);

create index habit_logs_user_date_idx on public.habit_logs (user_id, log_date);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "habits_select_own" on public.habits for select using (auth.uid() = user_id);
create policy "habits_insert_own" on public.habits for insert with check (auth.uid() = user_id);
create policy "habits_update_own" on public.habits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_delete_own" on public.habits for delete using (auth.uid() = user_id);

create policy "habit_logs_select_own" on public.habit_logs for select using (auth.uid() = user_id);
-- Además de ser suyo el registro, el hábito también debe ser del mismo usuario
create policy "habit_logs_insert_own" on public.habit_logs for insert with check (
  auth.uid() = user_id
  and exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid())
);
create policy "habit_logs_delete_own" on public.habit_logs for delete using (auth.uid() = user_id);
