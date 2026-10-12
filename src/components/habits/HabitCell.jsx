import { Check } from "lucide-react";
import { formatLong } from "../../lib/dates";

export default function HabitCell({ habit, date, checked, future, onToggle, big = false }) {
  const size = big ? "h-10 w-10" : "h-7 w-7";
  return (
    <button
      onClick={() => onToggle(habit.id, date)}
      disabled={future}
      aria-pressed={checked}
      aria-label={`${habit.name}, ${formatLong(date)}: ${checked ? "hecho" : "sin marcar"}`}
      title={future ? "Aún no puedes marcar días futuros" : undefined}
      className={`${size} inline-flex items-center justify-center rounded-lg border text-ink ${
        checked ? "border-ink/30" : "border-line bg-surface hover:border-muted"
      } ${future ? "cursor-not-allowed opacity-40" : ""}`}
      style={checked ? { backgroundColor: habit.color } : undefined}
    >
      {checked && <Check size={big ? 20 : 16} strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}
