import { CalendarDays, ChevronsUp, Minus, ChevronDown } from "lucide-react";
import { countdownText, isOverdue, priorityLabel, typeLabel } from "../../lib/countdown";
import { formatLong } from "../../lib/dates";
import CountdownBadge from "./CountdownBadge";
import EventActions from "./EventActions";

const PRIORITY_ICON = { high: ChevronsUp, medium: Minus, low: ChevronDown };

export default function EventCard({ event, today, handlers }) {
  const overdue = isOverdue(event, today);
  const PIcon = PRIORITY_ICON[event.priority] ?? Minus;
  const done = event.status !== "pending";

  return (
    <li className={`rounded-2xl bg-surface p-4 shadow-soft ${done ? "opacity-80" : ""}`}>
      <div className="flex gap-4">
        <CountdownBadge event={event} today={today} />
        <div className="min-w-0 flex-1">
          <p className={`font-display text-xl font-semibold break-words ${event.status === "cancelled" ? "line-through" : ""}`}>
            {event.title}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {typeLabel(event.type)}
            {event.subject ? ` · ${event.subject}` : ""}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <CalendarDays size={14} aria-hidden="true" /> {formatLong(event.event_date)}
          </p>
          <p className={`mt-1 text-sm font-semibold ${overdue ? "text-urgent" : "text-ink"}`}>{countdownText(event, today)}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <PIcon size={14} aria-hidden="true" /> Prioridad {priorityLabel(event.priority).toLowerCase()}
          </p>
          {event.description && <p className="mt-2 break-words text-sm text-muted">{event.description}</p>}
        </div>
      </div>
      <div className="mt-3 border-t border-line pt-2">
        <EventActions event={event} {...handlers} />
      </div>
    </li>
  );
}
