import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_DRAFT, isEmptyDraft, toDraft, toRow } from "../lib/journal";
import { resizeImage } from "../lib/image";
import * as api from "../services/journal";

const DELAY = 900;

// Página del diario de un día con guardado automático (espera 0,9 s sin escribir) y lista de páginas.
export function useJournal(date) {
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [photo, setPhoto] = useState(null); // URL temporal de la foto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  const draftRef = useRef(EMPTY_DRAFT);
  const dirty = useRef(false);
  const timer = useRef(null);
  const exists = useRef(false);
  const orphan = useRef(null); // foto reemplazada o quitada: se borra de Storage tras guardar

  const loadIndex = useCallback(async () => {
    const { data } = await api.listEntries();
    setEntries(data ?? []);
  }, []);

  const persist = useCallback(async (forDate) => {
    clearTimeout(timer.current);
    if (!dirty.current) return true;
    dirty.current = false;
    const d = draftRef.current;
    setStatus("saving");
    let err;
    if (isEmptyDraft(d)) {
      if (exists.current) {
        ({ error: err } = await api.deleteEntry(forDate));
        if (!err) {
          exists.current = false;
          setEntries((list) => list.filter((e) => e.entry_date !== forDate));
        }
      }
    } else {
      const { data, error } = await api.saveEntry(forDate, toRow(d));
      err = error;
      if (!error) {
        exists.current = true;
        setEntries((list) => [data, ...list.filter((e) => e.entry_date !== forDate)].sort((a, b) => b.entry_date.localeCompare(a.entry_date)));
      }
    }
    if (err) {
      dirty.current = true;
      setStatus("error");
      return false;
    }
    if (orphan.current) {
      api.removePhoto(orphan.current);
      orphan.current = null;
    }
    setStatus("saved");
    return true;
  }, []);

  useEffect(() => {
    loadIndex();
  }, [loadIndex]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setStatus("idle");
      const { data, error } = await api.getEntry(date);
      if (cancelled) return;
      setError(error ? "No se pudo abrir esta página." : null);
      exists.current = !!data;
      draftRef.current = toDraft(data);
      dirty.current = false;
      setDraft(draftRef.current);
      setLoading(false);
    })();
    // Al cambiar de día (o salir) se guarda lo pendiente de la página que se deja
    return () => {
      cancelled = true;
      persist(date);
    };
  }, [date, persist]);

  useEffect(() => {
    let cancelled = false;
    setPhoto(null);
    if (draft.photo_path) api.photoUrl(draft.photo_path).then(({ data }) => !cancelled && setPhoto(data));
    return () => {
      cancelled = true;
    };
  }, [draft.photo_path]);

  const change = (patch, immediate = false) => {
    draftRef.current = { ...draftRef.current, ...patch };
    dirty.current = true;
    setDraft(draftRef.current);
    clearTimeout(timer.current);
    if (immediate) persist(date);
    else timer.current = setTimeout(() => persist(date), DELAY);
  };

  const setPhotoFile = async (file) => {
    setStatus("saving");
    try {
      const { data: path, error } = await api.uploadPhoto(await resizeImage(file));
      if (error) throw error;
      if (draftRef.current.photo_path) orphan.current = draftRef.current.photo_path;
      change({ photo_path: path }, true);
    } catch {
      setStatus("error");
    }
  };

  const removePhoto = () => {
    orphan.current = draftRef.current.photo_path;
    change({ photo_path: null }, true);
  };

  return {
    entries, draft, photo, loading, error, status,
    change, setPhotoFile, removePhoto,
    retry: () => persist(date),
    reload: () => window.location.reload(),
  };
}
