import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { formatDue, todayISO } from "../lib/dates";
import TaskEditForm from "./TaskEditForm";

const PRIORITY_LABEL = { high: "alta", medium: "media", low: "baja" };

export default function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const today = todayISO();
  const overdue = !task.is_done && task.due_date && task.due_date < today;
  const dueToday = !task.is_done && task.due_date === today;

  const act = async (fn) => {
    const err = await fn();
    setError(err ? "No se pudo completar la acción." : null);
    return err;
  };

  if (editing) {
    return (
      <li className="border-b border-line py-4">
        <TaskEditForm
          task={task}
          onCancel={() => setEditing(false)}
          onSave={async (changes) => {
            const err = await act(() => onEdit(task.id, changes));
            if (!err) setEditing(false);
          }}
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-urgent">
            {error}
          </p>
        )}
      </li>
    );
  }

  const iconBtn = "rounded-xl p-2 text-muted hover:bg-surface hover:text-ink";

  return (
    <li className="flex items-start gap-3 border-b border-line py-3">
      <button
        onClick={() => act(() => onToggle(task))}
        aria-pressed={task.is_done}
        aria-label={task.is_done ? `Reabrir: ${task.title}` : `Completar: ${task.title}`}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 ${
          task.is_done ? "border-accent bg-accent text-white" : "border-ink hover:border-accent"
        }`}
      >
        {task.is_done && <Check size={16} aria-hidden="true" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`strike break-words font-semibold ${task.is_done ? "done text-muted" : ""}`}>{task.title}</p>
        {task.description && <p className="mt-0.5 break-words text-sm text-muted">{task.description}</p>}
        <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
          <span className={task.priority === "high" && !task.is_done ? "font-semibold text-urgent" : ""}>
            Prioridad {PRIORITY_LABEL[task.priority]}
          </span>
          {task.due_date && (
            <span className={overdue ? "font-semibold text-urgent" : dueToday ? "font-semibold text-ink" : ""}>
              {overdue ? "Venció el " : dueToday ? "Vence hoy · " : "Vence el "}
              {formatDue(task.due_date)}
            </span>
          )}
        </p>
        {error && (
          <p role="alert" className="mt-1 text-sm text-urgent">
            {error}
          </p>
        )}
      </div>

      {confirming ? (
        <div className="flex shrink-0 items-center gap-1 text-sm">
          <button
            onClick={() => act(() => onDelete(task.id))}
            className="rounded-xl bg-urgent px-3 py-1.5 font-semibold text-white hover:opacity-90"
          >
            Borrar tarea
          </button>
          <button onClick={() => setConfirming(false)} className="rounded-xl px-3 py-1.5 font-semibold hover:bg-surface">
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex shrink-0">
          <button onClick={() => setEditing(true)} aria-label={`Editar: ${task.title}`} className={iconBtn}>
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button onClick={() => setConfirming(true)} aria-label={`Borrar: ${task.title}`} className={`${iconBtn} hover:text-urgent`}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </li>
  );
}
