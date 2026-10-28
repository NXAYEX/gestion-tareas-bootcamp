import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_EXPECTANCY } from "../lib/life";
import * as api from "../services/life";

const DELAY = 700;
const DEFAULTS = { birth_date: null, age_years: null, life_expectancy: DEFAULT_EXPECTANCY };

// Ajustes de Vida en semanas con guardado automático (0,7 s después del último cambio)
export function useLifeSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const ref = useRef(DEFAULTS);
  const timer = useRef(null);
  const dirty = useRef(false);

  const save = useCallback(async () => {
    clearTimeout(timer.current);
    if (!dirty.current) return;
    dirty.current = false;
    setStatus("saving");
    const { error } = await api.saveSettings(ref.current);
    if (error) {
      dirty.current = true;
      setStatus("error");
    } else {
      setStatus("saved");
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await api.getSettings();
    setError(error ? "No se pudieron cargar tus datos." : null);
    ref.current = data ? { ...DEFAULTS, ...data, age_years: data.age_years === null ? null : Number(data.age_years) } : DEFAULTS;
    setSettings(ref.current);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    return () => {
      save(); // al salir se guarda lo pendiente
    };
  }, [load, save]);

  const change = (patch) => {
    ref.current = { ...ref.current, ...patch };
    setSettings(ref.current);
    dirty.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(save, DELAY);
  };

  return { settings, loading, error, status, change, retry: save, reload: load };
}
