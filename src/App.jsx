import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <p className="p-8 text-muted" role="status">
        Cargando…
      </p>
    );
  }
  return session ? <TasksPage /> : <LoginPage />;
}
