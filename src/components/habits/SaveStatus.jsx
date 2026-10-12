import { AlertCircle, Check, Loader2 } from "lucide-react";

export default function SaveStatus({ status, onRetry }) {
  if (status === "idle") return null;
  if (status === "error") {
    return (
      <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-urgent">
        <AlertCircle size={16} aria-hidden="true" /> No se pudo guardar el último cambio.
        <button onClick={onRetry} className="underline underline-offset-4">Reintentar</button>
      </p>
    );
  }
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-muted">
      {status === "saving" ? (
        <><Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> Guardando…</>
      ) : (
        <><Check size={16} aria-hidden="true" /> Cambios guardados</>
      )}
    </p>
  );
}
