import { useState } from "react";
import { PRIORITIES } from "./TaskForm";

export default function TaskEditForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    await onSave({ title: title.trim(), description: description.trim() || null, priority, due_date: dueDate || null });
    setBusy(false);
  };

  const ctl = "mt-1 block rounded-md border border-line bg-surface px-3 py-2 text-sm font-normal hover:border-muted focus:border-accent";

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm font-semibold">
        Título
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className={`${ctl} w-full`} />
      </label>
      <label className="block text-sm font-semibold">
        Descripción
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${ctl} w-full`} />
      </label>
      <div className="flex flex-wrap gap-3">
        <label className="text-sm font-semibold">
          Prioridad
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={ctl}>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Fecha límite
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={ctl} />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          disabled={busy || !title.trim()}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#2342b8] disabled:opacity-50"
        >
          {busy ? "Guardando…" : "Guardar cambios"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-semibold hover:bg-surface">
          Cancelar
        </button>
      </div>
    </form>
  );
}
