import { useEffect, useState } from "react";
import { ArrowUpToLine, Minus, Plus, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { NOTE_COLORS, PEN_COLORS, sizeItem } from "../../lib/board";
import { COLORS } from "../../lib/palette";

const PALETTES = {
  note: NOTE_COLORS,
  text: PEN_COLORS.map((c) => c.hex),
  sticker: COLORS.map((c) => c.hex),
};

// Opciones del objeto seleccionado: color, giro, tamaño, traer al frente y borrar
export default function SelectedBar({ item, onChange, onFront, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => setConfirming(false), [item.id]);

  const btn = "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-paper hover:text-ink";
  const palette = PALETTES[item.type];
  const turn = (d) => onChange(item.id, { rotation: Math.max(-180, Math.min(180, Math.round(item.rotation + d))) });

  return (
    <div role="toolbar" aria-label="Opciones del objeto seleccionado" className="mb-3 flex flex-wrap items-center gap-1 rounded-2xl bg-surface p-2 shadow-soft">
      {palette && (
        <div role="radiogroup" aria-label="Color" className="mr-1 flex gap-1">
          {palette.map((hex) => (
            <button
              key={hex}
              role="radio"
              aria-checked={item.color === hex}
              aria-label={`Color ${hex}`}
              onClick={() => onChange(item.id, { color: hex })}
              className={`h-7 w-7 rounded-lg ring-1 ring-ink/25 ${item.color === hex ? "ring-2 ring-ink" : ""}`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      )}
      <button onClick={() => turn(-8)} aria-label="Girar a la izquierda" className={btn}><RotateCcw size={16} aria-hidden="true" /></button>
      <button onClick={() => turn(8)} aria-label="Girar a la derecha" className={btn}><RotateCw size={16} aria-hidden="true" /></button>
      <button onClick={() => onChange(item.id, { w: sizeItem(item, 1 / 1.15) })} aria-label="Hacer más pequeño" className={btn}><Minus size={16} aria-hidden="true" /></button>
      <button onClick={() => onChange(item.id, { w: sizeItem(item, 1.15) })} aria-label="Hacer más grande" className={btn}><Plus size={16} aria-hidden="true" /></button>
      <button onClick={() => onFront(item.id)} className={btn}><ArrowUpToLine size={16} aria-hidden="true" /> Al frente</button>
      {confirming ? (
        <span className="ml-auto flex gap-1">
          <button onClick={() => onDelete(item.id)} className="rounded-full bg-urgent px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">Borrar objeto</button>
          <button onClick={() => setConfirming(false)} className={btn}>Mantener</button>
        </span>
      ) : (
        <button onClick={() => setConfirming(true)} className={`${btn} ml-auto hover:text-urgent`}><Trash2 size={16} aria-hidden="true" /> Borrar</button>
      )}
    </div>
  );
}
