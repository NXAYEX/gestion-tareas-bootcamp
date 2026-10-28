import { MOODS } from "../../lib/journal";
import Cat from "../cats/Cat";

export default function MoodPicker({ value, onChange }) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-muted">¿Cómo te sentiste hoy?</p>
      <div role="radiogroup" aria-label="Ánimo del día" className="flex flex-wrap gap-1">
        {MOODS.map((m) => {
          const on = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={m.label}
              title={m.label}
              onClick={() => onChange(on ? null : m.id)}
              className={`rounded-xl p-0.5 ${on ? "bg-surface ring-2 ring-ink" : "opacity-70 hover:bg-surface hover:opacity-100"}`}
            >
              <Cat variant={m.id} color="#F6CBA6" size={38} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
