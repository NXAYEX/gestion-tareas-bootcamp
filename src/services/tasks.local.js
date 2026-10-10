// Almacenamiento local en el navegador (localStorage). Misma interfaz { data, error }
// que tasks.supabase.js, para poder cambiar de backend tocando solo este archivo.
const KEY = "gestion.tasks";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

const write = (tasks) => localStorage.setItem(KEY, JSON.stringify(tasks));

// Mismo orden que la consulta de Supabase: pendientes primero, luego por fecha límite, luego más nuevas
const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    if (a.is_done !== b.is_done) return a.is_done ? 1 : -1;
    if (a.due_date !== b.due_date) {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date < b.due_date ? -1 : 1;
    }
    return a.created_at < b.created_at ? 1 : -1;
  });

// Envuelve una operación para devolver siempre { data, error } (por ejemplo si el almacenamiento está lleno)
const attempt = async (fn) => {
  try {
    return { data: fn(), error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const listTasks = () => attempt(() => sortTasks(read()));

export const createTask = (task) =>
  attempt(() => {
    const created = {
      description: null,
      is_done: false,
      ...task,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    write([...read(), created]);
    return created;
  });

export const updateTask = (id, changes) =>
  attempt(() => {
    const tasks = read().map((t) => (t.id === id ? { ...t, ...changes } : t));
    write(tasks);
    return tasks.find((t) => t.id === id);
  });

export const deleteTask = (id) =>
  attempt(() => {
    write(read().filter((t) => t.id !== id));
    return null;
  });
