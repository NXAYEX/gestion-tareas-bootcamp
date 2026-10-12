import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LayoutList, Plus } from "lucide-react";
import { applyFilters, EMPTY_FILTERS, labelsForDay } from "../lib/countdown";
import { parseISO } from "../lib/dates";
import { useEvents } from "../hooks/useEvents";
import { useToday } from "../hooks/useToday";
import Cat from "../components/cats/Cat";
import Modal from "../components/layout/Modal";
import CalendarMonth from "../components/countdown/CalendarMonth";
import CardsView from "../components/countdown/CardsView";
import DayPanel from "../components/countdown/DayPanel";
import EventFilters from "../components/countdown/EventFilters";
import EventForm from "../components/countdown/EventForm";

const VIEWS = [
  { id: "calendar", label: "Calendario", icon: CalendarDays },
  { id: "cards", label: "Tarjetas", icon: LayoutList },
];

export default function CountdownPage() {
  const { events, loading, error, reload, add, edit, setStatus, remove } = useEvents();
  const today = useToday();
  const [view, setView] = useState("calendar");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [month, setMonth] = useState(() => ({ y: parseISO(today).y, m: parseISO(today).m }));
  const [selected, setSelected] = useState(today);
  const [form, setForm] = useState(null); // { event } al editar, { date } al crear

  useEffect(() => {
    document.title = "Cuenta regresiva · Mi planner";
  }, []);

  const filtered = useMemo(() => applyFilters(events, filters, today), [events, filters, today]);
  const subjects = useMemo(() => [...new Set(events.map((e) => e.subject).filter(Boolean))].sort(), [events]);
  const handlers = { onEdit: (event) => setForm({ event }), onStatus: setStatus, onDelete: remove };

  const save = async (payload) => {
    const err = form.event ? await edit(form.event.id, payload) : await add(payload);
    if (!err) setForm(null);
    return err;
  };

  const pendingCount = events.filter((e) => e.status === "pending").length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <Cat variant="curious" color="#B3D4F2" size={56} />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-semibold">Cuenta regresiva</h1>
          <p className="text-muted">{loading ? "Cargando…" : `${pendingCount} ${pendingCount === 1 ? "evento pendiente" : "eventos pendientes"}`}</p>
        </div>
        <div role="group" aria-label="Cambiar vista" className="flex rounded-full bg-surface p-1 shadow-soft">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${view === id ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setForm({ date: selected })}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-dark"
        >
          <Plus size={18} aria-hidden="true" /> Nuevo evento
        </button>
      </header>

      {loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-surface shadow-soft" role="status" aria-label="Cargando eventos" />
      ) : error ? (
        <div role="alert" className="rounded-2xl bg-surface p-6 shadow-soft">
          <p className="text-urgent">{error}</p>
          <button onClick={reload} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">Reintentar</button>
        </div>
      ) : (
        <>
          {events.length === 0 && (
            <div className="mb-5 flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft">
              <Cat variant="happy" color="#F4B6CC" size={72} />
              <p className="text-muted">
                Aún no tienes eventos. Crea tu primer certamen o entrega y verás en cada día del calendario cuántos días faltan.
              </p>
            </div>
          )}
          <EventFilters filters={filters} onChange={setFilters} events={events} subjects={subjects} />
          {view === "calendar" ? (
            <>
              <CalendarMonth events={filtered} today={today} month={month} onMonthChange={setMonth} selected={selected} onSelect={setSelected} />
              <DayPanel iso={selected} items={labelsForDay(filtered, selected, today)} today={today} handlers={handlers} onCreate={(date) => setForm({ date })} />
            </>
          ) : (
            <CardsView events={filtered} today={today} handlers={handlers} onClearFilters={() => setFilters(EMPTY_FILTERS)} />
          )}
        </>
      )}

      {form && (
        <Modal title={form.event ? "Editar evento" : "Nuevo evento"} onClose={() => setForm(null)}>
          <EventForm event={form.event} defaultDate={form.date} subjects={subjects} onSubmit={save} onCancel={() => setForm(null)} />
        </Modal>
      )}
    </main>
  );
}
