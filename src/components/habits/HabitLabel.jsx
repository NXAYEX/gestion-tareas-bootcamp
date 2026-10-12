import { Flame } from "lucide-react";
import Cat from "../cats/Cat";

// Identifica al hábito: gatito con su color, nombre, meta diaria, avance del mes y racha
export default function HabitLabel({ habit, progress, streak }) {
  const done = progress.goal ? `${progress.count}/${progress.goal} días` : `${progress.count} ${progress.count === 1 ? "día" : "días"}`;
  return (
    <div className="flex items-center gap-3">
      <Cat variant={habit.icon} color={habit.color} size={40} className="shrink-0" />
      <div className="min-w-0">
        <p className="truncate font-semibold">{habit.name}</p>
        <p className="truncate text-sm text-muted">
          {habit.daily_goal_label ? `${habit.daily_goal_label} · ` : ""}
          {done}
          {progress.pct !== null ? ` (${progress.pct}%)` : ""}
        </p>
        {streak > 1 && (
          <p className="flex items-center gap-1 text-sm font-semibold text-ink">
            <Flame size={14} aria-hidden="true" /> Racha de {streak} días
          </p>
        )}
      </div>
    </div>
  );
}
