import test from "node:test";
import assert from "node:assert/strict";
import { BOARD_H, BOARD_W, clampPos, newItem, sizeItem, thinPoints, topZ } from "./board.js";

test("los objetos no se pierden fuera de la pizarra", () => {
  assert.deepEqual(clampPos(5000, 5000), { x: BOARD_W - 60, y: BOARD_H - 60 });
  assert.deepEqual(clampPos(-900, -900), { x: -20, y: -20 });
  assert.deepEqual(clampPos(300, 200), { x: 300, y: 200 });
});

test("un objeto nuevo queda al frente y con valores por defecto", () => {
  const a = newItem("cork", "note", []);
  const b = newItem("cork", "image", [a], { image_path: "u/a.jpg" });
  assert.equal(a.w, 200);
  assert.equal(a.z, 1);
  assert.equal(b.z, 2);
  assert.equal(topZ([a, b]), 3);
  assert.equal(b.image_path, "u/a.jpg");
  assert.notEqual(a.id, b.id);
  assert.equal(newItem("white", "sticker", []).content, "happy");
});

test("el tamaño se mantiene entre 60 y 700", () => {
  assert.equal(sizeItem({ w: 200 }, 1.15), 230);
  assert.equal(sizeItem({ w: 65 }, 0.5), 60);
  assert.equal(sizeItem({ w: 690 }, 1.5), 700);
});

test("thinPoints descarta puntos casi iguales pero conserva el inicio y el final", () => {
  const out = thinPoints([0, 0, 0.2, 0.2, 0.4, 0.4, 10, 10, 10.1, 10.1]);
  assert.deepEqual(out, [0, 0, 10, 10, 10.1, 10.1]);
  assert.deepEqual(thinPoints([5.55, 6.04]), [5.6, 6]);
});
