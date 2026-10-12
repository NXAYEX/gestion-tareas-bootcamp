import { addDays, daysBetween } from "./dates.js";

export const EVENT_TYPES = [
  { id: "certamen", label: "Certamen" },
  { id: "examen", label: "Examen" },
  { id: "tarea", label: "Tarea" },
  { id: "entrega", label: "Entrega" },
  { id: "proyecto", label: "Proyecto" },
  { id: "presentacion", label: "Presentación" },
  { id: "practica", label: "Práctica" },
  { id: "otro", label: "Otro" },
];

export const PRIORITIES = [
  { id: "low", label: "Baja" },
  { id: "medium", label: "Media" },
  { id: "high", label: "Alta" },
];

export const STATUSES = [
  { id: "pending", label: "Pendiente" },
  { id: "completed", label: "Completado" },
  { id: "cancelled", label: "Cancelado" },
];

export const typeLabel = (id) => EVENT_TYPES.find((t) => t.id === id)?.label ?? "Otro";
export const priorityLabel = (id) => PRIORITIES.find((p) => p.id === id)?.label ?? "Media";

// Pendiente con fecha anterior a hoy. No es lo mismo que completado.
export const isOverdue = (event, today) => event.status === "pending" && event.event_date < today;

// Días que faltan para el evento (negativo si ya pasó). Nunca se guarda: se calcula con la fecha de hoy.
export const daysLeft = (event, today) => daysBetween(today, event.event_date);

export function countdownText(event, today) {
  if (event.status === "completed") return "Completado";
  if (event.status === "cancelled") return "Cancelado";
  const n = daysLeft(event, today);
  if (n === 0) return "¡Es hoy!";
  if (n === 1) return "Falta 1 día";
  if (n > 1) return `Faltan ${n} días`;
  return n === -1 ? "Venció ayer" : `Venció hace ${-n} días`;
}

/*
 * Etiqueta de un evento para un día del calendario:
 *  - { kind: "count", n }  pendiente, desde hoy hasta el día anterior al evento (n >= 1)
 *  - { kind: "day" }       el día del evento (nunca muestra 0)
 *  - null                  cualquier otro día (antes de hoy, después del evento, completado/cancelado en días previos)
 */
export function labelForDay(event, dayISO, today) {
  if (dayISO === event.event_date) return { kind: "day" };
  if (event.status !== "pending" || dayISO < today || dayISO > event.event_date) return null;
  return { kind: "count", n: daysBetween(dayISO, event.event_date) };
}

// Eventos con etiqueta en un día, con la más cercana primero y el indicador del día del evento antes que los números
export function labelsForDay(events, dayISO, today) {
  return events
    .map((event) => ({ event, label: labelForDay(event, dayISO, today) }))
    .filter((x) => x.label)
    .sort((a, b) => {
      if (a.label.kind !== b.label.kind) return a.label.kind === "day" ? -1 : 1;
      return a.event.event_date.localeCompare(b.event.event_date) || a.event.title.localeCompare(b.event.title);
    });
}

export function describeLabel({ event, label }, today) {
  const typ = typeLabel(event.type);
  if (label.kind === "count") {
    return `${typ} ${event.title}: ${label.n === 1 ? "falta 1 día" : `faltan ${label.n} días`}`;
  }
  return `${typ} ${event.title}: ${countdownText(event, today).toLowerCase()}`;
}

// Filtros combinables. status: all | pending | overdue | completed | cancelled
export function applyFilters(events, f, today) {
  const q = f.query.trim().toLowerCase();
  return events.filter(
    (e) =>
      (!f.eventId || e.id === f.eventId) &&
      (!f.type || e.type === f.type) &&
      (!f.subject || e.subject === f.subject) &&
      (!f.priority || e.priority === f.priority) &&
      (f.status === "all" ||
        (f.status === "overdue" ? isOverdue(e, today) : e.status === f.status)) &&
      (!q || e.title.toLowerCase().includes(q))
  );
}

export const EMPTY_FILTERS = { eventId: "", type: "", subject: "", priority: "", status: "all", query: "" };

// Pendientes ordenados por proximidad (los vencidos primero porque son los más urgentes)
export const sortPending = (events) =>
  events
    .filter((e) => e.status === "pending")
    .sort((a, b) => a.event_date.localeCompare(b.event_date) || a.title.localeCompare(b.title));

export const nextEvent = (events, today) => sortPending(events).find((e) => e.event_date >= today) ?? null;

export const upcomingWeek = (events, today) =>
  sortPending(events).filter((e) => e.event_date >= today && e.event_date <= addDays(today, 6));

// Urgente: vencido, vence en 0–3 días, o prioridad alta dentro de 7 días
export const urgentEvents = (events, today) =>
  sortPending(events).filter((e) => {
    const n = daysLeft(e, today);
    return n <= 3 || (e.priority === "high" && n <= 7);
  });
