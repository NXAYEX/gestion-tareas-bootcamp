import { useEffect, useId } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-soft sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="font-display text-2xl font-semibold">
            {title}
          </h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 text-muted hover:bg-paper hover:text-ink">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
