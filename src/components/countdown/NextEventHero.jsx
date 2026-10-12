import { daysLeft, countdownText, typeLabel } from "../../lib/countdown";
import { formatLong } from "../../lib/dates";
import Cat from "../cats/Cat";
import CountdownBadge from "./CountdownBadge";

export default function NextEventHero({ event, today }) {
  if (!event) {
    return (
      <section className="flex items-center gap-4 rounded-3xl bg-surface p-5 shadow-soft">
        <Cat variant="sleepy" color="#CFC2F0" size={72} />
        <div>
          <h2 className="font-display text-xl font-semibold">Nada a la vista</h2>
          <p className="text-muted">No tienes eventos próximos con estos filtros. Respira, gatito.</p>
        </div>
      </section>
    );
  }
  const n = daysLeft(event, today);
  const mood = n === 0 ? "cheer" : n <= 3 ? "curious" : "happy";

  return (
    <section aria-label="Próximo evento" className="flex flex-wrap items-center gap-5 rounded-3xl bg-surface p-5 shadow-soft">
      <CountdownBadge event={event} today={today} size="lg" />
      <div className="min-w-0 flex-1 basis-56">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Próximo evento</p>
        <h2 className="font-display text-2xl font-semibold break-words">{event.title}</h2>
        <p className="mt-1 text-muted">
          {typeLabel(event.type)}
          {event.subject ? ` · ${event.subject}` : ""} · {formatLong(event.event_date)}
        </p>
        <p className="mt-1 text-xl font-semibold">{countdownText(event, today)}</p>
      </div>
      <Cat variant={mood} color={event.color} size={72} className="hidden sm:block" />
    </section>
  );
}
