import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "done", label: "Completadas" },
];

export default function TasksPage() {
  const { tasks, loading, error, reload, add, edit, toggle, remove } = useTasks();
  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Mis tareas";
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (filter === "all" || (filter === "done" ? t.is_done : !t.is_done)) &&
        (!q || `${t.title} ${t.description ?? ""}`.toLowerCase().includes(q))
    );
  }, [tasks, filter, query]);

  const pendingCount = tasks.filter((t) => !t.is_done).length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Mis tareas</h1>
          <p className="mt-1 text-muted">
            {loading ? "Cargando…" : pendingCount === 0 ? "Nada pendiente." : `${pendingCount} por hacer`}
          </p>
        </div>
      </header>

      <TaskForm onSubmit={add} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filtrar tareas" className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                filter === f.id ? "bg-ink text-white" : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="relative block">
          <span className="sr-only">Buscar tareas</span>
          <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tareas"
            className="w-full rounded-md border border-line bg-surface py-1.5 pl-9 pr-3 text-sm hover:border-muted focus:border-accent sm:w-56"
          />
        </label>
      </div>

      <TaskList
        tasks={visible}
        total={tasks.length}
        loading={loading}
        error={error}
        onRetry={reload}
        onToggle={toggle}
        onEdit={edit}
        onDelete={remove}
      />
    </main>
  );
}
