import { useEffect, useState } from "react";
import { Pin, Presentation } from "lucide-react";
import Cat from "../components/cats/Cat";
import BoardView from "../components/boards/BoardView";

const TABS = [
  { id: "cork", label: "Corcho", icon: Pin, hint: "Pincha fotos, notas y gatitos como en la pared de tu cuarto." },
  { id: "white", label: "Pizarra blanca", icon: Presentation, hint: "Dibuja, escribe y pega post-its, como la pizarra de clases." },
];

export default function BoardsPage() {
  const [tab, setTab] = useState("cork");

  useEffect(() => {
    document.title = "Pizarras · Mi planner";
  }, []);

  const current = TABS.find((t) => t.id === tab);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <Cat variant="wink" color="#B3D4F2" size={56} />
        <div className="min-w-0 flex-1 basis-60">
          <h1 className="font-display text-3xl font-semibold">Pizarras</h1>
          <p className="text-muted">{current.hint}</p>
        </div>
        <div role="tablist" aria-label="Elegir pizarra" className="flex rounded-full bg-surface p-1 shadow-soft">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls="board-panel"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${tab === id ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      </header>
      <div role="tabpanel" id="board-panel" aria-labelledby={`tab-${tab}`}>
        <BoardView key={tab} kind={tab} />
      </div>
    </main>
  );
}
