import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDays } from "../lib/dates";
import * as api from "../services/habits";

const key = (habitId, date) => `${habitId}|${date}`;
const HISTORY_DAYS = 400; // ventana para calcular rachas

// Registros de hábitos: carga desde (visibleStart o 400 días atrás, lo que sea más antiguo) hasta hoy.
// Marcar/desmarcar es optimista: se ve al instante y se revierte si Supabase falla.
export function useHabitLogs(today, visibleStart) {
  const [keys, setKeys] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(0);
  const [failed, setFailed] = useState(null);
  const [touched, setTouched] = useState(false);
  const inflight = useRef(new Set());

  const history = addDays(today, -HISTORY_DAYS);
  const from = visibleStart < history ? visibleStart : history;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.listLogs(from, today);
    setError(error ? "No se pudieron cargar los registros." : null);
    setKeys(new Set((data ?? []).map((r) => key(r.habit_id, r.log_date))));
    setLoading(false);
  }, [from, today]);

  useEffect(() => {
    load();
  }, [load]);

  const byHabit = useMemo(() => {
    const map = new Map();
    for (const k of keys) {
      const [habitId, date] = k.split("|");
      if (!map.has(habitId)) map.set(habitId, new Set());
      map.get(habitId).add(date);
    }
    return map;
  }, [keys]);

  const setOne = (k, on) =>
    setKeys((prev) => {
      const next = new Set(prev);
      if (on) next.add(k);
      else next.delete(k);
      return next;
    });

  const apply = useCallback(async (habitId, date, desired) => {
    const k = key(habitId, date);
    if (inflight.current.has(k)) return;
    inflight.current.add(k);
    setTouched(true);
    setPending((n) => n + 1);
    setOne(k, desired);
    const { error } = await (desired ? api.addLog(habitId, date) : api.removeLog(habitId, date));
    // 23505 = ya existía ese registro: el estado deseado ya está guardado
    if (error && error.code !== "23505") {
      setOne(k, !desired);
      setFailed({ habitId, date, desired });
    } else {
      setFailed((f) => (f && key(f.habitId, f.date) === k ? null : f));
    }
    inflight.current.delete(k);
    setPending((n) => n - 1);
  }, []);

  const toggle = (habitId, date) => {
    if (date > today) return; // nunca se registran días futuros
    apply(habitId, date, !keys.has(key(habitId, date)));
  };

  const status = pending > 0 ? "saving" : failed ? "error" : touched ? "saved" : "idle";

  return {
    byHabit,
    loading,
    error,
    reload: load,
    toggle,
    status,
    retry: () => failed && apply(failed.habitId, failed.date, failed.desired),
  };
}
