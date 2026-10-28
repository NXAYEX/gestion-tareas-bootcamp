import Cat from "../cats/Cat";

const fmt = (n) => n.toLocaleString("es");

export default function LifeStats({ stats, years, hasAge }) {
  if (!hasAge) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-surface p-5 text-muted shadow-soft">
        <Cat variant="sleepy" color="#CFC2F0" size={56} />
        <p>Escribe tu edad o tu fecha de nacimiento y verás pintarse cada semana que ya viviste.</p>
      </div>
    );
  }

  return (
    <section aria-label="Resumen" className="rounded-2xl bg-surface p-5 shadow-soft">
      <p className="font-display text-2xl font-semibold">{fmt(stats.lived)} semanas vividas</p>
      <div
        role="progressbar"
        aria-label="Porcentaje de vida contado"
        aria-valuenow={Math.round(stats.pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-3 overflow-hidden rounded-full bg-paper"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, stats.pct)}%` }} />
      </div>
      <p className="mt-2 text-muted">
        {stats.pct.toLocaleString("es")} % de {years} años.{" "}
        {stats.beyond ? "Superaste la edad elegida: cuenta hasta una mayor si quieres seguir viendo lo que viene." : `Quedan ${fmt(stats.left)} semanas por vivir.`}
      </p>
      {stats.current >= 0 && (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <span className="inline-block h-3 w-3 rounded-full bg-pink ring-2 ring-ink" aria-hidden="true" /> Esta es tu semana actual.
        </p>
      )}
    </section>
  );
}
