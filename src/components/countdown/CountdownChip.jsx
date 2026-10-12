import { Ban, Check, Flag } from "lucide-react";

// Cuadradito del calendario: número de días que faltan, o indicador especial el día del evento.
// Es decorativo (aria-hidden): la información accesible va en el aria-label de la celda.
export default function CountdownChip({ item, title }) {
  const { event, label } = item;
  const base = "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-bold text-ink sm:h-6 sm:min-w-6";

  if (label.kind === "count") {
    return (
      <span aria-hidden="true" title={title} className={base} style={{ backgroundColor: event.color }}>
        {label.n}
      </span>
    );
  }

  const Icon = event.status === "completed" ? Check : event.status === "cancelled" ? Ban : Flag;
  const faded = event.status === "pending" ? "ring-2 ring-ink" : "opacity-60 ring-1 ring-ink/40";
  return (
    <span aria-hidden="true" title={title} className={`${base} ${faded}`} style={{ backgroundColor: event.color }}>
      <Icon size={13} strokeWidth={2.6} />
    </span>
  );
}
