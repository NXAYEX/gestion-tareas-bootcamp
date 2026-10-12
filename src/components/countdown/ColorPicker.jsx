import { Check } from "lucide-react";
import { COLORS } from "../../lib/palette";

export default function ColorPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Color del evento" className="flex flex-wrap gap-2">
      {COLORS.map((c) => {
        const on = c.hex === value;
        return (
          <button
            type="button"
            key={c.id}
            role="radio"
            aria-checked={on}
            aria-label={c.name}
            title={c.name}
            onClick={() => onChange(c.hex)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-ink ring-offset-2 ${
              on ? "ring-2 ring-ink" : "ring-1 ring-ink/20 hover:ring-ink/50"
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {on && <Check size={16} strokeWidth={3} aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
