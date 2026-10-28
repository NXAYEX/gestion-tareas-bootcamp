import { useMemo, useRef, useState } from "react";
import { WEEKS_PER_ROW as COLS, weekInfo } from "../../lib/life";
import { formatDue, parseISO } from "../../lib/dates";

const CELL = 11;
const LEFT = 30;
const TOP = 16;
const R = 3.7;

// Un solo trazo SVG con todos los círculos de un grupo (4000+ elementos separados serían lentos)
const dot = (cx, cy) => `M${cx - R} ${cy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0`;
const center = (i) => [LEFT + (i % COLS) * CELL + CELL / 2, TOP + Math.floor(i / COLS) * CELL + CELL / 2];

function describe(info, settings) {
  const where = `Año ${info.row + 1} de vida, semana ${info.week + 1}`;
  const when = info.range ? ` (${formatDue(info.range.start)} – ${formatDue(info.range.end)} ${parseISO(info.range.end).y})` : "";
  const state = { vivida: "ya la viviste", actual: "es tu semana actual", futura: "aún no llega" }[info.state];
  return `${where}${when}: ${state}`;
}

export default function LifeGrid({ rows, total, current, settings }) {
  const svg = useRef(null);
  const [picked, setPicked] = useState(null);
  const capacity = rows * COLS;
  const painted = Math.min(total ?? 0, capacity);

  const paths = useMemo(() => {
    let lived = "";
    let future = "";
    for (let i = 0; i < capacity; i++) {
      if (i === current) continue;
      const [cx, cy] = center(i);
      if (i < painted) lived += dot(cx, cy);
      else future += dot(cx, cy);
    }
    return { lived, future };
  }, [capacity, painted, current]);

  const indexAt = (e) => {
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * (LEFT + COLS * CELL) - LEFT;
    const y = ((e.clientY - r.top) / r.height) * (TOP + rows * CELL) - TOP;
    const col = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);
    return col >= 0 && col < COLS && row >= 0 && row < rows ? row * COLS + col : null;
  };

  const info = picked !== null ? weekInfo(picked, settings, total) : null;
  const decades = Array.from({ length: Math.floor(rows / 10) + 1 }, (_, i) => i * 10).filter((a) => a <= rows);
  const summary = `Cuadrícula de ${rows} años con ${COLS} semanas cada uno. ${painted} semanas vividas pintadas.`;

  return (
    <div>
      <svg
        ref={svg}
        viewBox={`0 0 ${LEFT + COLS * CELL} ${TOP + rows * CELL}`}
        role="img"
        aria-label={summary}
        className="block h-auto w-full touch-manipulation"
        onPointerMove={(e) => e.pointerType === "mouse" && setPicked(indexAt(e))}
        onPointerDown={(e) => setPicked(indexAt(e))}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPicked(null)}
      >
        <text x={LEFT - 6} y={9} textAnchor="end" fontSize="7" fill="#6B6473">Edad</text>
        {decades.map((a) => (
          <g key={a}>
            <text x={LEFT - 6} y={TOP + a * CELL + 8} textAnchor="end" fontSize="8" fontWeight="700" fill="#6B6473">{a}</text>
            {a > 0 && a < rows && <path d={`M${LEFT} ${TOP + a * CELL}h${COLS * CELL}`} stroke="#E8DFD6" strokeWidth="0.6" />}
          </g>
        ))}
        <path d={paths.future} fill="#E8DFD6" />
        <path d={paths.lived} fill="#7B6BC9" />
        {current >= 0 && (
          <circle cx={center(current)[0]} cy={center(current)[1]} r={R + 1.6} fill="#F4B6CC" stroke="#2B2630" strokeWidth="1.4" />
        )}
        {picked !== null && (
          <circle cx={center(picked)[0]} cy={center(picked)[1]} r={R + 2.4} fill="none" stroke="#2B2630" strokeWidth="1.2" />
        )}
      </svg>
      <p aria-live="polite" className="mt-2 min-h-[2.5rem] text-sm text-muted">
        {info ? describe(info, settings) : "Pasa el mouse o toca un círculo para ver de qué semana se trata."}
      </p>
    </div>
  );
}
