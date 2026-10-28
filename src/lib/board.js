// Las pizarras usan un espacio fijo de 1200 x 800 que se escala a la pantalla
export const BOARD_W = 1200;
export const BOARD_H = 800;
export const MIN_SCALE = 0.6;
export const MAX_ITEMS = 80;

export const NOTE_COLORS = ["#F2E0A0", "#F4B6CC", "#B3D4F2", "#B9D9B9", "#CFC2F0", "#F6CBA6"];

export const PEN_COLORS = [
  { hex: "#2B2630", name: "Negro" },
  { hex: "#B5433A", name: "Rojo" },
  { hex: "#3F6FB5", name: "Azul" },
  { hex: "#4F8A5B", name: "Verde" },
  { hex: "#7B6BC9", name: "Lavanda" },
  { hex: "#D9638F", name: "Rosa" },
];

export const PEN_WIDTHS = [
  { w: 3, name: "Fino" },
  { w: 6, name: "Medio" },
  { w: 12, name: "Grueso" },
];

export const ERASER_FACTOR = 3;
export const STICKERS = ["happy", "cheer", "love", "wink", "cool", "curious", "surprised", "sleepy"];

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Deja siempre una parte del objeto dentro de la pizarra
export const clampPos = (x, y) => ({ x: clamp(x, -20, BOARD_W - 60), y: clamp(y, -20, BOARD_H - 60) });

export const topZ = (items) => items.reduce((m, i) => Math.max(m, i.z), 0) + 1;

const DEFAULT_W = { note: 200, text: 280, image: 260, sticker: 96 };
const TILTS = [-3, 2, -1, 4, 0, -4];

export function newItem(board, type, items, extra = {}) {
  const n = items.length;
  return {
    id: crypto.randomUUID(),
    board,
    type,
    x: 440 + (n % 6) * 36,
    y: 240 + (n % 5) * 32,
    w: DEFAULT_W[type],
    rotation: TILTS[n % TILTS.length],
    z: topZ(items),
    color: type === "note" ? NOTE_COLORS[n % NOTE_COLORS.length] : type === "text" ? PEN_COLORS[0].hex : type === "sticker" ? "#F4B6CC" : null,
    content: type === "sticker" ? "happy" : "",
    image_path: null,
    ...extra,
  };
}

// Quita puntos casi iguales de un trazo ([x1, y1, x2, y2, ...]) y redondea a 1 decimal para guardar menos datos
export function thinPoints(points, minDist = 1.5) {
  const out = [Math.round(points[0] * 10) / 10, Math.round(points[1] * 10) / 10];
  for (let i = 2; i < points.length; i += 2) {
    const dx = points[i] - out[out.length - 2];
    const dy = points[i + 1] - out[out.length - 1];
    const last = i >= points.length - 2;
    if (last || dx * dx + dy * dy >= minDist * minDist) {
      out.push(Math.round(points[i] * 10) / 10, Math.round(points[i + 1] * 10) / 10);
    }
  }
  return out;
}

export const sizeItem = (item, factor) => clamp(Math.round(item.w * factor), 60, 700);
