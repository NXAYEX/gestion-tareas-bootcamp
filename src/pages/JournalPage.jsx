import { useEffect, useState } from "react";
import { useJournal } from "../hooks/useJournal";
import { useToday } from "../hooks/useToday";
import Cat from "../components/cats/Cat";
import Cloud from "../components/cottage/Cloud";
import Daisy from "../components/cottage/Daisy";
import Sprig from "../components/cottage/Sprig";
import SaveStatus from "../components/habits/SaveStatus";
import DayNav from "../components/journal/DayNav";
import EntryList from "../components/journal/EntryList";
import Notebook from "../components/journal/Notebook";

export default function JournalPage() {
  const today = useToday();
  const [date, setDate] = useState(today);
  const j = useJournal(date);

  useEffect(() => {
    document.title = "Diario · Mi planner";
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="relative mb-6 overflow-hidden rounded-3xl bg-sage/30 p-5 sm:p-6">
        <Cloud size={96} className="pointer-events-none absolute -top-1 right-6 hidden opacity-90 sm:block" />
        <Cloud size={64} face={false} className="pointer-events-none absolute right-40 top-8 hidden opacity-80 md:block" />
        <Sprig size={46} className="pointer-events-none absolute -bottom-3 right-2 hidden sm:block" />
        <div className="relative flex flex-wrap items-center gap-4">
          <Cat variant="love" color="#F4B6CC" size={64} />
          <div className="min-w-0 flex-1 basis-72">
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Diario</h1>
            <p className="mt-1 max-w-2xl font-hand text-hand text-ink">
              ¿Y si escribir cada día fuera una forma de cuidar nuestra mente? De entendernos a nosotr@s mism@s.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-4">
            <div className="flex-1">
              <DayNav date={date} today={today} onChange={setDate} />
            </div>
            <div className="mb-3 min-h-5">
              <SaveStatus status={j.status} onRetry={j.retry} />
            </div>
          </div>

          {j.loading ? (
            <div className="h-[560px] animate-pulse rounded-3xl bg-surface shadow-soft" role="status" aria-label="Abriendo la página" />
          ) : j.error ? (
            <div role="alert" className="rounded-2xl bg-surface p-6 shadow-soft">
              <p className="text-urgent">{j.error}</p>
              <button onClick={j.reload} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">
                Reintentar
              </button>
            </div>
          ) : (
            <Notebook date={date} draft={j.draft} photo={j.photo} onChange={j.change} onFile={j.setPhotoFile} onRemove={j.removePhoto} />
          )}

          <div aria-hidden="true" className="pointer-events-none mt-3 flex justify-around">
            <Daisy size={28} />
            <Daisy size={22} petal="#F4B6CC" />
            <Daisy size={30} />
            <Daisy size={22} petal="#CFC2F0" />
            <Daisy size={26} />
          </div>
        </div>
        <aside>
          <EntryList entries={j.entries} current={date} onSelect={setDate} />
        </aside>
      </div>
    </main>
  );
}
