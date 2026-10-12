import test from "node:test";
import assert from "node:assert/strict";
import { addDays, addMonths, daysBetween, daysInMonth, monthGrid } from "./dates.js";
import { applyFilters, countdownText, EMPTY_FILTERS, labelForDay, labelsForDay, urgentEvents } from "./countdown.js";

const ev = (over = {}) => ({
  id: "1", title: "Certamen de Computación Científica", type: "certamen", event_date: "2026-10-20",
  status: "pending", priority: "medium", subject: "Computación", ...over,
});

test("el ejemplo: hoy 12 oct, evento el 20 oct", () => {
  const today = "2026-10-12";
  const nums = [];
  for (let d = 12; d <= 19; d++) nums.push(labelForDay(ev(), `2026-10-${d}`, today).n);
  assert.deepEqual(nums, [8, 7, 6, 5, 4, 3, 2, 1]);
  assert.deepEqual(labelForDay(ev(), "2026-10-20", today), { kind: "day" });
});

test("sin etiquetas antes de hoy ni después del evento", () => {
  assert.equal(labelForDay(ev(), "2026-10-11", "2026-10-12"), null);
  assert.equal(labelForDay(ev(), "2026-10-21", "2026-10-12"), null);
});

test("completado o cancelado: sin cuenta regresiva, solo indicador en su fecha", () => {
  for (const status of ["completed", "cancelled"]) {
    assert.equal(labelForDay(ev({ status }), "2026-10-15", "2026-10-12"), null);
    assert.deepEqual(labelForDay(ev({ status }), "2026-10-20", "2026-10-12"), { kind: "day" });
  }
});

test("vencido: sin números negativos", () => {
  const e = ev({ event_date: "2026-10-05" });
  assert.equal(labelForDay(e, "2026-10-12", "2026-10-12"), null);
  assert.equal(countdownText(e, "2026-10-12"), "Venció hace 7 días");
  assert.equal(countdownText(e, "2026-10-06"), "Venció ayer");
});

test("textos del contador", () => {
  assert.equal(countdownText(ev(), "2026-10-05"), "Faltan 15 días");
  assert.equal(countdownText(ev(), "2026-10-19"), "Falta 1 día");
  assert.equal(countdownText(ev(), "2026-10-20"), "¡Es hoy!");
  assert.equal(countdownText(ev({ status: "completed" }), "2026-10-05"), "Completado");
});

test("diferencia por calendario a través de cambios de horario y años bisiestos", () => {
  assert.equal(daysBetween("2026-03-07", "2026-03-09"), 2); // cambio de horario en EE. UU.
  assert.equal(daysBetween("2026-10-31", "2026-11-02"), 2);
  assert.equal(daysBetween("2028-02-28", "2028-03-01"), 2); // 2028 es bisiesto
  assert.equal(daysBetween("2027-02-28", "2027-03-01"), 1);
  assert.equal(daysInMonth(2028, 2), 29);
  assert.equal(daysInMonth(2026, 2), 28);
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.deepEqual(addMonths({ y: 2026, m: 12 }, 1), { y: 2027, m: 1 });
  assert.deepEqual(addMonths({ y: 2026, m: 1 }, -1), { y: 2025, m: 12 });
});

test("la cuadrícula del mes empieza en lunes y cubre el mes completo", () => {
  const grid = monthGrid(2026, 10); // 1 oct 2026 es jueves
  assert.equal(grid[0][0].iso, "2026-09-28");
  assert.equal(grid[0][3].iso, "2026-10-01");
  assert.ok(grid.every((w) => w.length === 7));
  assert.equal(grid.flat().filter((d) => d.inMonth).length, 31);
});

test("varios eventos el mismo día: independientes y ordenados", () => {
  const a = ev({ id: "a", event_date: "2026-10-20" });
  const b = ev({ id: "b", title: "Entrega de proyecto", type: "entrega", event_date: "2026-10-17" });
  const out = labelsForDay([a, b], "2026-10-15", "2026-10-12");
  assert.deepEqual(out.map((x) => [x.event.id, x.label.n]), [["b", 2], ["a", 5]]);
  const day = labelsForDay([a, b], "2026-10-17", "2026-10-12");
  assert.deepEqual(day.map((x) => [x.event.id, x.label.kind]), [["b", "day"], ["a", "count"]]);
});

test("los filtros se combinan", () => {
  const events = [ev({ id: "a" }), ev({ id: "b", type: "tarea", priority: "high" }), ev({ id: "c", status: "completed" })];
  const f = (over) => applyFilters(events, { ...EMPTY_FILTERS, ...over }, "2026-10-12").map((e) => e.id);
  assert.deepEqual(f({}), ["a", "b", "c"]);
  assert.deepEqual(f({ type: "tarea" }), ["b"]);
  assert.deepEqual(f({ status: "pending", priority: "high" }), ["b"]);
  assert.deepEqual(f({ eventId: "c" }), ["c"]);
  assert.deepEqual(f({ query: "COMPUTACIÓN", status: "completed" }), ["c"]);
});

test("urgentes: vencidos, 0–3 días y prioridad alta cercana", () => {
  const today = "2026-10-12";
  const events = [
    ev({ id: "vencido", event_date: "2026-10-10" }),
    ev({ id: "hoy", event_date: "2026-10-12" }),
    ev({ id: "lejos", event_date: "2026-10-30" }),
    ev({ id: "alta", event_date: "2026-10-18", priority: "high" }),
    ev({ id: "media", event_date: "2026-10-18" }),
  ];
  assert.deepEqual(urgentEvents(events, today).map((e) => e.id), ["vencido", "hoy", "alta"]);
});
