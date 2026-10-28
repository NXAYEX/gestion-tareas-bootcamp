import { useEffect, useRef } from "react";
import { BOARD_H, BOARD_W, ERASER_FACTOR, thinPoints } from "../../lib/board";

const RES = 2; // el lienzo tiene el doble de resolución para que el trazo se vea nítido

function paint(ctx, s) {
  ctx.save();
  ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = s.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const p = s.points;
  ctx.beginPath();
  if (p.length <= 2) {
    ctx.arc(p[0], p[1], s.width / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.moveTo(p[0], p[1]);
    // Curvas entre puntos medios: el trazo se ve suave aunque haya pocos puntos
    for (let i = 2; i < p.length - 2; i += 2) ctx.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
    ctx.lineTo(p[p.length - 2], p[p.length - 1]);
    ctx.stroke();
  }
  ctx.restore();
}

// Lienzo transparente sobre la pizarra. Solo recibe el puntero cuando hay lápiz o borrador activo.
export default function DrawLayer({ strokes, tool, color, width, onStroke }) {
  const canvas = useRef(null);
  const current = useRef(null);
  const active = tool === "pen" || tool === "eraser";

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    ctx.setTransform(RES, 0, 0, RES, 0, 0);
    ctx.clearRect(0, 0, BOARD_W, BOARD_H);
    strokes.forEach((s) => paint(ctx, s));
  }, [strokes]);

  const point = (e) => {
    const r = canvas.current.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * BOARD_W, ((e.clientY - r.top) / r.height) * BOARD_H];
  };

  const down = (e) => {
    if (!active) return;
    canvas.current.setPointerCapture(e.pointerId);
    const [x, y] = point(e);
    current.current = {
      tool,
      color: tool === "eraser" ? "#000000" : color,
      width: tool === "eraser" ? width * ERASER_FACTOR : width,
      points: [x, y],
    };
    paint(canvas.current.getContext("2d"), current.current);
  };

  const move = (e) => {
    const s = current.current;
    if (!s) return;
    const [x, y] = point(e);
    const n = s.points.length;
    paint(canvas.current.getContext("2d"), { ...s, points: [s.points[n - 2], s.points[n - 1], x, y] });
    s.points.push(x, y);
  };

  const end = () => {
    const s = current.current;
    current.current = null;
    if (s) onStroke({ ...s, points: thinPoints(s.points) });
  };

  return (
    <canvas
      ref={canvas}
      width={BOARD_W * RES}
      height={BOARD_H * RES}
      aria-label="Zona de dibujo de la pizarra"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: active ? "auto" : "none", touchAction: active ? "none" : "auto", cursor: active ? "crosshair" : "default" }}
    />
  );
}
