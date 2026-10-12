import { addDays, daysInMonth, parseISO, toISO } from "./dates.js";

/*
 * byHabit: Map<habit_id, Set<"YYYY-MM-DD">> con los días realmente registrados.
 * Todo se calcula a partir de esos registros, nada se asume.
 */

// Días del mes que cuentan: hasta hoy en el mes en curso, todos en meses pasados, ninguno en futuros
export function possibleDays(y, m, today) {
  const t = parseISO(today);
  const key = y * 12 + m;
  const tKey = t.y * 12 + t.m;
  if (key > tKey) return 0;
  return key === tKey ? t.d : daysInMonth(y, m);
}

const monthPrefix = (y, m) => toISO(y, m, 1).slice(0, 8);

export function monthCount(set, y, m, today) {
  if (!set) return 0;
  const prefix = monthPrefix(y, m);
  let n = 0;
  for (const d of set) if (d.startsWith(prefix) && d <= today) n++;
  return n;
}

// Progreso de un hábito en el mes. pct es null si no tiene meta mensual.
export function habitProgress(habit, set, y, m, today) {
  const count = monthCount(set, y, m, today);
  const possible = possibleDays(y, m, today);
  const goal = habit.monthly_goal ?? null;
  return {
    count,
    possible,
    goal,
    pct: goal ? Math.min(100, Math.round((count / goal) * 100)) : null,
    ratio: possible ? count / possible : 0,
  };
}

// Porcentaje de cumplimiento del mes sobre todos los hábitos activos
export function overallPct(habits, byHabit, y, m, today) {
  const possible = possibleDays(y, m, today) * habits.length;
  if (!possible) return 0;
  const done = habits.reduce((sum, h) => sum + monthCount(byHabit.get(h.id), y, m, today), 0);
  return Math.round((done / possible) * 100);
}

// Hábito con mayor cumplimiento del mes. En empate gana el primero por orden. Sin registros: null.
export function bestHabit(habits, byHabit, y, m, today) {
  let best = null;
  let bestRatio = 0;
  for (const h of habits) {
    const { ratio } = habitProgress(h, byHabit.get(h.id), y, m, today);
    if (ratio > bestRatio) {
      best = h;
      bestRatio = ratio;
    }
  }
  return best;
}

/*
 * Racha = días de calendario consecutivos con registro, contando hacia atrás desde hoy.
 * Si hoy todavía no está marcado, se cuenta desde ayer (hoy aún no rompe la racha).
 * Un día anterior a hoy sin registro la termina.
 */
export function streakOf(set, today) {
  if (!set) return 0;
  let day = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

// Racha general: días seguidos con al menos un hábito activo cumplido
export function generalStreak(habits, byHabit, today) {
  const union = new Set();
  for (const h of habits) for (const d of byHabit.get(h.id) ?? []) union.add(d);
  return streakOf(union, today);
}

export const doneToday = (habits, byHabit, today) => habits.filter((h) => byHabit.get(h.id)?.has(today)).length;
