import { useEffect } from "react";
import { useLifeSettings } from "../hooks/useLifeSettings";
import { useToday } from "../hooks/useToday";
import { lifeStats, livedWeeks } from "../lib/life";
import SaveStatus from "../components/habits/SaveStatus";
import CatClock from "../components/life/CatClock";
import LifeControls from "../components/life/LifeControls";
import LifeGrid from "../components/life/LifeGrid";
import LifeStats from "../components/life/LifeStats";

export default function LifePage() {
  const today = useToday();
  const life = useLifeSettings();
  const { settings } = life;

  useEffect(() => {
    document.title = "Vida en semanas · Mi planner";
  }, []);

  const lived = livedWeeks(settings, today);
  const stats = lifeStats(lived?.total ?? null, settings.life_expectancy);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center gap-5 rounded-3xl bg-surface p-5 shadow-soft sm:p-6">
        <div className="min-w-0 flex-1 basis-72">
          <h1 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
            Tu vida entera puede caber en una sola pantalla.
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted">
            Vive bien y haz lo que desees: nuestro tiempo es nuestro mayor tesoro. Como dijo Séneca,{" "}
            <em className="font-semibold text-ink">«No tenemos poco tiempo, sino que perdemos mucho»</em>.
          </p>
        </div>
        <CatClock size={150} className="shrink-0" />
      </header>

      {life.loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-surface shadow-soft" role="status" aria-label="Cargando tus datos" />
      ) : life.error ? (
        <div role="alert" className="rounded-2xl bg-surface p-6 shadow-soft">
          <p className="text-urgent">{life.error}</p>
          <button onClick={life.reload} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">Reintentar</button>
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <LifeControls settings={settings} today={today} onChange={life.change} />
            <LifeStats stats={stats} years={settings.life_expectancy} hasAge={!!lived} />
            <div className="min-h-5"><SaveStatus status={life.status} onRetry={life.retry} /></div>
          </div>
          <section aria-label="Tu vida en semanas" className="rounded-2xl bg-surface p-4 shadow-soft sm:p-6">
            <h2 className="font-display text-xl font-semibold">Una vida de {settings.life_expectancy} años</h2>
            <p className="mb-3 text-sm text-muted">Una fila = un año · un círculo = una semana</p>
            <div className="mx-auto max-w-[760px]">
              <LifeGrid rows={settings.life_expectancy} total={lived?.total ?? null} current={stats.current} settings={settings} />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
