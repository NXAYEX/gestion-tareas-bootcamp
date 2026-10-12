import { ChevronLeft, ChevronRight } from "lucide-react";
import { labelsForDay } from "../../lib/countdown";
import { addMonths, formatMonth, monthGrid, parseISO } from "../../lib/dates";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import CalendarDay from "./CalendarDay";

const WEEKDAYS = [
  ["Lun", "L"], ["Mar", "M"], ["Mié", "X"], ["Jue", "J"], ["Vie", "V"], ["Sáb", "S"], ["Dom", "D"],
];

export default function CalendarMonth({ events, today, month, onMonthChange, selected, onSelect }) {
  const wide = useMediaQuery("(min-width: 640px)");
  const weeks = monthGrid(month.y, month.m);
  const title = formatMonth(month);
  const navBtn = "rounded-full p-2 text-ink hover:bg-surface";

  return (
    <section aria-label="Calendario">
      <div className="mb-3 flex items-center gap-1">
        <button onClick={() => onMonthChange(addMonths(month, -1))} aria-label="Mes anterior" className={navBtn}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <h2 className="min-w-[9rem] text-center font-display text-xl font-semibold" aria-live="polite">
          {title}
        </h2>
        <button onClick={() => onMonthChange(addMonths(month, 1))} aria-label="Mes siguiente" className={navBtn}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
        <button
          onClick={() => {
            onMonthChange({ y: parseISO(today).y, m: parseISO(today).m });
            onSelect(today);
          }}
          className="ml-auto rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface"
        >
          Ir a hoy
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-line shadow-soft">
        <div className="grid grid-cols-7 gap-px">
          {WEEKDAYS.map(([long, short]) => (
            <div key={long} className="bg-paper py-2 text-center text-sm font-semibold text-muted">
              <span className="sm:hidden" aria-hidden="true">{short}</span>
              <span className="hidden sm:inline">{long}</span>
              <span className="sr-only sm:hidden">{long}</span>
            </div>
          ))}
          {weeks.flat().map((cell) => (
            <CalendarDay
              key={cell.iso}
              cell={cell}
              items={labelsForDay(events, cell.iso, today)}
              today={today}
              selected={cell.iso === selected}
              maxChips={wide ? 8 : 4}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
