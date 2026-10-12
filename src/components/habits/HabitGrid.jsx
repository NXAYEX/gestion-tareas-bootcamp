import { daysInMonth, toISO } from "../../lib/dates";
import { habitProgress, streakOf } from "../../lib/habitStats";
import HabitCell from "./HabitCell";
import HabitLabel from "./HabitLabel";

// Cuadrícula mensual: hábitos en filas, días en columnas. Primera columna y encabezado fijos al desplazarse.
export default function HabitGrid({ habits, byHabit, month, today, onToggle }) {
  const days = Array.from({ length: daysInMonth(month.y, month.m) }, (_, i) => toISO(month.y, month.m, i + 1));

  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border border-line bg-surface shadow-soft">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 top-0 z-30 min-w-[230px] border-b border-line bg-paper px-3 py-2 text-left text-sm font-semibold text-muted">
              Hábito
            </th>
            {days.map((iso, i) => (
              <th
                key={iso}
                scope="col"
                className={`sticky top-0 z-20 min-w-[36px] border-b border-line px-0.5 py-2 text-center text-sm font-semibold ${
                  iso === today ? "bg-accent text-white" : "bg-paper text-muted"
                }`}
              >
                <span className="sr-only">Día </span>
                {i + 1}
              </th>
            ))}
            <th scope="col" className="sticky right-0 top-0 z-30 border-b border-l border-line bg-paper px-3 py-2 text-sm font-semibold text-muted">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => {
            const set = byHabit.get(h.id);
            const progress = habitProgress(h, set, month.y, month.m, today);
            return (
              <tr key={h.id}>
                <th scope="row" className="sticky left-0 z-10 border-b border-line bg-surface px-3 py-2 text-left font-normal">
                  <HabitLabel habit={h} progress={progress} streak={streakOf(set, today)} />
                </th>
                {days.map((iso) => (
                  <td key={iso} className={`border-b border-line px-0.5 py-1.5 text-center ${iso === today ? "bg-accent/10" : ""}`}>
                    <HabitCell habit={h} date={iso} checked={!!set?.has(iso)} future={iso > today} onToggle={onToggle} />
                  </td>
                ))}
                <td className="sticky right-0 z-10 whitespace-nowrap border-b border-l border-line bg-surface px-3 py-2 text-center text-sm font-semibold">
                  {progress.goal ? `${progress.count}/${progress.goal}` : progress.count}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
