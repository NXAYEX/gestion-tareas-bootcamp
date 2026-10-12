import { useCallback, useEffect, useState } from "react";
import * as api from "../services/events";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.listEvents();
    setError(error ? "No se pudieron cargar los eventos." : null);
    setEvents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Devuelve el error (o null) para que el formulario lo muestre; si sale bien, recarga la lista
  const run = async (fn) => {
    const { error } = await fn();
    if (!error) await load();
    return error;
  };

  return {
    events,
    loading,
    error,
    reload: load,
    add: (event) => run(() => api.createEvent(event)),
    edit: (id, changes) => run(() => api.updateEvent(id, changes)),
    setStatus: (id, status) => run(() => api.updateEvent(id, { status })),
    remove: (id) => run(() => api.deleteEvent(id)),
  };
}
