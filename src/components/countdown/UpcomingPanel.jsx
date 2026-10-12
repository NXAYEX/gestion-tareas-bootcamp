import { AlertCircle, CalendarClock } from "lucide-react";
import { countdownText, isOverdue, upcomingWeek, urgentEvents } from "../../lib/countdown";
import { formatDue } from "../../lib/dates";

function Row({ event, today }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <span className="h-4 w-4 shrink-0 rounded-md ring-1 ring-ink/20" style={{ backgroundColor: event.color }} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{event.title}</p>
        <p className={`text-sm ${isOverdue(event, today) ? "font-semibold text-urgent" : "text-muted"}`}>
          {countdownText(event, today)} · {formatDue(event.event_date)}
        </p>
      </div>
    </li>
  );
}

function Block({ icon: Icon, title, empty, events, today }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-soft">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
        <Icon size={18} aria-hidden="true" /> {title}
      </h3>
      {events.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-1 divide-y divide-line">
          {events.map((e) => <Row key={e.id} event={e} today={today} />)}
        </ul>
      )}
    </section>
  );
}

export default function UpcomingPanel({ events, today }) {
  return (
    <div className="space-y-4">
      <Block icon={AlertCircle} title="Urgentes" empty="Nada urgente por ahora." events={urgentEvents(events, today)} today={today} />
      <Block icon={CalendarClock} title="Próximos 7 días" empty="No hay eventos en la próxima semana." events={upcomingWeek(events, today)} today={today} />
    </div>
  );
}
