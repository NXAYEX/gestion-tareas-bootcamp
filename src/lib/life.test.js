import test from "node:test";
import assert from "node:assert/strict";
import { ageFromBirth, ageFromYears, lifeStats, livedWeeks, weekInfo } from "./life.js";

test("edad desde fecha de nacimiento: años cumplidos y semanas de la fila actual", () => {
  // nació el 15 mar 2000; el 27 oct 2026 pasaron 226 días desde su último cumpleaños = 32 semanas
  assert.deepEqual(ageFromBirth("2000-03-15", "2026-10-27"), { years: 26, weeks: 32 });
  assert.deepEqual(ageFromBirth("2000-03-15", "2026-03-15"), { years: 26, weeks: 0 }); // el día del cumpleaños
  assert.deepEqual(ageFromBirth("2000-03-15", "2026-03-14"), { years: 25, weeks: 51 }); // el día antes
  assert.equal(ageFromBirth("2030-01-01", "2026-10-27"), null); // nacimiento en el futuro
});

test("nacida un 29 de febrero: en años no bisiestos cumple el 28", () => {
  assert.deepEqual(ageFromBirth("2000-02-29", "2026-02-28"), { years: 26, weeks: 0 });
  assert.deepEqual(ageFromBirth("2000-02-29", "2026-02-27"), { years: 25, weeks: 51 });
  assert.deepEqual(ageFromBirth("2000-02-29", "2028-02-29"), { years: 28, weeks: 0 });
});

test("edad escrita con decimales", () => {
  assert.deepEqual(ageFromYears(24.5), { years: 24, weeks: 26 });
  assert.deepEqual(ageFromYears(30), { years: 30, weeks: 0 });
  assert.deepEqual(ageFromYears(0), { years: 0, weeks: 0 });
  assert.equal(ageFromYears(null), null);
  assert.equal(ageFromYears(-1), null);
  assert.equal(ageFromYears(24.999).weeks, 51); // nunca pasa de 51
});

test("la fecha de nacimiento manda sobre la edad escrita", () => {
  const s = { birth_date: "2000-03-15", age_years: 10 };
  assert.equal(livedWeeks(s, "2026-10-27").total, 26 * 52 + 32);
  assert.equal(livedWeeks({ birth_date: null, age_years: 10 }, "2026-10-27").total, 520);
  assert.equal(livedWeeks({ birth_date: null, age_years: null }, "2026-10-27"), null);
});

test("estadísticas y semana en curso", () => {
  const st = lifeStats(1000, 80);
  assert.deepEqual([st.capacity, st.lived, st.left, st.current, st.beyond], [4160, 1000, 3160, 1000, false]);
  assert.equal(st.pct, 24);
  const over = lifeStats(4200, 80);
  assert.deepEqual([over.lived, over.left, over.current, over.beyond], [4160, 0, -1, true]);
  assert.equal(lifeStats(null, 80).lived, 0);
});

test("descripción de una semana", () => {
  const s = { birth_date: "2000-03-15" };
  const total = 26 * 52 + 32;
  const lived = weekInfo(0, s, total);
  assert.deepEqual([lived.state, lived.row, lived.week], ["vivida", 0, 0]);
  assert.deepEqual(lived.range, { start: "2000-03-15", end: "2000-03-21" });
  assert.equal(weekInfo(total, s, total).state, "actual");
  assert.equal(weekInfo(total + 1, s, total).state, "futura");
  assert.equal(weekInfo(100, { birth_date: null }, total).range, null);
  assert.equal(weekInfo(5, s, null).state, "futura");
});
