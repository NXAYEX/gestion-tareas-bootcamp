import { Plus } from "lucide-react";
import { countdownText, typeLabel } from "../../lib/countdown";
import { formatDue, formatLong } from "../../lib/dates";
import Cat from "../cats/Cat";
import EventActions from "./EventActions";

// Eventos con etiqueta en el día seleccionado, con sus contadores
export default function DayPanel({ iso, items, today, handlers, onCreate }) {
  return (
    <section aria-label="Eventos del día" className="mt-4 rounded-2xl bg-surface p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl font-semibold">{formatLong(iso)}</h3>
        <button
          onClick={() => onCreate(iso)}
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus size={16} aria-hidden="true" /> Agregar evento este día
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-3 flex items-center gap-3 text-muted">
          <Cat variant="curious" color="#B3D4F2" size={52} />
          <p>No hay eventos ni cuentas regresivas para este día.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {items.map(({ event, label }) => (
            <li key={event.id} className="py-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-4 w-4 shrink-0 rounded-md ring-1 ring-ink/20" style={{ backgroundColor: event.color }} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold break-words">{event.title}</p>
                  <p className="text-sm text-muted">
                    {typeLabel(event.type)}
                    {event.subject ? ` · ${event.subject}` : ""}
                  </p>
                  <p className="text-sm font-semibold">
                    {label.kind === "count"
                      ? `${label.n === 1 ? "Falta 1 día" : `Faltan ${label.n} días`} para el ${formatDue(event.event_date)}`
                      : countdownText(event, today)}
                  </p>
                  {event.description && <p className="mt-1 break-words text-sm text-muted">{event.description}</p>}
                </div>
              </div>
              <div className="mt-2 pl-7">
                <EventActions event={event} {...handlers} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
