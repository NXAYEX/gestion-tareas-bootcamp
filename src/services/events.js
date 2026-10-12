import { supabase } from "../lib/supabase";

export const listEvents = () =>
  supabase.from("events").select("*").order("event_date", { ascending: true }).order("title", { ascending: true });

export const createEvent = (event) => supabase.from("events").insert(event).select().single();

export const updateEvent = (id, changes) =>
  supabase.from("events").update(changes).eq("id", id).select().single();

export const deleteEvent = (id) => supabase.from("events").delete().eq("id", id);
