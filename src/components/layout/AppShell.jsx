import { NavLink, Outlet } from "react-router-dom";
import { CalendarDays, ListChecks, LogOut } from "lucide-react";
import { signOut } from "../../services/auth";
import Cat from "../cats/Cat";

const LINKS = [
  { to: "/", label: "Tareas", icon: ListChecks, end: true },
  { to: "/cuentas-regresivas", label: "Cuenta regresiva", icon: CalendarDays },
];

export default function AppShell() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
      isActive ? "bg-ink text-white" : "text-muted hover:bg-surface hover:text-ink"
    }`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface/70">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <Cat size={36} variant="happy" />
            <span className="font-display text-xl font-semibold">Mi planner</span>
          </div>
          <nav aria-label="Secciones" className="order-last flex w-full gap-1 sm:order-none sm:w-auto sm:flex-1">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon size={16} aria-hidden="true" /> {label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={signOut}
            aria-label="Cerrar sesión"
            className="ml-auto flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-paper hover:text-ink sm:ml-0"
          >
            <LogOut size={16} aria-hidden="true" /> <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
