import { useCallback, useEffect, useState } from "react";
import * as api from "../services/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.listTasks();
    setError(error ? "No se pudieron cargar las tareas." : null);
    setTasks(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Cada acción devuelve el error para que el componente lo muestre; si sale bien, recarga para mantener el orden
  const run = async (fn) => {
    const { error } = await fn();
    if (!error) await load();
    return error;
  };

  return {
    tasks,
    loading,
    error,
    reload: load,
    add: (task) => run(() => api.createTask(task)),
    edit: (id, changes) => run(() => api.updateTask(id, changes)),
    toggle: (task) => run(() => api.updateTask(task.id, { is_done: !task.is_done })),
    remove: (id) => run(() => api.deleteTask(id)),
  };
}
