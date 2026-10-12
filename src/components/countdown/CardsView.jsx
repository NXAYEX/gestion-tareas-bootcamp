import { nextEvent, sortPending } from "../../lib/countdown";
import EventCard from "./EventCard";
import NextEventHero from "./NextEventHero";
import UpcomingPanel from "./UpcomingPanel";

export default function CardsView({ events, today, handlers, onClearFilters }) {
  const pending = sortPending(events);
  const closed = events.filter((e) => e.status !== "pending").sort((a, b) => b.event_date.localeCompare(a.event_date));

  return (
    <div className="space-y-5">
      <NextEventHero event={nextEvent(events, today)} today={today} />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          {events.length === 0 && (
            <p className="rounded-2xl bg-surface p-5 text-muted shadow-soft">
              Ningún evento coincide con los filtros.{" "}
              <button onClick={onClearFilters} className="font-semibold text-accent underline underline-offset-4">
                Quitar filtros
              </button>
            </p>
          )}
          {pending.length > 0 && (
            <ul aria-label="Eventos pendientes" className="space-y-3">
              {pending.map((e) => <EventCard key={e.id} event={e} today={today} handlers={handlers} />)}
            </ul>
          )}
          {closed.length > 0 && (
            <details className="mt-5">
              <summary className="cursor-pointer rounded-xl px-2 py-2 font-semibold text-muted hover:text-ink">
                Completados y cancelados ({closed.length})
              </summary>
              <ul className="mt-2 space-y-3">
                {closed.map((e) => <EventCard key={e.id} event={e} today={today} handlers={handlers} />)}
              </ul>
            </details>
          )}
        </div>
        <aside aria-label="Resumen">
          <UpcomingPanel events={events} today={today} />
        </aside>
      </div>
    </div>
  );
}
