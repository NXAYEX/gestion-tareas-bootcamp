import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays } from "../../lib/dates";

export default function DayNav({ date, today, onChange }) {
  const btn = "rounded-full p-2 text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1">
      <button onClick={() => onChange(addDays(date, -1))} aria-label="Día anterior" className={btn}>
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <label className="block">
        <span className="sr-only">Ir a una fecha</span>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => e.target.value && e.target.value <= today && onChange(e.target.value)}
          className="rounded-xl border border-line bg-surface px-3 py-1.5 text-sm font-semibold hover:border-muted focus:border-accent"
        />
      </label>
      <button onClick={() => onChange(addDays(date, 1))} disabled={date >= today} aria-label="Día siguiente" className={btn}>
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <button
        onClick={() => onChange(today)}
        disabled={date === today}
        className="ml-auto rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface disabled:opacity-40"
      >
        Ir a hoy
      </button>
    </div>
  );
}
