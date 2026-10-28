import { supabase } from "../lib/supabase";

const BUCKET = "board-images";

export const listItems = (board) => supabase.from("board_items").select("*").eq("board", board).order("z", { ascending: true });

export const insertItem = (item) => supabase.from("board_items").insert(item);

export const patchItem = (id, patch) => supabase.from("board_items").update(patch).eq("id", id);

export const removeItem = (id) => supabase.from("board_items").delete().eq("id", id);

export const getStrokes = (board) => supabase.from("boards").select("strokes").eq("kind", board).maybeSingle();

// user_id lo pone la base de datos (auth.uid()); la fila única es (usuario, pizarra)
export const saveStrokes = (board, strokes) =>
  supabase.from("boards").upsert({ kind: board, strokes }, { onConflict: "user_id,kind" });

export async function uploadImage(blob) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return { data: null, error: new Error("Sin sesión") };
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
  return { data: error ? null : path, error };
}

export const removeImage = (path) => supabase.storage.from(BUCKET).remove([path]);

// El bucket es privado: se pide una URL temporal (1 hora)
export async function imageUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  return { data: data?.signedUrl ?? null, error };
}
