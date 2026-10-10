import { useAuth } from "./context/AuthContext";
import { isConfigured } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";

export default function App() {
  const { session, loading } = useAuth();

  if (!isConfigured) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="font-display text-2xl font-bold">Falta conectar Supabase</h1>
        <p className="mt-2 text-muted">
          Completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env.local y reinicia el servidor con npm run dev.
        </p>
      </main>
    );
  }
  if (loading) {
    return (
      <p className="p-8 text-muted" role="status">
        Cargando…
      </p>
    );
  }
  return session ? <TasksPage /> : <LoginPage />;
}
