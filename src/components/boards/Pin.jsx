const PIN_COLORS = ["#B5433A", "#3F6FB5", "#4F8A5B", "#D9A441"];

// Sujeción del objeto: chincheta en el corcho, cinta washi en la pizarra blanca. Decorativa.
export default function Pin({ kind, id }) {
  if (kind === "white") {
    return <span aria-hidden="true" className="pointer-events-none absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 bg-pink/80" />;
  }
  const color = PIN_COLORS[id.charCodeAt(0) % PIN_COLORS.length];
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full ring-1 ring-ink/40"
      style={{ background: `radial-gradient(circle at 35% 30%, #ffffffaa 0 12%, ${color} 40%)`, boxShadow: "1px 3px 3px rgba(43,38,48,.35)" }}
    />
  );
}
