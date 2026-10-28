-- Crea el diario (una entrada por día y usuario) y un bucket privado para las fotos. Cada usuario solo accede a lo suyo.
-- Requiere haber ejecutado antes 002_create_events.sql (usa la función set_updated_at).

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  entry_date date not null,
  title text check (title is null or char_length(title) <= 120),
  body text check (body is null or char_length(body) <= 20000),
  note text check (note is null or char_length(note) <= 140),
  mood text check (mood is null or char_length(mood) <= 20),
  photo_path text check (photo_path is null or char_length(photo_path) <= 200),
  unique (user_id, entry_date)
);

create index journal_entries_user_date_idx on public.journal_entries (user_id, entry_date desc);

create trigger journal_entries_set_updated_at before update on public.journal_entries
  for each row execute function public.set_updated_at();

alter table public.journal_entries enable row level security;

create policy "journal_select_own" on public.journal_entries for select using (auth.uid() = user_id);
create policy "journal_insert_own" on public.journal_entries for insert with check (auth.uid() = user_id);
create policy "journal_update_own" on public.journal_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journal_delete_own" on public.journal_entries for delete using (auth.uid() = user_id);

-- Bucket privado: las fotos se guardan en una carpeta con el id del usuario (ej. <user_id>/foto.jpg)
insert into storage.buckets (id, name, public) values ('journal-photos', 'journal-photos', false)
  on conflict (id) do nothing;

create policy "journal_photos_select_own" on storage.objects for select
  using (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "journal_photos_insert_own" on storage.objects for insert
  with check (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "journal_photos_update_own" on storage.objects for update
  using (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "journal_photos_delete_own" on storage.objects for delete
  using (bucket_id = 'journal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
