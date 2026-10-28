import { useRef, useState } from "react";
import { Eraser, ImagePlus, MousePointer2, Pencil, StickyNote, Trash2, Type, Undo2 } from "lucide-react";
import { PEN_COLORS, PEN_WIDTHS } from "../../lib/board";
import StickerMenu from "./StickerMenu";

const MAX_MB = 15;

export default function Toolbar({ white, tool, onTool, pen, onPen, canUndo, onUndo, onClear, onAdd, onImage, tooBigNotice }) {
  const file = useRef(null);
  const [clearing, setClearing] = useState(false);
  const btn = "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-paper";
  const tbtn = (on) => `${btn} ${on ? "bg-ink text-white hover:bg-ink" : "text-muted hover:text-ink"}`;

  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) tooBigNotice(`La imagen pesa más de ${MAX_MB} MB. Elige una más liviana.`);
    else onImage(f);
  };

  return (
    <div role="toolbar" aria-label="Herramientas de la pizarra" className="mb-3 flex flex-wrap items-center gap-1 rounded-2xl bg-surface p-2 shadow-soft">
      <button onClick={() => onTool("select")} aria-pressed={tool === "select"} className={tbtn(tool === "select")}>
        <MousePointer2 size={16} aria-hidden="true" /> Mover
      </button>
      {white && (
        <>
          <button onClick={() => onTool("pen")} aria-pressed={tool === "pen"} className={tbtn(tool === "pen")}>
            <Pencil size={16} aria-hidden="true" /> Lápiz
          </button>
          <button onClick={() => onTool("eraser")} aria-pressed={tool === "eraser"} className={tbtn(tool === "eraser")}>
            <Eraser size={16} aria-hidden="true" /> Borrador
          </button>
        </>
      )}
      {white && tool !== "select" && (
        <span className="flex items-center gap-1 border-l border-line pl-2">
          {tool === "pen" &&
            PEN_COLORS.map((c) => (
              <button
                key={c.hex}
                role="radio"
                aria-checked={pen.color === c.hex}
                aria-label={c.name}
                title={c.name}
                onClick={() => onPen({ ...pen, color: c.hex })}
                className={`h-7 w-7 rounded-full ring-1 ring-ink/25 ${pen.color === c.hex ? "ring-2 ring-offset-1 ring-ink" : ""}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          {PEN_WIDTHS.map((w) => (
            <button
              key={w.w}
              aria-pressed={pen.width === w.w}
              aria-label={`Grosor ${w.name.toLowerCase()}`}
              title={w.name}
              onClick={() => onPen({ ...pen, width: w.w })}
              className={`flex h-8 w-8 items-center justify-center rounded-full hover:bg-paper ${pen.width === w.w ? "bg-paper ring-2 ring-ink" : ""}`}
            >
              <span className="rounded-full bg-ink" style={{ width: w.w + 3, height: w.w + 3 }} />
            </button>
          ))}
        </span>
      )}
      {white && (
        <>
          <button onClick={onUndo} disabled={!canUndo} className={`${btn} text-muted disabled:opacity-40`}>
            <Undo2 size={16} aria-hidden="true" /> Deshacer
          </button>
          {clearing ? (
            <span className="flex gap-1">
              <button onClick={() => { onClear(); setClearing(false); }} className="rounded-full bg-urgent px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">Borrar todo el dibujo</button>
              <button onClick={() => setClearing(false)} className={`${btn} text-muted`}>Mantener</button>
            </span>
          ) : (
            <button onClick={() => setClearing(true)} disabled={!canUndo} className={`${btn} text-muted hover:text-urgent disabled:opacity-40`}>
              <Trash2 size={16} aria-hidden="true" /> Limpiar dibujo
            </button>
          )}
        </>
      )}
      <span className="flex flex-wrap items-center gap-1 border-l border-line pl-2">
        <button onClick={() => onAdd("note")} className={`${btn} text-muted hover:text-ink`}><StickyNote size={16} aria-hidden="true" /> Post-it</button>
        <button onClick={() => onAdd("text")} className={`${btn} text-muted hover:text-ink`}><Type size={16} aria-hidden="true" /> Texto</button>
        <button onClick={() => file.current.click()} className={`${btn} text-muted hover:text-ink`}><ImagePlus size={16} aria-hidden="true" /> Imagen</button>
        <StickerMenu onPick={(variant, color) => onAdd("sticker", { content: variant, color })} btnClass={`${btn} text-muted hover:text-ink`} />
      </span>
      <input ref={file} type="file" accept="image/*" className="sr-only" aria-label="Elegir imagen" onChange={pick} />
    </div>
  );
}
