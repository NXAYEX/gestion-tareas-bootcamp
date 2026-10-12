import { useState } from "react";
import { Archive, ArchiveRestore, ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import Cat from "../cats/Cat";

function ManagerRow({ habit, index, total, onMove, onEdit, onArchive, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const run = async (fn) => setError((await fn()) ? "No se pudo completar la acción." : null);
  const btn = "rounded-full p-2 text-muted hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <li className="py-3">
      <div className="flex items-center gap-2">
        <Cat variant={habit.icon} color={habit.color} size={36} className={`shrink-0 ${habit.is_archived ? "opacity-50" : ""}`} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{habit.name}</p>
          <p className="text-sm text-muted">{habit.is_archived ? "Archivado · conserva su historial" : "Activo"}</p>
        </div>
        <button onClick={() => run(() => onMove(habit.id, -1))} disabled={index === 0} aria-label={`Subir ${habit.name}`} className={btn}><ChevronUp size={18} aria-hidden="true" /></button>
        <button onClick={() => run(() => onMove(habit.id, 1))} disabled={index === total - 1} aria-label={`Bajar ${habit.name}`} className={btn}><ChevronDown size={18} aria-hidden="true" /></button>
        <button onClick={() => onEdit(habit)} aria-label={`Editar ${habit.name}`} className={btn}><Pencil size={18} aria-hidden="true" /></button>
        <button
          onClick={() => run(() => onArchive(habit.id, !habit.is_archived))}
          aria-label={habit.is_archived ? `Reactivar ${habit.name}` : `Archivar ${habit.name}`}
          title={habit.is_archived ? "Reactivar" : "Archivar"}
          className={btn}
        >
          {habit.is_archived ? <ArchiveRestore size={18} aria-hidden="true" /> : <Archive size={18} aria-hidden="true" />}
        </button>
        <button onClick={() => setConfirming(true)} aria-label={`Borrar ${habit.name}`} className={`${btn} hover:text-urgent`}><Trash2 size={18} aria-hidden="true" /></button>
      </div>
      {confirming && (
        <div role="alertdialog" aria-label="Confirmar borrado" className="mt-2 rounded-xl bg-paper p-3 text-sm">
          <p>Se borrará <strong>{habit.name}</strong> y todo su historial. Si solo quieres dejar de verlo, archívalo.</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => run(() => onDelete(habit.id))} className="rounded-full bg-urgent px-4 py-1.5 font-semibold text-white hover:opacity-90">Borrar hábito</button>
            <button onClick={() => setConfirming(false)} className="rounded-full px-4 py-1.5 font-semibold hover:bg-surface">Mantener</button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="mt-1 text-sm text-urgent">{error}</p>}
    </li>
  );
}

export default function HabitManager({ habits, onNew, onEdit, onMove, onArchive, onDelete, onExamples }) {
  const [exampleError, setExampleError] = useState(false);
  return (
    <div>
      <button onClick={onNew} className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
        <Plus size={16} aria-hidden="true" /> Nuevo hábito
      </button>
      {habits.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 text-muted">
          <Cat variant="curious" color="#F4B6CC" size={56} />
          <div>
            <p>Aún no tienes hábitos.</p>
            <button
              onClick={async () => setExampleError(!!(await onExamples()))}
              className="mt-1 text-sm font-semibold text-accent underline underline-offset-4"
            >
              Agregar hábitos de ejemplo
            </button>
            {exampleError && <p role="alert" className="text-sm text-urgent">No se pudieron agregar.</p>}
          </div>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {habits.map((h, i) => (
            <ManagerRow key={h.id} habit={h} index={i} total={habits.length} onMove={onMove} onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
