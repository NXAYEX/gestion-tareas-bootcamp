import TaskRow from "./TaskRow";

export default function TaskList({ tasks, total, loading, error, onRetry, onToggle, onEdit, onDelete }) {
  if (loading) {
    return (
      <ul className="mt-4 animate-pulse border-t border-line" aria-label="Cargando tareas">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-14 border-b border-line" />
        ))}
      </ul>
    );
  }
  if (error) {
    return (
      <div role="alert" className="mt-4 border-t border-line py-8">
        <p className="text-urgent">{error}</p>
        <button onClick={onRetry} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">
          Reintentar
        </button>
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <p className="mt-4 border-t border-line py-8 text-muted">
        {total === 0 ? "Aún no tienes tareas. Escribe la primera arriba." : "Ninguna tarea coincide con este filtro."}
      </p>
    );
  }
  return (
    <ul className="mt-4 border-t border-line">
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
