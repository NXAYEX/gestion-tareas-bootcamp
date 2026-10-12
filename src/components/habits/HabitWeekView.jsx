import { addDays, parseISO } from "../../lib/dates";
import { habitProgress, streakOf } from "../../lib/habitStats";
import HabitCell from "./HabitCell";
import HabitLabel from "./HabitLabel";

const LETTERS = ["L", "M", "X", "J", "V", "S", "D"];

// Vista móvil: una semana a la vez, con botones grandes para marcar cada día
export default function HabitWeekView({ habits, byHabit, weekStart, today, onToggle }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const { y, m } = parseISO(weekStart);

  return (
    <ul className="space-y-3">
      {habits.map((h) => {
        const set = byHabit.get(h.id);
        // El progreso mensual se muestra del mes en que cae el lunes de la semana
        const progress = habitProgress(h, set, y, m, today);
        return (
          <li key={h.id} className="rounded-2xl bg-surface p-4 shadow-soft">
            <HabitLabel habit={h} progress={progress} streak={streakOf(set, today)} />
            <div className="mt-3 grid grid-cols-7 gap-1 text-center">
              {days.map((iso, i) => (
                <div key={iso} className={`rounded-xl py-1 ${iso === today ? "bg-accent/10" : ""}`}>
                  <p className={`text-sm ${iso === today ? "font-bold text-accent-dark" : "text-muted"}`} aria-hidden="true">
                    {LETTERS[i]}
                  </p>
                  <p className="mb-1 text-sm font-semibold" aria-hidden="true">{parseISO(iso).d}</p>
                  <HabitCell habit={h} date={iso} checked={!!set?.has(iso)} future={iso > today} onToggle={onToggle} big />
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
