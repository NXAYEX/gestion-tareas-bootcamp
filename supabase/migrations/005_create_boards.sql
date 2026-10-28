-- Crea las dos pizarras (corcho y pizarra blanca): los trazos de dibujo, los objetos pegados y un bucket privado para las imágenes.
-- Cada usuario solo ve y modifica lo suyo. Requiere haber ejecutado antes 002_create_events.sql (función set_updated_at).

-- Una fila por usuario y pizarra, con los trazos de dibujo como lista JSON
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('cork', 'white')),
  strokes jsonb not null default '[]'::jsonb
    check (jsonb_typeof(strokes) = 'array' and jsonb_array_length(strokes) <= 3000 and octet_length(strokes::text) <= 2000000),
  unique (user_id, kind)
);

create trigger boards_set_updated_at before update on public.boards
  for each row execute function public.set_updated_at();

-- Objetos pegados: post-its, textos, imágenes y stickers. x, y y w están en un espacio fijo de 1200 x 800.
create table public.board_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  board text not null check (board in ('cork', 'white')),
  type text not null check (type in ('note', 'text', 'image', 'sticker')),
  x real not null,
  y real not null,
  w real not null check (w between 40 and 800),
  rotation real not null default 0 check (rotation between -180 and 180),
  z int not null default 0,
  color text check (color is null or color ~ '^#[0-9A-Fa-f]{6}$'),
  content text check (content is null or char_length(content) <= 2000),
  image_path text check (image_path is null or char_length(image_path) <= 200)
);

create index board_items_user_board_idx on public.board_items (user_id, board);

create trigger board_items_set_updated_at before update on public.board_items
  for each row execute function public.set_updated_at();

alter table public.boards enable row level security;
alter table public.board_items enable row level security;

create policy "boards_select_own" on public.boards for select using (auth.uid() = user_id);
create policy "boards_insert_own" on public.boards for insert with check (auth.uid() = user_id);
create policy "boards_update_own" on public.boards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "boards_delete_own" on public.boards for delete using (auth.uid() = user_id);

create policy "board_items_select_own" on public.board_items for select using (auth.uid() = user_id);
create policy "board_items_insert_own" on public.board_items for insert with check (auth.uid() = user_id);
create policy "board_items_update_own" on public.board_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "board_items_delete_own" on public.board_items for delete using (auth.uid() = user_id);

-- Bucket privado: las imágenes van en una carpeta con el id del usuario (ej. <user_id>/foto.jpg)
insert into storage.buckets (id, name, public) values ('board-images', 'board-images', false)
  on conflict (id) do nothing;

create policy "board_images_select_own" on storage.objects for select
  using (bucket_id = 'board-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "board_images_insert_own" on storage.objects for insert
  with check (bucket_id = 'board-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "board_images_update_own" on storage.objects for update
  using (bucket_id = 'board-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "board_images_delete_own" on storage.objects for delete
  using (bucket_id = 'board-images' and (storage.foldername(name))[1] = auth.uid()::text);
