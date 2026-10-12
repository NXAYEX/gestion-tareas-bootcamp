import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PeriodNav({ label, unit, onPrev, onNext, nextDisabled, onToday }) {
  const btn = "rounded-full p-2 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="mb-3 flex items-center gap-1">
      <button onClick={onPrev} aria-label={`${unit} anterior`} className={btn}>
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <h2 className="min-w-[9rem] text-center font-display text-xl font-semibold" aria-live="polite">
        {label}
      </h2>
      <button onClick={onNext} disabled={nextDisabled} aria-label={`${unit} siguiente`} className={btn}>
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <button onClick={onToday} className="ml-auto rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface">
        Ir a hoy
      </button>
    </div>
  );
}
