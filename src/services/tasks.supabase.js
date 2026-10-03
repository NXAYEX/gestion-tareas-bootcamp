import { supabase } from "../lib/supabase";

export const listTasks = () =>
  supabase
    .from("tasks")
    .select("*")
    .order("is_done", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

export const createTask = (task) =>
  supabase.from("tasks").insert(task).select().single();

export const updateTask = (id, changes) =>
  supabase.from("tasks").update(changes).eq("id", id).select().single();

export const deleteTask = (id) => supabase.from("tasks").delete().eq("id", id);
