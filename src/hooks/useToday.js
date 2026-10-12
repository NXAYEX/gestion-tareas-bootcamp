import { useEffect, useState } from "react";
import { todayISO } from "../lib/dates";

// Devuelve la fecha de hoy y se actualiza sola al pasar la medianoche o al volver a la pestaña
export function useToday() {
  const [today, setToday] = useState(todayISO);

  useEffect(() => {
    const refresh = () => setToday(todayISO());
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const timer = setTimeout(refresh, nextMidnight - now);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [today]);

  return today;
}
