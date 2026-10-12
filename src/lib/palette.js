// Colores permitidos para eventos y hábitos. El texto encima siempre es "ink" (#2B2630): contraste AA en todos.
export const COLORS = [
  { id: "sky", name: "Azul", hex: "#B3D4F2" },
  { id: "pink", name: "Rosa", hex: "#F4B6CC" },
  { id: "lavender", name: "Lavanda", hex: "#CFC2F0" },
  { id: "sage", name: "Salvia", hex: "#B9D9B9" },
  { id: "peach", name: "Durazno", hex: "#F6CBA6" },
  { id: "butter", name: "Mantequilla", hex: "#F2E0A0" },
  { id: "mint", name: "Menta", hex: "#A9DDD0" },
  { id: "fog", name: "Gris", hex: "#D6D1DB" },
];

export const DEFAULT_COLOR = COLORS[0].hex;

export const colorName = (hex) => COLORS.find((c) => c.hex === hex)?.name ?? "Color";
