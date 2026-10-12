import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <p className="p-8 text-muted" role="status">
        Cargando…
      </p>
    );
  }
  return session ? children : <Navigate to="/login" replace />;
}
