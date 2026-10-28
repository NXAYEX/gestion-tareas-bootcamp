// Ánimos del diario: cada uno es una carita de gatito (variante de Cat)
export const MOODS = [
  { id: "happy", label: "Feliz" },
  { id: "cheer", label: "Con energía" },
  { id: "love", label: "Con cariño" },
  { id: "cool", label: "Con confianza" },
  { id: "curious", label: "Con curiosidad" },
  { id: "surprised", label: "Con sorpresa" },
  { id: "sleepy", label: "Con sueño" },
  { id: "worried", label: "Con preocupación" },
  { id: "sad", label: "Con tristeza" },
];

export const moodLabel = (id) => MOODS.find((m) => m.id === id)?.label ?? null;

export const EMPTY_DRAFT = { title: "", body: "", note: "", mood: null, photo_path: null };

export const toDraft = (entry) => ({
  title: entry?.title ?? "",
  body: entry?.body ?? "",
  note: entry?.note ?? "",
  mood: entry?.mood ?? null,
  photo_path: entry?.photo_path ?? null,
});

// Una página sin nada escrito, sin ánimo y sin foto no se guarda
export const isEmptyDraft = (d) => !d.title.trim() && !d.body.trim() && !d.note.trim() && !d.mood && !d.photo_path;

export const toRow = (d) => ({
  title: d.title.trim() || null,
  body: d.body.trim() ? d.body : null,
  note: d.note.trim() || null,
  mood: d.mood,
  photo_path: d.photo_path,
});

// Agrupa entradas (ya ordenadas de la más nueva a la más antigua) por año-mes
export function groupByMonth(entries) {
  const groups = [];
  for (const e of entries) {
    const key = e.entry_date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last?.key === key) last.entries.push(e);
    else groups.push({ key, entries: [e] });
  }
  return groups;
}
