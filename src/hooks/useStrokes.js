import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../services/boards";

const DELAY = 800;

// Trazos de dibujo de la pizarra blanca. Se guardan solos 0,8 s después del último cambio.
export function useStrokes(board, enabled) {
  const [strokes, setStrokes] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const ref = useRef([]);
  const timer = useRef(null);
  const dirty = useRef(false);

  const save = useCallback(async () => {
    clearTimeout(timer.current);
    if (!dirty.current) return;
    dirty.current = false;
    setStatus("saving");
    const { error } = await api.saveStrokes(board, ref.current);
    if (error) {
      dirty.current = true;
      setStatus("error");
    } else {
      setStatus("saved");
    }
  }, [board]);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    const { data, error } = await api.getStrokes(board);
    setError(error ? "No se pudo abrir la pizarra." : null);
    ref.current = data?.strokes ?? [];
    setStrokes(ref.current);
    setLoading(false);
  }, [board, enabled]);

  useEffect(() => {
    load();
    return () => {
      save(); // al salir se guarda lo pendiente
    };
  }, [load, save]);

  const set = (next) => {
    ref.current = next;
    setStrokes(next);
    dirty.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(save, DELAY);
  };

  return {
    strokes, loading, error, status, reload: load, retry: save,
    add: (stroke) => set([...ref.current, stroke]),
    undo: () => set(ref.current.slice(0, -1)),
    clear: () => set([]),
  };
}
