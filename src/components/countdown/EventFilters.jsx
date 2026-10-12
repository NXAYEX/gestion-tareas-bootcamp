import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { EMPTY_FILTERS, EVENT_TYPES, PRIORITIES } from "../../lib/countdown";

const STATUS_OPTIONS = [
  { id: "all", label: "Todos los estados" },
  { id: "pending", label: "Pendientes" },
  { id: "overdue", label: "Vencidos" },
  { id: "completed", label: "Completados" },
  { id: "cancelled", label: "Cancelados" },
];

const ctl = "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm hover:border-muted focus:border-accent";

function Select({ label, value, onChange, children }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className={ctl}>
      {children}
    </select>
  );
}

export default function EventFilters({ filters, onChange, events, subjects }) {
  // En móvil los selectores se pliegan para dejar sitio al calendario
  const [open, setOpen] = useState(false);
  const set = (key) => (value) => onChange({ ...filters, [key]: value });
  const activeCount = Object.keys(EMPTY_FILTERS).filter((k) => filters[k] !== EMPTY_FILTERS[k]).length;

  return (
    <section aria-label="Filtros" className="mb-5 rounded-2xl bg-surface p-3 shadow-soft">
      <div className="flex gap-2">
        <label className="relative block flex-1">
          <span className="sr-only">Buscar por nombre</span>
          <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set("query")(e.target.value)}
            placeholder="Buscar por nombre"
            className={`${ctl} pl-9`}
          />
        </label>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-semibold hover:bg-paper sm:hidden"
        >
          <SlidersHorizontal size={16} aria-hidden="true" /> Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>
      <div className={`${open ? "grid" : "hidden"} mt-2 grid-cols-2 gap-2 sm:grid lg:grid-cols-5`}>
        <Select label="Evento" value={filters.eventId} onChange={set("eventId")}>
          <option value="">Todos los eventos</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </Select>
        <Select label="Tipo" value={filters.type} onChange={set("type")}>
          <option value="">Todos los tipos</option>
          {EVENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </Select>
        <Select label="Asignatura" value={filters.subject} onChange={set("subject")}>
          <option value="">Todas las asignaturas</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Prioridad" value={filters.priority} onChange={set("priority")}>
          <option value="">Todas las prioridades</option>
          {PRIORITIES.map((p) => <option key={p.id} value={p.id}>Prioridad {p.label.toLowerCase()}</option>)}
        </Select>
        <Select label="Estado" value={filters.status} onChange={set("status")}>
          {STATUS_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </Select>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-accent hover:bg-paper lg:col-span-5"
          >
            <X size={14} aria-hidden="true" /> Quitar filtros
          </button>
        )}
      </div>
    </section>
  );
}
