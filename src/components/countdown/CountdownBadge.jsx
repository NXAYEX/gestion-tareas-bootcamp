import { Ban, Check, Flag } from "lucide-react";
import { daysLeft } from "../../lib/countdown";

// Bloque del contador: el elemento más visible de cada tarjeta. Usa el color del evento como fondo.
export default function CountdownBadge({ event, today, size = "md" }) {
  const n = daysLeft(event, today);
  const box = size === "lg" ? "h-28 w-28" : "h-[72px] w-[72px]";
  const big = size === "lg" ? "text-3xl" : "text-2xl";
  const small = size === "lg" ? "text-sm" : "text-xs";

  let body;
  if (event.status === "completed") {
    body = <><Check size={size === "lg" ? 30 : 24} aria-hidden="true" /><span className={small}>Hecho</span></>;
  } else if (event.status === "cancelled") {
    body = <><Ban size={size === "lg" ? 30 : 24} aria-hidden="true" /><span className={small}>Cancelado</span></>;
  } else if (n === 0) {
    body = <><Flag size={size === "lg" ? 30 : 24} aria-hidden="true" /><span className={`${small} font-bold`}>HOY</span></>;
  } else {
    body = (
      <>
        <span className={`font-display ${big} font-semibold leading-none`}>{Math.abs(n)}</span>
        <span className={small}>{n < 0 ? "de atraso" : n === 1 ? "día" : "días"}</span>
      </>
    );
  }

  return (
    <div
      className={`${box} flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-ink ${
        event.status === "pending" ? "" : "opacity-70"
      }`}
      style={{ backgroundColor: event.color }}
    >
      {body}
    </div>
  );
}
