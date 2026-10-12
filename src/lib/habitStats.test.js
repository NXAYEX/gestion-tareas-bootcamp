import test from "node:test";
import assert from "node:assert/strict";
import { bestHabit, doneToday, generalStreak, habitProgress, overallPct, possibleDays, streakOf } from "./habitStats.js";

const set = (...d) => new Set(d);
const h = (id, extra = {}) => ({ id, monthly_goal: null, ...extra });

test("días posibles del mes", () => {
  assert.equal(possibleDays(2026, 10, "2026-10-12"), 12); // mes en curso: hasta hoy
  assert.equal(possibleDays(2026, 9, "2026-10-12"), 30); // mes pasado: completo
  assert.equal(possibleDays(2026, 11, "2026-10-12"), 0); // mes futuro: ninguno
  assert.equal(possibleDays(2028, 2, "2028-03-10"), 29); // bisiesto
});

test("racha: hoy sin marcar no la rompe, un hueco sí", () => {
  assert.equal(streakOf(set("2026-10-10", "2026-10-11", "2026-10-12"), "2026-10-12"), 3);
  assert.equal(streakOf(set("2026-10-10", "2026-10-11"), "2026-10-12"), 2); // hoy aún sin marcar
  assert.equal(streakOf(set("2026-10-09", "2026-10-10"), "2026-10-12"), 0); // ayer sin marcar: se perdió
  assert.equal(streakOf(set("2026-10-12", "2026-10-10"), "2026-10-12"), 1); // hueco el 11
  assert.equal(streakOf(undefined, "2026-10-12"), 0);
  assert.equal(streakOf(new Set(), "2026-10-12"), 0);
});

test("racha que cruza de mes y de año", () => {
  assert.equal(streakOf(set("2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02"), "2026-10-02"), 4);
  assert.equal(streakOf(set("2025-12-31", "2026-01-01"), "2026-01-01"), 2);
});

test("racha general: al menos un hábito por día", () => {
  const habits = [h("a"), h("b")];
  const by = new Map([["a", set("2026-10-10", "2026-10-12")], ["b", set("2026-10-11")]]);
  assert.equal(generalStreak(habits, by, "2026-10-12"), 3);
});

test("progreso con y sin meta mensual", () => {
  const s = set("2026-10-01", "2026-10-02", "2026-10-05", "2026-09-30");
  const withGoal = habitProgress(h("a", { monthly_goal: 20 }), s, 2026, 10, "2026-10-12");
  assert.deepEqual([withGoal.count, withGoal.possible, withGoal.pct], [3, 12, 15]);
  const noGoal = habitProgress(h("a"), s, 2026, 10, "2026-10-12");
  assert.equal(noGoal.pct, null);
  assert.equal(habitProgress(h("a", { monthly_goal: 2 }), s, 2026, 10, "2026-10-12").pct, 100); // tope 100
});

test("porcentaje general, mejor hábito y hechos hoy", () => {
  const habits = [h("a"), h("b")];
  const by = new Map([["a", set("2026-10-11", "2026-10-12")], ["b", set("2026-10-12", "2026-10-05", "2026-10-06")]]);
  assert.equal(overallPct(habits, by, 2026, 10, "2026-10-12"), Math.round((5 / 24) * 100));
  assert.equal(bestHabit(habits, by, 2026, 10, "2026-10-12").id, "b");
  assert.equal(doneToday(habits, by, "2026-10-12"), 2);
  assert.equal(bestHabit(habits, new Map(), 2026, 10, "2026-10-12"), null);
  assert.equal(overallPct([], new Map(), 2026, 10, "2026-10-12"), 0);
});

test("los registros de otro mes o futuros no cuentan en el mes visible", () => {
  const s = set("2026-10-20", "2026-09-10");
  assert.equal(habitProgress(h("a"), s, 2026, 10, "2026-10-12").count, 0);
});
