import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { isConfigured } from "./lib/supabase";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import CountdownPage from "./pages/CountdownPage";
import HabitsPage from "./pages/HabitsPage";
import JournalPage from "./pages/JournalPage";

export default function App() {
  const { session } = useAuth();

  if (!isConfigured) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="font-display text-2xl font-semibold">Falta conectar Supabase</h1>
        <p className="mt-2 text-muted">
          Completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env.local y reinicia el servidor con npm run dev.
        </p>
        <ul className="mt-4 text-sm">
          <li>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? "cargada" : "falta"}</li>
          <li>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "cargada" : "falta"}</li>
        </ul>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<TasksPage />} />
        <Route path="/habitos" element={<HabitsPage />} />
        <Route path="/cuentas-regresivas" element={<CountdownPage />} />
        <Route path="/diario" element={<JournalPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
