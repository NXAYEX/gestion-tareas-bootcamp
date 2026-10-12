import { useEffect, useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import { addDays, addMonths, formatMonth, parseISO, toISO, weekStartOf } from "../lib/dates";
import { useHabits } from "../hooks/useHabits";
import { useHabitLogs } from "../hooks/useHabitLogs";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useToday } from "../hooks/useToday";
import Cat from "../components/cats/Cat";
import Modal from "../components/layout/Modal";
import HabitForm from "../components/habits/HabitForm";
import HabitGrid from "../components/habits/HabitGrid";
import HabitManager from "../components/habits/HabitManager";
import HabitSummary from "../components/habits/HabitSummary";
import HabitWeekView from "../components/habits/HabitWeekView";
import PeriodNav from "../components/habits/PeriodNav";
import SaveStatus from "../components/habits/SaveStatus";

const monthKey = ({ y, m }) => y * 12 + m;

export default function HabitsPage() {
  const today = useToday();
  const wide = useMediaQuery("(min-width: 768px)");
  const [month, setMonth] = useState(() => ({ y: parseISO(today).y, m: parseISO(today).m }));
  const [weekStart, setWeekStart] = useState(() => weekStartOf(today));
  const [panel, setPanel] = useState(null); // { mode: "manage" } | { mode: "form", habit? }

  const hb = useHabits();
  const logs = useHabitLogs(today, wide ? toISO(month.y, month.m, 1) : weekStart);
  const active = hb.habits.filter((h) => !h.is_archived);
  const thisMonth = { y: parseISO(today).y, m: parseISO(today).m };

  useEffect(() => {
    document.title = "Hábitos · Mi planner";
  }, []);

  const saveHabit = async (payload) => {
    const err = panel.habit ? await hb.edit(panel.habit.id, payload) : await hb.add(payload);
    if (!err) setPanel({ mode: "manage" });
    return err;
  };

  const loading = hb.loading || logs.loading;
  const error = hb.error || logs.error;
  const summaryMonth = wide ? month : { y: parseISO(weekStart).y, m: parseISO(weekStart).m };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <Cat variant="love" color="#F4B6CC" size={56} />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold">Hábitos</h1>
          <SaveStatus status={logs.status} onRetry={logs.retry} />
          {logs.status === "idle" && <p className="text-muted">Marca cada día que cumplas un hábito.</p>}
        </div>
        <button onClick={() => setPanel({ mode: "manage" })} className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-paper">
          <Settings2 size={16} aria-hidden="true" /> Administrar hábitos
        </button>
        <button onClick={() => setPanel({ mode: "form" })} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-dark">
          <Plus size={18} aria-hidden="true" /> Nuevo hábito
        </button>
      </header>

      {loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-surface shadow-soft" role="status" aria-label="Cargando hábitos" />
      ) : error ? (
        <div role="alert" className="rounded-2xl bg-surface p-6 shadow-soft">
          <p className="text-urgent">{error}</p>
          <button onClick={() => { hb.reload(); logs.reload(); }} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">Reintentar</button>
        </div>
      ) : active.length === 0 ? (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface p-6 shadow-soft">
          <Cat variant="sleepy" color="#CFC2F0" size={80} />
          <div className="flex-1 basis-64">
            <p className="font-display text-xl font-semibold">{hb.habits.length ? "Todos tus hábitos están archivados" : "Aún no tienes hábitos"}</p>
            <p className="text-muted">Crea uno propio o parte con algunos de ejemplo. Después puedes cambiarlos o borrarlos.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPanel({ mode: "form" })} className="rounded-full bg-accent px-5 py-2 font-semibold text-white hover:bg-accent-dark">Crear mi primer hábito</button>
            {hb.habits.length === 0 && (
              <button onClick={hb.addExamples} className="rounded-full border border-line px-5 py-2 font-semibold hover:bg-paper">Agregar hábitos de ejemplo</button>
            )}
          </div>
        </div>
      ) : (
        <>
          <HabitSummary habits={active} byHabit={logs.byHabit} month={summaryMonth} today={today} />
          {wide ? (
            <>
              <PeriodNav
                label={formatMonth(month)} unit="Mes"
                onPrev={() => setMonth(addMonths(month, -1))} onNext={() => setMonth(addMonths(month, 1))}
                nextDisabled={monthKey(month) >= monthKey(thisMonth)} onToday={() => setMonth(thisMonth)}
              />
              <HabitGrid habits={active} byHabit={logs.byHabit} month={month} today={today} onToggle={logs.toggle} />
            </>
          ) : (
            <>
              <PeriodNav
                label={`${parseISO(weekStart).d} ${formatMonth(summaryMonth).split(" ")[0].toLowerCase()} – ${parseISO(addDays(weekStart, 6)).d}`} unit="Semana"
                onPrev={() => setWeekStart(addDays(weekStart, -7))} onNext={() => setWeekStart(addDays(weekStart, 7))}
                nextDisabled={addDays(weekStart, 7) > today} onToday={() => setWeekStart(weekStartOf(today))}
              />
              <HabitWeekView habits={active} byHabit={logs.byHabit} weekStart={weekStart} today={today} onToggle={logs.toggle} />
            </>
          )}
        </>
      )}

      {panel && (
        <Modal title={panel.mode === "form" ? (panel.habit ? "Editar hábito" : "Nuevo hábito") : "Administrar hábitos"} onClose={() => setPanel(null)}>
          {panel.mode === "form" ? (
            <HabitForm habit={panel.habit} onSubmit={saveHabit} onCancel={() => setPanel({ mode: "manage" })} />
          ) : (
            <HabitManager
              habits={hb.habits}
              onNew={() => setPanel({ mode: "form" })}
              onEdit={(habit) => setPanel({ mode: "form", habit })}
              onMove={hb.move}
              onArchive={hb.setArchived}
              onDelete={hb.remove}
              onExamples={hb.addExamples}
            />
          )}
        </Modal>
      )}
    </main>
  );
}
