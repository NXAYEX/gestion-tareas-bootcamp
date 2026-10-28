import test from "node:test";
import assert from "node:assert/strict";
import { EMPTY_DRAFT, groupByMonth, isEmptyDraft, toDraft, toRow } from "./journal.js";

test("una página vacía no se guarda, con cualquier contenido sí", () => {
  assert.equal(isEmptyDraft(EMPTY_DRAFT), true);
  assert.equal(isEmptyDraft({ ...EMPTY_DRAFT, body: "   \n " }), true);
  assert.equal(isEmptyDraft({ ...EMPTY_DRAFT, body: "hola" }), false);
  assert.equal(isEmptyDraft({ ...EMPTY_DRAFT, mood: "sad" }), false);
  assert.equal(isEmptyDraft({ ...EMPTY_DRAFT, photo_path: "u/a.jpg" }), false);
});

test("toRow limpia espacios y convierte vacíos en null", () => {
  const row = toRow({ title: "  Hoy ", body: "texto", note: " ", mood: null, photo_path: null });
  assert.deepEqual(row, { title: "Hoy", body: "texto", note: null, mood: null, photo_path: null });
  assert.deepEqual(toDraft(null), EMPTY_DRAFT);
});

test("agrupa por mes manteniendo el orden", () => {
  const g = groupByMonth([
    { entry_date: "2026-10-20" }, { entry_date: "2026-10-02" }, { entry_date: "2026-09-30" },
  ]);
  assert.deepEqual(g.map((x) => [x.key, x.entries.length]), [["2026-10", 2], ["2026-09", 1]]);
});
