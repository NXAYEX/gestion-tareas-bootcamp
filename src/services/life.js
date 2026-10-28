import { supabase } from "../lib/supabase";

export const getSettings = () =>
  supabase.from("life_settings").select("birth_date, age_years, life_expectancy").maybeSingle();

// user_id lo pone la base de datos (auth.uid()); hay una sola fila por usuario
export const saveSettings = (settings) =>
  supabase.from("life_settings").upsert(settings, { onConflict: "user_id" });
