import { useState } from "react";
import { Ban, Check, Pencil, RotateCcw, Trash2 } from "lucide-react";

export default function EventActions({ event, onEdit, onStatus, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const run = async (fn) => {
    const err = await fn();
    setError(err ? "No se pudo completar la acción. Inténtalo de nuevo." : null);
  };

  const btn = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-paper hover:text-ink";
  const pending = event.status === "pending";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1">
        {pending ? (
          <>
            <button onClick={() => run(() => onStatus(event.id, "completed"))} className={btn}>
              <Check size={16} aria-hidden="true" /> Completar
            </button>
            <button onClick={() => run(() => onStatus(event.id, "cancelled"))} className={btn}>
              <Ban size={16} aria-hidden="true" /> Cancelar evento
            </button>
          </>
        ) : (
          <button onClick={() => run(() => onStatus(event.id, "pending"))} className={btn}>
            <RotateCcw size={16} aria-hidden="true" /> Reabrir
          </button>
        )}
        <button onClick={() => onEdit(event)} className={btn}>
          <Pencil size={16} aria-hidden="true" /> Editar
        </button>
        {confirming ? (
          <>
            <button
              onClick={() => run(() => onDelete(event.id))}
              className="rounded-full bg-urgent px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Borrar evento
            </button>
            <button onClick={() => setConfirming(false)} className={btn}>
              Mantener
            </button>
          </>
        ) : (
          <button onClick={() => setConfirming(true)} className={`${btn} hover:text-urgent`}>
            <Trash2 size={16} aria-hidden="true" /> Borrar
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}
