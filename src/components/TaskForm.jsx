import { useState } from "react";
import { Plus } from "lucide-react";

export const PRIORITIES = [
  { id: "high", label: "Alta" },
  { id: "medium", label: "Media" },
  { id: "low", label: "Baja" },
];

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const err = await onSubmit({ title: title.trim(), priority, due_date: dueDate || null });
    setBusy(false);
    if (err) return setError("No se pudo agregar la tarea. Inténtalo de nuevo.");
    setError(null);
    setTitle("");
    setDueDate("");
  };

  const ctl = "rounded-xl border border-line bg-surface px-3 py-2 text-sm hover:border-muted focus:border-accent";

  return (
    <form onSubmit={submit} className="mt-8">
      <label className="sr-only" htmlFor="new-title">
        Nueva tarea
      </label>
      <input
        id="new-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        placeholder="¿Qué tienes que hacer?"
        className="w-full border-b-2 border-ink bg-transparent py-2 font-display text-xl font-semibold placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="new-priority">
          Prioridad
        </label>
        <select id="new-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={ctl}>
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>
              Prioridad {p.label.toLowerCase()}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="new-due">
          Fecha límite
        </label>
        <input id="new-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={ctl} />
        <button
          disabled={busy || !title.trim()}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
        >
          <Plus size={16} aria-hidden="true" /> {busy ? "Agregando…" : "Agregar tarea"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-urgent">
          {error}
        </p>
      )}
    </form>
  );
}
