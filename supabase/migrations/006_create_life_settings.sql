-- Guarda los ajustes de "Vida en semanas": fecha de nacimiento o edad escrita, y la esperanza de vida elegida.
-- Una fila por usuario. Requiere haber ejecutado antes 002_create_events.sql (función set_updated_at).
-- Las semanas vividas NO se guardan: se calculan al mostrar la pantalla.

create table public.life_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade unique,
  birth_date date check (birth_date is null or (birth_date >= '1900-01-01' and birth_date <= current_date + 1)),
  age_years numeric(5, 2) check (age_years is null or age_years between 0 and 120),
  life_expectancy int not null default 80 check (life_expectancy between 1 and 120)
);

create trigger life_settings_set_updated_at before update on public.life_settings
  for each row execute function public.set_updated_at();

alter table public.life_settings enable row level security;

create policy "life_settings_select_own" on public.life_settings for select using (auth.uid() = user_id);
create policy "life_settings_insert_own" on public.life_settings for insert with check (auth.uid() = user_id);
create policy "life_settings_update_own" on public.life_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "life_settings_delete_own" on public.life_settings for delete using (auth.uid() = user_id);
