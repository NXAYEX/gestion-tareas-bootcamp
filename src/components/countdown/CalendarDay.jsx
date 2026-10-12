import { describeLabel } from "../../lib/countdown";
import { formatLong } from "../../lib/dates";
import CountdownChip from "./CountdownChip";

export default function CalendarDay({ cell, items, today, selected, maxChips, onSelect }) {
  const overflow = items.length > maxChips;
  const visible = overflow ? items.slice(0, maxChips - 1) : items;
  const hidden = items.length - visible.length;
  const isToday = cell.iso === today;

  const name = [formatLong(cell.iso), ...items.map((i) => describeLabel(i, today))].join(". ");

  return (
    <button
      onClick={() => onSelect(cell.iso)}
      aria-label={name}
      aria-pressed={selected}
      className={`flex min-h-[76px] flex-col items-start gap-1 p-1 text-left sm:min-h-[108px] sm:p-2 ${
        cell.inMonth ? "bg-surface" : "bg-paper"
      } ${selected ? "relative z-10 ring-2 ring-inset ring-accent" : "hover:bg-paper"}`}
    >
      <span
        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-sm font-semibold ${
          isToday ? "bg-ink text-white" : cell.inMonth ? "text-ink" : "text-muted"
        }`}
      >
        {cell.day}
      </span>
      <span className="flex flex-wrap gap-1">
        {visible.map((i) => (
          <CountdownChip key={i.event.id} item={i} title={describeLabel(i, today)} />
        ))}
        {hidden > 0 && (
          <span aria-hidden="true" className="inline-flex h-5 items-center px-0.5 text-xs font-bold text-muted sm:h-6">
            +{hidden}
          </span>
        )}
      </span>
    </button>
  );
}
