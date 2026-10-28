import { formatDue, formatMonth } from "../../lib/dates";
import { groupByMonth, moodLabel } from "../../lib/journal";
import Cat from "../cats/Cat";

export default function EntryList({ entries, current, onSelect }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-surface p-4 shadow-soft">
        <h2 className="font-display text-xl font-semibold">Mis páginas</h2>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted">
          <Cat variant="sleepy" color="#CFC2F0" size={48} />
          <p>Aún no has escrito ninguna. Tu primera página aparecerá aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <nav aria-label="Mis páginas" className="max-h-[70vh] overflow-y-auto rounded-2xl bg-surface p-4 shadow-soft">
      <h2 className="font-display text-xl font-semibold">Mis páginas</h2>
      {groupByMonth(entries).map(({ key, entries: list }) => {
        const [y, m] = key.split("-").map(Number);
        return (
          <section key={key} className="mt-3">
            <h3 className="text-sm font-semibold text-muted">{formatMonth({ y, m })}</h3>
            <ul className="mt-1">
              {list.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => onSelect(e.entry_date)}
                    aria-current={e.entry_date === current ? "page" : undefined}
                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-paper ${e.entry_date === current ? "bg-paper ring-1 ring-line" : ""}`}
                  >
                    <Cat variant={e.mood ?? "sleepy"} color="#F6CBA6" size={28} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{e.title || "Sin título"}</span>
                      <span className="block text-sm text-muted">
                        {formatDue(e.entry_date)}
                        {e.mood ? ` · ${moodLabel(e.mood)}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
