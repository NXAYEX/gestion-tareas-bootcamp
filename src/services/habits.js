import { supabase } from "../lib/supabase";

export const listHabits = () =>
  supabase.from("habits").select("*").order("position", { ascending: true }).order("created_at", { ascending: true });

export const createHabits = (habits) => supabase.from("habits").insert(habits).select();

export const updateHabit = (id, changes) => supabase.from("habits").update(changes).eq("id", id).select().single();

// Borra el hábito y, por cascada, todo su historial
export const deleteHabit = (id) => supabase.from("habits").delete().eq("id", id);

// Registros entre dos fechas. Supabase devuelve máx. 1000 filas por consulta, así que se pide por páginas.
export async function listLogs(from, to) {
  const PAGE = 1000;
  const rows = [];
  for (let start = 0; ; start += PAGE) {
    const { data, error } = await supabase
      .from("habit_logs")
      .select("habit_id, log_date")
      .gte("log_date", from)
      .lte("log_date", to)
      .order("log_date", { ascending: true })
      .range(start, start + PAGE - 1);
    if (error) return { data: null, error };
    rows.push(...data);
    if (data.length < PAGE) return { data: rows, error: null };
  }
}

export const addLog = (habitId, date) => supabase.from("habit_logs").insert({ habit_id: habitId, log_date: date });

export const removeLog = (habitId, date) =>
  supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("log_date", date);
