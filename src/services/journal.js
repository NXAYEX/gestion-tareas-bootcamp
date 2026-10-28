import { supabase } from "../lib/supabase";

const BUCKET = "journal-photos";

// Índice de páginas (sin el texto completo para que sea liviano)
export const listEntries = () =>
  supabase.from("journal_entries").select("id, entry_date, title, mood").order("entry_date", { ascending: false });

export const getEntry = (date) => supabase.from("journal_entries").select("*").eq("entry_date", date).maybeSingle();

// user_id lo pone la base de datos (auth.uid()); la fila única es (usuario, fecha)
export const saveEntry = (date, row) =>
  supabase.from("journal_entries").upsert({ entry_date: date, ...row }, { onConflict: "user_id,entry_date" }).select("id, entry_date, title, mood").single();

export const deleteEntry = (date) => supabase.from("journal_entries").delete().eq("entry_date", date);

export async function uploadPhoto(blob) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return { data: null, error: new Error("Sin sesión") };
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
  return { data: error ? null : path, error };
}

export const removePhoto = (path) => supabase.storage.from(BUCKET).remove([path]);

// El bucket es privado: se pide una URL temporal (1 hora)
export async function photoUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  return { data: data?.signedUrl ?? null, error };
}
