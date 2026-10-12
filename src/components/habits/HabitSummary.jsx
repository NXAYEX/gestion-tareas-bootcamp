import { Flame, Star, Target } from "lucide-react";
import { bestHabit, doneToday, generalStreak, overallPct } from "../../lib/habitStats";
import Cat from "../cats/Cat";

function moodFor(pct) {
  if (pct >= 80) return { cat: "cheer", text: "¡Vas increíble! Sigue así." };
  if (pct >= 50) return { cat: "happy", text: "Buen ritmo, un día a la vez." };
  if (pct >= 20) return { cat: "curious", text: "Cada marca suma, no pares." };
  return { cat: "sleepy", text: "Empieza con un hábito pequeño hoy." };
}

function Stat({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm text-muted">
        <Icon size={14} aria-hidden="true" /> {label}
      </p>
      <p className="mt-0.5 font-display text-xl font-semibold">{children}</p>
    </div>
  );
}

export default function HabitSummary({ habits, byHabit, month, today }) {
  const pct = overallPct(habits, byHabit, month.y, month.m, today);
  const best = bestHabit(habits, byHabit, month.y, month.m, today);
  const streak = generalStreak(habits, byHabit, today);
  const mood = moodFor(pct);

  return (
    <section aria-label="Resumen del mes" className="mb-5 flex flex-wrap items-center gap-5 rounded-3xl bg-surface p-5 shadow-soft">
      <Cat variant={mood.cat} color="#F6CBA6" size={80} />
      <div className="min-w-0 flex-1 basis-64">
        <p className="font-semibold">{mood.text}</p>
        <div className="mt-2 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Cumplimiento del mes"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-3 flex-1 overflow-hidden rounded-full bg-paper"
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-display text-xl font-semibold">{pct}%</span>
        </div>
        <p className="mt-1 text-sm text-muted">Cumplimiento del mes</p>
      </div>
      <div className="grid w-full grid-cols-3 gap-4 border-t border-line pt-4 sm:w-auto sm:border-0 sm:pt-0">
        <Stat icon={Target} label="Hoy">{doneToday(habits, byHabit, today)} de {habits.length}</Stat>
        <Stat icon={Flame} label="Racha">{streak} {streak === 1 ? "día" : "días"}</Stat>
        <Stat icon={Star} label="Mejor hábito"><span className="block truncate text-base">{best ? best.name : "—"}</span></Stat>
      </div>
    </section>
  );
}
