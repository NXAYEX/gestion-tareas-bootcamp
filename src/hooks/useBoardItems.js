import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_ITEMS, newItem, topZ } from "../lib/board";
import * as api from "../services/boards";

const SAVE_DELAY = 600;
const KEYS = ["x", "y", "w", "rotation", "z", "color", "content", "image_path"];

// Objetos de una pizarra. Los cambios se ven al instante y se guardan en segundo plano.
export function useBoardItems(board) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const itemsRef = useRef([]);
  const timers = useRef(new Map()); // id -> { t, keys }
  const pending = useRef(0);

  const setAll = (next) => {
    itemsRef.current = next;
    setItems(next);
  };

  const track = async (promise) => {
    pending.current++;
    setStatus("saving");
    const { error } = await promise;
    pending.current--;
    if (error) setStatus("error");
    else if (pending.current === 0) setStatus((s) => (s === "error" ? s : "saved"));
    return error;
  };

  const persist = (id, keys = KEYS) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item) return null;
    return track(api.patchItem(id, Object.fromEntries(keys.map((k) => [k, item[k]]))));
  };

  const schedule = (id, keys) => {
    const prev = timers.current.get(id);
    clearTimeout(prev?.t);
    const merged = new Set([...(prev?.keys ?? []), ...keys]);
    const t = setTimeout(() => {
      timers.current.delete(id);
      persist(id, [...merged]);
    }, SAVE_DELAY);
    timers.current.set(id, { t, keys: merged });
  };

  const flush = () => {
    for (const [id, { t, keys }] of timers.current) {
      clearTimeout(t);
      persist(id, [...keys]);
    }
    timers.current.clear();
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.listItems(board);
    setError(error ? "No se pudo abrir la pizarra." : null);
    setAll(data ?? []);
    setStatus("idle");
    setLoading(false);
  }, [board]);

  useEffect(() => {
    load();
    return flush; // al salir se guarda lo pendiente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  // Cambio local inmediato; se guarda 0,6 s después (o al llamar commit)
  const change = (id, patch) => {
    setAll(itemsRef.current.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    schedule(id, Object.keys(patch));
  };

  // Movimiento mientras se arrastra: solo local
  const move = (id, patch) => setAll(itemsRef.current.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const commit = (id, keys) => {
    clearTimeout(timers.current.get(id)?.t);
    timers.current.delete(id);
    persist(id, keys);
  };

  // Devuelve { item } o { error }
  const add = async (type, extra) => {
    if (itemsRef.current.length >= MAX_ITEMS) return { error: new Error("limit") };
    const item = newItem(board, type, itemsRef.current, extra);
    setAll([...itemsRef.current, item]);
    const error = await track(api.insertItem(item));
    if (error) {
      setAll(itemsRef.current.filter((i) => i.id !== item.id));
      return { error };
    }
    return { item };
  };

  const remove = async (id) => {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item) return;
    clearTimeout(timers.current.get(id)?.t);
    timers.current.delete(id);
    setAll(itemsRef.current.filter((i) => i.id !== id));
    await track(api.removeItem(id));
    if (item.image_path) api.removeImage(item.image_path);
  };

  const front = (id) => change(id, { z: topZ(itemsRef.current) });

  return { items, loading, error, status, reload: load, add, change, move, commit, remove, front };
}
