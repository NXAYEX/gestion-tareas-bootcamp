import { addDays, daysBetween, daysInMonth, parseISO, toISO } from "./dates.js";

export const WEEKS_PER_ROW = 52; // una fila = un año
export const DEFAULT_EXPECTANCY = 80;

// Cumpleaños de `birthISO` en un año dado. Si no existe esa fecha (29 de febrero), cae el último día del mes.
function birthdayIn(birthISO, year) {
  const { m, d } = parseISO(birthISO);
  return toISO(year, m, Math.min(d, daysInMonth(year, m)));
}

// Años cumplidos y semanas transcurridas desde el último cumpleaños (máx. 51, para que la fila nunca pase de 52)
export function ageFromBirth(birthISO, today) {
  if (!birthISO || birthISO > today) return null;
  const b = parseISO(birthISO);
  const t = parseISO(today);
  let years = t.y - b.y;
  if (birthdayIn(birthISO, t.y) > today) years -= 1;
  const days = daysBetween(birthdayIn(birthISO, b.y + years), today);
  return { years, weeks: Math.min(WEEKS_PER_ROW - 1, Math.floor(days / 7)) };
}

// Edad escrita (puede llevar decimales, ej. 24.5): la parte decimal se convierte en semanas de la fila actual
export function ageFromYears(age) {
  if (age === null || age === undefined || Number.isNaN(age) || age < 0) return null;
  const years = Math.floor(age + 1e-9);
  return { years, weeks: Math.min(WEEKS_PER_ROW - 1, Math.floor((age - years) * WEEKS_PER_ROW + 1e-9)) };
}

// Semanas vividas. La fecha de nacimiento, si existe, manda sobre la edad escrita.
export function livedWeeks(settings, today) {
  const a = settings.birth_date ? ageFromBirth(settings.birth_date, today) : ageFromYears(settings.age_years);
  if (!a) return null;
  return { ...a, total: a.years * WEEKS_PER_ROW + a.weeks };
}

export function lifeStats(total, expectancy) {
  const capacity = expectancy * WEEKS_PER_ROW;
  const lived = Math.min(total ?? 0, capacity);
  return {
    capacity,
    lived,
    left: capacity - lived,
    pct: Math.round((lived / capacity) * 1000) / 10,
    beyond: (total ?? 0) > capacity, // ya superó la esperanza de vida elegida
    current: total !== null && total < capacity ? total : -1, // semana en curso
  };
}

// Descripción de una semana de la cuadrícula (índice 0 = primera semana de vida)
export function weekInfo(index, settings, total) {
  const row = Math.floor(index / WEEKS_PER_ROW);
  const week = index % WEEKS_PER_ROW;
  const state = total === null ? "futura" : index < total ? "vivida" : index === total ? "actual" : "futura";
  let range = null;
  if (settings.birth_date) {
    const start = addDays(birthdayIn(settings.birth_date, parseISO(settings.birth_date).y + row), week * 7);
    range = { start, end: addDays(start, 6) };
  }
  return { row, week, state, range };
}
