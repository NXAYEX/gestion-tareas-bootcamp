import TaskRow from "./TaskRow";
import Cat from "./cats/Cat";

const box = "mt-4 rounded-2xl bg-surface px-4 shadow-soft";

export default function TaskList({ tasks, total, loading, error, onRetry, onToggle, onEdit, onDelete }) {
  if (loading) {
    return (
      <ul className={`${box} animate-pulse`} aria-label="Cargando tareas">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-14 border-b border-line last:border-0" />
        ))}
      </ul>
    );
  }
  if (error) {
    return (
      <div role="alert" className={`${box} py-8`}>
        <p className="text-urgent">{error}</p>
        <button onClick={onRetry} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">
          Reintentar
        </button>
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className={`${box} flex items-center gap-4 py-8`}>
        <Cat variant="sleepy" color="#CFC2F0" size={64} />
        <p className="text-muted">
          {total === 0 ? "Aún no tienes tareas. Escribe la primera arriba." : "Ninguna tarea coincide con este filtro."}
        </p>
      </div>
    );
  }
  return (
    <ul className={box}>
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
