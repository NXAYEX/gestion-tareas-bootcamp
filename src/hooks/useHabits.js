import { useCallback, useEffect, useState } from "react";
import * as api from "../services/habits";
import { EXAMPLE_HABITS } from "../lib/habitExamples";

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.listHabits();
    setError(error ? "No se pudieron cargar los hábitos." : null);
    setHabits(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn) => {
    const { error } = await fn();
    if (!error) await load();
    return error;
  };

  const nextPosition = () => Math.max(-1, ...habits.map((h) => h.position)) + 1;

  // Intercambia el hábito con su vecino y reescribe las posiciones 0..n para que nunca haya empates
  const move = async (id, direction) => {
    const from = habits.findIndex((h) => h.id === id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= habits.length) return null;
    const order = [...habits];
    [order[from], order[to]] = [order[to], order[from]];
    const results = await Promise.all(
      order.map((h, i) => (h.position === i ? null : api.updateHabit(h.id, { position: i })))
    );
    const failed = results.find((r) => r?.error);
    await load();
    return failed?.error ?? null;
  };

  return {
    habits,
    loading,
    error,
    reload: load,
    add: (habit) => run(() => api.createHabits([{ ...habit, position: nextPosition() }])),
    edit: (id, changes) => run(() => api.updateHabit(id, changes)),
    setArchived: (id, is_archived) => run(() => api.updateHabit(id, { is_archived })),
    remove: (id) => run(() => api.deleteHabit(id)),
    move,
    addExamples: () => {
      const start = nextPosition();
      return run(() => api.createHabits(EXAMPLE_HABITS.map((h, i) => ({ ...h, position: start + i }))));
    },
  };
}
