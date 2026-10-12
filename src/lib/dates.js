// Todas las fechas son texto "YYYY-MM-DD" (fecha de calendario, sin hora ni zona horaria).
const pad = (n) => String(n).padStart(2, "0");

export const toISO = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

export function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

// Fecha local de hoy (la del reloj del usuario) en formato YYYY-MM-DD
export function todayISO() {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

// Días de calendario entre dos fechas. Ambas se pasan a UTC a medianoche, así un cambio de horario no altera el resultado.
export function daysBetween(fromISO, toISOStr) {
  const a = parseISO(fromISO);
  const b = parseISO(toISOStr);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86400000);
}

export function addDays(iso, n) {
  const { y, m, d } = parseISO(iso);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return toISO(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

export const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

// Suma meses a un par { y, m } (m de 1 a 12)
export function addMonths({ y, m }, n) {
  const idx = y * 12 + (m - 1) + n;
  return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
}

// Semanas del mes (lunes a domingo). Cada día: { iso, day, inMonth }
export function monthGrid(y, m) {
  const first = toISO(y, m, 1);
  const weekday = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // lunes = 0
  const total = Math.ceil((weekday + daysInMonth(y, m)) / 7) * 7;
  const days = Array.from({ length: total }, (_, i) => {
    const iso = addDays(first, i - weekday);
    return { iso, day: parseISO(iso).d, inMonth: parseISO(iso).m === m };
  });
  return Array.from({ length: total / 7 }, (_, w) => days.slice(w * 7, w * 7 + 7));
}

export function formatDue(iso) {
  const { y, m, d } = parseISO(iso);
  return new Date(y, m - 1, d).toLocaleDateString("es", { day: "numeric", month: "short" });
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatLong(iso) {
  const { y, m, d } = parseISO(iso);
  return cap(new Date(y, m - 1, d).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }));
}

export function formatMonth({ y, m }) {
  return cap(new Date(y, m - 1, 1).toLocaleDateString("es", { month: "long", year: "numeric" }));
}

// Lunes de la semana que contiene la fecha
export function weekStartOf(iso) {
  const { y, m, d } = parseISO(iso);
  const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return addDays(iso, -weekday);
}
